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
// MAPA — APOIO PSICOLÓGICO + CLÍNICAS + CAPS
// -----------------------------------------------------

// Criar o mapa
const map = L.map('map').setView([-14.235, -51.9253], 4); // Centro do Brasil

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// 1. PEGAR A LOCALIZAÇÃO DO USUÁRIO
function localizarUsuario() {
  if (!navigator.geolocation) {
    alert("Seu navegador não permite geolocalização.");
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

    buscarApoio(lat, lon);

  }, () => {
    alert("Não foi possível obter sua localização.");
  });
}

localizarUsuario();


// 2. BUSCAR LOCAIS DE APOIO — CLÍNICAS, CAPS, APOIO GRATUITO
async function buscarApoio(lat, lon) {

  const query = `
    [out:json];
    (
      // CLÍNICAS PSICOLÓGICAS
      node["amenity"="clinic"](around:8000, ${lat}, ${lon});
      node["healthcare"="psychotherapist"](around:8000, ${lat}, ${lon});
      node["healthcare"="mental_health"](around:8000, ${lat}, ${lon});

      // CAPS e centros públicos
      node["amenity"="social_facility"](around:8000, ${lat}, ${lon});
      node["social_facility"="mental_health"](around:8000, ${lat}, ${lon});

      // Redes de apoio psicológico gratuitas
      node["social_facility"="support"](around:8000, ${lat}, ${lon});
      node["social_facility"="outreach"](around:8000, ${lat}, ${lon});
    );
    out body;
    >;
    out skel qt;
  `;

  const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.elements.length === 0) {
      alert("Nenhum serviço de apoio psicológico encontrado perto de você.");
      return;
    }

    data.elements.forEach(el => {
      if (!el.tags) return;

      const nome = el.tags.name || "Local sem nome";
      const tipo =
        el.tags.healthcare ||
        el.tags.amenity ||
        el.tags.social_facility ||
        "Apoio Psicológico";

      const endereco = el.tags["addr:street"] || "";
      const numero = el.tags["addr:housenumber"] || "";
      const cidade = el.tags["addr:city"] || "";

      const popup = `
        <b>${nome}</b><br>
        <b>Tipo:</b> ${tipo}<br>
        ${endereco} ${numero}<br>
        ${cidade}<br><br>

        <b>Preço:</b>
        <input type="text" placeholder="R$ --,--" style="width:100%; padding:4px;"><br><br>

        <a href="https://www.google.com/maps/?q=${el.lat},${el.lon}"
           target="_blank"
           style="color:#7b4dbb; font-weight:600;">
           📍 Ver rota no Google Maps
        </a>
      `;

      L.marker([el.lat, el.lon]).addTo(map).bindPopup(popup);
    });

  } catch (err) {
    console.error("Erro Overpass:", err);
  }
}
