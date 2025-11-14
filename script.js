@@ -1,4 +1,6 @@
// Chatbot acolhimento e WhatsApp
// ----------------------
// CHATBOT ACOLHIMENTO
// ----------------------
const acolhimento = "Agradecemos que você tenha sido forte — procurar ajuda é um grande passo. Podemos te conectar com um atendimento via WhatsApp agora.";
document.getElementById('welcomeText').textContent = acolhimento;

@@ -10,40 +12,134 @@ document.getElementById('closeModal2').onclick = () => modal.classList.remove('s

const PHONE_NUMBER = "";
const MESSAGE = "Agradeço pelo acolhimento. Preciso de ajuda.";

function waUrl(phone, text) {
  const encoded = encodeURIComponent(text);
  return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}` :
                 `https://api.whatsapp.com/send?text=${encoded}`;
  return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`
               : `https://api.whatsapp.com/send?text=${encoded}`;
}

document.getElementById('waSendBtn').href = waUrl(PHONE_NUMBER, MESSAGE);

document.getElementById('whatsappQuick').onclick = e => {
  e.preventDefault();
  window.open(waUrl(PHONE_NUMBER, MESSAGE), "_blank");
};

// Notícias automáticas

// ----------------------
// NOTÍCIAS AUTOMÁTICAS
// ----------------------
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


// -----------------------------------------------------
// NOVO MAPA — LOCALIZAÇÃO + CAPS + CLÍNICAS + APOIO
// -----------------------------------------------------

// Criar o mapa
const map = L.map('map').setView([-14.235, -51.9253], 4); // centro do Brasil

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
const pontos = [
  [-23.5489, -46.6388, 'Centro de Apoio A', 'Atendimento psicológico (baixo custo)'],
  [-23.5712, -46.6417, 'Clínica Comunitária B', 'Triagem e encaminhamento'],
  [-23.5632, -46.6550, 'Ponto de Informação C', 'Grupo de apoio semanal']
];
pontos.forEach(p => L.marker([p[0], p[1]]).addTo(map).bindPopup(`<b>${p[2]}</b><br>${p[3]}`));


// ----------------------
// 1. PEGAR LOCALIZAÇÃO DO USUÁRIO
// ----------------------
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


// ----------------------
// 2. BUSCAR LOCAIS NO OPENSTREETMAP
// ----------------------
async function buscarLocais(lat, lon) {

  const query = `
    [out:json];
    (
      node["amenity"="clinic"](around:5000, ${lat}, ${lon});
      node["healthcare"="psychotherapist"](around:5000, ${lat}, ${lon});
      node["amenity"="social_facility"](around:5000, ${lat}, ${lon});
      node["social_facility"="outreach"](around:5000, ${lat}, ${lon});
      node["healthcare"="mental_health"](around:5000, ${lat}, ${lon});
    );
    out body;
    >;
    out skel qt;
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

      const popup = `
        <b>${nome}</b><br>
        ${tipo}<br>
        ${endereco} ${numero}<br>
        ${cidade}<br><br>
        <b>Preço:</b>
        <input type="text" placeholder="R$ --,--" style="width:100%; padding:4px;">
      `;

      L.marker([el.lat, el.lon]).addTo(map).bindPopup(popup);
    });

  } catch (err) {
    console.error("Erro Overpass:", err);
  }
}
