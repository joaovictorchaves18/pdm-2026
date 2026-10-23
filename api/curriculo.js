import axios from "axios";

export const API_BASE_URL = "https://curriculo-api-joao.vercel.app";
export const JOAO_PESSOA_ID = "05d157dc-1b34-4d0d-b516-3965b84945bc";

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const FALLBACK_PESSOA = {
  id: JOAO_PESSOA_ID,
  nome: "João Victor de Oliveira Chaves",
  titulo: "Desenvolvedor Full Stack & Eng. de Controle e Automação",
  resumo:
    "Tenho 20 anos, moro em Recife-PE e estudo na interseção entre o mundo digital e físico: curso Sistemas para Internet na UNICAP e Engenharia de Controle e Automação na UFPE. Desenvolvo aplicações web/mobile modernas (React, React Native, Next.js, Node.js) integradas a sistemas embarcados e IoT (ESP32, Arduino, C/C++).",
  email: "joao.chaves@unicap.br",
  telefone: "(81) 99999-1111",
  linkedin: "https://linkedin.com/in/joaovictorchaves",
  github: "https://github.com/joaovictorchaves18",
  experienciasAcademicas: [
    {
      id: "acad-1",
      instituicao: "UNICAP (Universidade Católica de Pernambuco)",
      curso: "Sistemas para Internet",
      grau: "Graduação Tecnológica",
      dataInicio: "2024-02",
      dataFim: "Em Andamento",
      descricao:
        "Graduação focada no desenvolvimento de sistemas web e mobile completos, lógica de programação front-end/back-end, arquitetura orientada a serviços (AOS), bancos de dados e nuvem.",
    },
    {
      id: "acad-2",
      instituicao: "UFPE (Universidade Federal de Pernambuco)",
      curso: "Engenharia de Controle e Automação",
      grau: "Bacharelado",
      dataInicio: "2024-02",
      dataFim: "Em Andamento",
      descricao:
        "Curso focado no controle de processos físicos e robóticos, automação industrial, microcontroladores (Arduino e ESP32), instrumentação, sistemas embarcados e IoT.",
    },
  ],
  experienciasProfissionais: [
    {
      id: "prof-1",
      empresa: "Projetos Independentes & Desenvolvimento Web",
      cargo: "Desenvolvedor Fullstack Freelancer",
      dataInicio: "2024-03",
      dataFim: "Atual",
      descricao:
        "Criação de páginas institucionais, landing pages, sistemas de reservas e painéis web sob medida com React, Next.js, Node.js, bancos SQL e deploy na Vercel.",
    },
    {
      id: "prof-2",
      empresa: "Protótipos de Sistemas Conectados (UFPE / Autônomo)",
      cargo: "Desenvolvedor de Automação & IoT",
      dataInicio: "2024-06",
      dataFim: "Atual",
      descricao:
        "Programação de firmwares em C/C++ para placas ESP32 e Arduino, leitura de sensores físicos (temperatura, umidade, presença), telemetria via MQTT e lógica de controle em CLPs.",
    },
    {
      id: "prof-3",
      empresa: "Comunidade & Repositórios Próprios",
      cargo: "Desenvolvedor Open Source",
      dataInicio: "2023-01",
      dataFim: "Atual",
      descricao:
        "Desenvolvimento de APIs REST em Node.js/Express, aplicativos mobile com React Native + Expo e scripts de automação documentados no GitHub.",
    },
  ],
  projetos: [
    {
      id: "proj-1",
      nome: "Flávia Oliveira Comedoria na Copa",
      descricao:
        "Sistema web completo para reserva de ingressos e controle de eventos, com painel administrativo em tempo real, geração de QR Codes para check-in e integração com WhatsApp.",
      tecnologias: "React, Next.js, JavaScript, Node.js",
      urlRepositorio:
        "https://github.com/joaovictorchaves18/Flaviaoliveiradoceriaa",
      urlDeploy: "https://github.com/joaovictorchaves18/Flaviaoliveiradoceriaa",
    },
    {
      id: "proj-2",
      nome: "API REST de Currículo (AOS - UNICAP)",
      descricao:
        "Back-end RESTful completo desenvolvido com Node.js, Express, Sequelize e PostgreSQL (NeonDB) para gestão de currículos e portfólios, consumido por este App Mobile.",
      tecnologias: "Node.js, Express, Sequelize, PostgreSQL, Vercel",
      urlRepositorio:
        "https://github.com/joaovictorchaves18/curriculo-api-joao",
      urlDeploy: "https://curriculo-api-joao.vercel.app",
    },
    {
      id: "proj-3",
      nome: "Estufa Inteligente IoT",
      descricao:
        "Protótipo baseado em ESP32 que lê sensores físicos de temperatura e umidade e envia dados via protocolo MQTT para um painel web de controle automático de ventilação e irrigação.",
      tecnologias: "C++, ESP32, MQTT, IoT, Sensores",
      urlRepositorio: "https://github.com/joaovictorchaves18",
      urlDeploy: "https://github.com/joaovictorchaves18",
    },
    {
      id: "proj-4",
      nome: "Braço Robótico Articulado",
      descricao:
        "Programação de hardware para controle físico de motores de passo em um mini manipulador robótico industrial, calculando cinemática e sincronizando com painel de controle.",
      tecnologias: "C++, Arduino, Robótica, Controle",
      urlRepositorio: "https://github.com/joaovictorchaves18",
      urlDeploy: "https://github.com/joaovictorchaves18",
    },
  ],
  habilidades: [
    {
      id: "hab-1",
      nome: "React & React Native (Expo)",
      nivel: "Avançado",
      categoria: "Front-end & Mobile",
    },
    {
      id: "hab-2",
      nome: "Next.js & JavaScript/TypeScript",
      nivel: "Avançado",
      categoria: "Front-end",
    },
    {
      id: "hab-3",
      nome: "Node.js & Express (REST APIs)",
      nivel: "Avançado",
      categoria: "Back-end",
    },
    {
      id: "hab-4",
      nome: "PostgreSQL & Sequelize ORM",
      nivel: "Intermediário",
      categoria: "Banco de Dados",
    },
    {
      id: "hab-5",
      nome: "C/C++, Arduino & ESP32",
      nivel: "Avançado",
      categoria: "Sistemas Embarcados",
    },
    {
      id: "hab-6",
      nome: "IoT, MQTT & Automação CLP",
      nivel: "Intermediário",
      categoria: "Controle & Automação",
    },
  ],
};

// ==================== PESSOA / CURRÍCULO COMPLETO ====================
export async function getCurriculoPessoa() {
  const response = await instance.get(`/pessoas/${JOAO_PESSOA_ID}`);
  return response.data;
}

export async function updateCurriculoPessoa(dados) {
  const response = await instance.put(`/pessoas/${JOAO_PESSOA_ID}`, dados);
  return response.data;
}

// ==================== EXPERIÊNCIA ACADÊMICA ====================
export async function getExperienciasAcademicas() {
  const response = await instance.get(
    `/experiencias-academicas?pessoaId=${JOAO_PESSOA_ID}`,
  );
  return response.data;
}

export async function addExperienciaAcademica(novaExp) {
  const response = await instance.post("/experiencias-academicas", {
    ...novaExp,
    pessoaId: JOAO_PESSOA_ID,
  });
  return response.data;
}

export async function updateExperienciaAcademica({ id, ...dados }) {
  const response = await instance.put(`/experiencias-academicas/${id}`, {
    ...dados,
    pessoaId: JOAO_PESSOA_ID,
  });
  return response.data;
}

export async function deleteExperienciaAcademica(id) {
  const response = await instance.delete(`/experiencias-academicas/${id}`);
  return response.data;
}

// ==================== EXPERIÊNCIA PROFISSIONAL ====================
export async function getExperienciasProfissionais() {
  const response = await instance.get(
    `/experiencias-profissionais?pessoaId=${JOAO_PESSOA_ID}`,
  );
  return response.data;
}

export async function addExperienciaProfissional(novaExp) {
  const response = await instance.post("/experiencias-profissionais", {
    ...novaExp,
    pessoaId: JOAO_PESSOA_ID,
  });
  return response.data;
}

export async function updateExperienciaProfissional({ id, ...dados }) {
  const response = await instance.put(`/experiencias-profissionais/${id}`, {
    ...dados,
    pessoaId: JOAO_PESSOA_ID,
  });
  return response.data;
}

export async function deleteExperienciaProfissional(id) {
  const response = await instance.delete(`/experiencias-profissionais/${id}`);
  return response.data;
}

// ==================== PROJETOS ====================
export async function getProjetos() {
  const response = await instance.get(`/projetos?pessoaId=${JOAO_PESSOA_ID}`);
  return response.data;
}

export async function addProjeto(novoProjeto) {
  const response = await instance.post("/projetos", {
    ...novoProjeto,
    pessoaId: JOAO_PESSOA_ID,
  });
  return response.data;
}

export async function updateProjeto({ id, ...dados }) {
  const response = await instance.put(`/projetos/${id}`, {
    ...dados,
    pessoaId: JOAO_PESSOA_ID,
  });
  return response.data;
}

export async function deleteProjeto(id) {
  const response = await instance.delete(`/projetos/${id}`);
  return response.data;
}

// ==================== HABILIDADES ====================
export async function getHabilidades() {
  const response = await instance.get(
    `/habilidades?pessoaId=${JOAO_PESSOA_ID}`,
  );
  return response.data;
}

export async function addHabilidade(novaHabilidade) {
  const response = await instance.post("/habilidades", {
    ...novaHabilidade,
    pessoaId: JOAO_PESSOA_ID,
  });
  return response.data;
}

export async function deleteHabilidade(id) {
  const response = await instance.delete(`/habilidades/${id}`);
  return response.data;
}

// ==================== INTEGRAÇÃO GITHUB REST API ====================
export async function getRepositoriosGitHub() {
  const response = await axios.get(
    "https://api.github.com/users/joaovictorchaves18/repos?sort=updated&per_page=8",
    { timeout: 8000 },
  );
  return response.data;
}
