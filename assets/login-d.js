(function(){
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var CHEV='<svg class="lxd-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
var BACK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
var onResize=null;
window.BLogin.styles.d=function(host,o){
  var L=o.L,groups=o.groups.filter(function(g){return g.items&&g.items.length});
  var list=[];groups.forEach(function(g,gi){g.items.forEach(function(it){list.push({it:it,g:gi})})});
  var n=list.length,ng=groups.length,sel=-1;
  host.innerHTML='<div class="lxd-wrap"><div class="lxd-wallet" role="group" aria-label="'+esc(L("Choix du profil","Profile selection"))+'"></div></div>';
  var wallet=host.querySelector(".lxd-wallet");
  var secs=groups.map(function(g,gi){var d=document.createElement("div");d.className="lxd-sec lxd-g"+gi;d.setAttribute("aria-hidden","true");d.innerHTML="<span>"+esc(g.label)+"</span>";wallet.appendChild(d);return d});
  var cards=list.map(function(e,i){
    var p=e.it,c=document.createElement("div");c.className="lxd-card lxd-g"+e.g;c.style.zIndex=i+1;
    c.innerHTML='<button type="button" class="lxd-head" aria-expanded="false" aria-label="'+esc(p.title+" — "+p.sub)+'"><span class="lxd-ic">'+p.icon+'</span><span class="lxd-tx"><span class="lxd-t">'+esc(p.title)+'</span><span class="lxd-w">'+esc(p.sub)+'</span></span>'+CHEV+'</button>'+
    '<div class="lxd-body" aria-hidden="true"><button type="button" class="lxd-back" aria-label="'+esc(L("Retour à la liste des profils","Back to profile list"))+'" tabindex="-1">'+BACK+'<span>'+L("Retour","Back")+'</span></button>'+
    '<div class="lxd-halo"><span class="lxd-glow"></span><span class="lxd-disc">'+p.icon+'</span></div><div class="lxd-role">'+esc(p.title)+'</div><div class="lxd-who">'+esc(p.sub)+'</div>'+
    '<button type="button" class="lxd-enter" tabindex="-1" aria-label="'+esc(L("Entrer","Enter")+" — "+p.title)+'">'+L("Entrer","Enter")+'</button></div>';
    var head=c.querySelector(".lxd-head"),body=c.querySelector(".lxd-body");
    head.onclick=function(){open(i)};
    head.onkeydown=function(ev){var d=ev.key==="ArrowDown"?1:ev.key==="ArrowUp"?-1:0;
      if(d){ev.preventDefault();cards[Math.max(0,Math.min(n-1,i+d))].head.focus()}
      else if(ev.key==="Home"){ev.preventDefault();cards[0].head.focus()}
      else if(ev.key==="End"){ev.preventDefault();cards[n-1].head.focus()}};
    body.onclick=function(ev){if(!ev.target.closest(".lxd-enter"))close()};
    c.querySelector(".lxd-back").onclick=function(ev){ev.stopPropagation();close()};
    c.querySelector(".lxd-enter").onclick=function(ev){ev.stopPropagation();o.onPick(p.id)};
    c.onkeydown=function(ev){if(ev.key==="Escape"&&sel>=0){ev.stopPropagation();close()}};
    wallet.appendChild(c);return{el:c,head:head,body:body}
  });
  function layout(){
    var H=wallet.clientHeight,Ls=H<420?18:22;
    wallet.classList.toggle("lxd-open",sel>=0);
    if(sel<0){
      var lastH=H<420?64:84,p=Math.floor((H-ng*Ls-lastH)/(n-1));
      if(p<36){lastH=60;p=Math.max(32,Math.floor((H-ng*Ls-lastH)/(n-1)))}
      p=Math.min(78,p);
      var total=ng*Ls+(n-1)*p+lastH,y=Math.max(0,Math.floor((H-total)/2)),ls=-1;
      cards.forEach(function(c,i){
        if(list[i].g!==ls){ls=list[i].g;secs[ls].style.height=Ls+"px";secs[ls].style.transform="translateY("+y+"px)";y+=Ls}
        c.el.style.setProperty("--p",p+"px");
        var endSec=i===n-1||list[i+1].g!==list[i].g;
        c.el.style.height=(i===n-1?lastH:endSec?p+16:p+30)+"px";
        c.el.style.transform="translateY("+y+"px)";y+=p;
        c.el.classList.remove("lxd-sel","lxd-compact");c.el.style.zIndex=i+1});
    }else{
      var others=n-1,q=Math.max(20,Math.min(34,Math.floor((H-276)/others)));
      var lastH2=q+16,stack=(others-1)*q+lastH2,Ho=Math.max(150,H-stack-10);
      wallet.style.setProperty("--m",(Ho>330?96:Ho>280?80:Ho>240?64:Ho>205?52:38)+"px");
      wallet.classList.toggle("lxd-tight",Ho<=205);
      var k=0;
      cards.forEach(function(c,i){
        if(i===sel){c.el.style.height=Ho+"px";c.el.style.transform="translateY(0px)";c.el.classList.add("lxd-sel");c.el.classList.remove("lxd-compact");c.el.style.zIndex=50}
        else{var last=k===others-1;c.el.style.setProperty("--p",q+"px");c.el.style.height=(last?lastH2:q+30)+"px";
          c.el.style.transform="translateY("+(Ho+10+k*q)+"px)";c.el.classList.add("lxd-compact");c.el.classList.remove("lxd-sel");c.el.style.zIndex=i+1;k++}});
      secs.forEach(function(s){s.style.transform="translateY(0px)"});
    }
    cards.forEach(function(c,i){var on=i===sel;c.head.setAttribute("aria-expanded",on);c.head.tabIndex=0;
      c.body.setAttribute("aria-hidden",!on);
      c.body.querySelectorAll("button").forEach(function(b){b.tabIndex=on?0:-1});
      c.body.querySelector(".lxd-halo").style.setProperty("--m",wallet.style.getPropertyValue("--m"))});
  }
  function open(i){if(i===sel)return;sel=i;layout();setTimeout(function(){if(sel===i)cards[i].body.querySelector(".lxd-enter").focus({preventScroll:true})},420)}
  function close(){if(sel<0)return;var i=sel;sel=-1;layout();cards[i].head.focus({preventScroll:true})}
  if(onResize)removeEventListener("resize",onResize);
  var rz;onResize=function(){if(!host.isConnected)return;clearTimeout(rz);rz=setTimeout(layout,60)};
  addEventListener("resize",onResize);
  cards.forEach(function(c){c.el.style.transition="none"});layout();
  requestAnimationFrame(function(){requestAnimationFrame(function(){cards.forEach(function(c){c.el.style.transition=""})})});
};
})();
