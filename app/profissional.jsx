import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Modal,
  Alert,
} from "react-native";
import {
  Card,
  Text,
  Chip,
  Button,
  IconButton,
  TextInput,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExperienciasProfissionais,
  addExperienciaProfissional,
  updateExperienciaProfissional,
  deleteExperienciaProfissional,
  FALLBACK_PESSOA,
} from "@/api";

const TAGS_POR_CARGO = {
  "Desenvolvedor Fullstack Freelancer": [
    "React",
    "Next.js",
    "Node.js",
    "APIs REST",
    "PostgreSQL",
    "Vercel",
  ],
  "Desenvolvedor de Automação & IoT": [
    "C/C++",
    "ESP32",
    "Arduino",
    "MQTT",
    "IoT",
    "Lógica CLP",
  ],
  "Desenvolvedor Open Source": [
    "React Native",
    "Expo",
    "Git & GitHub",
    "Clean Code",
    "Node.js",
  ],
};

export default function ProfissionalScreen() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [cargo, setCargo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  const {
    data: apiProfissionais,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["experienciasProfissionais"],
    queryFn: getExperienciasProfissionais,
  });

  const listaProfissional =
    apiProfissionais && apiProfissionais.length > 0
      ? apiProfissionais
      : FALLBACK_PESSOA.experienciasProfissionais;

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["experienciasProfissionais"] });
    queryClient.invalidateQueries({ queryKey: ["curriculoPessoa"] });
  };

  const addMutation = useMutation({
    mutationFn: addExperienciaProfissional,
    onSuccess: () => {
      invalidateAll();
      fecharModal();
    },
    onError: (err) => Alert.alert("Erro ao adicionar", err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateExperienciaProfissional,
    onSuccess: () => {
      invalidateAll();
      fecharModal();
    },
    onError: (err) => Alert.alert("Erro ao atualizar", err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperienciaProfissional,
    onSuccess: invalidateAll,
    onError: (err) => Alert.alert("Erro ao excluir", err.message),
  });

  const abrirNovo = () => {
    setEditandoId(null);
    setCargo("");
    setEmpresa("");
    setDataInicio("2025-01");
    setDataFim("Atual");
    setDescricao("");
    setModalVisivel(true);
  };

  const abrirEdicao = (item) => {
    setEditandoId(item.id);
    setCargo(item.cargo || "");
    setEmpresa(item.empresa || "");
    setDataInicio(item.dataInicio || "");
    setDataFim(item.dataFim || "");
    setDescricao(item.descricao || "");
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setEditandoId(null);
  };

  const salvarExperiencia = () => {
    if (!cargo.trim() || !empresa.trim()) {
      Alert.alert("Atenção", "Preencha o Cargo e a Empresa.");
      return;
    }
    const payload = {
      cargo: cargo.trim(),
      empresa: empresa.trim(),
      dataInicio: dataInicio.trim() || "2024-03",
      dataFim: dataFim.trim() || "Atual",
      descricao: descricao.trim(),
    };
    if (editandoId) {
      updateMutation.mutate({ id: editandoId, ...payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={refetch}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* CABEÇALHO */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text
            variant="headlineSmall"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            Experiência Profissional
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Atuação prática em desenvolvimento web/mobile full stack e prototipagem IoT.
          </Text>
        </View>
        <Button
          mode="contained"
          icon="plus"
          onPress={abrirNovo}
          buttonColor={theme.colors.primary}
          textColor="#090D16"
          style={styles.addBtn}
        >
          Adicionar
        </Button>
      </View>

      {/* TIMELINE PROFISSIONAL */}
      {listaProfissional.map((exp, idx) => {
        const isPurple = idx % 2 !== 0;
        const accentColor = isPurple
          ? theme.colors.secondary
          : theme.colors.primary;
        const tags = TAGS_POR_CARGO[exp.cargo] || [
          "Full Stack",
          "JavaScript",
          "APIs REST",
        ];

        return (
          <Card
            key={exp.id}
            mode="elevated"
            style={[
              styles.expCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: accentColor,
              },
            ]}
          >
            <Card.Content>
              <View style={styles.cardTopRow}>
                <View style={styles.periodBadge}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={15}
                    color={accentColor}
                  />
                  <Text style={[styles.periodText, { color: accentColor }]}>
                    {exp.dataInicio} — {exp.dataFim || "Atual"}
                  </Text>
                </View>

                <View style={styles.actionIcons}>
                  <IconButton
                    icon="pencil-outline"
                    size={18}
                    iconColor={theme.colors.primary}
                    onPress={() => abrirEdicao(exp)}
                  />
                  <IconButton
                    icon="delete-outline"
                    size={18}
                    iconColor="#EF4444"
                    onPress={() => deleteMutation.mutate(exp.id)}
                  />
                </View>
              </View>

              <Text
                variant="titleLarge"
                style={[styles.roleTitle, { color: theme.colors.onSurface }]}
              >
                {exp.cargo}
              </Text>

              <View style={styles.companyRow}>
                <MaterialCommunityIcons
                  name="domain"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="titleSmall"
                  style={[
                    styles.companyName,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {exp.empresa}
                </Text>
              </View>

              {exp.descricao ? (
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.description,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {exp.descricao}
                </Text>
              ) : null}

              <View style={styles.tagsWrap}>
                {tags.map((tg) => (
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
        );
      })}

      {/* MODAL PARA ADICIONAR / EDITAR EXPERIÊNCIA PROFISSIONAL */}
      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              variant="titleLarge"
              style={[styles.modalTitle, { color: theme.colors.onSurface }]}
            >
              {editandoId
                ? "Editar Experiência (API)"
                : "Nova Experiência Profissional"}
            </Text>
            <TextInput
              label="Cargo / Função"
              mode="outlined"
              value={cargo}
              onChangeText={setCargo}
              style={styles.input}
            />
            <TextInput
              label="Empresa / Organização"
              mode="outlined"
              value={empresa}
              onChangeText={setEmpresa}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                label="Início (AAAA-MM)"
                mode="outlined"
                value={dataInicio}
                onChangeText={setDataInicio}
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                label="Fim (ou Atual)"
                mode="outlined"
                value={dataFim}
                onChangeText={setDataFim}
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            <TextInput
              label="Descrição das atividades realizadas"
              mode="outlined"
              multiline
              numberOfLines={3}
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <Button mode="outlined" onPress={fecharModal}>
                Cancelar
              </Button>
              <Button
                mode="contained"
                loading={addMutation.isPending || updateMutation.isPending}
                onPress={salvarExperiencia}
              >
                Salvar no Back-end
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  addBtn: {
    borderRadius: 12,
  },
  expCard: {
    borderRadius: 18,
    borderLeftWidth: 4,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  periodText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  actionIcons: {
    flexDirection: "row",
  },
  roleTitle: {
    fontWeight: "bold",
    marginTop: 2,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    marginBottom: 10,
  },
  companyName: {
    fontWeight: "600",
  },
  description: {
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagChip: {
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    borderRadius: 18,
    padding: 20,
    gap: 8,
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
});
