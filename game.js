// ====== GeoQuest: North America Trek - Map & Journey Renderer ======

// --- SETTINGS ---
const SECRET_KEY = "SC7Geo2025";
const GOAL_VISITS = 12;
const GOAL_XP = 20;
const START_AP = 24;
const VERSION = '2.3.4-AssessedEvents';

// --- RNG ---
let rngSeed = Date.now() & 0xffffffff;
function srand(s){ rngSeed = (s>>>0) || 1; }
function rand(){ let x=rngSeed; x^=x<<13; x^=x>>>17; x^=x<<5; rngSeed=x>>>0; return (rngSeed/0xffffffff); }
function randPick(arr){ return arr[Math.floor(rand()*arr.length)] }

// --- GRAPH DATA ---
const CITIES = [
  {id:"van", name:"Vancouver", country:"CAN", biome:"temperate_rainforest", lat:49.2827, lon:-123.1207},
  {id:"vic", name:"Victoria", country:"CAN", biome:"temperate_rainforest", lat:48.4284, lon:-123.3656},
  {id:"calg", name:"Calgary", country:"CAN", biome:"steppe", lat:51.0447, lon:-114.0719},
  {id:"edm", name:"Edmonton", country:"CAN", biome:"boreal", lat:53.5461, lon:-113.4938},
  {id:"winn", name:"Winnipeg", country:"CAN", biome:"boreal", lat:49.8951, lon:-97.1384},
  {id:"tor", name:"Toronto", country:"CAN", biome:"temperate_forest", lat:43.6511, lon:-79.3831},
  {id:"ott", name:"Ottawa", country:"CAN", biome:"temperate_forest", lat:45.4215, lon:-75.6996},
  {id:"mont", name:"Montréal", country:"CAN", biome:"temperate_forest", lat:45.5017, lon:-73.5673},
  {id:"que", name:"Québec City", country:"CAN", biome:"boreal", lat:46.8139, lon:-71.2080},
  {id:"hal", name:"Halifax", country:"CAN", biome:"temperate_forest", lat:44.6488, lon:-63.5752},
  {id:"stj", name:"St. John’s", country:"CAN", biome:"boreal", lat:47.5615, lon:-52.7126},
  {id:"sea", name:"Seattle", country:"USA", biome:"temperate_rainforest", lat:47.6062, lon:-122.3321},
  {id:"por", name:"Portland", country:"USA", biome:"temperate_rainforest", lat:45.5051, lon:-122.6750},
  {id:"sf", name:"San Francisco", country:"USA", biome:"mediterranean", lat:37.7749, lon:-122.4194},
  {id:"la", name:"Los Angeles", country:"USA", biome:"mediterranean", lat:34.0522, lon:-118.2437},
  {id:"sd", name:"San Diego", country:"USA", biome:"semi_arid", lat:32.7157, lon:-117.1611},
  {id:"phx", name:"Phoenix", country:"USA", biome:"desert", lat:33.4484, lon:-112.0740},
  {id:"slc", name:"Salt Lake City", country:"USA", biome:"semi_arid", lat:40.7608, lon:-111.8910},
  {id:"den", name:"Denver", country:"USA", biome:"alpine", lat:39.7392, lon:-104.9903},
  {id:"dal", name:"Dallas", country:"USA", biome:"prairie", lat:32.7767, lon:-96.7970},
  {id:"hou", name:"Houston", country:"USA", biome:"humid_subtropical", lat:29.7604, lon:-95.3698},
  {id:"sa", name:"San Antonio", country:"USA", biome:"semi_arid", lat:29.4241, lon:-98.4936},
  {id:"no", name:"New Orleans", country:"USA", biome:"wetland", lat:29.9511, lon:-90.0715},
  {id:"minn", name:"Minneapolis", country:"USA", biome:"temperate_forest", lat:44.9778, lon:-93.2650},
  {id:"chi", name:"Chicago", country:"USA", biome:"temperate_forest", lat:41.8781, lon:-87.6298},
  {id:"det", name:"Detroit", country:"USA", biome:"temperate_forest", lat:42.3314, lon:-83.0458},
  {id:"atl", name:"Atlanta", country:"USA", biome:"humid_subtropical", lat:33.7490, lon:-84.3880},
  {id:"mia", name:"Miami", country:"USA", biome:"tropical", lat:25.7617, lon:-80.1918},
  {id:"nyc", name:"New York City", country:"USA", biome:"temperate_forest", lat:40.7128, lon:-74.0060},
  {id:"bos", name:"Boston", country:"USA", biome:"temperate_forest", lat:42.3601, lon:-71.0589},
  {id:"dc", name:"Washington, DC", country:"USA", biome:"temperate_forest", lat:38.8951, lon:-77.0364},
  {id:"clt", name:"Charlotte", country:"USA", biome:"temperate_forest", lat:35.2271, lon:-80.8431},
  {id:"nash", name:"Nashville", country:"USA", biome:"temperate_forest", lat:36.1627, lon:-86.7816},
  {id:"phl", name:"Philadelphia", country:"USA", biome:"temperate_forest", lat:39.9526, lon:-75.1652},
  {id:"tij", name:"Tijuana", country:"MEX", biome:"semi_arid", lat:32.5149, lon:-117.0382},
  {id:"herm", name:"Hermosillo", country:"MEX", biome:"desert", lat:29.0729, lon:-110.9559},
  {id:"gdl", name:"Guadalajara", country:"MEX", biome:"temperate_highland", lat:20.6597, lon:-103.3496},
  {id:"cdmx", name:"Mexico City", country:"MEX", biome:"temperate_highland", lat:19.4326, lon:-99.1332},
  {id:"pue", name:"Puebla", country:"MEX", biome:"temperate_highland", lat:19.0414, lon:-98.2063},
  {id:"oax", name:"Oaxaca", country:"MEX", biome:"tropical_seasonal", lat:17.0732, lon:-96.7266},
  {id:"mty", name:"Monterrey", country:"MEX", biome:"semi_arid", lat:25.6866, lon:-100.3161},
  {id:"coa", name:"Coahuila (Saltillo)", country:"MEX", biome:"semi_arid", lat:25.4383, lon:-100.9737},
  {id:"ver", name:"Veracruz", country:"MEX", biome:"tropical", lat:19.1738, lon:-96.1342},
  {id:"mer", name:"Mérida", country:"MEX", biome:"tropical", lat:20.9674, lon:-89.5926},
  {id:"cun", name:"Cancún", country:"MEX", biome:"tropical", lat:21.1619, lon:-86.8515}
];

const EDGES = [
  ["vic","van"],["van","sea"],["sea","por"],["por","sf"],["sf","la"],["la","sd"],["sd","tij"],["tij","phx"],
  ["van","calg"],["calg","edm"],["edm","winn"],["winn","minn"],["winn","chi"],["winn","tor"],["tor","ott"],["ott","mont"],["mont","que"],["que","hal"],["hal","stj"],
  ["phx","slc"],["slc","den"],["den","minn"],["den","dal"],["dal","hou"],["hou","no"],
  ["minn","chi"],["chi","det"],["det","tor"],["chi","nash"],["nash","atl"],["atl","mia"],["atl","dc"],["dc","nyc"],["nyc","bos"],["phl","nyc"],["clt","atl"],["clt","dc"],
  ["tij","herm"],["herm","gdl"],["gdl","cdmx"],["cdmx","pue"],["pue","oax"],["cdmx","ver"],["ver","mer"],["mer","cun"],["mty","coa"],["coa","mty"],["mty","dal"],["cdmx","mty"]
];

// --- STATE ---
const State = {
  current: "chi",
  visited: new Set(["chi"]),
  ap: START_AP,
  stamps: [],
};

// --- SPRITE/ICON ---
function spriteForCity(city) {
  // Use a placeholder, or replace with your actual sprite logic
  return `https://placehold.co/72x72?text=${encodeURIComponent(city.name[0])}`;
}

// --- MAP RENDERER ---
const MapView = (()=>{
  const LON_MIN = -170, LON_MAX = -50;
  const LAT_MIN =   5,  LAT_MAX =  85;

  let canvas, ctx, w, h, raf=0, lastT=0;
  const proj = new Map(); // city.id -> {x,y}

  function project(lat, lon){
    const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (w-20) + 10;
    const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (h-20) + 10;
    return {x,y};
  }

  function ensureCanvas(){
    canvas = document.getElementById('mapCanvas');
    if(!canvas) return false;
    ctx = canvas.getContext('2d');
    w = canvas.width = 640;
    h = canvas.height = 400;
    canvas.style.cursor = 'crosshair';
    proj.clear();
    for(const c of CITIES){ proj.set(c.id, project(c.lat, c.lon)); }
    canvas.onclick = (e)=>{
      const r = canvas.getBoundingClientRect();
      const mx = (e.clientX - r.left) * (canvas.width / r.width);
      const my = (e.clientY - r.top)  * (canvas.height/ r.height);
      let hit=null, best=12;
      for(const c of CITIES){
        const p = proj.get(c.id);
        const d = Math.hypot(mx-p.x, my-p.y);
        if(d<best){ best=d; hit=c; }
      }
      if(hit) onCityClick(hit);
    };
    return true;
  }

  function drawGrid(){
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(76,201,240,0.08)';
    for(let gx=0; gx<=w; gx+=32){ ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,h); ctx.stroke(); }
    for(let gy=0; gy<=h; gy+=32){ ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(w,gy); ctx.stroke(); }
    ctx.restore();
  }
  function drawBackground(){
    const grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,'#081a2d'); grad.addColorStop(1,'#0b2140');
    ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);
    drawGrid();
  }
  function poly(latlon, fill, stroke='#1a4b74'){
    ctx.beginPath();
    latlon.forEach(([la,lo],i)=>{
      const p = project(la,lo);
      if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
    });
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle=stroke; ctx.lineWidth=2; ctx.stroke();
  }
  function drawLand(){
    ctx.save();
    poly([[49,-125],[49,-65],[25,-80],[21,-86.8],[18,-94.5],[17,-97.5],[20.5,-105],[23,-110],[32,-117],[38,-123],[49,-125]], '#12395b');
    poly([[65,-168],[70,-150],[72,-140],[72,-120],[70,-100],[67,-85],[62,-60],[48,-54],[49,-65],[49,-125],[54,-133],[60,-148],[65,-168]], '#0e3153');
    poly([[31,-81.5],[25.5,-80.1],[27,-82],[31,-81.5]], '#0f385e');   // Florida
    poly([[30,-114.5],[26,-112.5],[24,-110.0],[28,-113.0],[30,-114.5]], '#0f385e'); // Baja
    function lake(la,lo,rx,ry){
      const p = project(la,lo);
      ctx.beginPath();
      ctx.ellipse(p.x,p.y,rx,ry,0,0,Math.PI*2);
      ctx.fillStyle = '#0a2a4a'; ctx.fill();
    }
    lake(44.0,-84.7,14,9); lake(43.5,-79.3,12,8); lake(45.0,-81.0,10,7); lake(42.2,-78.8,10,6); lake(46.5,-84.5,10,6);
    ctx.restore();
  }
  function drawEdges(){
    ctx.save();
    ctx.strokeStyle='rgba(188,220,255,0.25)'; ctx.lineWidth=1; ctx.setLineDash([2,2]);
    for(const [a,b] of EDGES){
      const pa = proj.get(a), pb = proj.get(b);
      ctx.beginPath(); ctx.moveTo(pa.x,pa.y); ctx.lineTo(pb.x,pb.y); ctx.stroke();
    }
    ctx.restore();
  }
  function drawCities(){
    ctx.save();
    for(const c of CITIES){
      const p = proj.get(c.id);
      const r = (c.id===State.current)? 4 : 3;
      ctx.fillStyle = (c.id===State.current) ? '#ffd166'
                    : (State.visited.has(c.id)? '#41d3c5' : '#9fb3cc');
      ctx.fillRect(p.x-r, p.y-r, r*2, r*2);
      if(c.id===State.current){
        ctx.font='bold 12px ui-monospace, monospace';
        ctx.fillStyle='#ffe7a3';
        ctx.fillText(c.name, p.x+6, p.y-8);
      }
    }
    ctx.restore();
  }
  function drawPlane(t){
    const cur = CITIES.find(c=>c.id===State.current);
    if(!cur) return;
    const p = proj.get(cur.id);
    const bob = Math.sin(t/450)*2.5;
    ctx.save();
    ctx.translate(p.x, p.y - 10 + bob);
    ctx.fillStyle='#ffffff'; ctx.fillRect(-1,-6,2,12); ctx.fillRect(-3,-1,6,2); // fuselage
    ctx.fillRect(-6,-2,12,4);                  // wings
    ctx.fillRect(-2,-7,4,2);                   // tail
    ctx.fillStyle='#a3c9ff'; ctx.fillRect(-1,-5,2,3); // cockpit
    ctx.restore();
  }
  function frame(ts){
    if(!canvas) return;
    if(!lastT) lastT=ts;
    drawBackground(); drawLand(); drawEdges(); drawCities(); drawPlane(ts);
    requestAnimationFrame(frame);
  }
  function start(){
    if(!ensureCanvas()) return;
    requestAnimationFrame(frame);
  }
  return { start };
})();


// --- RENDER JOURNEY UI ---
function renderJourney(){
  const cur = CITIES.find(c=>c.id===State.current);
  const neighborIds = EDGES
    .filter(([a,b])=> a===State.current || b===State.current)
    .map(([a,b])=> a===State.current? b : a);
  const neighbors = neighborIds.map(id=> CITIES.find(c=>c.id===id));
  const canTravel = State.ap>0;

  let html = '';
  // Map card
  html += `
    <div class="card mapWrap">
      <h3>Map</h3>
      <canvas id="mapCanvas" width="640" height="400" aria-label="North America map"></canvas>
      <div class="mapLegend">
        <div class="dot" style="background:#ffd166;border:1px solid #a37a00"></div><span>Current</span>
        <div class="dot" style="background:#41d3c5;border:1px solid #2a8b80"></div><span>Visited</span>
        <div class="dot" style="background:#9fb3cc;border:1px solid #5b6a7d"></div><span>Unvisited</span>
      </div>
      <div class="small" style="margin-top:6px">Tip: Click a city on the map to travel (route rules apply).</div>
    </div>`;

  // Current location
  html += `<div class="card"><h3>Current Location</h3>
    <div class="vcard"><img class="pimg" src="${spriteForCity(cur)}" alt="Biome art">
      <div><b>${cur.name}</b> — ${cur.country}
        <div class="small">Biome: ${cur.biome.replace(/_/g,' ')}</div>
      </div>
    </div>
    <div class="small">Travel points left: <b>${State.ap}</b>. Choose a connected destination.</div>
  </div>`;

  // Destinations
  html += `<div class="card"><h3>Destinations</h3><div class="destGrid">` +
    neighbors.map(n=>`<button class="chip" ${canTravel?'':'disabled'} data-goto="${n.id}">
      <img class="pimg" alt="" src="${spriteForCity(n)}"><span>${n.name}</span>
    </button>`).join('') + `</div></div>`;

  // Passport
  const recent = State.stamps.slice(-8);
  html += `<div class="card"><h3>Passport (recent)</h3><div class="list">${
    recent.length? recent.map(s=>`<span class="stamp">${s}</span>`).join('') : '<span class="small">No stamps yet.</span>'
  }</div></div>`;

  document.getElementById('journey').innerHTML = html;

  // Bind travel buttons
  document.querySelectorAll('[data-goto]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-goto');
      const dest = CITIES.find(c=>c.id===id);
      onCityClick(dest);
    });
  });

  // Start the map after canvas exists
  MapView.start();
}

// --- GAMEPLAY: City travel ---
function onCityClick(city){
  if(city.id===State.current) return;
  if(State.ap<=0) return;
  const neighbors = EDGES.filter(([a,b])=> a===State.current||b===State.current).map(([a,b])=> a===State.current?b:a);
  if(!neighbors.includes(city.id)) return;
  State.ap--; State.current = city.id;
  if(!State.visited.has(city.id)){
    State.visited.add(city.id);
    State.stamps.push(city.name);
  }
  renderJourney();
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', renderJourney);
