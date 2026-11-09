"use strict";
// Small fictional commerce module, intentionally pure for transparent QA.
const catalog=[
 {id:"notebook",name:"Notebook",price:12},
 {id:"lamp",name:"Studio Lamp",price:38},
 {id:"cup",name:"Ceramic Cup",price:20}
];
const functions={
 normalize:function(value){return String(value||"").trim().toLowerCase();},
 search:function(q){const t=this.normalize(q);return catalog.filter(p=>p.name.toLowerCase().includes(t));},
 sortPrices:function(){return [...catalog].sort((a,b)=>a.price-b.price);},
 quantity:function(input){const n=Number(input);return Number.isFinite(n)?Math.max(0,Math.min(20,Math.trunc(n))):0;},
 subtotal:function(items){return items.reduce((sum,item)=>sum+item.price*this.quantity(item.qty),0);},
 shipping:function(amount){return amount<=0?0:amount>=100?0:8;},
 escapeHtml:function(s){return String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
};
const checks=[
 {label:"Text normalization trims & lowercases",detail:"Whitespace and case",run:()=>functions.normalize("  PhANtom ")==="phantom"},
 {label:"Search matches a product",detail:"Case-insensitive search",run:()=>functions.search("LAMP").length===1},
 {label:"Search returns an empty list",detail:"No invented result",run:()=>functions.search("unknown").length===0},
 {label:"Sorting is ascending and immutable",detail:"Input records unchanged",run:()=>functions.sortPrices().map(x=>x.price).join(",")==="12,20,38"&&catalog[0].price===12},
 {label:"Quantity enforces a 20-item cap",detail:"Bounds and integers",run:()=>functions.quantity(500)===20&&functions.quantity(-2)===0&&functions.quantity("3.7")===3},
 {label:"Subtotal calculates quantities",detail:"USD demo arithmetic",run:()=>functions.subtotal([{price:12,qty:2},{price:20,qty:1}])===44},
 {label:"Shipping threshold is consistent",detail:"Fixed demo policy",run:()=>functions.shipping(0)===0&&functions.shipping(99)===8&&functions.shipping(100)===0},
 {label:"HTML text is escaped",detail:"Protect displayed content",run:()=>functions.escapeHtml("<script>")==="&lt;script&gt;"}
];
const sampleSeries=Object.freeze([121,145,133,162,186,201,292,240,225,257,268,293,320,337,315,352,370,345,391,411,395,423,451,430,449,481,460,495,526,500]);
function drawChart(n){
 const arr=sampleSeries.slice(-n),w=480,h=210,pad=17,max=Math.max(...arr)*1.15,min=0;
 const point=(v,i)=>[pad+(i/(arr.length-1))*(w-2*pad),h-pad-((v-min)/(max-min))*(h-2*pad)];
 const coords=arr.map((v,i)=>point(v,i));
 const line=coords.map(([x,y],i)=>(i===0?"M":"L")+x.toFixed(2)+" "+y.toFixed(2)).join(" ");
 const fill=line+" L "+coords[coords.length-1][0].toFixed(2)+" "+(h-pad)+" L "+pad+" "+(h-pad)+" Z";
 document.getElementById("chart-line").setAttribute("d",line);
 document.getElementById("chart-fill").setAttribute("d",fill);
 document.getElementById("visitors").textContent=arr.reduce((a,b)=>a+b,0).toLocaleString();
 document.getElementById("average").textContent=Math.round(arr.reduce((a,b)=>a+b,0)/arr.length).toLocaleString();
 document.getElementById("peak").textContent=Math.max(...arr).toLocaleString();
}
function runTests(){
 const items=document.getElementById("results");items.replaceChildren();
 let passed=0;
 for(const test of checks){
  let ok=false;try{ok=Boolean(test.run())}catch(_e){ok=false}
  if(ok)passed++;
  const row=document.createElement("div");row.className="case";
  const details=document.createElement("div"),name=document.createElement("strong"),small=document.createElement("small");
  name.textContent=test.label;small.textContent=test.detail;details.append(name,small);
  const badge=document.createElement("span");badge.className="badge"+(ok?"":" bad");badge.textContent=ok?"PASS":"FAIL";
  row.append(details,badge);items.append(row);
 }
 document.getElementById("passed-count").textContent=String(passed).padStart(2,"0");
 document.getElementById("failed-count").textContent=String(checks.length-passed).padStart(2,"0");
}
if(typeof document!=="undefined"){
 document.getElementById("tests-count").textContent=String(checks.length).padStart(2,"0");
 document.getElementById("run").addEventListener("click",runTests);
 document.getElementById("range").addEventListener("change",e=>drawChart(Number(e.target.value)));
 const results=document.getElementById("results");const intro=document.createElement("p");intro.className="small-note";intro.textContent="Click Run all tests to execute the assertions in this browser.";results.append(intro);
 drawChart(7);
}
if(typeof module!=="undefined"&&module.exports)module.exports={catalog,functions,checks,sampleSeries};