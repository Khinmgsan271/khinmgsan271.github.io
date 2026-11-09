"use strict";
const PRODUCTS=Object.freeze([
  {id:"vase",name:"Solstice Vase",category:"Homeware",price:38,icon:"🏺",bg:"#e8ddd0"},
  {id:"lamp",name:"Arc Table Lamp",category:"Workspace",price:74,icon:"💡",bg:"#dde9dd"},
  {id:"notes",name:"Studio Notebook",category:"Workspace",price:18,icon:"📓",bg:"#e6e4e9"},
  {id:"clock",name:"Nordic Clock",category:"Homeware",price:49,icon:"🕰️",bg:"#e3e9df"},
  {id:"cup",name:"Stoneware Cup",category:"Homeware",price:22,icon:"☕",bg:"#eadbce"},
  {id:"bag",name:"Everyday Tote",category:"Accessories",price:27,icon:"👜",bg:"#e2e8dc"},
  {id:"plant",name:"Clover Planter",category:"Homeware",price:33,icon:"🪴",bg:"#dce8dd"},
  {id:"case",name:"Minimal Pouch",category:"Accessories",price:25,icon:"👝",bg:"#e8dcd6"}
].map(p=>Object.freeze(p)));
const money=n=>"$"+Number(n).toFixed(2);
const CART=new Map();
function viewProducts(q,category,sort){
 let filtered=PRODUCTS.filter(p=>(category==="all"||p.category===category)&&p.name.toLowerCase().includes(q.toLowerCase().trim()));
 if(sort==="low")filtered.sort((a,b)=>a.price-b.price);
 if(sort==="high")filtered.sort((a,b)=>b.price-a.price);
 return filtered;
}
function totals(cart){
 let subtotal=0,qty=0;
 for(const [id,count] of cart){const p=PRODUCTS.find(v=>v.id===id);if(p&&count>0&&Number.isInteger(count)){subtotal+=p.price*count;qty+=count;}}
 return {subtotal,shipping:subtotal>0&&subtotal<100?8:0,count:qty,total:subtotal+(subtotal>0&&subtotal<100?8:0)};
}
function add(id){if(!PRODUCTS.some(p=>p.id===id))return;CART.set(id,Math.min((CART.get(id)||0)+1,20));renderCart();}
function adjust(id,diff){const current=CART.get(id)||0;const next=Math.max(0,Math.min(20,current+diff));if(!next)CART.delete(id);else CART.set(id,next);renderCart();}
function renderCatalog(){
 const grid=document.getElementById("products");
 grid.replaceChildren();
 const visible=viewProducts(document.getElementById("q").value,document.getElementById("category").value,document.getElementById("sort").value);
 if(!visible.length){const p=document.createElement("p");p.className="empty";p.textContent="No fictional products match your search.";grid.append(p);return;}
 for(const p of visible){
  const article=document.createElement("article");article.className="product";
  const art=document.createElement("div");art.className="product-art";art.style.background=p.bg;
  const icon=document.createElement("span");icon.className="product-glyph";icon.textContent=p.icon;icon.setAttribute("aria-hidden","true");art.append(icon);
  const content=document.createElement("div");content.className="product-content";
  const cat=document.createElement("span");cat.className="product-type";cat.textContent=p.category.toUpperCase()+" / CONCEPT";
  const name=document.createElement("h3");name.textContent=p.name;
  const bottom=document.createElement("div");bottom.className="product-bottom";
  const price=document.createElement("strong");price.textContent=money(p.price);
  const button=document.createElement("button");button.className="add-btn";button.type="button";button.textContent="+ Add to bag";button.setAttribute("aria-label","Add "+p.name+" to demonstration cart");
  button.addEventListener("click",()=>{add(p.id);openCart();});bottom.append(price,button);
  content.append(cat,name,bottom);article.append(art,content);grid.append(article);
 }
}
function renderCart(){
 const area=document.getElementById("cart-items");area.replaceChildren();
 if(!CART.size){const p=document.createElement("p");p.className="empty";p.textContent="Your demonstration bag is empty.";area.append(p);}
 for(const [id,qty]of CART){
  const p=PRODUCTS.find(x=>x.id===id);if(!p)continue;
  const row=document.createElement("div");row.className="cart-item";
  const ico=document.createElement("span");ico.className="cart-icon";ico.textContent=p.icon;
  const details=document.createElement("div");const name=document.createElement("strong");name.textContent=p.name;const desc=document.createElement("small");desc.textContent="Fictional · "+p.category;
  const ctr=document.createElement("div");ctr.className="qty";
  const minus=document.createElement("button");minus.textContent="−";minus.setAttribute("aria-label","Remove one "+p.name);minus.addEventListener("click",()=>adjust(id,-1));
  const number=document.createElement("span");number.textContent=qty;
  const plus=document.createElement("button");plus.textContent="+";plus.setAttribute("aria-label","Add one "+p.name);plus.addEventListener("click",()=>adjust(id,1));ctr.append(minus,number,plus);
  details.append(name,desc,ctr);const price=document.createElement("strong");price.textContent=money(p.price*qty);
  row.append(ico,details,price);area.append(row);
 }
 const t=totals(CART);
 document.getElementById("cart-count").textContent=t.count;
 document.getElementById("subtotal").textContent=money(t.subtotal);
 document.getElementById("shipping").textContent=money(t.shipping);
 document.getElementById("grand-total").textContent=money(t.total);
}
function openCart(){document.getElementById("cart-panel").classList.add("open");document.getElementById("cart-panel").setAttribute("aria-hidden","false");document.getElementById("scrim").hidden=false;document.getElementById("cart-close").focus();}
function closeCart(){document.getElementById("cart-panel").classList.remove("open");document.getElementById("cart-panel").setAttribute("aria-hidden","true");document.getElementById("scrim").hidden=true;document.getElementById("cart-open").focus();}
if(typeof document!=="undefined"){
 document.getElementById("q").addEventListener("input",renderCatalog);
 document.getElementById("category").addEventListener("change",renderCatalog);
 document.getElementById("sort").addEventListener("change",renderCatalog);
 document.getElementById("cart-open").addEventListener("click",openCart);
 document.getElementById("cart-close").addEventListener("click",closeCart);
 document.getElementById("scrim").addEventListener("click",closeCart);
 document.getElementById("reset").addEventListener("click",()=>{CART.clear();renderCart();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.getElementById("cart-panel").classList.contains("open"))closeCart();});
 renderCatalog();renderCart();
}
if(typeof module!=="undefined"&&module.exports)module.exports={PRODUCTS,viewProducts,totals,money};
