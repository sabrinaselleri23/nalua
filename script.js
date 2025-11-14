// ==============================
// CHATBOT ACOLHIMENTO + WHATSAPP
// ==============================
const acolhimento = "Agradecemos que você tenha sido forte — procurar ajuda é um grande passo. Podemos te conectar com um atendimento via WhatsApp agora.";

const welcomeTextEl = document.getElementById('welcomeText');
if (welcomeTextEl) welcomeTextEl.textContent = acolhimento;

const chatModal = document.getElementById('chatModal');
const openChatBtn = document.getElementById('openChatBtn2');
const closeModalBtn = document.getElementById('closeModal');

if (openChatBtn && chatModal) openChatBtn.onclick = () => chatModal.classList.add('show');
if (closeModalBtn && chatModal) closeModalBtn.onclick = () => chatModal.classList.remove('show');

// WhatsApp
const PHONE_NUMBER = ""; // +5511XXXXXXXXX
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
// NOTÍCIAS AUTOMÁTICAS
// ==============================
const newsList = document.getElementById('newsList');

async function fetchNews() {
  try {
    const res = await fetch('https://api.quotable.io/random');
    const data = await res.json();
    const item = document.createElement('div');
    item.className = 'news-item';
    item.innerHTML = `<strong>${data.author}</strong><p>${data.content}</p>`;
    newsList.prepend(item);

    while (newsList.children.length > 6) {
      newsList.removeChild(newsList.lastChild);
    }
  } catch (err) {
    console.error("Erro ao buscar notícias:", err);
  }
}

fetchNews();
setInterval(fetchNews, 12000);

const loadNewsBtn = document.getElementById('loadNews');
if (loadNewsBtn) loadNewsBtn.onclick = fetchNews;

// ==============================
// MAPA LEAFLET
// ==============================
const map = L.map('map').setView([-14.235, -51.9253], 4); // Centro do Brasil

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Pontos fixos
const pontos = [
  [-23.5489, -46.6388, 'Centro de Apoio A', 'Atendimento psicológico'],
  [-23.5712, -46.6417, 'Clínica Comunitária B', 'Triagem e encaminhamento'],
  [-23.5632, -46.6550, 'Ponto de Informação C', 'Grupo de apoio semanal']
];

pontos.forEach(p => {
  L.marker([p[0], p[1]]).addTo(map).bindPopup(`<b>${p[2]}</b><br>${p[3]}`);
});

// ==============================
// LOCALIZAÇÃO DO USUÁRIO + BUSCA DE LOCAIS
// ==============================
function localizarUsuario() {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada no seu navegador.");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    map.setView([lat, lon], 14);

    L.marker([lat, lon], { title: "Você está aqui" })
      .addTo(map)
      .bindPopup("<b>Você está aqui</b>")
      .openPopup();

    buscarLocais(lat, lon);
  }, () => {
    alert("Não foi possível obter sua localização.");
  });
}

localizarUsuario();

async function buscarLocais(lat, lon) {
  const query = `
  [out:json];
  (
    node["amenity"="clinic"](around:5000, ${lat}, ${lon});
    node["healthcare"="psychotherapist"](around:5000, ${lat}, ${lon});
    node["amenity"="social_facility"](around:5000, ${lat}, ${lon});
    node["healthcare"="mental_health"](around:5000, ${lat}, ${lon});
  );
  out body;
  `;
  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  try {
    const response = await fetch(url);
    const data = await response.json();
    data.elements.forEach(el => {
      if (!el.tags) return;
      const nome = el.tags.name || "Local sem nome";
      const endereco = el.tags["addr:street"] || "";
      const numero = el.tags["addr:housenumber"] || "";
      const cidade = el.tags["addr:city"] || "";
      const tipo = el.tags.amenity || el.tags.healthcare || "Atendimento";
      const popup = `<b>${nome}</b><br>${tipo}<br>${endereco} ${numero}<br>${cidade}`;
      L.marker([el.lat, el.lon]).addTo(map).bindPopup(popup);
    });
  } catch (err) {
    console.error("Erro Overpass:", err);
  }
}

// ==============================
// CHATBOT IA + APOIO PSICOLÓGICO
// ==============================
const chatPanel = chatModal.querySelector('.panel');
const chatInput = document.createElement('textarea');
chatInput.placeholder = "Digite sua mensagem...";
chatInput.style.width = "100%";
chatInput.style.marginTop = "12px";
chatInput.style.padding = "8px";
chatPanel.appendChild(chatInput);

const palavrasDeRisco = ["não aguento","quero acabar","não quero mais","suicídio","acabou","desespero","triste demais","sofrendo"];

function mensagemDeRisco(texto) {
  texto = texto.toLowerCase();
  return palavrasDeRisco.some(p => texto.includes(p));
}

async function chamarIA(userMessage) {
  // Exemplo placeholder. Substitua por chamada real ao OpenAI se tiver API Key
  return `Resposta acolhedora da IA para: "${userMessage}"`;
}

function abrirWhatsApp() {
  window.open(waUrl(PHONE_NUMBER, MESSAGE), "_blank");
}

chatInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";

    const userMsgEl = document.createElement('div');
    userMsgEl.innerHTML = `<b>Você:</b> ${userMessage}`;
    chatPanel.appendChild(userMsgEl);

    if (mensagemDeRisco(userMessage)) {
      const alerta = document.createElement('div');
      alerta.innerHTML = `<b>IA:</b> Vejo que você está passando por um momento difícil. Vou te conectar com um atendimento humano agora.`;
      chatPanel.appendChild(alerta);
      chatPanel.scrollTop = chatPanel.scrollHeight;
      abrirWhatsApp();
      return;
    }

    const aiReply = await chamarIA(userMessage);
    const msgEl = document.createElement('div');
    msgEl.innerHTML = `<b>IA:</b> ${aiReply}`;
    chatPanel.appendChild(msgEl);
    chatPanel.scrollTop = chatPanel.scrollHeight;
  }
});
