'use strict';
document.getElementById('year').textContent=String(new Date().getFullYear());
const targets=document.querySelectorAll('a[href^="#"]');
for(const a of targets){a.addEventListener('click',e=>{const id=a.getAttribute('href')?.slice(1);const dest=id&&document.getElementById(id);if(dest){e.preventDefault();dest.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'','#'+id);}});}
const revealItems=document.querySelectorAll('.project-card,.approach-section,.contact-inner');
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});},{threshold:.12});revealItems.forEach(el=>observer.observe(el));}else revealItems.forEach(el=>el.classList.add('in-view'));
