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
  getExperienciasAcademicas,
  addExperienciaAcademica,
  updateExperienciaAcademica,
  deleteExperienciaAcademica,
  FALLBACK_PESSOA,
} from "@/api";

const DESTAQUES_CURSO = {
  "Sistemas para Internet": {
    skills: [
      "React & React Native",
      "Next.js",
      "JavaScript / TypeScript",
      "Node.js & APIs REST",
      "PostgreSQL",
      "Arquitetura Orientada a Serviços",
    ],
    highlights: [
      "Desenvolvimento de sistemas web e aplicativos móveis modernos.",
      "Prática com metodologias ágeis (Scrum / Kanban) e versionamento Git.",
      "Construção de APIs RESTful escaláveis e interfaces responsivas.",
    ],
  },
  "Engenharia de Controle e Automação": {
    skills: [
      "Linguagem C/C++",
      "Arduino & ESP32",
      "Sistemas Embarcados",
      "Programação CLP",
      "Eletrônica Aplicada",
      "IoT & Robótica",
    ],
    highlights: [
      "Modelagem matemática de malhas de controle analógico e digital.",
      "Programação de microcontroladores para leitura de sensores físicos.",
      "Automação industrial e Internet das Coisas (IoT) conectada à nuvem.",
    ],
  },
};

export default function AcademicoScreen() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [instituicao, setInstituicao] = useState("");
  const [curso, setCurso] = useState("");
  const [grau, setGrau] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");

  const {
    data: apiAcademicas,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["experienciasAcademicas"],
    queryFn: getExperienciasAcademicas,
  });

  const listaAcademica =
    apiAcademicas && apiAcademicas.length > 0
      ? apiAcademicas
      : FALLBACK_PESSOA.experienciasAcademicas;

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["experienciasAcademicas"] });
    queryClient.invalidateQueries({ queryKey: ["curriculoPessoa"] });
  };

  const addMutation = useMutation({
    mutationFn: addExperienciaAcademica,
    onSuccess: () => {
      invalidateAll();
      fecharModal();
    },
    onError: (err) => Alert.alert("Erro ao adicionar", err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateExperienciaAcademica,
    onSuccess: () => {
      invalidateAll();
      fecharModal();
    },
    onError: (err) => Alert.alert("Erro ao atualizar", err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperienciaAcademica,
    onSuccess: invalidateAll,
    onError: (err) => Alert.alert("Erro ao remover", err.message),
  });

  const abrirNovo = () => {
    setEditandoId(null);
    setInstituicao("");
    setCurso("");
    setGrau("Bacharelado / Tecnólogo");
    setDataInicio("2024-02");
    setDataFim("Em Andamento");
    setDescricao("");
    setModalVisivel(true);
  };

  const abrirEdicao = (item) => {
    setEditandoId(item.id);
    setInstituicao(item.instituicao || "");
    setCurso(item.curso || "");
    setGrau(item.grau || "");
    setDataInicio(item.dataInicio || "");
    setDataFim(item.dataFim || "");
    setDescricao(item.descricao || "");
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setEditandoId(null);
  };

  const salvarFormacao = () => {
    if (!instituicao.trim() || !curso.trim() || !grau.trim()) {
      Alert.alert("Atenção", "Preencha Instituição, Curso e Grau.");
      return;
    }
    const payload = {
      instituicao: instituicao.trim(),
      curso: curso.trim(),
      grau: grau.trim(),
      dataInicio: dataInicio.trim() || "2024-02",
      dataFim: dataFim.trim() || "Em Andamento",
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
      {/* CABEÇALHO DA SEÇÃO */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text
            variant="headlineSmall"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            Trajetória Acadêmica
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Duas graduações simultâneas unindo software moderno e automação física.
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

      {/* CARDS DE FORMAÇÃO VINDOS DO BACK-END */}
      {listaAcademica.map((item, idx) => {
        const isPurple = idx % 2 !== 0;
        const accentColor = isPurple
          ? theme.colors.secondary
          : theme.colors.primary;
        const extraInfo = DESTAQUES_CURSO[item.curso];

        return (
          <Card
            key={item.id}
            mode="elevated"
            style={[
              styles.degreeCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: accentColor,
              },
            ]}
          >
            <Card.Content>
              <View style={styles.cardTopRow}>
                <Chip
                  icon="school"
                  compact
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                  textStyle={{ color: accentColor, fontWeight: "bold", fontSize: 11 }}
                >
                  {item.grau}
                </Chip>
                <View style={styles.actionIcons}>
                  <IconButton
                    icon="pencil-outline"
                    size={18}
                    iconColor={theme.colors.primary}
                    onPress={() => abrirEdicao(item)}
                  />
                  <IconButton
                    icon="delete-outline"
                    size={18}
                    iconColor="#EF4444"
                    onPress={() => deleteMutation.mutate(item.id)}
                  />
                </View>
              </View>

              <Text
                variant="titleLarge"
                style={[styles.courseTitle, { color: theme.colors.onSurface }]}
              >
                {item.curso}
              </Text>

              <Text
                variant="titleSmall"
                style={[styles.institution, { color: accentColor }]}
              >
                {item.instituicao}
              </Text>

              <View style={styles.periodRow}>
                <MaterialCommunityIcons
                  name="calendar-range"
                  size={15}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.periodText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {item.dataInicio} — {item.dataFim || "Em Andamento"}
                </Text>
              </View>

              {item.descricao ? (
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.description,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {item.descricao}
                </Text>
              ) : null}

              {extraInfo && (
                <>
                  <Text
                    style={[
                      styles.subHeader,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Focos de Aprendizado:
                  </Text>
                  <View style={styles.chipsWrap}>
                    {extraInfo.skills.map((sk) => (
                      <Chip
                        key={sk}
                        compact
                        style={[
                          styles.skillChip,
                          { backgroundColor: theme.colors.surfaceVariant },
                        ]}
                        textStyle={{
                          color: theme.colors.onSurface,
                          fontSize: 11,
                        }}
                      >
                        {sk}
                      </Chip>
                    ))}
                  </View>

                  <Text
                    style={[
                      styles.subHeader,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Destaques do Curso:
                  </Text>
                  {extraInfo.highlights.map((hl, i) => (
                    <View key={i} style={styles.highlightRow}>
                      <MaterialCommunityIcons
                        name="check-circle-outline"
                        size={16}
                        color={accentColor}
                      />
                      <Text
                        style={[
                          styles.highlightText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {hl}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </Card.Content>
          </Card>
        );
      })}

      {/* CARD DE SINERGIA ENTRE AS DUAS ÁREAS */}
      <Card
        mode="elevated"
        style={[
          styles.synergyCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.tertiary,
          },
        ]}
      >
        <Card.Content>
          <View style={styles.synergyHeader}>
            <MaterialCommunityIcons
              name="auto-fix"
              size={24}
              color={theme.colors.tertiary}
            />
            <Text
              variant="titleMedium"
              style={[styles.synergyTitle, { color: theme.colors.onSurface }]}
            >
              Sinergia: Sistemas (UNICAP) + Automação (UFPE)
            </Text>
          </View>
          <Text
            style={[
              styles.synergyText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            1. IoT & Cidades Inteligentes: Capacidade de programar o firmware
            físico no chip (ESP32/Arduino) e construir o aplicativo mobile/web
            reativo para monitoramento em tempo real.
          </Text>
          <Text
            style={[
              styles.synergyText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            2. Interfaces Industriais Modernas (IHMs): Uso de React e React
            Native para substituir painéis industriais antigos por interfaces
            intuitivas e responsivas.
          </Text>
        </Card.Content>
      </Card>

      {/* MODAL DE ADIÇÃO / EDIÇÃO NO BACK-END */}
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
                ? "Editar Formação (API)"
                : "Nova Formação Acadêmica (API)"}
            </Text>
            <TextInput
              label="Instituição (ex: UNICAP, UFPE)"
              mode="outlined"
              value={instituicao}
              onChangeText={setInstituicao}
              style={styles.input}
            />
            <TextInput
              label="Curso"
              mode="outlined"
              value={curso}
              onChangeText={setCurso}
              style={styles.input}
            />
            <TextInput
              label="Grau (ex: Bacharelado, Tecnólogo)"
              mode="outlined"
              value={grau}
              onChangeText={setGrau}
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
                label="Fim / Status"
                mode="outlined"
                value={dataFim}
                onChangeText={setDataFim}
                style={[styles.input, { flex: 1 }]}
              />
            </View>
            <TextInput
              label="Descrição das atividades"
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
                onPress={salvarFormacao}
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
  degreeCard: {
    borderRadius: 18,
    borderLeftWidth: 4,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionIcons: {
    flexDirection: "row",
  },
  courseTitle: {
    fontWeight: "bold",
    marginTop: 4,
  },
  institution: {
    fontWeight: "700",
    marginTop: 2,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    marginBottom: 10,
  },
  periodText: {
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    lineHeight: 20,
    marginBottom: 12,
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  skillChip: {
    borderRadius: 10,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  synergyCard: {
    borderRadius: 16,
    borderWidth: 1,
  },
  synergyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  synergyTitle: {
    fontWeight: "bold",
    flex: 1,
  },
  synergyText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
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
