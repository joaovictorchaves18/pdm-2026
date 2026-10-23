import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Text,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Providers from "@/Providers";
import { useThemeStore } from "@/zustand";

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#00F0FF",
    secondary: "#A855F7",
    tertiary: "#10B981",
    background: "#090D16",
    surface: "#111827",
    surfaceVariant: "#1E293B",
    onSurface: "#F8FAFC",
    onSurfaceVariant: "#94A3B8",
    outline: "#334155",
  },
};

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#0284C7",
    secondary: "#7C3AED",
    tertiary: "#059669",
    background: "#F1F5F9",
    surface: "#FFFFFF",
    surfaceVariant: "#E2E8F0",
    onSurface: "#0F172A",
    onSurfaceVariant: "#475569",
    outline: "#CBD5E1",
  },
};

export default function RootLayout() {
  const modoEscuro = useThemeStore((state) => state.modoEscuro);
  const toggleModoEscuro = useThemeStore((state) => state.toggleModoEscuro);
  const theme = modoEscuro ? customDarkTheme : customLightTheme;

  return (
    <Providers>
      <PaperProvider theme={theme}>
        <StatusBar style={modoEscuro ? "light" : "dark"} />
        <Tabs
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.outline,
            },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 17,
            },
            tabBarStyle: {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.outline,
              borderTopWidth: 1,
              height: 64,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "600",
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={toggleModoEscuro}
                style={[
                  styles.themeBtn,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.primary,
                  },
                ]}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={modoEscuro ? "weather-sunny" : "weather-night"}
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.themeBtnText,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {modoEscuro ? "Claro" : "Escuro"}
                </Text>
              </TouchableOpacity>
            ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Início",
              headerTitle: "João Victor • Portfólio",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="home-variant"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="academico"
            options={{
              title: "Acadêmico",
              headerTitle: "Experiência Acadêmica",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="school"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profissional"
            options={{
              title: "Profissional",
              headerTitle: "Experiência Profissional",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="briefcase-variant"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="projetos"
            options={{
              title: "Projetos",
              headerTitle: "Projetos & GitHub",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="rocket-launch"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="sobre"
            options={{
              title: "Sobre",
              headerTitle: "Sobre o App & Tecnologias",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="information-variant"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </PaperProvider>
    </Providers>
  );
}

const styles = StyleSheet.create({
  themeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 14,
    gap: 5,
  },
  themeBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
