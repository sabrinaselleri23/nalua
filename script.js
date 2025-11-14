/* ============================================================
   CHATBOT
============================================================ */

const acolhimento =
  "Agradecemos que você tenha sido forte — procurar ajuda é um grande passo. Podemos te conectar com um atendimento via WhatsApp agora.";

document.getElementById("welcomeText").textContent = acolhimento;

const modal = document.getElementById("chatModal");
const openBtns = [
  document.getElementById("openChatBtn"),
  document.getElementById("openChatBtn2"),
];

openBtns.forEach((btn) =>
  btn.addEventListener("click", () => modal.classList.add("show"))
);

document.getElementById("closeModal").onclick = () =>
  modal.classList.remove("show");
document.getElementById("closeModal2").onclick = () =>
  modal.classList.remove("show");

const PHONE_NUMBER = "";
const MESSAGE = "Agradeço pelo acolhimento. Preciso de ajuda.";

function waUrl(phone, text) {
  const encoded = encodeURIComponent(text);
  return phone
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;
}

document.getElementById("waSendBtn").href = waUrl(PHONE_NUMBER, MESSAGE);

document.getElementById("whatsappQuick").onclick = (e) => {
  e.preventDefault();
  window.open(waUrl(PHONE_NUMBER, MESSAGE), "_blank");
};

/* ============================================================
   NOTÍCIAS AUTOMÁTICAS
============================================================ */

const newsList = document.getElementById("newsList");

async function fetchNews() {
  const res = await fetch("https://api.quotable.io/random");
  const j = await res.json();

  const item = document.createElement("div");
  item.className = "news-item";
  item.innerHTML = `
    <strong>${j.author}</strong>
    <p>${j.content}</p>
  `;

  newsList.prepend(item);

  while (newsList.children.length > 6) {
    newsList.removeChild(newsList.lastChild);
  }
}

fetchNews();
setInterval(fetchNews, 12000);
document.getElementById("loadNews").onclick = fetchNews;

/* ============================================================
   MAPA ROXO + GEOLOCALIZAÇÃO REAL
============================================================ */

const map = L.map("map").setView([-23.55, -46.63], 12);

L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }
).addTo(map);

/* ============================================================
   ÍCONES PERSONALIZADOS
============================================================ */

const icons = {
  caps: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  clinicas: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  psicologos: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  gratuitos: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

/* ============================================================
   BANCO DE DADOS DE EXEMPLO
============================================================ */

const locais = [
  {
    nome: "CAPS Jardim Norte",
    cidade: "São Paulo - SP",
    endereco: "Rua das Flores, 120",
    tipo: "Centro de Atenção Psicossocial (SUS)",
    categoria: "caps",
    lat: -23.5489,
    lon: -46.6388,
  },
  {
    nome: "Clínica Renovamente",
    cidade: "São Paulo - SP",
    endereco: "Av. Brasil, 421",
    tipo: "Clínica psicológica",
    categoria: "clinicas",
    lat: -23.5712,
    lon: -46.6417,
  },
  {
    nome: "Espaço Psi Acolher",
    cidade: "São Paulo - SP",
    endereco: "Rua Horizonte, 88",
    tipo: "Psicólogos e saúde mental",
    categoria: "psicologos",
    lat: -23.5632,
    lon: -46.655,
  },
  {
    nome: "Centro Comunitário Vida",
    cidade: "São Paulo - SP",
    endereco: "Rua Esperança, 77",
    tipo: "Apoio psicológico gratuito",
    categoria: "gratuitos",
    lat: -23.5601,
    lon: -46.6408,
  },
];

/* ============================================================
   ADICIONAR MARCADORES NO MAPA
============================================================ */

let markersGroup = L.layerGroup().addTo(map);

function renderMarkers() {
  markersGroup.clearLayers();

  locais.forEach((loc) => {
    const marker = L.marker([loc.lat, loc.lon], {
      icon: icons[loc.categoria],
    });

    let priceField = "";

    if (loc.categoria === "psicologos") {
      priceField = `
        <label style="font-weight:700">Preço da sessão</label>
        <input type="text" placeholder="R$ --,--"
        style="width:100%; padding:6px; margin:6px 0 12px 0;
        border-radius:8px; border:none;">
      `;
    }

    marker.bindPopup(`
      <b>${loc.nome}</b><br>
      <small>${loc.tipo}</small><br>
      ${loc.endereco}<br>
      ${loc.cidade}<br><br>

      ${priceField}

      <a href="https://www.google.com/maps/?q=${loc.lat},${loc.lon}"
         target="_blank"
         style="color:#a47be6; font-weight:700;">
         📍 Ver rota no Google Maps
      </a>
    `);

    marker.addTo(markersGroup);
  });
}

renderMarkers();

/* ============================================================
   GEOLOCALIZAÇÃO DO USUÁRIO
============================================================ */

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;

    map.setView([latitude, longitude], 14);

    L.circleMarker([latitude, longitude], {
      radius: 8,
      color: "#7b4dbb",
      fillColor: "#a47be6",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup("📍 Você está aqui");
  });
}
