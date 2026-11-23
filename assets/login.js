/* BEME KSA — écran d'entrée : onglets de groupe + carrousel 3D (v40) */
(function(){
var FR='<svg viewBox="0 0 3 2" aria-hidden="true"><path fill="#fff" d="M0 0h3v2H0z"/><path fill="#1f3a8a" d="M0 0h1v2H0z"/><path fill="#d22b3a" d="M2 0h1v2H2z"/></svg>';
var GB='<svg viewBox="0 0 60 40" aria-hidden="true"><path fill="#1f2f6b" d="M0 0h60v40H0z"/><path stroke="#fff" stroke-width="8" d="M0 0l60 40M60 0L0 40"/><path stroke="#c8202f" stroke-width="3" d="M0 0l60 40M60 0L0 40"/><path stroke="#fff" stroke-width="13" d="M30 0v40M0 20h60"/><path stroke="#c8202f" stroke-width="8" d="M30 0v40M0 20h60"/></svg>';
var CH='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
var cur=0;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function styleA(host,o){
  var L=o.L,groups=o.groups.filter(function(g){return g.items.length});
  if(cur>=groups.length)cur=0;
  host.innerHTML=
  '<div class="lx-tabs" role="tablist" aria-label="'+L("Groupes","Groups")+'"><i class="lx-ind"></i>'+groups.map(function(g,i){return'<button type="button" role="tab" id="lxt'+i+'" aria-selected="'+(i===cur)+'" data-g="'+i+'">'+esc(g.label)+'</button>'}).join("")+'</div>'+
  '<div class="lx-stage" role="listbox" tabindex="-1" aria-label="'+L("Profils","Profiles")+'"></div>'+
  '<div class="lx-info" aria-live="polite"><div class="lx-nm"></div><div class="lx-sb"></div></div>'+
  '<div class="lx-ctrl"><button type="button" class="lx-nav" data-n="-1" aria-label="'+L("Précédent","Previous")+'">'+CH.replace('m9 5 7 7-7 7','m15 5-7 7 7 7')+'</button><div class="lx-dots"></div><button type="button" class="lx-nav" data-n="1" aria-label="'+L("Suivant","Next")+'">'+CH+'</button></div>'+
  '<div class="lx-cta"><button type="button" class="lx-go">'+L("Entrer","Enter")+'</button></div>';
  var $=function(s){return host.querySelector(s)},stage=$(".lx-stage"),tabs=host.querySelectorAll(".lx-tabs [role=tab]"),ind=$(".lx-ind");
  var items,cards,dots,pos,target,sel,drag,raf,moved=0;
  function ind_(){var t=tabs[cur];if(t){ind.style.width=t.offsetWidth+"px";ind.style.transform="translateX("+t.offsetLeft+"px)"}}
  function build(){
    items=groups[cur].items;stage.innerHTML="";dots_(); 
    cards=items.map(function(p,i){var b=document.createElement("button");b.type="button";b.className="lx-card";b.setAttribute("role","option");
      b.innerHTML='<span class="lx-n">0'+(i+1)+'</span><span class="lx-medal">'+p.icon+'</span><i class="lx-orn"></i><b>'+esc(p.title)+'</b><em>'+esc(p.sub)+'</em>';
      b.onclick=function(){if(moved>6)return;if(i===sel)pick();else go(i)};stage.appendChild(b);return b});
    sel=0;pos=0;target=0;draw();info();
  }
  function dots_(){var d=$(".lx-dots");d.innerHTML=groups[cur].items.map(function(p,i){return'<button type="button" class="lx-dot" aria-label="'+esc(p.title)+'" data-i="'+i+'"><i></i></button>'}).join("");d.querySelectorAll("button").forEach(function(b){b.onclick=function(){go(+b.dataset.i)}})}
  function info(){var p=items[sel];$(".lx-nm").textContent=p.title;$(".lx-sb").textContent=p.sub;host.querySelectorAll(".lx-dot").forEach(function(d,i){d.setAttribute("aria-current",i===sel)});
    host.querySelector('[data-n="-1"]').disabled=sel<=0;host.querySelector('[data-n="1"]').disabled=sel>=items.length-1}
  function draw(){var cw=cards[0].offsetWidth,step=cw*.82;
    cards.forEach(function(c,i){var d=i-pos,a=Math.abs(d),s=d<0?-1:1;
      var x=s*(a<1?a*step:step+(a-1)*step*.7),z=-Math.min(a,2)*110-(a>0?50*Math.min(a,1):0),ry=-s*Math.min(a,1)*44,sc=1-Math.min(a,1)*.07,op=a>2.2?0:(a<1?1-a*.3:Math.max(0,.7-(a-1)*.5));
      c.style.transform="translate3d("+x.toFixed(1)+"px,"+(a*4).toFixed(1)+"px,"+z.toFixed(0)+"px) rotateY("+ry.toFixed(1)+"deg) scale("+sc.toFixed(3)+")";
      c.style.opacity=op.toFixed(2);c.style.zIndex=100-Math.round(a*10);c.style.filter=a<.02?"none":"brightness("+(1-Math.min(a,1.4)*.4).toFixed(2)+")";
      c.style.setProperty("--glow",Math.max(0,1-a*1.5).toFixed(2));c.tabIndex=i===sel?0:-1;c.setAttribute("aria-selected",i===sel);c.classList.toggle("on",i===sel&&a<.1);c.style.pointerEvents=op<.05?"none":"auto"});
    var n=Math.round(pos);if(n!==sel){sel=n;info()}}
  function loop(){raf=null;if(drag)return;var diff=target-pos;if(Math.abs(diff)<.002){pos=target;draw();if(sel!==target){sel=target;info()}return}pos+=diff*.2;draw();raf=requestAnimationFrame(loop)}
  function kick(){if(!raf)raf=requestAnimationFrame(loop)}
  function go(i){target=Math.max(0,Math.min(items.length-1,i));kick()}
  function pick(){o.onPick(items[sel].id)}
  var sx=0,sp=0,lx=0,lt=0,vel=0;
  stage.addEventListener("pointerdown",function(e){drag=true;moved=0;sx=lx=e.clientX;sp=pos;vel=0;lt=performance.now();stage.setPointerCapture(e.pointerId)});
  stage.addEventListener("pointermove",function(e){if(!drag)return;var dx=e.clientX-sx;moved=Math.max(moved,Math.abs(dx));var k=1/(cards[0].offsetWidth*.82);pos=Math.max(-.35,Math.min(items.length-.65,sp-dx*k));var t=performance.now();vel=(lx-e.clientX)*k/Math.max(1,t-lt)*16;lx=e.clientX;lt=t;draw()});
  function end(){if(!drag)return;drag=false;var v=Math.abs(vel)>.04?vel*5:0;target=Math.max(0,Math.min(items.length-1,Math.round(pos+v)));kick();setTimeout(function(){moved=0},40)}
  stage.addEventListener("pointerup",end);stage.addEventListener("pointercancel",end);
  host.querySelectorAll(".lx-nav").forEach(function(b){b.onclick=function(){go(sel+ +b.dataset.n)}});
  $(".lx-go").onclick=pick;
  stage.addEventListener("keydown",function(e){if(e.key==="ArrowRight"){go(sel+1);e.preventDefault()}else if(e.key==="ArrowLeft"){go(sel-1);e.preventDefault()}else if(e.key==="Enter"||e.key===" "){pick();e.preventDefault()}});
  tabs.forEach(function(t){t.onclick=function(){cur=+t.dataset.g;tabs.forEach(function(x,i){x.setAttribute("aria-selected",i===cur)});ind_();build()};
    t.onkeydown=function(e){var k=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;if(k){var n=(cur+k+tabs.length)%tabs.length;tabs[n].click();tabs[n].focus();e.preventDefault()}}});
  addEventListener("resize",function(){if(host.isConnected){ind_();draw()}});
  build();requestAnimationFrame(function(){ind_();draw()});
}

var STY=[["a","Carrousel","Carousel"],["b","Onglets","Tabs"],["c","Roue","Wheel"],["d","Cartes","Cards"]];
window.BLogin={styles:{a:styleA},mount:function(host,o){
  var L=o.L,st="a";try{st=localStorage.getItem("beme_style")||"c"}catch(e){}
  if(!BLogin.styles[st])st="a";
  host.innerHTML='<div class="lx-bg" aria-hidden="true"></div>'+
  '<header class="lx-h"><img src="assets/beme-orn.svg" alt="BEME"><h1>BEME KSA</h1><small>'+L("Opérations","Operations")+'</small><i class="lx-rule"></i></header>'+
  '<div class="lx-lang" role="group" aria-label="Langue / Language"><button type="button" data-lg="fr" aria-label="Français" aria-pressed="'+(o.lang==="fr")+'"><span>'+FR+'</span></button><button type="button" data-lg="en" aria-label="English" aria-pressed="'+(o.lang==="en")+'"><span>'+GB+'</span></button></div>'+
  '<div class="lx-body" data-style="'+st+'"></div>'+
  '<nav class="lx-sty" aria-label="'+L("Style d’affichage","Display style")+'"><span>'+L("Style","Style")+'</span>'+STY.filter(function(x){return BLogin.styles[x[0]]}).map(function(x){return'<button type="button" data-s="'+x[0]+'" aria-pressed="'+(x[0]===st)+'">'+L(x[1],x[2])+'</button>'}).join("")+'</nav>'+
  '<footer class="lx-f"><span>'+L("Un partenaire","A partner of")+'</span><img src="assets/img/bongard-logo.png" alt="Bongard"></footer>';
  host.querySelectorAll(".lx-lang button").forEach(function(b){b.onclick=function(){o.onLang(b.dataset.lg)}});
  host.querySelectorAll(".lx-sty button").forEach(function(b){b.onclick=function(){try{localStorage.setItem("beme_style",b.dataset.s)}catch(e){}var kb=host.querySelector(".lx-back");BLogin.mount(host,o);if(kb)host.appendChild(kb)}});
  BLogin.styles[st](host.querySelector(".lx-body"),o);
}};
})();
