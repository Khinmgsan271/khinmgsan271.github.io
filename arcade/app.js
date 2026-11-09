"use strict";
const ICONS=["🪐","🌕","✨","🚀","🌟","🛰️","☄️","🌙"];
let cards=[],first=null,second=null,locked=false,moves=0,matched=0,seconds=0,intervalId=null,started=false,epoch=0;
function shuffle(arr){const result=[...arr];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function startTimer(){if(started)return;started=true;intervalId=setInterval(()=>{seconds++;document.getElementById("seconds").textContent=seconds;},1000);}
function update(){document.getElementById("pairs").textContent=matched+"/"+ICONS.length;document.getElementById("moves").textContent=moves;}
function setMsg(message){document.getElementById("message").textContent=message;}
function reveal(card){card.node.classList.add("revealed");card.node.setAttribute("aria-label",card.icon+" revealed");}
function hide(card){card.node.classList.remove("revealed");card.node.setAttribute("aria-label","Hidden card");}
function choose(index){
 if(locked)return;
 const card=cards[index];if(!card||card.matched||card===first)return;
 startTimer();reveal(card);
 if(!first){first=card;setMsg("Find the matching symbol.");return;}
 second=card;moves++;update();
 if(first.icon===second.icon){
  first.matched=true;second.matched=true;first.node.classList.add("matched");second.node.classList.add("matched");first.node.disabled=true;second.node.disabled=true;
  matched++;first=null;second=null;update();
  if(matched===ICONS.length){clearInterval(intervalId);started=false;setMsg("✨ Complete! "+moves+" moves in "+seconds+" seconds.");}
  else setMsg("Match found! Keep going.");
 }else{
  locked=true;const a=first,b=second,round=epoch;setMsg("Not a match. Try again.");
  setTimeout(()=>{if(round!==epoch)return;hide(a);hide(b);first=null;second=null;locked=false;},850);
 }
}
function newGame(){
 epoch++;if(intervalId)clearInterval(intervalId);intervalId=null;seconds=0;started=false;moves=0;matched=0;first=null;second=null;locked=false;
 document.getElementById("seconds").textContent="0";
 const deck=shuffle([...ICONS,...ICONS]);
 const board=document.getElementById("board");board.replaceChildren();
 cards=deck.map((icon,index)=>{
  const button=document.createElement("button");button.className="tile";button.type="button";button.setAttribute("aria-label","Hidden card");button.setAttribute("aria-describedby","message");
  const face=document.createElement("span");face.className="face";face.textContent=icon;face.setAttribute("aria-hidden","true");button.append(face);
  button.addEventListener("click",()=>choose(index));board.append(button);
  return {icon,node:button,matched:false};
 });
 update();setMsg("Select two cards to find a pair.");
}
if(typeof document!=="undefined"){document.getElementById("new").addEventListener("click",newGame);newGame();}
if(typeof module!=="undefined"&&module.exports)module.exports={ICONS,shuffle};