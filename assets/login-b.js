/* BEME KSA — style B : onglets + cartes de membre */
(function(){
var cur=0;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var ARR='<svg class="lxb-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
window.BLogin.styles.b=function(host,o){
  var L=o.L,groups=o.groups.filter(function(g){return g.items&&g.items.length}),N=groups.length;
  if(cur>=N)cur=0;
  host.innerHTML='<div class="lxb">'+
   '<div class="lxb-tabs" role="tablist" aria-label="'+L("Catégories","Categories")+'" style="--n:'+N+'"><span class="lxb-ind" aria-hidden="true"></span>'+
   groups.map(function(g,i){return'<button type="button" class="lxb-tab" role="tab" id="lxbt'+i+'" aria-controls="lxbp'+i+'" aria-selected="'+(i===cur)+'" tabindex="'+(i===cur?0:-1)+'">'+esc(g.label)+'</button>'}).join("")+'</div>'+
   '<div class="lxb-view"><div class="lxb-track" style="width:'+N*100+'%">'+
   groups.map(function(g,i){return'<section class="lxb-panel" role="tabpanel" id="lxbp'+i+'" aria-labelledby="lxbt'+i+'" style="width:'+100/N+'%">'+
     g.items.map(function(p,n){return'<button type="button" class="lxb-card" data-id="'+esc(p.id)+'" style="--k:'+n+'" aria-label="'+esc(p.title+" — "+p.sub)+'"><span class="lxb-med" aria-hidden="true">'+p.icon+'</span><span class="lxb-txt"><b>'+esc(p.title)+'</b><i></i><em>'+esc(p.sub)+'</em></span>'+ARR+'</button>'}).join("")+'</section>'}).join("")+
   '</div></div>'+
   '<div class="lxb-dots" aria-hidden="true">'+groups.map(function(){return'<b></b>'}).join("")+'</div></div>';
  var root=host.querySelector(".lxb"),tabs=[].slice.call(host.querySelectorAll(".lxb-tab")),panels=[].slice.call(host.querySelectorAll(".lxb-panel")),
      dots=[].slice.call(host.querySelectorAll(".lxb-dots b")),track=host.querySelector(".lxb-track"),view=host.querySelector(".lxb-view"),tabbar=host.querySelector(".lxb-tabs");
  function show(i,noAnim){
    cur=Math.max(0,Math.min(N-1,i));
    root.style.setProperty("--i",cur);
    tabs.forEach(function(t,j){t.setAttribute("aria-selected",j===cur);t.tabIndex=j===cur?0:-1});
    dots.forEach(function(d,j){d.classList.toggle("on",j===cur)});
    panels.forEach(function(p,j){p.classList.remove("in");p.classList.toggle("on",j===cur);if(j===cur){p.removeAttribute("aria-hidden")}else p.setAttribute("aria-hidden","true");
      if(j===cur&&!noAnim){void p.offsetWidth;p.classList.add("in")}});
    if(noAnim)panels[cur].classList.add("in","still");
  }
  tabs.forEach(function(t,i){
    t.onclick=function(){show(i)};
    t.onkeydown=function(e){var n=null;
      if(e.key==="ArrowRight")n=(i+1)%N;else if(e.key==="ArrowLeft")n=(i-1+N)%N;else if(e.key==="Home")n=0;else if(e.key==="End")n=N-1;
      if(n!==null){e.preventDefault();show(n);tabs[n].focus()}}});
  host.querySelectorAll(".lxb-card").forEach(function(c){c.onclick=function(){if(moved>8)return;o.onPick(c.dataset.id)}});
  /* swipe entre onglets */
  var sx=0,sy=0,dx=0,dr=false,lock=null,moved=0;
  view.addEventListener("pointerdown",function(e){if(e.pointerType==="mouse"&&e.button)return;sx=e.clientX;sy=e.clientY;dx=0;moved=0;dr=true;lock=null});
  view.addEventListener("pointermove",function(e){if(!dr)return;var x=e.clientX-sx,y=e.clientY-sy;
    if(lock===null&&(Math.abs(x)>8||Math.abs(y)>8))lock=Math.abs(x)>Math.abs(y);
    if(lock){dx=x;moved=Math.abs(x);track.classList.add("drag");var edge=(cur===0&&dx>0)||(cur===N-1&&dx<0);
      track.style.transform="translateX("+(-cur*view.clientWidth+dx*(edge?.3:1))+"px)"}});
  function end(){if(!dr)return;dr=false;track.classList.remove("drag");track.style.transform="";
    if(lock&&Math.abs(dx)>50)show(cur+(dx<0?1:-1));setTimeout(function(){moved=0},60)}
  view.addEventListener("pointerup",end);view.addEventListener("pointercancel",end);
  show(cur,true);
};
})();
