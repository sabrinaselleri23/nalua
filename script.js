// Chatbot acolhimento e WhatsApp
const acolhimento = "Agradecemos que você tenha sido forte — procurar ajuda é um grande passo. Podemos te conectar com um atendimento via WhatsApp agora.";
document.getElementById('welcomeText').textContent = acolhimento;

const modal = document.getElementById('chatModal');
const openBtns = [document.getElementById('openChatBtn'), document.getElementById('openChatBtn2')];
openBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.add('show')));
document.getElementById('closeModal').onclick = () => modal.classList.remove('show');
document.getElementById('closeModal2').onclick = () => modal.classList.remove('show');

const PHONE_NUMBER = "";
const MESSAGE = "Agradeço pelo acolhimento. Preciso de ajuda.";
function waUrl(phone, text) {
  const encoded = encodeURIComponent(text);
  return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}` :
                 `https://api.whatsapp.com/send?text=${encoded}`;
}
document.getElementById('waSendBtn').href = waUrl(PHONE_NUMBER, MESSAGE);
document.getElementById('whatsappQuick').onclick = e => {
  e.preventDefault();
  window.open(waUrl(PHONE_NUMBER, MESSAGE), "_blank");
};

// Notícias automáticas
const newsList = document.getElementById('newsList');
async function fetchNews() {
  const res = await fetch('https://api.quotable.io/random');
  const j = await res.json();
  const item = document.createElement('div');
  item.className = 'news-item';
  item.innerHTML = `<strong>${j.author}</strong><p>${j.content}</p>`;
  newsList.prepend(item);
  while (newsList.children.length > 6) newsList.removeChild(newsList.lastChild);
}
fetchNews();
setInterval(fetchNews, 12000);
document.getElementById('loadNews').onclick = fetchNews;

// Mapa Leaflet
const map = L.map('map').setView([-23.55052, -46.633308], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
const pontos = [
  [-23.5489, -46.6388, 'Centro de Apoio A', 'Atendimento psicológico (baixo custo)'],
  [-23.5712, -46.6417, 'Clínica Comunitária B', 'Triagem e encaminhamento'],
  [-23.5632, -46.6550, 'Ponto de Informação C', 'Grupo de apoio semanal']
];
pontos.forEach(p => L.marker([p[0], p[1]]).addTo(map).bindPopup(`<b>${p[2]}</b><br>${p[3]}`));
