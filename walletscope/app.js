"use strict";
(function(){
  const rows=window.WalletScopeDemoData.rows;
  const filteredRows=window.WalletScopeUtils.filteredRows;
  const rowsToCsv=window.WalletScopeUtils.rowsToCsv;
  const search=document.getElementById("search");
  const status=document.getElementById("status");
  const body=document.getElementById("table-body");
  const counter=document.getElementById("result-count");
  const exportButton=document.getElementById("download-btn");
  const pad=x=>String(x).padStart(2,"0");
  document.getElementById("stat-total").textContent=pad(rows.length);
  document.getElementById("stat-installed").textContent=pad(rows.filter(r=>r.status==="Installed").length);
  document.getElementById("stat-not-installed").textContent=pad(rows.filter(r=>r.status==="Not installed").length);
  function td(value){const el=document.createElement("td");el.textContent=value;return el;}
  function render(){
    const visible=filteredRows(rows,search.value,status.value);
    body.replaceChildren();
    for(const r of visible){
      const tr=document.createElement("tr");
      const first=td("");
      const entry=document.createElement("span");entry.className="wallet-cell";
      const logo=document.createElement("span");logo.className="wallet-logo "+r.swatch;logo.textContent=r.glyph;logo.setAttribute("aria-hidden","true");
      const name=document.createElement("span");name.textContent=r.name;
      entry.append(logo,name);first.append(entry);
      tr.append(first,td(r.type),td(r.browser),td(r.profile),td(r.date));
      const last=td("");const pill=document.createElement("span");pill.className="pill "+(r.status==="Installed"?"installed":"not-installed");pill.textContent=r.status+" (sample)";last.append(pill);tr.append(last);
      body.append(tr);
    }
    if(!visible.length){const tr=document.createElement("tr");const empty=td("No fictional entries match your filters.");empty.colSpan=6;empty.className="empty-message";tr.append(empty);body.append(tr);}
    counter.textContent="Showing "+visible.length+" of "+rows.length+" fictional records";
    exportButton.disabled=!visible.length;
  }
  search.addEventListener("input",render);
  status.addEventListener("change",render);
  exportButton.addEventListener("click",function(){
    const visible=filteredRows(rows,search.value,status.value);
    if(!visible.length)return;
    const csv=rowsToCsv(visible);
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const link=document.createElement("a");link.href=url;link.download="walletscope-synthetic-demo.csv";
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement&&document.activeElement.tagName)){
      e.preventDefault();search.focus();
    }
  });
  render();
})();