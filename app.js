
const state={apps:[],favorites:new Set(JSON.parse(localStorage.getItem("tvFavorites")||"[]")),favoritesOnly:false};
const $=s=>document.querySelector(s);
const els={
 search:$("#searchInput"),country:$("#countryFilter"),language:$("#languageFilter"),
 price:$("#priceFilter"),content:$("#contentFilter"),norway:$("#norwayFilter"),
 geo:$("#geoFilter"),live:$("#liveFilter"),sort:$("#sortSelect"),grid:$("#appGrid"),
 count:$("#resultCount"),empty:$("#emptyState"),active:$("#activeFilters"),
 dialog:$("#appDialog"),dialogContent:$("#dialogContent")
};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
const initial=s=>(s||"?").trim().charAt(0).toUpperCase();
const splitValues=s=>String(s||"").split(",").map(v=>v.trim()).filter(Boolean);
const isFree=s=>String(s).includes("Gratis");
const norwayRank=s=>s==="Ja"?0:s==="Ja / delvis"?1:s==="Usikkert / delvis"?2:3;

function fillSelect(el,values){
  [...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,"no")).forEach(v=>{
    const o=document.createElement("option");o.value=v;o.textContent=v;el.appendChild(o);
  });
}
function matches(app){
  const q=els.search.value.trim().toLowerCase();
  const hay=Object.values(app).join(" ").toLowerCase();
  return (!q||hay.includes(q))
    &&(!els.country.value||app["Land / region"]===els.country.value)
    &&(!els.language.value||app["Hovedspråk"]===els.language.value)
    &&(!els.price.value||app["Pris / tilgang"]===els.price.value)
    &&(!els.content.value||splitValues(app["Innholdstyper"]).includes(els.content.value))
    &&(!els.norway.value||app["Tilgjengelig fra Norge"]===els.norway.value)
    &&(!els.geo.value||app["Geobegrensning"]===els.geo.value)
    &&(!els.live.checked||app["Direkte-TV"]==="Ja")
    &&(!state.favoritesOnly||state.favorites.has(app.id));
}
function sortApps(items){
  const mode=els.sort.value;
  return [...items].sort((a,b)=>{
    if(mode==="country-asc")return a["Land / region"].localeCompare(b["Land / region"],"no")||a.App.localeCompare(b.App,"no");
    if(mode==="free-first")return Number(!isFree(a["Pris / tilgang"]))-Number(!isFree(b["Pris / tilgang"]))||a.App.localeCompare(b.App,"no");
    if(mode==="norway-first")return norwayRank(a["Tilgjengelig fra Norge"])-norwayRank(b["Tilgjengelig fra Norge"])||a.App.localeCompare(b.App,"no");
    return a.App.localeCompare(b.App,"no");
  });
}
function logoHtml(app, sizeClass=""){
  const fallback=esc(initial(app.App));
  const src=esc(app.logo||"");
  return `<div class="app-icon ${sizeClass}">
    ${src?`<img src="${src}" alt="${esc(app.App)} logo" onerror="this.remove();this.parentElement.classList.add('fallback');this.parentElement.insertAdjacentHTML('beforeend','<span>${fallback}</span>')">`:`<span>${fallback}</span>`}
  </div>`;
}
function card(app){
  const free=isFree(app["Pris / tilgang"]);
  const fav=state.favorites.has(app.id);
  return `<article class="app-card">
    <div class="card-top">${logoHtml(app)}
      <button class="favorite-btn ${fav?"active":""}" data-fav="${app.id}" aria-label="Favoritt">${fav?"★":"☆"}</button>
    </div>
    <h3>${esc(app.App)}</h3><div class="country">${esc(app["Land / region"])}</div>
    <p class="description">${esc(app.Beskrivelse)}</p>
    <div class="tags">
      <span class="tag ${free?"free":""}">${esc(app["Pris / tilgang"])}</span>
      ${app["Direkte-TV"]==="Ja"?'<span class="tag live">Direkte-TV</span>':""}
      <span class="tag">${esc(app["Tilgjengelig fra Norge"])}</span>
    </div>
    <button class="card-open" data-open="${app.id}" aria-label="Åpne ${esc(app.App)}">Åpne</button>
  </article>`;
}
function renderActiveFilters(){
  const pairs=[
    ["Søk",els.search.value],["Land",els.country.value],["Språk",els.language.value],
    ["Pris",els.price.value],["Innhold",els.content.value],["Norge",els.norway.value],
    ["Geo",els.geo.value],["Direkte-TV",els.live.checked?"Ja":""],
    ["Favoritter",state.favoritesOnly?"Ja":""]
  ];
  els.active.innerHTML=pairs.filter(([,v])=>v).map(([k,v])=>`<span class="filter-chip">${esc(k)}: ${esc(v)}</span>`).join("");
}
function render(){
  const filtered=sortApps(state.apps.filter(matches));
  els.grid.innerHTML=filtered.map(card).join("");
  els.count.textContent=filtered.length;
  els.empty.hidden=filtered.length!==0;
  renderActiveFilters();
}
function detail(label,value){return `<div class="detail"><span>${esc(label)}</span>${esc(value||"Ikke oppgitt")}</div>`}
function openDialog(id){
  const app=state.apps.find(x=>x.id===id);if(!app)return;
  els.dialogContent.innerHTML=`<div class="dialog-body">
    <div class="dialog-header">${logoHtml(app,"large")}
      <div><h2>${esc(app.App)}</h2><div class="country">${esc(app["Land / region"])}</div></div></div>
    <div class="dialog-grid">
      ${detail("Pris / tilgang",app["Pris / tilgang"])}
      ${detail("Hovedspråk",app["Hovedspråk"])}
      ${detail("Innholdstyper",app["Innholdstyper"])}
      ${detail("Direkte-TV",app["Direkte-TV"])}
      ${detail("Tilgjengelig fra Norge",app["Tilgjengelig fra Norge"])}
      ${detail("Geobegrensning",app["Geobegrensning"])}
      ${detail("Konto / innlogging",app["Konto / innlogging"])}
      ${detail("Google TV-støtte",app["Google TV-støtte"])}
      ${detail("Offisiell app",app["Offisiell app"])}
      ${detail("Målmarked",app["Målmarked"])}
      ${detail("Sist kontrollert",app["Sist kontrollert"])}
    </div>
    <p class="dialog-description">${esc(app.Beskrivelse)}</p>
  </div>`;
  els.dialog.showModal();
}
function reset(){
  els.search.value="";[els.country,els.language,els.price,els.content,els.norway,els.geo].forEach(x=>x.value="");
  els.live.checked=false;state.favoritesOnly=false;$("#favoritesToggle").textContent="☆ Favoritter";render();
}
function saveFavs(){localStorage.setItem("tvFavorites",JSON.stringify([...state.favorites]));}

fetch("data.json").then(r=>r.json()).then(data=>{
  state.apps=data;
  fillSelect(els.country,data.map(x=>x["Land / region"]));
  fillSelect(els.language,data.map(x=>x["Hovedspråk"]));
  fillSelect(els.price,data.map(x=>x["Pris / tilgang"]));
  fillSelect(els.content,data.flatMap(x=>splitValues(x["Innholdstyper"])));
  fillSelect(els.norway,data.map(x=>x["Tilgjengelig fra Norge"]));
  fillSelect(els.geo,data.map(x=>x["Geobegrensning"]));
  $("#statApps").textContent=data.length;
  $("#statRegions").textContent=new Set(data.map(x=>x["Land / region"])).size;
  $("#statFree").textContent=data.filter(x=>isFree(x["Pris / tilgang"])).length;
  $("#statNorway").textContent=data.filter(x=>["Ja","Ja / delvis"].includes(x["Tilgjengelig fra Norge"])).length;
  render();
}).catch(()=>{
  els.grid.innerHTML="<p>Datafilen kunne ikke lastes. Start nettsiden via en lokal webserver eller GitHub Pages.</p>";
});

[els.search,els.country,els.language,els.price,els.content,els.norway,els.geo,els.live,els.sort].forEach(el=>el.addEventListener("input",render));
$("#resetFilters").addEventListener("click",reset);
$("#favoritesToggle").addEventListener("click",e=>{state.favoritesOnly=!state.favoritesOnly;e.currentTarget.textContent=state.favoritesOnly?"★ Viser favoritter":"☆ Favoritter";render()});
$("#themeToggle").addEventListener("click",()=>document.body.classList.toggle("light"));
$("#closeDialog").addEventListener("click",()=>els.dialog.close());
els.dialog.addEventListener("click",e=>{if(e.target===els.dialog)els.dialog.close()});
els.grid.addEventListener("click",e=>{
  const fav=e.target.closest("[data-fav]");if(fav){const id=fav.dataset.fav;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);saveFavs();render();return}
  const open=e.target.closest("[data-open]");if(open)openDialog(open.dataset.open);
});
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();els.search.focus()}});
