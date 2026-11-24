/* BEME KSA — entrée style C : roue de médaillons (v41) */
(function(){
var cur=0;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function styleC(host,o){
  var L=o.L,items=[];
  o.groups.forEach(function(g){g.items.forEach(function(it){items.push({id:it.id,title:it.title,sub:it.sub,icon:it.icon,group:g.label})})});
  var N=items.length;if(!N){host.innerHTML="";return}
  if(cur>=N||cur<0)cur=0;
  var STEP=360/N,rot=-cur*STEP,idx=cur,drag=null,moved=false,ready=false,tm=0;
  host.innerHTML=
  '<div class="lxc"><div class="lxc-stage"><div class="lxc-wheel">'+
    '<i class="lxc-trk" aria-hidden="true"></i><i class="lxc-trk lxc-t2" aria-hidden="true"></i>'+
    '<div class="lxc-ring" role="radiogroup" aria-label="'+esc(L("Choix du profil","Profile selection"))+'"></div>'+
    '<div class="lxc-ctr" aria-live="polite" aria-atomic="true"><div class="lxc-halo"><span class="lxc-glow"></span><span class="lxc-disc"></span></div>'+
    '<div class="lxc-swap"><div class="lxc-role"></div><div class="lxc-who"></div><div class="lxc-grp"></div></div></div>'+
  '</div></div>'+
  '<div class="lxc-act"><button type="button" class="lxc-enter">'+L("Entrer","Enter")+'</button><div class="lxc-hint">'+L("Tournez la roue · touchez le centre ou appuyez sur Entrée","Spin the wheel · tap the centre or press Enter")+'</div></div></div>';
  var $=function(s){return host.querySelector(s)};
  var stage=$(".lxc-stage"),wheel=$(".lxc-wheel"),ring=$(".lxc-ring"),swap=$(".lxc-swap");
  var els=items.map(function(p,i){
    var slot=document.createElement("div");slot.className="lxc-slot";
    var arm=document.createElement("div");arm.className="lxc-arm";
    var b=document.createElement("button");b.type="button";b.className="lxc-med";b.setAttribute("role","radio");
    b.setAttribute("aria-label",p.title+" — "+p.sub);
    b.innerHTML=p.icon+'<span class="lxc-lbl">'+esc(p.title)+'</span>';
    b.addEventListener("click",function(){if(moved)return;if(i===idx)pick();else go(i)});
    b.addEventListener("keydown",function(e){
      var d={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];
      if(d){e.preventDefault();go(idx+d,true)}
      else if(e.key==="Home"){e.preventDefault();go(0,true)}
      else if(e.key==="End"){e.preventDefault();go(N-1,true)}});
    arm.appendChild(b);slot.appendChild(arm);ring.appendChild(slot);return{slot:slot,arm:arm,b:b}});
  function pick(){o.onPick(items[idx].id)}
  $(".lxc-enter").onclick=pick;
  var ctr=$(".lxc-ctr");if(ctr){ctr.style.pointerEvents="auto";ctr.style.cursor="pointer";ctr.setAttribute("role","button");ctr.setAttribute("aria-label",L("Entrer avec ce profil","Enter with this profile"));ctr.addEventListener("click",function(){if(!moved)pick()})}
  var onKey=function(e){if(!host.isConnected){document.removeEventListener("keydown",onKey);return}if(e.key!=="Enter"||e.defaultPrevented)return;var t=e.target&&e.target.tagName;if(t==="BUTTON"||t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||t==="A")return;e.preventDefault();pick()};
  document.addEventListener("keydown",onKey);
  function size(){
    var w=stage.clientWidth,h=stage.clientHeight;
    var S=Math.max(220,Math.min(w-20,h-14,400));
    var med=Math.max(44,Math.min(56,Math.round(S*.17)));
    wheel.style.setProperty("--S",S+"px");wheel.style.setProperty("--med",med+"px");
    return med}
  function radius(){return ring.offsetWidth/2-els[0].b.offsetWidth/2-2}
  function place(rot){
    var r=radius();
    els.forEach(function(it,i){
      var w=((i*STEP+rot)%360+540)%360-180;it.w=w;
      it.slot.style.transform="rotate("+(w-rot)+"deg)";
      it.arm.style.transform="translateY("+(-r)+"px) rotate("+(-w)+"deg)"})}
  function layout(){
    ring.style.transform="rotate("+rot+"deg)";place(rot);
    els.forEach(function(it,i){var act=i===idx;
      it.b.style.transform=act?"scale(1.16)":"scale("+(1-Math.min(Math.abs(it.w),120)/700).toFixed(3)+")";
      it.b.setAttribute("aria-checked",act);it.b.tabIndex=act?0:-1})}
  function setText(first){
    var p=items[idx];
    var apply=function(){$(".lxc-disc").innerHTML=p.icon;$(".lxc-role").textContent=p.title;$(".lxc-who").textContent=p.sub;$(".lxc-grp").textContent=p.group;swap.classList.remove("out")};
    clearTimeout(tm);
    if(first||!ready){apply();return}
    swap.classList.add("out");tm=setTimeout(apply,200)}
  function go(i,focus){
    var t=((i%N)+N)%N,d=t-idx;
    if(d>N/2)d-=N;if(d<-N/2)d+=N;
    idx=t;cur=t;rot-=d*STEP;layout();setText();
    if(focus)els[idx].b.focus({preventScroll:true})}
  function ang(e){var c=ring.getBoundingClientRect();return Math.atan2(e.clientY-(c.top+c.height/2),e.clientX-(c.left+c.width/2))*180/Math.PI}
  wheel.addEventListener("pointerdown",function(e){if(e.button>0)return;drag={a:ang(e),rot0:rot,x:e.clientX,y:e.clientY,id:e.pointerId};moved=false});
  wheel.addEventListener("pointermove",function(e){
    if(!drag)return;
    if(!moved){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8)return;moved=true;wheel.classList.add("drag");try{wheel.setPointerCapture(drag.id)}catch(x){}}
    var d=ang(e)-drag.a;if(d>180)d-=360;if(d<-180)d+=360;
    rot=drag.rot0+d;ring.style.transform="rotate("+rot+"deg)";place(rot);
    var t=(((Math.round(-rot/STEP))%N)+N)%N;
    if(t!==idx){idx=t;cur=t;els.forEach(function(it,i){it.b.setAttribute("aria-checked",i===idx);it.b.style.transform=i===idx?"scale(1.16)":""});setText()}});
  function end(){
    if(!drag)return;var was=moved;drag=null;wheel.classList.remove("drag");
    if(was){var n=Math.round(-rot/STEP);rot=-n*STEP;idx=((n%N)+N)%N;cur=idx;layout();setText()}
    setTimeout(function(){moved=false},0)}
  wheel.addEventListener("pointerup",end);wheel.addEventListener("pointercancel",end);
  wheel.addEventListener("wheel",function(e){if(Math.abs(e.deltaX)+Math.abs(e.deltaY)<12)return;e.preventDefault();
    if(wheel._w)return;wheel._w=1;setTimeout(function(){wheel._w=0},350);go(idx+((e.deltaY+e.deltaX)>0?1:-1))},{passive:false});
  function relayout(){if(!host.isConnected)return;size();layout()}
  if(window.ResizeObserver)new ResizeObserver(relayout).observe(stage);else addEventListener("resize",relayout);
  size();els.forEach(function(it){it.arm.style.transition="none"});
  setText(true);layout();
  requestAnimationFrame(function(){requestAnimationFrame(function(){els.forEach(function(it){it.arm.style.transition=""});ready=true;relayout()})});
}
if(window.BLogin&&BLogin.styles)BLogin.styles.c=styleC;
})();
