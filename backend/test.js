"use strict";
const assert=require("node:assert/strict");
const {handler,PRODUCTS}=require("./server");
const http=require("node:http");
assert.equal(PRODUCTS.length,8);
assert.equal(PRODUCTS.filter(p=>p.category==="Homeware").length,4);
async function run(){
  const server=http.createServer(handler).listen(0,"127.0.0.1");
  await new Promise(resolve=>server.once("listening",resolve));
  const port=server.address().port;
  async function get(path,opts={}){
    return await fetch("http://127.0.0.1:"+port+path,opts);
  }
  try{
    const health=await get("/api/health");assert.equal(health.status,200);
    assert.equal((await health.json()).demo,true);
    const products=await get("/api/products");assert.equal((await products.json()).count,8);
    const only=await get("/api/products?category=Homeware");assert.equal((await only.json()).count,4);
    const searched=await get("/api/products?q=notebook");assert.equal((await searched.json()).items[0].id,"notes");
    const analytics=await get("/api/analytics");assert.equal((await analytics.json()).visitors.length,7);
    const prohibited=await get("/api/products",{method:"POST"});assert.equal(prohibited.status,405);
    const missing=await get("/does-not-exist");assert.equal(missing.status,404);
    console.log("PASS: 7 REST API checks on localhost only.");
  }finally{server.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1});