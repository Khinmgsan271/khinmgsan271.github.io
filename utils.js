(function(root) {
  "use strict";
  function filteredRows(rows, search, status) {
    const term = String(search || "").toLowerCase().trim();
    return rows.filter(r => (status === "all" || r.status === status) &&
      [r.name,r.type,r.browser,r.profile,r.date,r.status].join(" ").toLowerCase().includes(term));
  }
  function csvSafe(value) {
    const raw = String(value == null ? "" : value);
    const guarded = /^[\s]*[=+\-@\t\r]/.test(raw) ? "'" + raw : raw;
    return '"' + guarded.replace(/"/g, '""') + '"';
  }
  function rowsToCsv(rows) {
    const header = ["Wallet name","Application type","Browser","Example profile","Sample date","Fictional status"];
    const lines = rows.map(r => [r.name,r.type,r.browser,r.profile,r.date,r.status].map(csvSafe).join(","));
    return [header.map(csvSafe).join(","),...lines].join("\r\n") + "\r\n";
  }
  root.WalletScopeUtils = {filteredRows,rowsToCsv,csvSafe};
  if (typeof module !== "undefined" && module.exports) module.exports = {filteredRows,rowsToCsv,csvSafe};
})(typeof window !== "undefined" ? window : globalThis);