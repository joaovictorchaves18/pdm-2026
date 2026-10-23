import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Modal,
  Alert,
} from "react-native";
import {
  Card,
  Text,
  Button,
  Chip,
  ActivityIndicator,
  TextInput,
  useTheme,
  IconButton,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurriculoPessoa,
  updateCurriculoPessoa,
  addHabilidade,
  deleteHabilidade,
  FALLBACK_PESSOA,
} from "@/api";
import { useThemeStore } from "@/zustand";

const CONSELHOS_DEV = [
  "Simplificar é o primeiro passo para a robustez de um sistema de automação e de software.",
  "O melhor hardware precisa de um software incrível, e o melhor software ganha vida através do hardware.",
  "Estudar Sistemas para Internet e Engenharia de Controle e Automação é dominar o software que move o mundo virtual e físico.",
  "A melhor maneira de prever o futuro é automatizá-lo.",
  "Antes de automatizar, certifique-se de que você entende o processo manual perfeitamente.",
];

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { filtroCategoriaSkill, setFiltroCategoriaSkill } = useThemeStore();

  // Estados para Dica de Dev
  const [conselho, setConselho] = useState(CONSELHOS_DEV[0]);
  const [loadingConselho, setLoadingConselho] = useState(false);

  // Estados para Modal de Edição do Perfil no Back-end
  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [nomeForm, setNomeForm] = useState("");
  const [tituloForm, setTituloForm] = useState("");
  const [resumoForm, setResumoForm] = useState("");
  const [emailForm, setEmailForm] = useState("");
  const [telefoneForm, setTelefoneForm] = useState("");

  // Estados para Modal de Nova Habilidade no Back-end
  const [modalSkillVisivel, setModalSkillVisivel] = useState(false);
  const [novaSkillNome, setNovaSkillNome] = useState("");
  const [novaSkillNivel, setNovaSkillNivel] = useState("Avançado");
  const [novaSkillCategoria, setNovaSkillCategoria] = useState("Front-end & Mobile");

  const {
    data: apiPessoa,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["curriculoPessoa"],
    queryFn: getCurriculoPessoa,
  });

  const pessoa = apiPessoa || FALLBACK_PESSOA;
  const habilidades = pessoa.habilidades || FALLBACK_PESSOA.habilidades;

  const updatePerfilMutation = useMutation({
    mutationFn: updateCurriculoPessoa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculoPessoa"] });
      setModalPerfilVisivel(false);
      Alert.alert("Sucesso", "Perfil atualizado no Back-end!");
    },
    onError: (err) => {
      Alert.alert("Erro ao atualizar", err.message);
    },
  });

  const addSkillMutation = useMutation({
    mutationFn: addHabilidade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculoPessoa"] });
      setNovaSkillNome("");
      setModalSkillVisivel(false);
    },
    onError: (err) => {
      Alert.alert("Erro ao adicionar habilidade", err.message);
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: deleteHabilidade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculoPessoa"] });
    },
    onError: (err) => {
      Alert.alert("Erro ao remover habilidade", err.message);
    },
  });

  const abrirModalPerfil = () => {
    setNomeForm(pessoa.nome || "");
    setTituloForm(pessoa.titulo || "");
    setResumoForm(pessoa.resumo || "");
    setEmailForm(pessoa.email || "");
    setTelefoneForm(pessoa.telefone || "");
    setModalPerfilVisivel(true);
  };

  const salvarPerfil = () => {
    if (!nomeForm.trim() || !tituloForm.trim()) {
      Alert.alert("Atenção", "Preencha pelo menos Nome e Título.");
      return;
    }
    updatePerfilMutation.mutate({
      nome: nomeForm,
      titulo: tituloForm,
      resumo: resumoForm,
      email: emailForm,
      telefone: telefoneForm,
      linkedin: pessoa.linkedin,
      github: pessoa.github,
    });
  };

  const salvarNovaSkill = () => {
    if (!novaSkillNome.trim()) {
      Alert.alert("Atenção", "Digite o nome da habilidade/tecnologia.");
      return;
    }
    addSkillMutation.mutate({
      nome: novaSkillNome.trim(),
      nivel: novaSkillNivel,
      categoria: novaSkillCategoria,
    });
  };

  const sortearConselho = async () => {
    setLoadingConselho(true);
    try {
      const res = await fetch("https://api.adviceslip.com/advice", {
        cache: "no-store",
      });
      const json = await res.json();
      if (json?.slip?.advice) {
        setConselho(json.slip.advice);
      } else {
        throw new Error("Fallback");
      }
    } catch {
      const idx = Math.floor(Math.random() * CONSELHOS_DEV.length);
      setConselho(CONSELHOS_DEV[idx]);
    } finally {
      setLoadingConselho(false);
    }
  };

  useEffect(() => {
    // Mantém primeiro em português ao abrir, mas permite buscar na API pública
  }, []);

  const categorias = [
    "Todas",
    ...Array.from(new Set(habilidades.map((h) => h.categoria))),
  ];

  const habilidadesFiltradas =
    filtroCategoriaSkill === "Todas"
      ? habilidades
      : habilidades.filter((h) => h.categoria === filtroCategoriaSkill);

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
      {/* Barra de Status da Conexão com o Back-end */}
      <View
        style={[
          styles.statusBanner,
          {
            backgroundColor: theme.colors.surface,
            borderColor: isError ? "#F59E0B" : theme.colors.tertiary,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={isError ? "cloud-alert" : "cloud-check"}
          size={16}
          color={isError ? "#F59E0B" : theme.colors.tertiary}
        />
        <Text
          style={[styles.statusText, { color: theme.colors.onSurfaceVariant }]}
        >
          {isLoading
            ? "Conectando ao Back-end (Vercel + NeonDB)..."
            : isError
              ? "Modo Offline (Fallback Local Ativo)"
              : "Back-end Conectado: curriculo-api-joao.vercel.app"}
        </Text>
        {isFetching && (
          <ActivityIndicator size={14} color={theme.colors.primary} />
        )}
      </View>

      {/* HERO CARD DO CURRÍCULO */}
      <Card
        mode="elevated"
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <Card.Content style={styles.heroContent}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require("@/assets/images/perfil.jpg")}
              style={[
                styles.avatar,
                { borderColor: theme.colors.primary },
              ]}
            />
            <View
              style={[
                styles.ageBadge,
                { backgroundColor: theme.colors.secondary },
              ]}
            >
              <Text style={styles.ageBadgeText}>20 ANOS</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <Chip
              icon="sparkles"
              compact
              style={[
                styles.roleChip,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              textStyle={{ color: theme.colors.primary, fontWeight: "bold", fontSize: 11 }}
            >
              Sistemas (UNICAP) + Automação (UFPE)
            </Chip>
          </View>

          <Text
            variant="headlineSmall"
            style={[styles.name, { color: theme.colors.onSurface }]}
          >
            {pessoa.nome}
          </Text>

          <Text
            variant="titleSmall"
            style={[styles.roleTitle, { color: theme.colors.primary }]}
          >
            {pessoa.titulo}
          </Text>

          <Text
            variant="bodyMedium"
            style={[styles.bio, { color: theme.colors.onSurfaceVariant }]}
          >
            {pessoa.resumo}
          </Text>

          {/* Botões de Ação Rápida */}
          <View style={styles.ctaRow}>
            <Button
              mode="contained"
              icon="rocket-launch"
              onPress={() => router.push("/projetos")}
              style={styles.ctaBtn}
              buttonColor={theme.colors.primary}
              textColor="#090D16"
            >
              Ver Projetos
            </Button>
            <Button
              mode="outlined"
              icon="account-edit"
              onPress={abrirModalPerfil}
              style={[styles.ctaBtn, { borderColor: theme.colors.primary }]}
              textColor={theme.colors.primary}
            >
              Editar no Back-end
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* CARDS DE RESUMO RÁPIDO (2 GRADUAÇÕES + LOCALIZAÇÃO) */}
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={[
            styles.statBox,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
          onPress={() => router.push("/academico")}
        >
          <MaterialCommunityIcons
            name="code-tags"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            UNICAP
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            Sistemas p/ Internet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statBox,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
          onPress={() => router.push("/academico")}
        >
          <MaterialCommunityIcons
            name="chip"
            size={24}
            color={theme.colors.secondary}
          />
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            UFPE
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            Controle & Automação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statBox,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
          onPress={() => router.push("/sobre")}
        >
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={24}
            color={theme.colors.tertiary}
          />
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            Recife
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            Pernambuco • 20 anos
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEÇÃO DE HABILIDADES (VINDA DO BACK-END + FILTRO ZUSTAND + CRUD) */}
      <Card
        mode="elevated"
        style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={22}
                color={theme.colors.primary}
              />
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Habilidades Técnicas (API)
              </Text>
            </View>
            <Button
              mode="contained-tonal"
              compact
              icon="plus"
              onPress={() => setModalSkillVisivel(true)}
            >
              Nova
            </Button>
          </View>

          {/* Filtro por Categoria salvo no Zustand */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {categorias.map((cat) => {
              const selecionado = filtroCategoriaSkill === cat;
              return (
                <Chip
                  key={cat}
                  selected={selecionado}
                  onPress={() => setFiltroCategoriaSkill(cat)}
                  style={[
                    styles.filterChip,
                    selecionado && {
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                  textStyle={{
                    color: selecionado ? "#090D16" : theme.colors.onSurface,
                    fontWeight: selecionado ? "bold" : "normal",
                    fontSize: 12,
                  }}
                >
                  {cat}
                </Chip>
              );
            })}
          </ScrollView>

          {habilidadesFiltradas.map((hab) => (
            <View
              key={hab.id}
              style={[
                styles.skillRow,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.skillName, { color: theme.colors.onSurface }]}
                >
                  {hab.nome}
                </Text>
                <Text
                  style={[
                    styles.skillMeta,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {hab.categoria} • Nível: {hab.nivel}
                </Text>
              </View>
              <IconButton
                icon="delete-outline"
                size={18}
                iconColor="#EF4444"
                onPress={() => deleteSkillMutation.mutate(hab.id)}
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* CONTATOS E LINKS DIRETOS */}
      <Card
        mode="elevated"
        style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons
              name="card-account-mail"
              size={22}
              color={theme.colors.secondary}
            />
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Contato & Redes
            </Text>
          </View>

          <View style={styles.contactGrid}>
            <TouchableOpacity
              style={[
                styles.contactBtn,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              onPress={() =>
                Linking.openURL(
                  pessoa.github || "https://github.com/joaovictorchaves18",
                )
              }
            >
              <MaterialCommunityIcons
                name="github"
                size={22}
                color={theme.colors.primary}
              />
              <View>
                <Text
                  style={[
                    styles.contactLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  GitHub Oficial
                </Text>
                <Text
                  style={[
                    styles.contactValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  @joaovictorchaves18
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contactBtn,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              onPress={() =>
                Linking.openURL(`mailto:${pessoa.email || "joao.chaves@unicap.br"}`)
              }
            >
              <MaterialCommunityIcons
                name="email-fast-outline"
                size={22}
                color={theme.colors.secondary}
              />
              <View>
                <Text
                  style={[
                    styles.contactLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  E-mail Acadêmico
                </Text>
                <Text
                  style={[
                    styles.contactValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {pessoa.email}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* WIDGET INTERATIVO DE DICA DE DEV (API PÚBLICA) */}
      <Card
        mode="elevated"
        style={[
          styles.sectionCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.secondary,
            borderWidth: 1,
          },
        ]}
      >
        <Card.Content>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons
                name="console"
                size={20}
                color={theme.colors.secondary}
              />
              <Text
                variant="titleSmall"
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Insight de Programação & Automação
              </Text>
            </View>
            <Button
              mode="text"
              compact
              icon="refresh"
              loading={loadingConselho}
              onPress={sortearConselho}
              textColor={theme.colors.primary}
            >
              Sortear
            </Button>
          </View>
          <Text
            style={[
              styles.adviceQuote,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            "{conselho}"
          </Text>
        </Card.Content>
      </Card>

      {/* MODAL PARA EDITAR PERFIL NO BACK-END */}
      <Modal
        visible={modalPerfilVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalPerfilVisivel(false)}
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
              Editar Perfil (Back-end AOS)
            </Text>
            <TextInput
              label="Nome Completo"
              mode="outlined"
              value={nomeForm}
              onChangeText={setNomeForm}
              style={styles.input}
            />
            <TextInput
              label="Título Profissional"
              mode="outlined"
              value={tituloForm}
              onChangeText={setTituloForm}
              style={styles.input}
            />
            <TextInput
              label="Resumo / Bio"
              mode="outlined"
              multiline
              numberOfLines={3}
              value={resumoForm}
              onChangeText={setResumoForm}
              style={styles.input}
            />
            <TextInput
              label="E-mail"
              mode="outlined"
              value={emailForm}
              onChangeText={setEmailForm}
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalPerfilVisivel(false)}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                loading={updatePerfilMutation.isPending}
                onPress={salvarPerfil}
              >
                Salvar na API
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA ADICIONAR HABILIDADE NO BACK-END */}
      <Modal
        visible={modalSkillVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalSkillVisivel(false)}
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
              Nova Habilidade no Back-end
            </Text>
            <TextInput
              label="Tecnologia (ex: Docker, TypeScript, CLP)"
              mode="outlined"
              value={novaSkillNome}
              onChangeText={setNovaSkillNome}
              style={styles.input}
            />
            <TextInput
              label="Categoria (ex: Back-end, Front-end, Sistemas Embarcados)"
              mode="outlined"
              value={novaSkillCategoria}
              onChangeText={setNovaSkillCategoria}
              style={styles.input}
            />
            <TextInput
              label="Nível (Iniciante, Intermediário, Avançado)"
              mode="outlined"
              value={novaSkillNivel}
              onChangeText={setNovaSkillNivel}
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalSkillVisivel(false)}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                loading={addSkillMutation.isPending}
                onPress={salvarNovaSkill}
              >
                Adicionar
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
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    flex: 1,
    fontWeight: "600",
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
  },
  heroContent: {
    alignItems: "center",
    paddingVertical: 8,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
  },
  ageBadge: {
    position: "absolute",
    bottom: -4,
    right: -6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ageBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  badgeRow: {
    marginBottom: 8,
  },
  roleChip: {
    borderRadius: 16,
  },
  name: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  roleTitle: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  bio: {
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 16,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaBtn: {
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontWeight: "bold",
    fontSize: 15,
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  sectionCard: {
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: "bold",
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterChip: {
    marginRight: 8,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  skillName: {
    fontWeight: "700",
    fontSize: 14,
  },
  skillMeta: {
    fontSize: 12,
  },
  contactGrid: {
    gap: 10,
    marginTop: 6,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  contactLabel: {
    fontSize: 11,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  adviceQuote: {
    fontStyle: "italic",
    lineHeight: 20,
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
    gap: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 6,
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
