// ==============================
// CHATBOT ACOLHIMENTO + WHATSAPP
// ==============================

// Texto inicial de acolhimento
const acolhimento = "Agradecemos que você tenha sido forte — procurar ajuda é um grande passo. Podemos te conectar com um atendimento via WhatsApp agora.";
const welcomeTextEl = document.getElementById('welcomeText');
if (welcomeTextEl) welcomeTextEl.textContent = acolhimento;

// Modal e botões
const chatModal = document.getElementById('chatModal');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const openChatBtn = document.getElementById('openChatBtn2');
const closeModalBtn = document.getElementById('closeModal');

const PHONE_NUMBER = "5521975452824";
const MESSAGE = "Agradeço pelo acolhimento. Preciso de ajuda.";

function waUrl(phone, text) {
  const encoded = encodeURIComponent(text);
  return phone
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;
}

function abrirWhatsApp() {
  window.open(waUrl(PHONE_NUMBER, MESSAGE), "_blank");
}

openChatBtn.onclick = () => chatModal.classList.add('show');
closeModalBtn.onclick = () => chatModal.classList.remove('show');

const palavrasDeRisco = ["não aguento","quero acabar","não quero mais","suicídio","acabou","desespero","triste demais","sofrendo"];
const palavrasTristeza = ["triste","deprimido","sofrendo","cansado","solidão"];
const palavrasAnsiedade = ["ansioso","preocupado","medo","inseguro","nervoso"];
const palavrasRaiva = ["raiva","irritado","frustrado","injustiça"];
const palavrasAlivio = ["aliviado","feliz","grato","melhor"];

function mensagemDeRisco(texto) {
  texto = texto.toLowerCase();
  return palavrasDeRisco.some(p => texto.includes(p));
}

function respostaHumanaInteligente(texto) {
  texto = texto.toLowerCase();

  if (mensagemDeRisco(texto)) {
    return "Percebo que você está passando por um momento muito difícil. Vou te conectar com um atendimento humano agora.";
  }

  if (palavrasTristeza.some(p => texto.includes(p))) {
    const respostas = [
      "Entendo que você está triste. Quer me contar mais sobre o que está sentindo?",
      "Às vezes, só colocar para fora o que sentimos já ajuda bastante. Estou aqui para ouvir você.",
      "Sei que momentos assim podem ser pesados. Pode desabafar comigo."
    ];
    return respostas[Math.floor(Math.random() * respostas.length)];
  }

  if (palavrasAnsiedade.some(p => texto.includes(p))) {
    const respostas = [
      "Percebo que você está ansioso(a). Respire fundo comigo, vamos conversar devagar.",
      "Sentir preocupação é normal. Estou aqui para ouvir e ajudar a organizar seus pensamentos.",
      "Ansiedade pode ser muito desgastante. Me conte um pouco sobre o que está te preocupando."
    ];
    return respostas[Math.floor(Math.random() * respostas.length)];
  }

  if (palavrasRaiva.some(p => texto.includes(p))) {
    const respostas = [
      "Vejo que você está frustrado(a) ou irritado(a). Falar sobre isso pode aliviar um pouco. Quer me contar mais?",
      "É normal sentir raiva em algumas situações. Vamos conversar sobre isso?",
      "Seus sentimentos são importantes. Estou aqui para ouvir você sem julgamentos."
    ];
    return respostas[Math.floor(Math.random() * respostas.length)];
  }

  if (palavrasAlivio.some(p => texto.includes(p))) {
    const respostas = [
      "Fico feliz em saber que você se sente melhor. Quer compartilhar mais?",
      "Que bom que sente algum alívio! Às vezes falar sobre isso ajuda a manter esse sentimento.",
      "É ótimo ver você se sentindo mais leve. Podemos continuar conversando."
    ];
    return respostas[Math.floor(Math.random() * respostas.length)];
  }

  const respostasGenericas = [
    "Obrigado por compartilhar comigo. Estou aqui para ouvir você.",
    "Pode me contar mais sobre como se sente agora?",
    "Sei que pode ser difícil, mas é importante falar sobre seus sentimentos.",
    "Você não está sozinho(a). Vamos conversar sobre isso."
  ];

  return respostasGenericas[Math.floor(Math.random() * respostasGenericas.length)];
}

function adicionarMensagem(conteudo, classe) {
  const msgEl = document.createElement('div');
  msgEl.className = `message ${classe}`;
  msgEl.textContent = conteudo;
  chatBody.appendChild(msgEl);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function enviarMensagem() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";

  adicionarMensagem(userMessage, "user");

  const resposta = respostaHumanaInteligente(userMessage);
  setTimeout(() => {
    adicionarMensagem(resposta, "bot");
    if (mensagemDeRisco(userMessage)) abrirWhatsApp();
  }, 500 + Math.random()*500);
}

sendBtn.onclick = enviarMensagem;
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    enviarMensagem();
  }
});

