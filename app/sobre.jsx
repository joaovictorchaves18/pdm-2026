import React from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Card, Text, Chip, Divider, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MODULOS_TECNOLOGIAS = [
  {
    nome: "React Native 0.88 & Expo SDK 58",
    papel: "Framework Mobile Principal",
    descricao:
      "Base do aplicativo multiplataforma (Android / iOS) com suporte a OTA Updates (EAS Update) e execução nativa no Expo Go.",
    icone: "cellphone-cog",
    tags: ["Expo SDK 58", "React 19", "React Native"],
  },
  {
    nome: "Expo Router (File-based Routing)",
    papel: "Navegação entre Telas",
    descricao:
      "Gerencia a navegação por abas (Tabs) entre as 5 telas do currículo: Início (Home), Acadêmico, Profissional, Projetos e Sobre.",
    icone: "routes",
    tags: ["Expo Router", "Tabs Navigation", "Typed Routes"],
  },
  {
    nome: "TanStack React Query v5 + Axios",
    papel: "Conexão com Back-end & Cache Assíncrono",
    descricao:
      "Consome a API RESTful de Currículo na Vercel (Node.js + Express + Neon PostgreSQL) com cache inteligente, Pull-to-Refresh e mutações (useQuery / useMutation).",
    icone: "cloud-sync",
    tags: ["React Query", "Axios", "REST API", "PostgreSQL"],
  },
  {
    nome: "Zustand + AsyncStorage",
    papel: "Gerenciamento de Estado Persistente",
    descricao:
      "Armazena o estado global do Modo Escuro/Claro (Dark/Light Theme) e preferências de filtro de habilidades diretamente no armazenamento local do celular.",
    icone: "database-cog",
    tags: ["Zustand", "AsyncStorage", "Persistência"],
  },
  {
    nome: "React Native Paper (MD3)",
    papel: "Design System & Componentes Visuais",
    descricao:
      "Biblioteca de componentes Material Design 3 com temas customizados (Neon Cyber Dark e Clean Light), Cards, Chips, Modais e Searchbar.",
    icone: "palette-swatch",
    tags: ["Material Design 3", "UI/UX", "Temas Dinâmicos"],
  },
  {
    nome: "GitHub REST API & Advice Slip API",
    papel: "Integrações Externas em Tempo Real",
    descricao:
      "Busca dinamicamente os repositórios públicos de @joaovictorchaves18 no GitHub e dicas de programação ao vivo.",
    icone: "github",
    tags: ["GitHub API", "Advice API", "JSON"],
  },
];

export default function SobreScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* BIO & QUEM É JOÃO VICTOR */}
      <Card
        mode="elevated"
        style={[
          styles.bioCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <Card.Content>
          <View style={styles.bioHeader}>
            <Image
              source={require("@/assets/images/perfil.jpg")}
              style={[
                styles.smallAvatar,
                { borderColor: theme.colors.primary },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text
                variant="titleLarge"
                style={[styles.bioTitle, { color: theme.colors.onSurface }]}
              >
                Quem é João Victor?
              </Text>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                20 Anos • Recife, PE • UNICAP & UFPE
              </Text>
            </View>
          </View>

          <Text
            variant="bodyMedium"
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            Olá! Meu nome é João Victor de Oliveira Chaves, tenho 20 anos e sou
            apaixonado por programar tanto softwares modernos quanto hardwares
            físicos. Divido minha rotina em duas graduações complementares:
          </Text>

          <Text
            variant="bodyMedium"
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            • Na UNICAP, curso Sistemas para Internet, onde desenvolvo aplicações
            web e mobile modernas, APIs REST orientadas a serviços e bancos de
            dados relacionais.
          </Text>

          <Text
            variant="bodyMedium"
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            • Na UFPE (Federal), curso Engenharia de Controle e Automação, com
            foco em circuitos eletrônicos, microcontroladores (ESP32 e Arduino),
            robótica e Internet das Coisas (IoT).
          </Text>

          {/* TERMINAL HOLOGRÁFICO */}
          <View
            style={[
              styles.terminalBox,
              {
                backgroundColor: "#090D16",
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <View style={styles.terminalHeader}>
              <Text style={styles.terminalCode}>TERMINAL_JOAO_v2.0</Text>
              <MaterialCommunityIcons
                name="console-line"
                size={16}
                color="#00F0FF"
              />
            </View>
            <Divider style={{ backgroundColor: "#1E293B", marginVertical: 6 }} />
            <Text style={styles.termLine}>
              <Text style={styles.termPrompt}>$ </Text>
              quem_sou_eu --idade
            </Text>
            <Text style={styles.termOutput}>
              &gt; joao_victor_chaves (20 anos • Recife-PE)
            </Text>
            <Text style={styles.termLine}>
              <Text style={styles.termPrompt}>$ </Text>
              cat graduacoes.txt
            </Text>
            <Text style={[styles.termOutput, { color: "#00F0FF" }]}>
              &gt; [1] Sistemas para Internet (UNICAP)
            </Text>
            <Text style={[styles.termOutput, { color: "#A855F7" }]}>
              &gt; [2] Eng. de Controle e Automação (UFPE)
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* CARD EM DESTAQUE: FUNCIONALIDADE EXTRA IMPLEMENTADA */}
      <Card
        mode="elevated"
        style={[
          styles.extraCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.secondary,
          },
        ]}
      >
        <Card.Content>
          <View style={styles.extraHeader}>
            <MaterialCommunityIcons
              name="star-shooting"
              size={26}
              color={theme.colors.secondary}
            />
            <View style={{ flex: 1 }}>
              <Text
                variant="titleMedium"
                style={[styles.extraTitle, { color: theme.colors.onSurface }]}
              >
                Funcionalidades Extras Implementadas
              </Text>
              <Text
                style={{
                  color: theme.colors.secondary,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Destaques práticos do Aplicativo
              </Text>
            </View>
          </View>

          <View style={styles.extraItem}>
            <MaterialCommunityIcons
              name="database-edit"
              size={20}
              color={theme.colors.primary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.extraItemTitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                1. CRUD Completo em Tempo Real no Back-end (AOS + NeonDB)
              </Text>
              <Text
                style={[
                  styles.extraItemDesc,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Além de listar os dados do servidor, o App permite Adicionar,
                Editar e Excluir formações acadêmicas, experiências
                profissionais, projetos, habilidades e dados do perfil direto
                pelo celular, persistindo tudo no banco PostgreSQL via React
                Query Mutations.
              </Text>
            </View>
          </View>

          <View style={styles.extraItem}>
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={20}
              color={theme.colors.tertiary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.extraItemTitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                2. Tema Dark / Light Persistente + Filtro Dinâmico (Zustand)
              </Text>
              <Text
                style={[
                  styles.extraItemDesc,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Alternância instantânea no topo do App entre o tema Cyber Dark e
                Clean Light, mantendo a escolha salva no dispositivo via
                AsyncStorage.
              </Text>
            </View>
          </View>

          <View style={styles.extraItem}>
            <MaterialCommunityIcons
              name="github"
              size={20}
              color={theme.colors.secondary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.extraItemTitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                3. Integração Híbrida com GitHub API & Busca Instantânea
              </Text>
              <Text
                style={[
                  styles.extraItemDesc,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Combina os projetos em destaque do Back-end com os repositórios
                públicos em tempo real do GitHub (@joaovictorchaves18), com
                barra de busca instantânea por tecnologia.
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* LISTA DE TODAS AS TECNOLOGIAS E MÓDULOS UTILIZADOS */}
      <Text
        variant="titleLarge"
        style={[styles.sectionHeading, { color: theme.colors.onSurface }]}
      >
        Tecnologias & Módulos Utilizados
      </Text>

      {MODULOS_TECNOLOGIAS.map((mod) => (
        <Card
          key={mod.nome}
          mode="elevated"
          style={[
            styles.techCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <Card.Content>
            <View style={styles.techHeader}>
              <View
                style={[
                  styles.techIconBox,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <MaterialCommunityIcons
                  name={mod.icone}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  variant="titleMedium"
                  style={[styles.techName, { color: theme.colors.onSurface }]}
                >
                  {mod.nome}
                </Text>
                <Text
                  style={[
                    styles.techRole,
                    { color: theme.colors.primary },
                  ]}
                >
                  {mod.papel}
                </Text>
              </View>
            </View>

            <Text
              variant="bodyMedium"
              style={[
                styles.techDesc,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {mod.descricao}
            </Text>

            <View style={styles.tagsWrap}>
              {mod.tags.map((tg) => (
                <Chip
                  key={tg}
                  compact
                  style={[
                    styles.tagChip,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                  textStyle={{
                    color: theme.colors.onSurface,
                    fontSize: 11,
                  }}
                >
                  {tg}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
    gap: 16,
  },
  bioCard: {
    borderRadius: 18,
    borderWidth: 1,
  },
  bioHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  smallAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  bioTitle: {
    fontWeight: "bold",
  },
  paragraph: {
    lineHeight: 20,
    marginBottom: 8,
  },
  terminalBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginTop: 6,
  },
  terminalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  terminalCode: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  termLine: {
    color: "#F8FAFC",
    fontSize: 12,
    fontFamily: "monospace",
    marginTop: 4,
  },
  termPrompt: {
    color: "#10B981",
    fontWeight: "bold",
  },
  termOutput: {
    color: "#CBD5E1",
    fontSize: 12,
    fontFamily: "monospace",
    marginLeft: 8,
    marginBottom: 2,
  },
  extraCard: {
    borderRadius: 18,
    borderWidth: 2,
  },
  extraHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  extraTitle: {
    fontWeight: "bold",
  },
  extraItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  extraItemTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  extraItemDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeading: {
    fontWeight: "bold",
    marginTop: 4,
  },
  techCard: {
    borderRadius: 16,
    borderWidth: 1,
  },
  techHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  techIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  techName: {
    fontWeight: "bold",
  },
  techRole: {
    fontSize: 12,
    fontWeight: "700",
  },
  techDesc: {
    lineHeight: 19,
    marginBottom: 10,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagChip: {
    borderRadius: 10,
  },
});
