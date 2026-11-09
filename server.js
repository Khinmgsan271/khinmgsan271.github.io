"use strict";
// CartCraft demo REST API — localhost only, fictional data. No authentication, payments, wallet data or network calls.
const http=require("node:http");
const {URL}=require("node:url");
const PRODUCTS=Object.freeze([
 {id:"vase",name:"Solstice Vase",category:"Homeware",price:38},
 {id:"lamp",name:"Arc Table Lamp",category:"Workspace",price:74},
 {id:"notes",name:"Studio Notebook",category:"Workspace",price:18},
 {id:"clock",name:"Nordic Clock",category:"Homeware",price:49},
 {id:"cup",name:"Stoneware Cup",category:"Homeware",price:22},
 {id:"bag",name:"Everyday Tote",category:"Accessories",price:27},
 {id:"plant",name:"Clover Planter",category:"Homeware",price:33},
 {id:"case",name:"Minimal Pouch",category:"Accessories",price:25}
].map(p=>Object.freeze(p)));
function handler(req,res){
  const url=new URL(req.url||"/","http://localhost");
  const path=url.pathname;
  const reply=(status,payload)=>{
    res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});
    res.end(JSON.stringify(payload));
  };
  if(req.method!=="GET")return reply(405,{error:"Read-only demo API: GET requests only."});
  if(path==="/api/health")return reply(200,{status:"ok",demo:true,message:"Fictional local sample API."});
  if(path==="/api/products"){
    const category=(url.searchParams.get("category")||"all").toLowerCase();
    const q=(url.searchParams.get("q")||"").toLowerCase().slice(0,80);
    const items=PRODUCTS.filter(p=>(category==="all"||p.category.toLowerCase()===category)&&p.name.toLowerCase().includes(q));
    return reply(200,{items,count:items.length,demo:true});
  }
  if(path==="/api/analytics")return reply(200,{demo:true,timeRange:"7 days",visitors:[121,145,133,162,186,201,292],orders:[4,5,4,6,7,8,10]});
  reply(404,{error:"Endpoint not found",routes:["/api/health","/api/products","/api/products?category=Homeware","/api/analytics"]});
}
if(require.main===module){
  const port=Number(process.env.PORT||8765);
  const server=http.createServer(handler);
  server.listen(port,"127.0.0.1",()=>console.log("CartCraft demo API listening on localhost:"+port));
}
module.exports={handler,PRODUCTS};