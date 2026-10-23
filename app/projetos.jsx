import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Linking,
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
  Searchbar,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjetos,
  addProjeto,
  updateProjeto,
  deleteProjeto,
  getRepositoriosGitHub,
  FALLBACK_PESSOA,
} from "@/api";

export default function ProjetosScreen() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [busca, setBusca] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("todos"); // "todos" | "backend" | "github"

  // Estados do Modal de CRUD no Back-end
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tecnologias, setTecnologias] = useState("");
  const [urlRepositorio, setUrlRepositorio] = useState("");
  const [urlDeploy, setUrlDeploy] = useState("");

  const {
    data: apiProjetos,
    isFetching: fetchingBackend,
    refetch: refetchBackend,
  } = useQuery({
    queryKey: ["projetos"],
    queryFn: getProjetos,
  });

  const {
    data: githubRepos,
    isFetching: fetchingGithub,
    refetch: refetchGithub,
  } = useQuery({
    queryKey: ["githubRepos"],
    queryFn: getRepositoriosGitHub,
  });

  const projetosBackend =
    apiProjetos && apiProjetos.length > 0
      ? apiProjetos
      : FALLBACK_PESSOA.projetos;

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["projetos"] });
    queryClient.invalidateQueries({ queryKey: ["curriculoPessoa"] });
  };

  const addMutation = useMutation({
    mutationFn: addProjeto,
    onSuccess: () => {
      invalidateAll();
      fecharModal();
    },
    onError: (err) => Alert.alert("Erro ao criar projeto", err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateProjeto,
    onSuccess: () => {
      invalidateAll();
      fecharModal();
    },
    onError: (err) => Alert.alert("Erro ao atualizar projeto", err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjeto,
    onSuccess: invalidateAll,
    onError: (err) => Alert.alert("Erro ao excluir projeto", err.message),
  });

  const abrirNovo = () => {
    setEditandoId(null);
    setNome("");
    setDescricao("");
    setTecnologias("React Native, Expo, Node.js");
    setUrlRepositorio("https://github.com/joaovictorchaves18");
    setUrlDeploy("");
    setModalVisivel(true);
  };

  const abrirEdicao = (proj) => {
    setEditandoId(proj.id);
    setNome(proj.nome || "");
    setDescricao(proj.descricao || "");
    setTecnologias(proj.tecnologias || "");
    setUrlRepositorio(proj.urlRepositorio || "");
    setUrlDeploy(proj.urlDeploy || "");
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setEditandoId(null);
  };

  const salvarProjeto = () => {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert("Atenção", "Preencha pelo menos Nome e Descrição do projeto.");
      return;
    }
    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      tecnologias: tecnologias.trim() || "JavaScript, React",
      urlRepositorio:
        urlRepositorio.trim() || "https://github.com/joaovictorchaves18",
      urlDeploy: urlDeploy.trim() || null,
    };
    if (editandoId) {
      updateMutation.mutate({ id: editandoId, ...payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const termo = busca.toLowerCase();
  const projetosBackendFiltrados = projetosBackend.filter(
    (p) =>
      (p.nome || "").toLowerCase().includes(termo) ||
      (p.descricao || "").toLowerCase().includes(termo) ||
      (p.tecnologias || "").toLowerCase().includes(termo),
  );

  const reposGithubFiltrados = (githubRepos || []).filter(
    (r) =>
      (r.name || "").toLowerCase().includes(termo) ||
      (r.description || "").toLowerCase().includes(termo) ||
      (r.language || "").toLowerCase().includes(termo),
  );

  const onRefreshAll = () => {
    refetchBackend();
    refetchGithub();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={fetchingBackend || fetchingGithub}
          onRefresh={onRefreshAll}
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
            Projetos Desenvolvidos
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Projetos do Back-end de Currículo + Repositórios ao vivo da API do GitHub.
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
          Novo
        </Button>
      </View>

      {/* BARRA DE PESQUISA E FILTROS */}
      <Searchbar
        placeholder="Filtrar por nome ou tecnologia..."
        onChangeText={setBusca}
        value={busca}
        style={[
          styles.searchBar,
          { backgroundColor: theme.colors.surface },
        ]}
        inputStyle={{ fontSize: 14 }}
      />

      <View style={styles.tabsRow}>
        {[
          { key: "todos", label: "Todos" },
          {
            key: "backend",
            label: `Destaques API (${projetosBackendFiltrados.length})`,
          },
          {
            key: "github",
            label: `GitHub Live (${reposGithubFiltrados.length})`,
          },
        ].map((tab) => {
          const ativo = abaAtiva === tab.key;
          return (
            <Chip
              key={tab.key}
              selected={ativo}
              onPress={() => setAbaAtiva(tab.key)}
              style={[
                styles.tabChip,
                ativo && { backgroundColor: theme.colors.primary },
              ]}
              textStyle={{
                color: ativo ? "#090D16" : theme.colors.onSurface,
                fontWeight: ativo ? "bold" : "normal",
                fontSize: 12,
              }}
            >
              {tab.label}
            </Chip>
          );
        })}
      </View>

      {/* PROJETOS DO BACK-END DE CURRÍCULO (COM CRUD) */}
      {(abaAtiva === "todos" || abaAtiva === "backend") &&
        projetosBackendFiltrados.map((proj) => {
          const listaTechs = (proj.tecnologias || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          return (
            <Card
              key={proj.id}
              mode="elevated"
              style={[
                styles.projectCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              <Card.Content>
                <View style={styles.cardTopRow}>
                  <Chip
                    icon="star-four-points"
                    compact
                    style={{ backgroundColor: theme.colors.surfaceVariant }}
                    textStyle={{
                      color: theme.colors.primary,
                      fontWeight: "bold",
                      fontSize: 11,
                    }}
                  >
                    Destaque (Back-end AOS)
                  </Chip>
                  <View style={styles.actionIcons}>
                    <IconButton
                      icon="pencil-outline"
                      size={18}
                      iconColor={theme.colors.primary}
                      onPress={() => abrirEdicao(proj)}
                    />
                    <IconButton
                      icon="delete-outline"
                      size={18}
                      iconColor="#EF4444"
                      onPress={() => deleteMutation.mutate(proj.id)}
                    />
                  </View>
                </View>

                <Text
                  variant="titleLarge"
                  style={[styles.projectName, { color: theme.colors.onSurface }]}
                >
                  {proj.nome}
                </Text>

                <Text
                  variant="bodyMedium"
                  style={[
                    styles.projectDesc,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {proj.descricao}
                </Text>

                <View style={styles.techWrap}>
                  {listaTechs.map((tech) => (
                    <Chip
                      key={tech}
                      compact
                      style={[
                        styles.techChip,
                        { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                      textStyle={{
                        color: theme.colors.onSurface,
                        fontSize: 11,
                      }}
                    >
                      {tech}
                    </Chip>
                  ))}
                </View>

                <View style={styles.linksRow}>
                  {proj.urlRepositorio ? (
                    <Button
                      mode="outlined"
                      compact
                      icon="github"
                      onPress={() => Linking.openURL(proj.urlRepositorio)}
                      style={{ borderColor: theme.colors.primary }}
                      textColor={theme.colors.primary}
                    >
                      Repositório
                    </Button>
                  ) : null}
                  {proj.urlDeploy ? (
                    <Button
                      mode="contained-tonal"
                      compact
                      icon="open-in-new"
                      onPress={() => Linking.openURL(proj.urlDeploy)}
                    >
                      Acessar Projeto
                    </Button>
                  ) : null}
                </View>
              </Card.Content>
            </Card>
          );
        })}

      {/* REPOSITÓRIOS EM TEMPO REAL DA API DO GITHUB */}
      {(abaAtiva === "todos" || abaAtiva === "github") &&
        reposGithubFiltrados.map((repo) => (
          <Card
            key={repo.id}
            mode="elevated"
            style={[
              styles.projectCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.secondary,
              },
            ]}
          >
            <Card.Content>
              <View style={styles.cardTopRow}>
                <Chip
                  icon="github"
                  compact
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                  textStyle={{
                    color: theme.colors.secondary,
                    fontWeight: "bold",
                    fontSize: 11,
                  }}
                >
                  GitHub REST API Live
                </Chip>
                <View style={styles.repoStats}>
                  {repo.language ? (
                    <Text
                      style={[
                        styles.repoLang,
                        { color: theme.colors.tertiary },
                      ]}
                    >
                      ● {repo.language}
                    </Text>
                  ) : null}
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={15}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.colors.onSurfaceVariant,
                    }}
                  >
                    {repo.stargazers_count || 0}
                  </Text>
                </View>
              </View>

              <Text
                variant="titleMedium"
                style={[styles.projectName, { color: theme.colors.onSurface }]}
              >
                {repo.name}
              </Text>

              <Text
                variant="bodyMedium"
                style={[
                  styles.projectDesc,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {repo.description ||
                  "Repositório público oficial de João Victor Chaves no GitHub."}
              </Text>

              <View style={styles.linksRow}>
                <Button
                  mode="outlined"
                  compact
                  icon="github"
                  onPress={() => Linking.openURL(repo.html_url)}
                  style={{ borderColor: theme.colors.secondary }}
                  textColor={theme.colors.secondary}
                >
                  Ver Código no GitHub
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

      {/* MODAL PARA ADICIONAR / EDITAR PROJETO NO BACK-END */}
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
              {editandoId ? "Editar Projeto (API)" : "Novo Projeto no Back-end"}
            </Text>
            <TextInput
              label="Nome do Projeto"
              mode="outlined"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />
            <TextInput
              label="Tecnologias (separadas por vírgula)"
              mode="outlined"
              value={tecnologias}
              onChangeText={setTecnologias}
              style={styles.input}
            />
            <TextInput
              label="URL do Repositório (GitHub)"
              mode="outlined"
              value={urlRepositorio}
              onChangeText={setUrlRepositorio}
              style={styles.input}
            />
            <TextInput
              label="URL de Deploy (Opcional)"
              mode="outlined"
              value={urlDeploy}
              onChangeText={setUrlDeploy}
              style={styles.input}
            />
            <TextInput
              label="Descrição do Projeto"
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
                onPress={salvarProjeto}
              >
                Salvar na API
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
    gap: 14,
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
  searchBar: {
    borderRadius: 14,
  },
  tabsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tabChip: {
    borderRadius: 16,
  },
  projectCard: {
    borderRadius: 18,
    borderLeftWidth: 4,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  actionIcons: {
    flexDirection: "row",
  },
  repoStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  repoLang: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },
  projectName: {
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 6,
  },
  projectDesc: {
    lineHeight: 20,
    marginBottom: 12,
  },
  techWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  techChip: {
    borderRadius: 10,
  },
  linksRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
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
