function fullName(u) { if(!u) return "—"; if(u.firstName && u.lastName) return u.firstName+" "+u.lastName; return u.firstName||u.lastName||u.name||"—"; }
function fmtDate(iso) { if(!iso) return "—"; var p=iso.split("-"); return p[2]+"-"+p[1]+"-"+p[0]; }
function today() { return new Date().toISOString().slice(0,10); }
function genId() { return Math.random().toString(36).slice(2,10); }
function toBase64(f) { return new Promise(function(r,j){ var fr=new FileReader(); fr.onload=function(){r(fr.result);}; fr.onerror=j; fr.readAsDataURL(f); }); }
function calcAge(dob) {
  if(!dob) return null;
  var mo=(new Date().getFullYear()-new Date(dob).getFullYear())*12+new Date().getMonth()-new Date(dob).getMonth();
  if(mo<1) return "recién nacido";
  if(mo<12) return mo+" mes"+(mo>1?"es":"");
  var y=Math.floor(mo/12), m=mo%12;
  return m>0 ? y+" año"+(y>1?"s":"")+" y "+m+" mes"+(m>1?"es":"") : y+" año"+(y>1?"s":"");
}
function sanitizePhone(v) { return v.replace(/\D/g,"").slice(0,9); }
function validateDoc(type,num) {
  if(!num) return "Numero obligatorio.";
  if(type==="DNI") { if(!/^\d{8}$/.test(num)) return "DNI: 8 digitos exactos."; }
  else { if(!/^[A-Z]\d{8}$/.test(num)) return "Formato: letra + 8 digitos."; }
  return "";
}
var TIME_SLOTS = [];
for(var _h=8;_h<19;_h++) { for(var _m=0;_m<60;_m+=30) { TIME_SLOTS.push((_h<10?"0":"")+_h+":"+(_m===0?"00":"30")); } }
function useDark() {
  var mq = typeof window!=="undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : {matches:false};
  var d=useState(mq.matches);
  var dark=d[0], setDark=d[1];
  useEffect(function(){
    var handler=function(e){ setDark(e.matches); };
    mq.addEventListener("change",handler);
    return function(){ mq.removeEventListener("change",handler); };
  },[]);
  return dark;
}
function useIsMobile() {
  var s=useState(window.innerWidth<720);
  var mob=s[0], setMob=s[1];
  useEffect(function(){
    var h=function(){ setMob(window.innerWidth<720); };
    window.addEventListener("resize",h);
    return function(){ window.removeEventListener("resize",h); };
  },[]);
  return mob;
}
function useToast() {
  var s=useState([]); var toasts=s[0]; var setToasts=s[1];
  var push=useCallback(function(msg,type){
    type=type||"success";
    var id=genId();
    setToasts(function(t){ return t.concat([{id:id,msg:msg,type:type}]); });
    setTimeout(function(){ setToasts(function(t){ return t.filter(function(x){ return x.id!==id; }); }); },3800);
  },[]);
  return {toasts:toasts,push:push};
}
var useState=React.useState,useEffect=React.useEffect,useCallback=React.useCallback,useMemo=React.useMemo;