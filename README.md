# 📱 Aplicativo de Currículo & Portfólio — João Victor de Oliveira Chaves

Aplicativo mobile multiplataforma desenvolvido com **React Native + Expo (SDK 57)** e **Expo Router** para a disciplina de **Programação para Dispositivos Móveis (PDM - UNICAP)**.

---

## 🔗 Links Oficiais de Entrega

- **Repositório no GitHub:** [https://github.com/joaovictorchaves18/pdm-2026](https://github.com/joaovictorchaves18/pdm-2026)
- **App Publicado no Expo (EAS Update Dashboard + QR Code - SDK 58):** [https://expo.dev/accounts/joaochaves26s-team/projects/pdm-2026-curriculo-joao-chaves/updates/ca0d152e-ccdd-4b2f-a755-346f08617311](https://expo.dev/accounts/joaochaves26s-team/projects/pdm-2026-curriculo-joao-chaves/updates/ca0d152e-ccdd-4b2f-a755-346f08617311)
- **Página Direta de Preview com QR Code para o Expo Go:** [Abrir QR Code do App no Expo Go](https://expo.dev/preview/update?message=feat%3A+upgrade+para+Expo+SDK+58+%28iOS%2FAndroid+Expo+Go%29&updateRuntimeVersion=1.0.0&slug=pdm-2026-curriculo-joao-chaves&projectId=1634f0d2-762c-46e2-a525-802122ce7ab9&group=ca0d152e-ccdd-4b2f-a755-346f08617311)
- **Back-end AOS (API RESTful + Neon PostgreSQL):** [https://curriculo-api-joao.vercel.app/pessoas](https://curriculo-api-joao.vercel.app/pessoas)

---

## 👨‍💻 Autor

- **Nome:** João Victor de Oliveira Chaves (20 anos)
- **Formação:**
  - 🎓 **Sistemas para Internet** — UNICAP (Universidade Católica de Pernambuco)
  - 🎓 **Engenharia de Controle e Automação** — UFPE (Universidade Federal de Pernambuco)
- **GitHub:** [@joaovictorchaves18](https://github.com/joaovictorchaves18)

---

## 🧭 Telas do Aplicativo (Expo Router)

O aplicativo utiliza navegação em abas (**Tabs Navigation** do `expo-router`) dividida em **5 telas principais**:

1. **Início (`app/index.jsx`)**:
   - Foto de perfil, resumo profissional, idade (20 anos) e indicadores rápidos das duas graduações (UNICAP + UFPE).
   - **Habilidades Técnicas** carregadas dinamicamente do Back-end com filtro por categoria persistido via Zustand e opção de adicionar/remover habilidades ao vivo.
   - Botão de edição rápida do perfil no Back-end, links diretos para GitHub e E-mail, e widget interativo de Insights/Dicas de Programação.
2. **Experiência Acadêmica (`app/academico.jsx`)**:
   - Lista as formações acadêmicas vindas do Back-end (`Sistemas para Internet - UNICAP` e `Engenharia de Controle e Automação - UFPE`), focos de aprendizado, destaques e card de sinergia Software + Hardware.
   - Permite **Adicionar, Editar e Excluir** formações acadêmicas diretamente no Back-end.
3. **Experiência Profissional (`app/profissional.jsx`)**:
   - Linha do tempo das experiências práticas (Desenvolvimento Fullstack Freelancer, Automação & IoT e Projetos Open Source) com tags de tecnologias.
   - Permite **Adicionar, Editar e Excluir** experiências profissionais em tempo real na API.
4. **Projetos (`app/projetos.jsx`)**:
   - Combina os **Projetos em Destaque** cadastrados no Back-end de Currículo com os **Repositórios Públicos em Tempo Real** da API oficial do GitHub (`@joaovictorchaves18`).
   - Possui barra de busca instantânea (`Searchbar`), filtro por origem e CRUD completo no Back-end.
5. **Sobre (`app/sobre.jsx`)**:
   - Apresenta a biografia completa de João Victor, Terminal Holográfico interativo (`TERMINAL_JOAO_v2.0`), **todas as tecnologias e módulos utilizados** no desenvolvimento e o detalhamento das **Funcionalidades Extras implementadas**.

---

## 🌐 Conexão com o Back-end (AOS API + Neon PostgreSQL)

O aplicativo está integrado ao Back-end próprio desenvolvido na disciplina de **Aplicações Orientadas a Serviços (AOS)**, hospedado na **Vercel** com banco de dados **PostgreSQL (NeonDB)**:

- **Base URL:** `https://curriculo-api-joao.vercel.app`
- **Endpoints consumidos (`api/curriculo.js`):**
  - `GET / PUT /pessoas/:id`
  - `GET / POST / PUT / DELETE /experiencias-academicas`
  - `GET / POST / PUT / DELETE /experiencias-profissionais`
  - `GET / POST / PUT / DELETE /projetos`
  - `GET / POST / DELETE /habilidades`

---

## ⭐ Funcionalidades Extras Implementadas

1. **Gerenciador de Currículo Full-CRUD em Tempo Real no Back-end:** Permite criar, editar e remover formações acadêmicas, experiências profissionais, projetos, habilidades e dados do perfil diretamente pelo aplicativo utilizando `@tanstack/react-query` (`useQuery` e `useMutation` com invalidação automática de cache).
2. **Tema Cyber Dark / Clean Light com Persistência Local:** Alternância instantânea entre Modo Escuro e Modo Claro no cabeçalho do App, persistida no dispositivo com **Zustand + AsyncStorage**.
3. **Integração Híbrida com GitHub REST API + Busca Instantânea:** Consulta ao vivo os repositórios públicos de `joaovictorchaves18` no GitHub, exibindo linguagem principal, estrelas e link direto para o código, além de busca dinâmica por nome ou tecnologia.

---

## 🛠️ Tecnologias e Módulos Utilizados

- **Expo SDK 57** & **React Native 0.86** (`react: 19.2.3`)
- **Expo Router** (`~57.0.23`) — Roteamento baseado em arquivos (`app/`)
- **React Native Paper** (`^5.15.3`) — Componentes visuais Material Design 3 e temas customizados
- **TanStack React Query** (`^5.102.8`) & **Axios** (`^1.20.0`) — Consumo de API REST, cache e mutações
- **Zustand** (`^5.0.15`) & **AsyncStorage** (`2.2.0`) — Estado global com persistência nativa
- **@expo/vector-icons** (`MaterialCommunityIcons`) — Ícones vetoriais

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor Expo (para abrir no Expo Go pelo QR Code)
npx expo start --go

# Ou iniciar com Tunnel caso o celular esteja em outra rede:
npx expo start --go --tunnel
```
