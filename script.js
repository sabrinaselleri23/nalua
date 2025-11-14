// ----------------------
// CHATBOT ACOLHIMENTO
// ----------------------
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
  return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`
               : `https://api.whatsapp.com/send?text=${encoded}`;
}

document.getElementById('waSendBtn').href = waUrl(PHONE_NUMBER, MESSAGE);

document.getElementById('whatsappQuick').onclick = e => {
  e.preventDefault();
  window.open(waUrl(PHONE_NUMBER, MESSAGE), "_blank");
};


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



// -----------------------------------------------------
// MAPA — APOIO PSICOLÓGICO + CAPS + PSICÓLOGOS
// -----------------------------------------------------
const map = L.map('map').setView([-23.55, -46.63], 12);

// Mapa roxo/lilás
L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  { maxZoom: 18 }
).addTo(map);

// Ícones personalizados
const icons = {
  caps: L.icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png", iconSize: [25,41], iconAnchor: [12,41]}),
  clinicas: L.icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", iconSize: [25,41], iconAnchor: [12,41]}),
  psicologos: L.icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png", iconSize: [25,41], iconAnchor: [12,41]})
};

let markersGroup = L.layerGroup().addTo(map);
let locais = [];


// Localização do usuário
function localizarUsuario() {
  if (!navigator.geolocation) { alert("Seu navegador não permite geolocalização."); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    map.setView([lat, lon], 14);

    L.circleMarker([lat, lon], {
      radius: 8,
      color: "#7b4dbb",
      fillColor: "#a47be6",
      fillOpacity: 1
    }).addTo(map).bindPopup("📍 Você está aqui");

    buscarApoio(lat, lon);
  }, () => alert("Não foi possível obter sua localização."));
}

localizarUsuario();


// Buscar locais (Overpass)
async function buscarApoio(lat, lon) {
  const query = `
    [out:json];
    (
      node["amenity"="clinic"](around:10000, ${lat}, ${lon});
      node["healthcare"="psychotherapist"](around:10000, ${lat}, ${lon});
      node["healthcare"="mental_health"](around:10000, ${lat}, ${lon});
      node["amenity"="social_facility"](around:10000, ${lat}, ${lon});
    );
    out body; >; out skel qt;
  `;

  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  try {
    const res = await fetch(url);
    const data = await res.json();

    locais = data.elements.filter(el => el.tags);
    renderMarkers();

  } catch(e) {
    console.error(e);
  }
}


// Renderizar marcadores com filtros
function renderMarkers() {
  markersGroup.clearLayers();

  const active = [...document.querySelectorAll(".filter-btn.active")].map(b => b.dataset.category);

  locais.forEach(el => {
    const tag = el.tags;

    let categoria = "clinicas";
    if (tag.name?.toLowerCase().includes("caps")) categoria = "caps";
    if (tag.healthcare === "psychotherapist") categoria = "psicologos";

    if (!active.includes(categoria)) return;

    L.marker([el.lat, el.lon], { icon: icons[categoria] })
      .addTo(markersGroup)
      .bindPopup(`
        <b>${tag.name || "Local de apoio"}</b><br>
        <small>${tag.amenity || tag.healthcare || "Apoio psicológico"}</small><br>
        <a href="https://www.google.com/maps?q=${el.lat},${el.lon}" target="_blank" style="color:#a47be6; font-weight:700;">📍 Ver rota</a>
      `);
  });
}


// Filtros (sem botões de topo)
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    renderMarkers();
  });
});
