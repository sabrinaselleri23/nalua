// ==============================
// CHATBOT ACOLHIMENTO + WHATSAPP
// ==============================

// Texto inicial de acolhimento
const acolhimento = "Agradecemos que você tenha sido forte — procurar ajuda é um grande passo. Podemos te conectar com um atendimento via WhatsApp agora.";
const welcomeTextEl = document.getElementById('welcomeText');
if (welcomeTextEl) welcomeTextEl.textContent = acolhimento;

// Modal e botões
const chatModal = document.getElementById('chatModal');
const openChatBtn = document.getElementById('openChatBtn2');
const closeModalBtn = document.getElementById('closeModal');

if (openChatBtn && chatModal) openChatBtn.onclick = () => chatModal.classList.add('show');
if (closeModalBtn && chatModal) closeModalBtn.onclick = () => chatModal.classList.remove('show');

// WhatsApp
const PHONE_NUMBER = "5521975452824"; // substitua pelo número real
const MESSAGE = "Agradeço pelo acolhimento. Preciso de ajuda.";

function waUrl(phone, text) {
  const encoded = encodeURIComponent(text);
  return phone
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;
}

const waSendBtn = document.getElementById('waSendBtn');
if (waSendBtn) waSendBtn.href = waUrl(PHONE_NUMBER, MESSAGE);

const whatsappQuick = document.getElementById('whatsappQuick');
if (whatsappQuick) whatsappQuick.onclick = e => {
  e.preventDefault();
  window.open(waUrl(PHONE_NUMBER, MESSAGE), "_blank");
};

// ==============================
// CHATBOT IA + APOIO PSICOLÓGICO
// ==============================

const chatPanel = chatModal.querySelector('.panel');

// Criação do textarea
const chatInput = document.createElement('textarea');
chatInput.placeholder = "Digite sua mensagem...";
chatInput.style.width = "100%";
chatInput.style.marginTop = "12px";
chatInput.style.padding = "8px";
chatPanel.appendChild(chatInput);

// Palavras de risco e categorias
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

// Adicionar mensagem no painel
function adicionarMensagem(conteudo, classe) {
  const msgEl = document.createElement('div');
  msgEl.className = `message ${classe}`;
  msgEl.innerHTML = conteudo;
  chatPanel.appendChild(msgEl);
  chatPanel.scrollTop = chatPanel.scrollHeight;
}

// Envio de mensagens
async function enviarMensagem() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";

  adicionarMensagem(`<b>Você:</b> ${userMessage}`, "user");

  if (mensagemDeRisco(userMessage)) {
    adicionarMensagem(`<b>IA:</b> ${respostaHumanaInteligente(userMessage)}`, "bot");
    abrirWhatsApp();
    return;
  }

  const aiReply = respostaHumanaInteligente(userMessage);
  setTimeout(() => {
    adicionarMensagem(`<b>IA:</b> ${aiReply}`, "bot");
  }, 500 + Math.random()*500); // atraso natural
}

// Eventos de teclado e botão
chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    enviarMensagem();
  }
});

