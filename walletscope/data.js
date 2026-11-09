/* Fictional records only: no software detection, wallet access or network activity. */
(function (root) {
  "use strict";
  const rows = Object.freeze([
    {name:"Phantom",type:"Browser extension",browser:"Chrome",profile:"Example Profile A",date:"2026-05-12",status:"Installed",swatch:"lilac",glyph:"✦"},
    {name:"MetaMask",type:"Browser extension",browser:"Firefox",profile:"Example Profile B",date:"2026-06-02",status:"Installed",swatch:"orange",glyph:"◇"},
    {name:"Exodus",type:"Desktop app",browser:"—",profile:"—",date:"2026-06-22",status:"Not installed",swatch:"blue",glyph:"X"},
    {name:"Rabby",type:"Browser extension",browser:"Edge",profile:"Example Profile C",date:"2026-07-08",status:"Installed",swatch:"blue",glyph:"⬡"},
    {name:"Trust Wallet",type:"Browser extension",browser:"Chrome",profile:"Example Profile D",date:"2026-08-15",status:"Not installed",swatch:"green",glyph:"◇"},
    {name:"Coinbase Wallet",type:"Browser extension",browser:"Chrome",profile:"Example Profile E",date:"2026-09-01",status:"Installed",swatch:"gray",glyph:"C"},
    {name:"Brave Wallet",type:"Browser feature",browser:"Brave",profile:"Example Profile F",date:"2026-10-03",status:"Installed",swatch:"orange",glyph:"B"}
  ].map(x => Object.freeze(x)));
  root.WalletScopeDemoData = {rows};
  if (typeof module !== "undefined" && module.exports) module.exports = {rows};
})(typeof window !== "undefined" ? window : globalThis);