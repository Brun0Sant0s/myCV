// Portuguese (Portugal) versions of the content in src/data.
// The JSON files stay the source of truth in English; these overrides are applied on top when the site is in Portuguese.
// Anything missing here simply shows in English.

const STATUS = {
    Pilot: "Piloto",
    Completed: "Concluído",
    "Final testing": "Testes finais",
};

const ROLES = {
    epharma: { label: "ePharma", role: "Frontend Engineer", period: "Ago 2021 – Ago 2025" },
    freelance: { label: "Os meus projetos", role: "Frontend & Product Developer", period: "2021 – Presente" },
    pyro: { label: "Pirotecnia", role: "Técnico de Pirotecnia e SFX", period: "2024 – Presente" },
};

// Keyed by the id of each moment in experience.json
const EVENTS = {
    "epharma-join": {
        title: "Entrada na ePharma",
        text: "Entrei na empresa ePharma como Frontend Engineer, a construir interfaces de produção responsivas e acessíveis com componentes reutilizáveis.",
    },
    "epharma-angular": { title: "Angular na ePharma", text: "Passei para um projeto em Angular." },
    "epharma-return": {
        title: "De volta ao projeto original",
        text: "Regressei ao produto original, com JavaScript, jQuery e Java, e com o trabalho gerido no Wrike, em Scrum.",
    },
    "epharma-leave": { title: "Saída da ePharma", text: "Ao fim de quatro anos, saí da ePharma." },
    "freelance-start": {
        title: "Início como freelancer",
        text: "Comecei a criar produtos próprios para vender e rentabilizar, a par de landing pages e websites para clientes.",
    },
    savespot: { text: "App de marcações para barbeiros, salões, clínicas e estúdios, levada do conceito ao lançamento." },
    kyuar: { text: "Plataforma de gestão para restaurantes: pedidos por QR Code, backoffice, faturação, reservas e gestão de stock e de funcionários." },
    mingle: {
        text: "Plataforma para eventos com entrada por QR code: um rolo de fotos em estilo analógico revelado no fim da noite, mensagens dos convidados, pedidos de músicas, quizzes ao vivo e pulseiras LED.",
    },
    "pyro-shows": {
        title: "Espetáculos ao vivo e SFX",
        text: "Parte da equipa em grandes espetáculos ao vivo, onde o timing é ao segundo e as regras de segurança são rigorosas.",
        tags: ["Creamfields", "Estádio do Dragão", "Supertaça", "Seleção Nacional", "Paredes de Coura"],
    },
    "pyro-website": { title: "Website da Pyro", text: "Website e backoffice para a empresa: serviços, portefólio e três idiomas." },
    engi: {
        text: "App web de controlo de espetáculos para um cliente: luz, som e vídeo disparados ao segundo exato, num Raspberry Pi com hora GPS.",
    },
    ouruber: {
        text: "App de transporte que desenvolvi de ponta a ponta, com modo cliente e condutor, viagens em tempo real no mapa e avaliação dos condutores.",
    },
};

const PROJECTS = {
    savespot: {
        subtitle: "App de marcações para negócios de beleza",
        description:
            "O SaveSpot é uma app de marcações para barbeiros, salões, clínicas e estúdios. Os negócios gerem o dia inteiro a partir do telemóvel, e os clientes encontram um espaço e marcam em poucos toques, de graça.",
        features: [
            "Agenda única: marcações da app, de uma página web, do Instagram e do WhatsApp caem no mesmo calendário, sem marcações duplicadas",
            "Equipa e clientes: funções e horários por pessoa, histórico de clientes, notas e importação de contactos",
            "Lembretes e estatísticas: lembretes push antes de cada visita e uma vista mensal de marcações e faturação",
        ],
    },
    kyuar: {
        subtitle: "Pedidos por QR para bares e restaurantes",
        description:
            "O Kyuar é uma plataforma de pedidos por QR para bares e restaurantes. Os clientes pedem e pagam a partir da mesa sem esperar, e a equipa gere o serviço inteiro na sua própria app.",
        features: [
            "Pedidos por QR: ler o código da mesa, ver o menu, juntar notas e enviar o pedido, sem nada para instalar",
            "App da equipa: pedidos em tempo real por estado, mesas por zona, pagamentos por QR code e reservas",
            "Ferramentas do gerente: editar o menu, o stock e a disponibilidade, gerir os funcionários e acompanhar a faturação do dia",
        ],
    },
    pyro: {
        subtitle: "Website para cliente com backoffice",
        description:
            "Pyro Entertainment & SFX é o website de uma empresa de pirotecnia e efeitos especiais, a mesma com quem trabalho nos espetáculos ao vivo. Os visitantes vão de um serviço até cada efeito, e a equipa mantém tudo atualizado num backoffice, sem mexer em código.",
        features: [
            "Serviços em três níveis: da pirotecnia ou dos efeitos especiais até cada efeito, com galeria e destaques próprios",
            "Backoffice: a equipa edita serviços, efeitos, fotos e destaques depois de iniciar sessão, com sessões seguras",
            "Portefólio: espetáculos anteriores filtrados por tipo, da passagem de ano no Porto às chamas de palco e CO2",
            "Três idiomas: português, inglês e espanhol, escolhidos a partir do browser",
        ],
    },
    engi: {
        subtitle: "App web para cliente de controlo de espetáculos",
        description:
            "A engi.studio é uma empresa de engenharia de espetáculos ao vivo, e este é o painel de controlo que fiz para ela. Cada unidade corre num Raspberry Pi com hora GPS e dispara cues de luz, som e vídeo ao segundo exato.",
        features: [
            "Dashboard: sinal GPS, satélites e qualidade do sinal, testes ao sistema e os próximos cues à vista",
            "Eventos: todos os cues numa lista ou num calendário semanal, mensal e anual, filtrados por Art-Net, MIDI, OSC ou Reaper",
            "Setups: universos Art-Net e streams do Reaper para cada unidade, com IP, porta e modo",
            "Relógios e rede: hora GPS ou local como referência, interfaces de rede e um teste de ping",
        ],
    },
    ouruber: {
        subtitle: "App de transporte para clientes e condutores",
        description:
            "O OurUber é uma app de transporte que desenhei e desenvolvi de ponta a ponta, em que a mesma conta pode pedir viagens ou conduzir. Cada viagem vai do pedido à avaliação em tempo real, com mapa, hora de recolha e um curto prazo para aceitar a proposta do condutor.",
        features: [
            "Pedido: origem e destino escolhidos no mapa, com a morada preenchida a partir da localização",
            "Modo condutor: pedidos abertos por perto com a hora de recolha, e um toque para propor a viagem",
            "Viagem ao vivo: o cliente tem três minutos para aceitar a proposta e depois acompanha cada passo até ambos confirmarem o fim",
            "Viagens e avaliações: histórico por estado, avaliações de 1 a 5 estrelas e a média de cada condutor no perfil",
        ],
    },
    mingle: {
        subtitle: "Plataforma interativa para eventos",
        description:
            "O Mingle é uma plataforma interativa para eventos de todo o tipo, de festas a noites de empresa. Os convidados entram por QR code sem instalar nenhuma app, e os anfitriões controlam cada momento da noite a partir de um único painel. Está tudo feito; só falta testar as pulseiras LED num evento real.",
        features: [
            "Pulse: uma pulseira LED em cada convidado que ilumina a sala ao ritmo da música e reage às atividades",
            "Roll: o telemóvel de cada convidado passa a ser uma máquina de rolo, as fotos aparecem na TV e são reveladas todas juntas no fim",
            "Cheers: os convidados deixam uma mensagem escrita ou gravada com uma foto, guardada num livro para os anfitriões",
            "Jukebox: os convidados pedem músicas no telemóvel e o DJ vê a lista num ecrã",
            "Buzz: um quiz ao vivo, com a pergunta na TV, as respostas no telemóvel e um pódio",
        ],
    },
};

// Captions of the screenshots (group and screen name), shared by every project
const MEDIA = {
    Launch: "Abertura",
    "Business app": "App do negócio",
    "Client app": "App do cliente",
    Clients: "Clientes",
    Services: "Serviços",
    Home: "Início",
    Place: "Espaço",
    Customer: "Cliente",
    Staff: "Equipa",
    Manager: "Gerente",
    "Scan the table": "Ler a mesa",
    Item: "Artigo",
    Cart: "Carrinho",
    "Today's orders": "Pedidos de hoje",
    Tables: "Mesas",
    Orders: "Pedidos",
    "New order": "Novo pedido",
    Payments: "Pagamentos",
    Reservations: "Reservas",
    Service: "Serviço",
    Portfolio: "Portefólio",
    About: "Sobre",
    "Control panel": "Painel de controlo",
    Events: "Eventos",
    Calendar: "Calendário",
    Networks: "Redes",
    Client: "Cliente",
    Driver: "Condutor",
    Account: "Conta",
    Request: "Pedido",
    "Driver offer": "Proposta do condutor",
    "Open requests": "Pedidos abertos",
    Trips: "Viagens",
    Profile: "Perfil",
    Guest: "Convidado",
};

const CERTIFICATIONS = {
    1: "Do zero ao avançado em HTML, CSS e JavaScript. Inclui design responsivo, manipulação do DOM e uma introdução a frameworks. Um bom curso para começar uma carreira em front-end.",
    2: "Para quem já sabe o básico. Ensina navegação avançada, integração de APIs, gestão de estado (Redux, Context), animações e otimização de desempenho.",
    3: "Cobre áreas como encriptação, firewalls, análise de vulnerabilidades, engenharia social e proteção contra DDoS, phishing, etc. Bom para principiantes ou para quem quer subir de nível em cibersegurança.",
    4: "Vai do básico (componentes, data binding) ao avançado, como routing, formulários reativos, lazy loading e deployment. Ideal para quem quer construir apps Angular a sério.",
    5: "Focado em UI/UX. Ensina a criar protótipos funcionais, testar a usabilidade, aplicar princípios de design de interação e usar ferramentas como Figma, Adobe Photoshop e Adobe Illustrator.",
};

// While developing, say which content has no Portuguese version yet (it falls back to English)
const missing = (table, key, what) => {
    if (import.meta.env.DEV && key !== undefined && !(key in table)) console.warn(`[i18n] No Portuguese for ${what} "${key}"`);
};

const status = (s, lang) => {
    if (lang !== "pt" || !s) return s;
    missing(STATUS, s, "status");
    return STATUS[s] || s;
};
// Captions such as "Agenda", "Dashboard" or "Jukebox" stay the same in both languages, so no warning here
const media = (s, lang) => (lang === "pt" ? MEDIA[s] || s : s);

export const localizeRole = (role, lang) => (lang === "pt" ? { ...role, ...ROLES[role.id] } : role);

export const localizeEvent = (ev, lang) => {
    if (lang !== "pt") return ev;
    missing(EVENTS, ev.id, "timeline moment");
    return { ...ev, ...EVENTS[ev.id], status: status(ev.status, lang) };
};

export const localizeProject = (p, lang) => {
    if (lang !== "pt") return p;
    missing(PROJECTS, p.id, "project");
    return {
        ...p,
        ...PROJECTS[p.id],
        status: status(p.status, lang),
        media: { ...p.media, items: p.media.items.map((it) => ({ ...it, group: media(it.group, lang), label: media(it.label, lang) })) },
    };
};

export const localizeCertification = (c, lang) => {
    if (lang !== "pt") return c;
    missing(CERTIFICATIONS, c.id, "certificate");
    return CERTIFICATIONS[c.id] ? { ...c, description: CERTIFICATIONS[c.id] } : c;
};
