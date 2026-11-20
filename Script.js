/* HomeNest property discovery module — client-side demo data */
"use strict";

const properties = [
  {id:1,title:"The Willow Residence",city:"Bengaluru",area:"Whitefield",type:"Apartment",listing:"buy",price:8750000,beds:3,baths:2,areaSqft:1480,year:2024,image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",tag:"FEATURED",description:"A light-filled contemporary apartment with an open living space, thoughtful storage, and a calm community setting."},
  {id:2,title:"Palm Grove Villa",city:"Goa",area:"Assagao",type:"Villa",listing:"buy",price:24500000,beds:4,baths:4,areaSqft:2860,year:2025,image:"https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",tag:"NEW LISTING",description:"A relaxed private villa with generous outdoor space, warm finishes, and room to host family and friends."},
  {id:3,title:"The Parkside Loft",city:"Pune",area:"Koregaon Park",type:"Apartment",listing:"rent",price:42000,beds:2,baths:2,areaSqft:1120,year:2023,image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",tag:"POPULAR",description:"A beautifully planned city home close to cafés, parks, and everyday essentials. Monthly rent shown."},
  {id:4,title:"Cedar Lane House",city:"Jaipur",area:"Vaishali Nagar",type:"House",listing:"buy",price:11200000,beds:3,baths:3,areaSqft:1940,year:2022,image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80",tag:"GREAT VALUE",description:"A welcoming family home with a practical layout, bright bedrooms, and a quiet residential address."},
  {id:5,title:"The Olive Studio",city:"Mumbai",area:"Powai",type:"Studio",listing:"rent",price:28000,beds:1,baths:1,areaSqft:610,year:2024,image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",tag:"MOVE-IN READY",description:"A compact, well-finished studio designed for easy city living, with useful amenities close by."},
  {id:6,title:"Lakeview Heights",city:"Hyderabad",area:"Kokapet",type:"Apartment",listing:"buy",price:15800000,beds:3,baths:3,areaSqft:1760,year:2025,image:"https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1000&q=80",tag:"NEW LISTING",description:"A modern apartment with open views, spacious rooms, and convenient access to business districts."}
];

const state = { listing:"buy", saved:new Set(readSaved()), showSaved:false };
const $ = (selector) => document.querySelector(selector);
const grid = $("#propertyGrid");
const resultCount = $("#resultCount");
const emptyState = $("#emptyState");
const detailsDialog = $("#detailsDialog");
const postDialog = $("#postDialog");
let toastTimer;

function readSaved(){
  try { return JSON.parse(localStorage.getItem("homenest-saved") || "[]"); }
  catch { return []; }
}
function persistSaved(){
  try { localStorage.setItem("homenest-saved", JSON.stringify([...state.saved])); }
  catch { /* Storage may be disabled; saved state still works for this session. */ }
}
function formatPrice(price, listing){
  if(listing === "rent") return `₹${new Intl.NumberFormat("en-IN").format(price)}<small> / month</small>`;
  if(price >= 10000000) return `₹${(price/10000000).toFixed(2).replace(/\.00$/,"")} Cr`;
  return `₹${(price/100000).toFixed(price%100000===0?0:1)} L`;
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function getFilteredProperties(){
  const location = $("#location").value.trim().toLowerCase();
  const type = $("#propertyType").value;
  const maxBudget = $("#budget").value;
  const minPrice = Number($("#minPrice").value) || 0;
  const minBeds = Number($("#bedrooms").value) || 0;
  let result = properties.filter(property => {
    const matchesListing = state.listing === "all" || property.listing === state.listing;
    const searchable = `${property.city} ${property.area} ${property.title}`.toLowerCase();
    const matchesLocation = !location || searchable.includes(location);
    const matchesType = type === "all" || property.type === type;
    const matchesMax = maxBudget === "any" || property.price <= Number(maxBudget);
    const matchesMin = property.price >= minPrice;
    const matchesBeds = property.beds >= minBeds;
    const matchesSaved = !state.showSaved || state.saved.has(property.id);
    return matchesListing && matchesLocation && matchesType && matchesMax && matchesMin && matchesBeds && matchesSaved;
  });
  const sort = $("#sortBy").value;
  if(sort === "price-asc") result.sort((a,b)=>a.price-b.price);
  if(sort === "price-desc") result.sort((a,b)=>b.price-a.price);
  if(sort === "newest") result.sort((a,b)=>b.year-a.year);
  return result;
}
function renderFilters(){
  const chips = [];
  if(state.listing !== "all") chips.push(state.listing === "buy" ? "For sale" : "For rent");
  if($("#location").value.trim()) chips.push(`Location: ${$("#location").value.trim()}`);
  if($("#propertyType").value !== "all") chips.push($("#propertyType").value);
  if($("#budget").value !== "any") chips.push(`Max ₹${Number($("#budget").value).toLocaleString("en-IN")}`);
  if($("#minPrice").value) chips.push(`Min ₹${Number($("#minPrice").value).toLocaleString("en-IN")}`);
  if($("#bedrooms").value !== "0") chips.push(`${$("#bedrooms").value}+ bedrooms`);
  if(state.showSaved) chips.push("Saved homes");
  $("#activeFilters").innerHTML = chips.map(chip=>`<span class="filter-chip">${escapeHTML(chip)}</span>`).join("");
}
function propertyCard(property){
  const saved = state.saved.has(property.id);
  return `<article class="property-card">
    <div class="property-image-wrap">
      <img class="property-image" src="${property.image}" alt="${escapeHTML(property.title)}" loading="lazy">
      <span class="property-badge">${escapeHTML(property.tag)}</span>
      <button class="favorite-btn ${saved?"is-saved":""}" type="button" data-save="${property.id}" aria-label="${saved?"Remove from":"Save to"} favourites" aria-pressed="${saved}">${saved?"♥":"♡"}</button>
    </div>
    <div class="property-body">
      <p class="property-location">⌖ ${escapeHTML(property.area)}, ${escapeHTML(property.city)}</p>
      <h3 class="property-title">${escapeHTML(property.title)}</h3>
      <p class="property-price">${formatPrice(property.price,property.listing)}</p>
      <div class="property-meta"><span>▣ ${property.beds} beds</span><span>♧ ${property.baths} baths</span><span>↔ ${property.areaSqft.toLocaleString("en-IN")} sqft</span></div>
      <div class="card-footer"><span class="card-type">${property.type} · ${property.listing==="buy"?"For sale":"For rent"}</span><button class="details-btn" type="button" data-details="${property.id}">View details ↗</button></div>
    </div>
  </article>`;
}
function render(){
  const result = getFilteredProperties();
  grid.innerHTML = result.map(propertyCard).join("");
  resultCount.textContent = `Showing ${result.length} ${result.length===1?"home":"homes"}`;
  emptyState.hidden = result.length !== 0;
  grid.hidden = result.length === 0;
  $("#savedCount").textContent = state.saved.size;
  $("#showSavedBtn").setAttribute("aria-pressed",String(state.showSaved));
  renderFilters();
}
function showToast(message){
  const toast=$("#toast");
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function setListing(listing){
  state.listing=listing;
  document.querySelectorAll(".search-tab").forEach(tab=>{
    const active=tab.dataset.listing===listing;
    tab.classList.toggle("active",active);
    tab.setAttribute("aria-pressed",String(active));
  });
  render();
}
function resetFilters(){
  $("#searchForm").reset();
  $("#minPrice").value="";
  $("#bedrooms").value="0";
  $("#sortBy").value="recommended";
  state.showSaved=false;
  setListing("buy");
  render();
}
function openDetails(id){
  const property=properties.find(item=>item.id===Number(id));
  if(!property) return;
  $("#detailsContent").innerHTML=`<img class="detail-image" src="${property.image}" alt="${escapeHTML(property.title)}"><p class="detail-location">⌖ ${escapeHTML(property.area)}, ${escapeHTML(property.city)}</p><h2 class="detail-title">${escapeHTML(property.title)}</h2><p class="detail-price">${formatPrice(property.price,property.listing)}</p><div class="property-meta"><span>▣ ${property.beds} bedrooms</span><span>♧ ${property.baths} bathrooms</span><span>↔ ${property.areaSqft.toLocaleString("en-IN")} sqft</span></div><p class="detail-description">${escapeHTML(property.description)}</p><div class="detail-actions"><a class="btn btn-primary" href="mailto:hello@homenest.example?subject=${encodeURIComponent("Enquiry: "+property.title)}">Enquire about this home ↗</a><button class="btn btn-outline" type="button" data-save="${property.id}">${state.saved.has(property.id)?"♥ Saved":"♡ Save home"}</button></div>`;
  detailsDialog.showModal();
}
document.querySelectorAll(".search-tab").forEach(tab=>tab.addEventListener("click",()=>setListing(tab.dataset.listing)));
$("#searchForm").addEventListener("submit",event=>{event.preventDefault();state.showSaved=false;render();$("#properties").scrollIntoView({behavior:"smooth"});});
["propertyType","budget","minPrice","bedrooms","sortBy"].forEach(id=>$("#"+id).addEventListener("change",()=>{state.showSaved=false;render();}));
$("#location").addEventListener("input",()=>{state.showSaved=false;render();});
$("#advancedToggle").addEventListener("click",()=>{
  const panel=$("#advancedFilters"), expanded=$("#advancedToggle").getAttribute("aria-expanded")==="true";
  $("#advancedToggle").setAttribute("aria-expanded",String(!expanded));
  panel.hidden=expanded;
  $("#advancedToggle span").textContent=expanded?"＋":"−";
});
$("#clearFilters").addEventListener("click",()=>{ $("#propertyType").value="all";$("#budget").value="any";$("#minPrice").value="";$("#bedrooms").value="0";$("#sortBy").value="recommended";$("#location").value="";state.showSaved=false;render();});
$("#resetSearch").addEventListener("click",resetFilters);
$("#emptyReset").addEventListener("click",resetFilters);
$("#showSavedBtn").addEventListener("click",()=>{state.showSaved=!state.showSaved;render();$("#properties").scrollIntoView({behavior:"smooth"});});
document.addEventListener("click",event=>{
  const saveButton=event.target.closest("[data-save]");
  const detailsButton=event.target.closest("[data-details]");
  if(saveButton){const id=Number(saveButton.dataset.save);state.saved.has(id)?state.saved.delete(id):state.saved.add(id);persistSaved();render();if(detailsDialog.open)openDetails(id);showToast(state.saved.has(id)?"Added to saved homes":"Removed from saved homes");}
  if(detailsButton)openDetails(detailsButton.dataset.details);
});
$("#postPropertyBtn").addEventListener("click",()=>postDialog.showModal());
document.querySelectorAll("[data-close-dialog]").forEach(button=>button.addEventListener("click",()=>postDialog.close()));
$("#postForm").addEventListener("submit",event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const title=String(data.get("title")).trim(), city=String(data.get("city")).trim(), price=Number(data.get("price"));
  if(!title||!city||!Number.isFinite(price)||price<=0){showToast("Please enter valid property details.");return;}
  postDialog.close();event.currentTarget.reset();
  showToast(`Preview created for ${title}. Connect a backend to publish listings.`);
});
$("#mobileMenuToggle").addEventListener("click",()=>{
  const nav=$("#mainNav"),open=nav.classList.toggle("open");
  $("#mobileMenuToggle").setAttribute("aria-expanded",String(open));
});
$("#mainNav").addEventListener("click",event=>{if(event.target.closest("a")){$("#mainNav").classList.remove("open");$("#mobileMenuToggle").setAttribute("aria-expanded","false");}});
$("#year").textContent=new Date().getFullYear();
render();
