function Btn(props) {
  var children=props.children, onClick=props.onClick, variant=props.variant||"primary";
  var small=props.small, disabled=props.disabled, full=props.full, C=props.C, xStyle=props.style||{};
  var styles={
    primary:{background:C.brown,color:"#fff"},
    outline:{background:"transparent",color:C.brown,border:"2px solid "+C.brown},
    ghost:{background:C.peach,color:C.brownDark},
    danger:{background:C.red,color:"#fff"},
    success:{background:C.green,color:"#fff"},
    warning:{background:C.yellow,color:"#fff"},
    purple:{background:C.purple,color:"#fff"}
  };
  var base=styles[variant]||styles.primary;
  var pad=small?"8px 14px":"12px 22px";
  var fz=small?12:14;
  return (
    <button disabled={disabled} onClick={onClick} style={Object.assign({},base,{padding:pad,fontSize:fz,opacity:disabled?0.5:1,width:full?"100%":undefined,borderRadius:10},xStyle)}>{children}</button>
  );
}
function Card(props) {
  var C=props.C, xStyle=props.style||{};
  return (
    <div onClick={props.onClick} style={Object.assign({background:C.surface,borderRadius:16,border:"1px solid "+C.border,padding:20},xStyle)}>{props.children}</div>
  );
}
function Field(props) {
  var C=props.C;
  return (
    <div style={{marginBottom:14}}>
      <label style={{color:C.brownDark}}>{props.label}</label>
      {props.children}
      {props.error&&<div style={{color:C.red,fontSize:12,marginTop:4,fontWeight:600}}>{"⚠ "+props.error}</div>}
    </div>
  );
}
function StatCard(props) {
  var C=props.C;
  return (
    <div style={{background:C.surface,borderRadius:16,border:"1px solid "+C.border,padding:16,display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:46,height:46,borderRadius:14,background:props.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{props.icon}</div>
      <div>
        <div style={{fontSize:22,fontWeight:800,color:props.color}}>{props.value}</div>
        <div style={{fontSize:12,color:C.textMid}}>{props.label}</div>
      </div>
    </div>
  );
}
function Modal(props) {
  var C=props.C;
  function handleBg(e){ if(e.target===e.currentTarget) props.onClose(); }
  return (
    <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={handleBg}>
      <div style={{background:C.cream,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:580,maxHeight:"93vh",overflowY:"auto",padding:"18px 20px 36px",boxShadow:"0 -8px 40px #00000044",animation:"slideUp .25s ease"}}>
        <div style={{width:40,height:4,background:C.border,borderRadius:4,margin:"0 auto 16px"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <h3 style={{fontFamily:"'Playfair Display', serif",fontSize:19,color:C.brownDark}}>{props.title}</h3>
          <button onClick={props.onClose} style={{background:C.peach,border:"none",borderRadius:50,width:32,height:32,fontSize:18,cursor:"pointer",color:C.brown}}>x</button>
        </div>
        {props.children}
      </div>
    </div>
  );
}
function Badge(props) {
  var map={"Consulta":{bg:"#E8F4F8",c:"#4A9AB5",i:"🩺"},"Vacunación":{bg:"#EAF4EB",c:"#4A8F4E",i:"💉"},"Cirugía":{bg:"#FDEAEA",c:"#C05050",i:"🔬"},"Urgencia":{bg:"#FFF3E0",c:"#B05A00",i:"🚨"},"Control":{bg:"#F9E4CC",c:"#8B5230",i:"📋"}};
  var s=map[props.type]||map["Control"];
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{s.i+" "+props.type}</span>;
}
function StatusBadge(props) {
  var C=props.C;
  var m={confirmed:{bg:C.greenLight,c:C.green,l:"✅ Confirmada"},pending:{bg:C.yellowLight,c:C.yellow,l:"⏳ Pendiente"},cancelled:{bg:C.redLight,c:C.red,l:"❌ Cancelada"},attended:{bg:C.greenLight,c:C.green,l:"✔ Atendida"},absent:{bg:C.redLight,c:C.red,l:"No asistió"},requested:{bg:C.purpleLight,c:C.purple,l:"Solicitada"}};
  var s=m[props.status]||m.pending;
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{s.l}</span>;
}
function PetAvatar(props) {
  var size=props.size||56, C=props.C, r=size<80?12:18;
  if(props.photo) return <img src={props.photo} alt="pet" style={{width:size,height:size,borderRadius:r,objectFit:"cover",flexShrink:0,border:"2px solid "+C.border}}/>;
  return <div style={{width:size,height:size,borderRadius:r,background:C.tan,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.48,flexShrink:0,border:"2px solid "+C.border}}>{props.avatar||"🐾"}</div>;
}
function Toast(props) {
  var C=props.C;
  return (
    <div style={{position:"fixed",top:70,right:16,zIndex:500,display:"flex",flexDirection:"column",gap:8,maxWidth:300,pointerEvents:"none"}}>
      {props.toasts.map(function(t){
        var bg=t.type==="error"?C.redLight:t.type==="warning"?C.yellowLight:C.greenLight;
        var cl=t.type==="error"?C.red:t.type==="warning"?C.yellow:C.green;
        return <div key={t.id} style={{background:bg,border:"1px solid "+cl,color:cl,borderRadius:12,padding:"10px 14px",fontSize:13,fontWeight:600,animation:"slideUp .2s ease"}}>{t.msg}</div>;
      })}
    </div>
  );
}
function PasswordField(props) {
  var C=props.C;
  var s=useState(false); var show=s[0]; var setShow=s[1];
  return (
    <Field label={props.label} error={props.error} C={C}>
      <div style={{position:"relative"}}>
        <input type={show?"text":"password"} placeholder="..." value={props.value} onChange={props.onChange} className={props.error?"err":""} style={{paddingRight:44}}/>
        <button type="button" onClick={function(){setShow(function(v){return !v;});}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.textMid,padding:4}}>{show?"🙈":"👁"}</button>
      </div>
    </Field>
  );
}
function BreedSelect(props) {
  var list=BREEDS[props.species]||BREEDS.Otro;
  return (
    <div>
      <input value={props.value} onChange={function(e){props.onChange(e.target.value);}} placeholder="Buscar raza..." list={"bl-"+props.species}/>
      <datalist id={"bl-"+props.species}>{list.map(function(b){return <option key={b} value={b}/>;})}</datalist>
    </div>
  );
}
function NotifBell(props) {
  var C=props.C;
  var s1=useState(false); var open=s1[0]; var setOpen=s1[1];
  var mine=useMemo(function(){ return props.notifications.filter(function(n){return n.toId===props.userId;}).sort(function(a,b){return b.ts-a.ts;}); },[props.notifications,props.userId]);
  var unread=useMemo(function(){ return mine.filter(function(n){return !n.read;}).length; },[mine]);
  function handleClick(n){ props.onMarkRead([n.id]); if(n.actionId){ props.onNotifAction(n); setOpen(false); } }
  return (
    <div style={{position:"relative"}}>
      <button onClick={function(){setOpen(function(o){return !o;});}} style={{background:"transparent",border:"none",fontSize:22,position:"relative",padding:4,color:C.navIcon}}>
        {"🔔"}
        {unread>0&&<span style={{position:"absolute",top:-2,right:-2,background:C.red,color:"#fff",borderRadius:50,width:18,height:18,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread>9?"9+":unread}</span>}
      </button>
      {open&&<div style={{position:"fixed",inset:0,zIndex:198}} onClick={function(){setOpen(false);}}/>}
      {open&&(
        <div style={{position:"absolute",right:0,top:40,background:C.surface,border:"1px solid "+C.border,borderRadius:14,width:300,maxHeight:400,overflowY:"auto",zIndex:199,boxShadow:"0 8px 32px #0003",animation:"fadeIn .15s ease"}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:800,fontSize:14,color:C.brownDark}}>Notificaciones</span>
            {unread>0&&<button onClick={function(){props.onMarkRead(mine.filter(function(n){return !n.read;}).map(function(n){return n.id;}));}} style={{background:"none",border:"none",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer"}}>Leer todas</button>}
          </div>
          {mine.length===0?<p style={{padding:20,textAlign:"center",color:C.textLight,fontSize:13}}>Sin notificaciones</p>
            :mine.slice(0,25).map(function(n){
              return (
                <div key={n.id} onClick={function(){handleClick(n);}} style={{padding:"10px 14px",borderBottom:"1px solid "+C.border,background:n.read?"transparent":C.peach,cursor:"pointer"}}>
                  <div style={{fontSize:13,color:C.text,fontWeight:n.read?400:700}}>{n.icon+" "+n.msg}</div>
                  {n.actionId&&!n.read&&<div style={{fontSize:11,color:C.blue,fontWeight:700,marginTop:2}}>Toca para responder</div>}
                  <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{new Date(n.ts).toLocaleDateString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

function NavIcon(props) {
  var icon=props.icon, active=props.active, C=props.C;
  if(icon==="🐾") {
    return (
      <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="18" rx="6" ry="9" fill={active?"#fff":"rgba(255,255,255,0.7)"}/>
        <ellipse cx="28" cy="10" rx="6" ry="9" fill={active?"#fff":"rgba(255,255,255,0.7)"}/>
        <ellipse cx="44" cy="10" rx="6" ry="9" fill={active?"#fff":"rgba(255,255,255,0.7)"}/>
        <ellipse cx="56" cy="18" rx="6" ry="9" fill={active?"#fff":"rgba(255,255,255,0.7)"}/>
        <path d="M32 24 C18 24 10 34 12 46 C14 56 22 58 32 58 C42 58 50 56 52 46 C54 34 46 24 32 24Z" fill={active?"#fff":"rgba(255,255,255,0.7)"}/>
      </svg>
    );
  }
  return <span style={{fontSize:18}}>{icon}</span>;
}
var sFlexCenter={display:"flex",alignItems:"center"};
var sFlexBetween={display:"flex",alignItems:"center",justifyContent:"space-between"};
function sBtnIcon(C,color,bg,size){
  size=size||32;
  return {width:size,height:size,borderRadius:10,background:bg,border:"1px solid "+color,color:color,fontSize:size>32?14:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0};
}