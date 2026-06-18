
// ============================================================
// COMPONENTES PRIMITIVOS - Btn, Card, Field, Modal, Badge...
// ============================================================

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
    React.createElement('button', { disabled: disabled, onClick: onClick, style: Object.assign({},base,{padding:pad,fontSize:fz,opacity:disabled?0.5:1,width:full?"100%":undefined,borderRadius:10},xStyle),}, children)
  );
}
function Card(props) {
  var C=props.C, xStyle=props.style||{};
  return (
    React.createElement('div', { onClick: props.onClick, style: Object.assign({background:C.surface,borderRadius:16,border:"1px solid "+C.border,padding:20},xStyle),}, props.children)
  );
}
function Field(props) {
  var C=props.C;
  return (
    React.createElement('div', { style: {marginBottom:14},}
      , React.createElement('label', { style: {color:C.brownDark},}, props.label)
      , props.children
      , props.error&&React.createElement('div', { style: {color:C.red,fontSize:12,marginTop:4,fontWeight:600},}, "⚠ "+props.error)
    )
  );
}
function StatCard(props) {
  var C=props.C;
  return (
    React.createElement('div', { style: {background:C.surface,borderRadius:16,border:"1px solid "+C.border,padding:16,display:"flex",alignItems:"center",gap:14},}
      , React.createElement('div', { style: {width:46,height:46,borderRadius:14,background:props.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0},}, props.icon)
      , React.createElement('div', null
        , React.createElement('div', { style: {fontSize:22,fontWeight:800,color:props.color},}, props.value)
        , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, props.label)
      )
    )
  );
}
function Modal(props) {
  var C=props.C;
  function handleBg(e){ if(e.target===e.currentTarget) props.onClose(); }
  return (
    React.createElement('div', { style: {position:"fixed",inset:0,background:"#00000088",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}, onClick: handleBg,}
      , React.createElement('div', { style: {background:C.cream,borderRadius:20,width:"100%",maxWidth:580,maxHeight:"90vh",overflowY:"auto",padding:"24px 24px 28px",boxShadow:"0 20px 60px #00000044",animation:"slideUp .25s ease"},}

        , React.createElement('div', { style: {display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},}
          , React.createElement('h3', { style: {fontFamily:"'Playfair Display', serif",fontSize:19,color:C.brownDark},}, props.title)
          , React.createElement('button', { onClick: props.onClose, style: {background:C.peach,border:"none",borderRadius:50,width:32,height:32,fontSize:18,cursor:"pointer",color:C.brown},}, "x")
        )
        , props.children
      )
    )
  );
}
function Badge(props) {
  var map={"Consulta":{bg:"#E8F4F8",c:"#4A9AB5",i:"🩺"},"Vacunación":{bg:"#EAF4EB",c:"#4A8F4E",i:"💉"},"Cirugía":{bg:"#FDEAEA",c:"#C05050",i:"🔬"},"Urgencia":{bg:"#FFF3E0",c:"#B05A00",i:"🚨"},"Control":{bg:"#F9E4CC",c:"#8B5230",i:"📋"}};
  var s=map[props.type]||map["Control"];
  return React.createElement('span', { style: {background:s.bg,color:s.c,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"},}, s.i+" "+props.type);
}
function StatusBadge(props) {
  var C=props.C;
  var m={confirmed:{bg:C.greenLight,c:C.green,l:"✅ Confirmada"},pending:{bg:C.yellowLight,c:C.yellow,l:"⏳ Pendiente"},cancelled:{bg:C.redLight,c:C.red,l:"❌ Cancelada"},attended:{bg:C.greenLight,c:C.green,l:"✔ Atendida"},absent:{bg:C.redLight,c:C.red,l:"No asistió"},requested:{bg:C.purpleLight,c:C.purple,l:"Solicitada"}};
  var s=m[props.status]||m.pending;
  return React.createElement('span', { style: {background:s.bg,color:s.c,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,whiteSpace:"nowrap"},}, s.l);
}
function PetAvatar(props) {
  var size=props.size||56, C=props.C, r=size<80?12:18;
  if(props.photo) return React.createElement('img', { src: props.photo, alt: "pet", style: {width:size,height:size,borderRadius:r,objectFit:"cover",flexShrink:0,border:"2px solid "+C.border},});
  return React.createElement('div', { style: {width:size,height:size,borderRadius:r,background:C.tan,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.48,flexShrink:0,border:"2px solid "+C.border},}, props.avatar||"🐾");
}
function Toast(props) {
  var C=props.C;
  return (
    React.createElement('div', { style: {position:"fixed",top:70,right:16,zIndex:500,display:"flex",flexDirection:"column",gap:8,maxWidth:300,pointerEvents:"none"},}
      , props.toasts.map(function(t){
        var bg=t.type==="error"?C.redLight:t.type==="warning"?C.yellowLight:C.greenLight;
        var cl=t.type==="error"?C.red:t.type==="warning"?C.yellow:C.green;
        return React.createElement('div', { key: t.id, style: {background:bg,border:"1px solid "+cl,color:cl,borderRadius:12,padding:"10px 14px",fontSize:13,fontWeight:600,animation:"slideUp .2s ease"},}, t.msg);
      })
    )
  );
}
function PasswordField(props) {
  var C=props.C;
  var s=useState(false); var show=s[0]; var setShow=s[1];
  return (
    React.createElement(Field, { label: props.label, error: props.error, C: C,}
      , React.createElement('div', { style: {position:"relative"},}
        , React.createElement('input', { type: show?"text":"password", placeholder: "...", value: props.value, onChange: props.onChange, className: props.error?"err":"", style: {paddingRight:44},})
        , React.createElement('button', { type: "button", onClick: function(){setShow(function(v){return !v;});}, style: {position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.textMid,padding:4},}, show?"🙈":"👁")
      )
    )
  );
}
function BreedSelect(props) {
  var list=BREEDS[props.species]||BREEDS.Otro;
  return (
    React.createElement('div', null
      , React.createElement('input', { value: props.value, onChange: function(e){props.onChange(e.target.value);}, placeholder: "Buscar raza..." , list: "bl-"+props.species,})
      , React.createElement('datalist', { id: "bl-"+props.species,}, list.map(function(b){return React.createElement('option', { key: b, value: b,});}))
    )
  );
}
function NotifBell(props) {
  var C=props.C;
  var s1=useState(false); var open=s1[0]; var setOpen=s1[1];
  var mine=useMemo(function(){ return props.notifications.filter(function(n){return n.toId===props.userId;}).sort(function(a,b){return b.ts-a.ts;}); },[props.notifications,props.userId]);
  var unread=useMemo(function(){ return mine.filter(function(n){return !n.read;}).length; },[mine]);
  function handleClick(n){ props.onMarkRead([n.id]); if(n.actionId){ props.onNotifAction(n); setOpen(false); } }
  return (
    React.createElement('div', { style: {position:"relative"},}
      , React.createElement('button', { onClick: function(){setOpen(function(o){return !o;});}, style: {background:"transparent",border:"none",fontSize:22,position:"relative",padding:4,color:C.navIcon},}
        , "🔔"
        , unread>0&&React.createElement('span', { style: {position:"absolute",top:-2,right:-2,background:C.red,color:"#fff",borderRadius:50,width:18,height:18,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"},}, unread>9?"9+":unread)
      )
      , open&&React.createElement('div', { style: {position:"fixed",inset:0,zIndex:198}, onClick: function(){setOpen(false);},})
      , open&&(
        React.createElement('div', { style: {position:"absolute",right:0,top:40,background:C.surface,border:"1px solid "+C.border,borderRadius:14,width:320,maxHeight:480,overflowY:"auto",zIndex:199,boxShadow:"0 8px 32px #0003",animation:"fadeIn .15s ease"},}
          , React.createElement('div', { style: {padding:"12px 16px",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center"},}
            , React.createElement('span', { style: {fontWeight:800,fontSize:14,color:C.brownDark},}, "Notificaciones"+(unread>0?" ("+unread+" nuevas)":""))
            , unread>0&&React.createElement('button', { onClick: function(){props.onMarkRead(mine.filter(function(n){return !n.read;}).map(function(n){return n.id;}));}, style: {background:"none",border:"none",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer"},}, "Leer todas" )
          )
          , mine.length===0
            ?React.createElement('p', { style: {padding:20,textAlign:"center",color:C.textLight,fontSize:13},}, "Sin notificaciones" )
            :(function(){
              var unreadNotifs=mine.filter(function(n){return !n.read;});
              var readNotifs=mine.filter(function(n){return n.read;});
              var showUnread=unreadNotifs.slice(0,3);
              var hasMoreUnread=unreadNotifs.length>3;
              return (
                React.createElement('div', null
                  , showUnread.length>0&&React.createElement('div', { style: {padding:"6px 14px",fontSize:10,fontWeight:800,color:C.textLight,letterSpacing:1,background:C.peach},}, "SIN LEER")
                  , showUnread.map(function(n){
                    return (
                      React.createElement('div', { key: n.id, onClick: function(){handleClick(n);}, style: {padding:"10px 14px",borderBottom:"1px solid "+C.border,background:C.peach,cursor:"pointer"},}
                        , React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:700},}, n.icon+" "+n.msg)
                        , n.actionId&&React.createElement('div', { style: {fontSize:11,color:C.blue,fontWeight:700,marginTop:2},}, "Toca para responder"  )
                        , React.createElement('div', { style: {fontSize:11,color:C.textLight,marginTop:2},}, new Date(n.ts).toLocaleDateString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}))
                      )
                    );
                  })
                  , hasMoreUnread&&(
                    React.createElement('div', { style: {padding:"8px 14px",textAlign:"center",borderBottom:"1px solid "+C.border,background:C.peach},}
                      , React.createElement('span', { style: {fontSize:12,color:C.brown,fontWeight:700},}, "+"+(unreadNotifs.length-3)+" notificaciones sin leer más")
                    )
                  )
                  , readNotifs.length>0&&(
                    React.createElement('div', null
                      , React.createElement('div', { style: {padding:"6px 14px",fontSize:10,fontWeight:800,color:C.textLight,letterSpacing:1,background:C.cream,borderTop:"1px solid "+C.border},}, "LEÍDAS")
                      , readNotifs.slice(0,10).map(function(n){
                        return (
                          React.createElement('div', { key: n.id, onClick: function(){handleClick(n);}, style: {padding:"10px 14px",borderBottom:"1px solid "+C.border,opacity:0.7,cursor:"pointer"},}
                            , React.createElement('div', { style: {fontSize:12,color:C.textMid,fontWeight:400},}, n.icon+" "+n.msg)
                            , React.createElement('div', { style: {fontSize:11,color:C.textLight,marginTop:2},}, new Date(n.ts).toLocaleDateString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}))
                          )
                        );
                      })
                      , readNotifs.length>10&&React.createElement('div', { style: {padding:"8px 14px",textAlign:"center",fontSize:12,color:C.textLight},}, "...y "+(readNotifs.length-10)+" más")
                    )
                  )
                )
              );
            })()
          
          , React.createElement('div', { style: {padding:"10px 14px",borderTop:"1px solid "+C.border,textAlign:"center"},}
            , React.createElement('button', { onClick: function(){props.onMarkRead(mine.filter(function(n){return !n.read;}).map(function(n){return n.id;}));setOpen(false);}, style: {background:"none",border:"none",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer",width:"100%"},}, "✓ Marcar todas como leídas")
          )
        )
      )
    )
  );
}

function NavIcon(props) {
  var icon=props.icon, active=props.active, C=props.C;
  if(icon==="🐾") {
    return (
      React.createElement('svg', { width: "22", height: "22", viewBox: "0 0 64 64"   , fill: "none", xmlns: "http://www.w3.org/2000/svg",}
        , React.createElement('ellipse', { cx: "12", cy: "18", rx: "6", ry: "9", fill: active?"#fff":"rgba(255,255,255,0.7)",})
        , React.createElement('ellipse', { cx: "28", cy: "10", rx: "6", ry: "9", fill: active?"#fff":"rgba(255,255,255,0.7)",})
        , React.createElement('ellipse', { cx: "44", cy: "10", rx: "6", ry: "9", fill: active?"#fff":"rgba(255,255,255,0.7)",})
        , React.createElement('ellipse', { cx: "56", cy: "18", rx: "6", ry: "9", fill: active?"#fff":"rgba(255,255,255,0.7)",})
        , React.createElement('path', { d: "M32 24 C18 24 10 34 12 46 C14 56 22 58 32 58 C42 58 50 56 52 46 C54 34 46 24 32 24Z"                         , fill: active?"#fff":"rgba(255,255,255,0.7)",})
      )
    );
  }
  return React.createElement('span', { style: {fontSize:18},}, icon);
}
var sFlexCenter={display:"flex",alignItems:"center"};
var sFlexBetween={display:"flex",alignItems:"center",justifyContent:"space-between"};
function sBtnIcon(C,color,bg,size){
  size=size||32;
  return {width:size,height:size,borderRadius:10,background:bg,border:"1px solid "+color,color:color,fontSize:size>32?14:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0};
}

// ============================================================
// LAYOUT - Shell (nav) + AuthScreen
// ============================================================

function ChangePasswordModal(props) {
  var user=props.user, C=props.C;
  var s1=useState(""); var current=s1[0]; var setCurrent=s1[1];
  var s2=useState(""); var newPass=s2[0]; var setNewPass=s2[1];
  var s3=useState(""); var confirm=s3[0]; var setConfirm=s3[1];
  var s4=useState({}); var errors=s4[0]; var setErrors=s4[1];
  var s5=useState(false); var loading=s5[0]; var setLoading=s5[1];

  function validate(){
    var e={};
    if(!current) e.current="Ingresa tu contraseña actual.";
    else if(current!==user.password) e.current="Contraseña actual incorrecta.";
    if(!newPass||newPass.length<4) e.newPass="Mínimo 4 caracteres.";
    if(newPass!==confirm) e.confirm="Las contraseñas no coinciden.";
    return e;
  }

  async function submit(){
    var e=validate(); if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    await props.onSave(newPass);
    setLoading(false);
  }

  return (
    React.createElement(Modal, { title: "Cambiar contraseña" , onClose: props.onClose, C: C,}
      , React.createElement('div', { style: {background:C.peach,borderRadius:12,padding:"12px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center"},}
        , React.createElement('div', { style: {fontSize:32},}, "🔒")
        , React.createElement('div', null
          , React.createElement('div', { style: {fontWeight:700,color:C.brownDark},}, user.firstName+" "+user.lastName)
          , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, user.email)
        )
      )
      , React.createElement(PasswordField, { label: "Contraseña actual" , value: current, onChange: function(e){setCurrent(e.target.value);setErrors(function(er){return Object.assign({},er,{current:""});});}, error: errors.current, C: C,})
      , React.createElement(PasswordField, { label: "Nueva contraseña" , value: newPass, onChange: function(e){setNewPass(e.target.value);setErrors(function(er){return Object.assign({},er,{newPass:""});});}, error: errors.newPass, C: C,})
      , React.createElement(PasswordField, { label: "Confirmar nueva contraseña"  , value: confirm, onChange: function(e){setConfirm(e.target.value);setErrors(function(er){return Object.assign({},er,{confirm:""});});}, error: errors.confirm, C: C,})
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:8},}
        , React.createElement(Btn, { onClick: submit, disabled: loading, full: true, C: C, variant: "success",}, loading?"Guardando...":"Cambiar contraseña")
        , React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar")
      )
    )
  );
}

function Shell(props) {
  var user=props.user, tab=props.tab, setTab=props.setTab, onLogout=props.onLogout;
  var notifications=props.notifications, onMarkRead=props.onMarkRead, onNotifAction=props.onNotifAction, C=props.C;
  var isMobile=useIsMobile();
  var isVet=user.role==="vet", isAdmin=user.role==="admin";
  var vetTabs=[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"pets",icon:"🐾",label:"Pacientes"},{id:"records",icon:"📋",label:"Historias"},{id:"surgeries",icon:"🔬",label:"Cirugías"},{id:"calendar",icon:"📅",label:"Calendario"}];
  var ownerTabs=[{id:"mypets",icon:"🐾",label:"Mascotas"},{id:"history",icon:"📋",label:"Historial"},{id:"calendar",icon:"📅",label:"Citas"}];
  var adminTabs=[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"users",icon:"👥",label:"Usuarios"},{id:"surgeries",icon:"🔬",label:"Cirugías"},{id:"calendar",icon:"📅",label:"Calendario"},{id:"blocked",icon:"🚫",label:"Bloqueados"}];
  var tabs=isAdmin?adminTabs:isVet?vetTabs:ownerTabs;
  var name=fullName(user);
  if(isMobile) return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",minHeight:"100vh",background:C.cream},}
      , React.createElement('div', { style: {background:C.topbar,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50},}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8},}
          , React.createElement('span', { style: {fontSize:20,background:C.tan,borderRadius:8,padding:"3px 7px"},}, "🐾")
          , React.createElement('span', { style: {fontFamily:"'Playfair Display',serif",color:C.navIcon,fontSize:17},}, "VetCare")
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10},}
          , React.createElement(NotifBell, { notifications: notifications, userId: user.id, onMarkRead: onMarkRead, onNotifAction: onNotifAction, C: C,})
          , React.createElement('span', { style: {color:C.tan,fontSize:12,fontWeight:600,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, name.split(" ")[0])
          , React.createElement('button', { onClick: props.onChangePassword, style: {background:C.tan+"33",border:"1px solid "+C.tan+"44",borderRadius:8,color:C.navIcon,fontSize:12,padding:"6px 10px",fontWeight:700},}, "🔑")
          , React.createElement('button', { onClick: onLogout, style: {background:C.tan+"33",border:"1px solid "+C.tan+"44",borderRadius:8,color:C.navIcon,fontSize:12,padding:"6px 10px",fontWeight:700},}, "Salir")
        )
      )
      , React.createElement('div', { style: {flex:1,padding:"18px 14px",overflowY:"auto"},}, props.children)
      , React.createElement('div', { style: {background:C.sidebar,display:"flex",borderTop:"1px solid "+C.tan+"22",position:"sticky",bottom:0,zIndex:50},}
        , tabs.map(function(t){
          var active=tab===t.id;
          return React.createElement('button', { key: t.id, onClick: function(){setTab(t.id);}, style: {flex:1,padding:"8px 4px 10px",background:"transparent",border:"none",color:active?C.navIcon:C.navIconDim,display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontSize:9,fontWeight:700,borderTop:active?"2px solid "+C.tan:"2px solid transparent"},}, React.createElement(NavIcon, { icon: t.icon, active: active, C: C,}), t.label);
        })
      )
    )
  );
  return (
    React.createElement('div', { style: {display:"flex",minHeight:"100vh"},}
      , React.createElement('div', { style: {width:220,background:C.sidebar,display:"flex",flexDirection:"column",padding:"24px 14px",position:"fixed",top:0,left:0,bottom:0,zIndex:10},}
        , React.createElement('div', { style: {textAlign:"center",marginBottom:24},}
          , React.createElement('div', { style: {width:48,height:48,borderRadius:14,background:C.tan,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 6px"},}, "🐾")
          , React.createElement('div', { style: {fontFamily:"'Playfair Display',serif",color:C.navIcon,fontSize:19},}, "VetCare")
          , React.createElement('div', { style: {color:C.tan,fontSize:10,marginTop:1},}, isAdmin?"Panel Admin":isVet?"Panel Veterinario":"Portal Dueños")
        )
        , React.createElement('nav', { style: {flex:1},}
          , tabs.map(function(t){
            var active=tab===t.id;
            return React.createElement('button', { key: t.id, onClick: function(){setTab(t.id);}, style: {display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 12px",marginBottom:4,borderRadius:12,background:active?C.tan+"44":"transparent",border:active?"1px solid "+C.tan+"55":"1px solid transparent",color:active?C.navIcon:C.navIconDim,fontWeight:700,fontSize:13,textAlign:"left"},}, React.createElement(NavIcon, { icon: t.icon, active: active, C: C,}), t.label);
          })
        )
        , React.createElement('div', { style: {borderTop:"1px solid "+C.tan+"33",paddingTop:14},}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10},}
            , React.createElement('div', { style: {color:C.tan,fontSize:12,fontWeight:600,...sOverflow,flex:1},}, name)
            , React.createElement(NotifBell, { notifications: notifications, userId: user.id, onMarkRead: onMarkRead, onNotifAction: onNotifAction, C: C,})
          )
          , React.createElement('div', { style: {display:"flex",gap:6,marginBottom:6},}, React.createElement(Btn, { onClick: props.onChangePassword, variant: "outline", small: true, full: true, C: C, style: {borderColor:C.tan+"55",color:C.navIconDim},}, "🔑 Contraseña"))
          , React.createElement(Btn, { onClick: onLogout, variant: "outline", small: true, full: true, C: C, style: {borderColor:C.tan+"55",color:C.navIconDim},}, "Salir")
        )
      )
      , React.createElement('div', { style: {marginLeft:220,flex:1,padding:"26px 26px",background:C.cream,minHeight:"100vh"},}, props.children)
    )
  );
}
function AuthScreen(props) {
  var onLogin=props.onLogin, C=props.C;
  var users=props.users||[];
  var s1=useState(""); var email=s1[0]; var setEmail=s1[1];
  var s2=useState(""); var pass=s2[0]; var setPass=s2[1];
  var s3=useState({}); var errors=s3[0]; var setErrors=s3[1];
  var s4=useState(false); var loading=s4[0]; var setLoading=s4[1];

  async function handle(){
    var e={};
    if(!email.trim()) e.email="Email obligatorio.";
    if(!pass) e.pass="Contraseña obligatoria.";
    if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    var u=null;
    var lista=users.length?users:SEED_USERS;
    for(var i=0;i<lista.length;i++){ if(lista[i].email===email&&lista[i].password===pass){u=lista[i];break;} }
    if(!u){setErrors({pass:"Email o contraseña incorrectos."});setLoading(false);return;}
    if(u.blocked){setErrors({pass:"Cuenta bloqueada. Contacta al administrador."});setLoading(false);return;}
    await sSet(KEYS.session,u.id); onLogin(u,lista);
    setLoading(false);
  }

  function clrErr(k){ setErrors(function(e){var n=Object.assign({},e);delete n[k];return n;}); }

  return (
    React.createElement('div', { style: {minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,"+C.cream+" 0%,"+C.peach+" 100%)",padding:20},}
      , React.createElement('div', { style: {background:C.surface,borderRadius:20,padding:32,width:"100%",maxWidth:400,boxShadow:"0 20px 60px #00000022"},}
        , React.createElement('div', { style: {textAlign:"center",marginBottom:24},}
          , React.createElement('div', { style: {fontSize:52,marginBottom:8},}, "🐾")
          , React.createElement('h1', { style: {fontFamily:"'Playfair Display',serif",fontSize:28,color:C.brownDark,marginBottom:4},}, "VetCare")
          , React.createElement('p', { style: {fontSize:13,color:C.textMid},}, "Sistema de Gestión Veterinaria"   )
        )
        , React.createElement(Field, { label: "Email", error: errors.email, C: C,}
          , React.createElement('input', { type: "email", value: email, onChange: function(e){setEmail(e.target.value);clrErr("email");}, placeholder: "tu@email.com", className: errors.email?"err":"", autoComplete: "email",})
        )
        , React.createElement(PasswordField, { label: "Contraseña", value: pass, onChange: function(e){setPass(e.target.value);clrErr("pass");}, error: errors.pass, C: C,})
        , React.createElement(Btn, { onClick: handle, disabled: loading, full: true, C: C, style: {marginTop:8},}, loading?"...":"Entrar")
        , React.createElement('div', { style: {marginTop:14,padding:"10px 12px",background:C.greenLight,borderRadius:10,fontSize:11,color:C.textMid,lineHeight:1.7},}, "Admin: admin@vetcare.com / admin2025 | Vet: german@clinica.com / vetcare2025 | Dueño: carlos@mail.com / 1234")
      )
    )
  );
}

function ApptActionModal(props) {
  var appointment=props.appointment, pets=props.pets, users=props.users, C=props.C;
  if(!appointment) return null;
  var pet=byId(pets,appointment.petId);
  var owner=byId(users,appointment.ownerId);
  return (
    React.createElement(Modal, { title: "Confirmar cita" , onClose: props.onClose, C: C,}
      , React.createElement('div', { style: {background:C.peach,borderRadius:14,padding:16,marginBottom:18,display:"flex",gap:14,alignItems:"center"},}
        , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 60, C: C,})
        , React.createElement('div', null, React.createElement('div', { style: {fontWeight:800,fontSize:18,color:C.brownDark},}, pet&&pet.name), React.createElement('div', { style: {color:C.textMid,fontSize:13},}, pet&&pet.species))
      )
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16},}
        , React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:"8px 12px"},}, React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid},}, "Fecha"), React.createElement('div', { style: {fontSize:14,color:C.text,fontWeight:700},}, fmtDate(appointment.date)))
        , React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:"8px 12px"},}, React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid},}, "Hora"), React.createElement('div', { style: {fontSize:14,color:C.text,fontWeight:700},}, appointment.time+" hs"))
        , React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:"8px 12px"},}, React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid},}, "Tipo"), React.createElement('div', { style: {fontSize:14,color:C.text,fontWeight:700},}, appointment.type))
        , React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:"8px 12px"},}, React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid},}, "Dueño"), React.createElement('div', { style: {fontSize:14,color:C.text,fontWeight:700},}, fullName(owner)))
      )
      , appointment.notes&&React.createElement('div', { style: {background:C.blueLight,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:C.blue},}, "Nota: "+appointment.notes)
      , React.createElement('p', { style: {color:C.textMid,fontSize:14,marginBottom:16,textAlign:"center"},}, "Confirmas tu asistencia a esta cita?"     )
      , React.createElement('div', { style: {display:"flex",gap:10},}
        , React.createElement(Btn, { variant: "success", full: true, C: C, onClick: function(){props.onConfirm(appointment);props.onClose();},}, "Confirmar")
        , React.createElement(Btn, { variant: "danger", full: true, C: C, onClick: function(){props.onReject(appointment);props.onClose();},}, "No puedo asistir"  )
      )
    )
  );
}
function RequestApptModal(props) {
  var pets=props.pets, appointments=props.appointments, blockedList=props.blockedList, C=props.C;
  var TYPES=["Consulta","Vacunación","Cirugía","Urgencia","Control"];
  var s1=useState(pets.length>0?[pets[0].id]:[]); var selPets=s1[0]; var setSelPets=s1[1];
  var s2=useState(""); var date=s2[0]; var setDate=s2[1];
  var s3=useState(""); var time=s3[0]; var setTime=s3[1];
  var s4=useState("Consulta"); var type=s4[0]; var setType=s4[1];
  var s5=useState(""); var notes=s5[0]; var setNotes=s5[1];
  var s6=useState({}); var errors=s6[0]; var setErrors=s6[1];
  function clrErr(k){ setErrors(function(e){ var n=Object.assign({},e); n[k]=""; return n; }); }
  var isBlocked=blockedList.indexOf(date)>=0;
  var usedSlots=useMemo(function(){ return appointments.filter(function(a){return a.date===date&&a.status!=="cancelled";}).map(function(a){return a.time;}); },[appointments,date]);
  var freeSlots=useMemo(function(){ return TIME_SLOTS.filter(function(t){return usedSlots.indexOf(t)<0;}); },[usedSlots]);
  function togglePet(id){
    setSelPets(function(prev){
      if(prev.indexOf(id)>=0) return prev.filter(function(x){return x!==id;});
      if(prev.length>=3){ return prev; }
      return prev.concat([id]);
    });
    clrErr("pets");
  }
  function validate(){
    var e={};
    if(selPets.length===0) e.pets="Selecciona al menos una mascota.";
    if(!date) e.date="Fecha obligatoria.";
    else if(date<today()) e.date="No puede ser pasada.";
    else if(isBlocked) e.date="Dia bloqueado.";
    if(!time) e.time="Selecciona un horario.";
    return e;
  }
  function submit(){
    var e=validate(); if(Object.keys(e).length){setErrors(e);return;}
    selPets.forEach(function(petId){ props.onSend({petId:petId,date:date,time:time,type:type,notes:notes}); });
    props.onClose();
  }
  return (
    React.createElement(Modal, { title: "Solicitar cita" , onClose: props.onClose, C: C,}
      , React.createElement('div', { style: {marginBottom:14},}
        , React.createElement('label', { style: {color:C.brownDark},}, "Mascotas (maximo 3)")
        , errors.pets&&React.createElement('div', { style: {color:C.red,fontSize:12,marginTop:4},}, errors.pets)
        , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap",marginTop:6},}
          , pets.map(function(p){
            var sel=selPets.indexOf(p.id)>=0;
            return React.createElement('button', { key: p.id, type: "button", onClick: function(){togglePet(p.id);}, style: {display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:20,border:"2px solid "+(sel?C.brown:C.border),background:sel?C.peach:"transparent",color:sel?C.brownDark:C.textMid,fontWeight:700,fontSize:13,cursor:"pointer"},}, p.avatar+" "+p.name+(sel?" v":""));
          })
        )
      )
      , React.createElement(Field, { label: "Tipo de atención"  , C: C,}, React.createElement('select', { value: type, onChange: function(e){setType(e.target.value);},}, TYPES.map(function(t){return React.createElement('option', { key: t,}, t);})))
      , React.createElement(Field, { label: "Fecha deseada *"  , error: errors.date, C: C,}, React.createElement('input', { type: "date", value: date, onChange: function(e){setDate(e.target.value);setTime("");clrErr("date");}, min: today(), className: errors.date?"err":"",}))
      , isBlocked&&React.createElement('div', { style: {background:C.redLight,borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.red,fontSize:13,fontWeight:700},}, "Dia bloqueado. Elige otra fecha."    )
      , date&&!isBlocked&&(
        React.createElement(Field, { label: freeSlots.length===0?"Sin horarios disponibles":"Horario *", error: errors.time, C: C,}
          , freeSlots.length===0?React.createElement('p', { style: {color:C.red,fontSize:13},}, "Sin horarios libres este dia."    )
            :React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"},}
              , freeSlots.map(function(t){ return React.createElement('button', { key: t, type: "button", onClick: function(){setTime(t);clrErr("time");}, style: {padding:"6px 10px",borderRadius:8,border:"1.5px solid "+(time===t?C.brown:C.border),background:time===t?C.brown:"transparent",color:time===t?"#fff":C.text,fontSize:12,fontWeight:700,cursor:"pointer"},}, t); })
            )
        )
      )
      , React.createElement(Field, { label: "Motivo (opcional)" , C: C,}, React.createElement('textarea', { rows: 2, value: notes, onChange: function(e){setNotes(e.target.value);}, placeholder: "Describe el motivo..."  ,}))
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:8},}
        , React.createElement(Btn, { onClick: submit, full: true, C: C, disabled: isBlocked||!date,}, "Enviar"+( selPets.length>1?" ("+selPets.length+" mascotas)":""))
        , React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar")
      )
    )
  );
}
function ClinicalNoteModal(props) {
  var appointment=props.appointment, pet=props.pet, vetId=props.vetId, existing=props.existingRecord, C=props.C;
  var TYPES=["Consulta","Vacunación","Cirugía","Urgencia","Control"];
  var s1=useState(existing&&existing.diagnosis||""); var diagnosis=s1[0]; var setDiagnosis=s1[1];
  var s2=useState(existing&&existing.weight||""); var weight=s2[0]; var setWeight=s2[1];
  var s3=useState(existing&&existing.nextVisit||""); var nextVisit=s3[0]; var setNextVisit=s3[1];
  var s4=useState(existing&&existing.notes||""); var notes=s4[0]; var setNotes=s4[1];
  var s5=useState(existing&&existing.duration||""); var duration=s5[0]; var setDuration=s5[1];
  var s6=useState(existing&&existing.items||[]); var items=s6[0]; var setItems=s6[1];
  var s7=useState(""); var itemText=s7[0]; var setItemText=s7[1];
  var s8=useState("tratamiento"); var itemType=s8[0]; var setItemType=s8[1];
  var s9=useState({}); var errors=s9[0]; var setErrors=s9[1];
  function addItem(){ if(!itemText.trim())return; setItems(function(prev){return prev.concat([{id:genId(),text:itemText.trim(),type:itemType,files:[]}]);}); setItemText(""); }
  function removeItem(id){ setItems(function(prev){return prev.filter(function(x){return x.id!==id;});}); }
  function submit(){
    if(!diagnosis.trim()){setErrors({diagnosis:"Diagnóstico obligatorio."});return;}
    var record={id:existing&&existing.id||("r"+genId()),petId:appointment.petId,vetId:vetId,date:appointment.date,type:appointment.type,diagnosis:diagnosis,weight:weight,nextVisit:nextVisit,notes:notes,duration:duration?parseInt(duration):null,attended:true,items:items};
    props.onSave(record,appointment.id);
  }
  return (
    React.createElement(Modal, { title: "Historia clínica: "+(pet&&pet.name||""), onClose: props.onClose, C: C,}
      , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"center",background:C.peach,borderRadius:12,padding:12,marginBottom:16},}
        , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 48, C: C,})
        , React.createElement('div', null
          , React.createElement('div', { style: {fontWeight:800,fontSize:16,color:C.brownDark},}, pet&&pet.name)
          , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, pet&&(pet.species+" - "+pet.breed))
          , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, "Cita: "+fmtDate(appointment.date)+" "+appointment.time+" hs")
        )
      )
      , React.createElement(Field, { label: "Diagnóstico *" , error: errors.diagnosis, C: C,}
        , React.createElement('textarea', { rows: 2, value: diagnosis, onChange: function(e){setDiagnosis(e.target.value);setErrors({});}, placeholder: "Diagnóstico principal..." ,})
      )
      , React.createElement(TreatmentItemsField, { items: items, itemText: itemText, itemType: itemType, onItemTextChange: setItemText, onItemTypeChange: setItemType, onAdd: addItem, onRemove: removeItem, onAddFile: async function(itemId,e){var files=Array.from(e.target.files||[]);for(var _i=0;_i<files.length;_i++){var f=files[_i];if(f.size>3*1024*1024){alert("Máximo 3 MB por archivo.");continue;}var b64=await toBase64(f);var fe={id:genId(),file:b64,fileName:f.name};setItems(function(prev){return prev.map(function(x){return x.id===itemId?Object.assign({},x,{files:(x.files||[]).concat([fe])}):x;});});} e.target.value="";}, onRemoveFile: function(itemId,fileId){setItems(function(prev){return prev.map(function(x){return x.id===itemId?Object.assign({},x,{files:(x.files||[]).filter(function(f){return f.id!==fileId;})}):x;});});}, C: C,})
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"},}
        , React.createElement(Field, { label: "Peso (kg)" , C: C,}, React.createElement('input', { value: weight, onChange: function(e){setWeight(e.target.value);}, placeholder: "Ej: 4.5" , inputMode: "decimal",}))
        , React.createElement(Field, { label: "Duración (min)" , C: C,}, React.createElement('input', { type: "number", value: duration, onChange: function(e){setDuration(e.target.value);}, placeholder: "Ej: 30" , min: 1, max: 300,}))
        , React.createElement('div', { style: {gridColumn:"1/-1"},}, React.createElement(Field, { label: "Próxima visita" , C: C,}
        , React.createElement('div', { style: {display:"flex",gap:8,alignItems:"center"},}
          , React.createElement('input', { type: "date", value: nextVisit, onChange: function(e){setNextVisit(e.target.value);}, min: today(), style: {flex:1},})
          , nextVisit&&React.createElement('button', { type: "button", onClick: function(){setNextVisit("");}, title: "Borrar fecha" , style: {background:"none",border:"none",color:C.red,fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1,flexShrink:0},}, "×")
        )
      ))
      )
      , React.createElement(Field, { label: "Notas adicionales" , C: C,}, React.createElement('textarea', { rows: 2, value: notes, onChange: function(e){setNotes(e.target.value);}, placeholder: "Observaciones...",}))
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:8},}
        , React.createElement(Btn, { onClick: submit, full: true, C: C, variant: "success",}, "Guardar y marcar atendida"   )
        , React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar")
      )
    )
  );
}

// ============================================================
// ADMIN - AdminUsersPanel, EditUserModal, BlockedPanel
// ============================================================

function AdminUsersPanel(props) {
  var users=props.users, setUsers=props.setUsers, push=props.push, C=props.C;
  var isMobile=useIsMobile();
  var s1=useState(null); var editUser=s1[0]; var setEditUser=s1[1];
  var s2=useState(false); var showAdd=s2[0]; var setShowAdd=s2[1];
  var s3=useState(""); var search=s3[0]; var setSearch=s3[1];
  var roleColor={admin:C.purple,vet:C.blue,owner:C.green};
  var roleLabel={admin:"Admin",vet:"Veterinario",owner:"Dueño"};
  var filtered=users.filter(function(u){ var nm=fullName(u).toLowerCase(); return nm.indexOf(search.toLowerCase())>=0||u.email.indexOf(search.toLowerCase())>=0; });
  function sendCreds(u){ var n=fullName(u); simEmail(u.email,"Credenciales VetCare - "+n,push); simWA(u.phone,"Hola "+n+", tus credenciales VetCare: "+u.email,push); push("Credenciales enviadas a "+n); }
  async function toggleBlock(u){ var nu=users.map(function(x){return x.id===u.id?Object.assign({},x,{blocked:!x.blocked}):x;}); await sSet(KEYS.users,nu); setUsers(nu); push(fullName(u)+" "+(u.blocked?"desbloqueado":"bloqueado")); }
  async function saveEdit(updated){ var nu=users.map(function(x){return x.id===updated.id?Object.assign({},x,updated):x;}); await sSet(KEYS.users,nu); setUsers(nu); setEditUser(null); push("Usuario actualizado"); }
  async function addNewUser(nu){ var nl=users.concat([nu]); await sSet(KEYS.users,nl); setUsers(nl); setShowAdd(false); push("Usuario "+fullName(nu)+" creado"); }
  return (
    React.createElement('div', null
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:10},}
        , React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark},}, "Gestión de Usuarios"  )
        , React.createElement(Btn, { C: C, onClick: function(){setShowAdd(true);},}, "+ Nuevo usuario"  )
      )
      , React.createElement('p', { style: {color:C.textMid,fontSize:13,marginBottom:16},}, users.length+" usuarios registrados")
      , React.createElement('div', { style: {marginBottom:14},}, React.createElement('input', { placeholder: "Buscar por nombre o email..."    , value: search, onChange: function(e){setSearch(e.target.value);},}))
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10},}
        , filtered.map(function(u){
          var rc=roleColor[u.role]||C.green;
          var rl=roleLabel[u.role]||u.role;
          return (
            React.createElement(Card, { key: u.id, C: C, style: {padding:"14px 16px",opacity:u.blocked?0.65:1},}
              , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"},}
                , React.createElement('div', { style: {width:44,height:44,borderRadius:12,background:rc+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0},}, u.role==="admin"?"🛡️":u.role==="vet"?"🩺":"👤")
                , React.createElement('div', { style: {flex:1,minWidth:0},}
                  , React.createElement('div', { style: {fontWeight:800,fontSize:15,color:C.brownDark},}, fullName(u), u.blocked&&React.createElement('span', { style: {marginLeft:8,background:C.redLight,color:C.red,borderRadius:8,padding:"2px 8px",fontSize:11},}, "BLOQUEADO"))
                  , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, u.email+" - "+u.docType+": "+(u.docNum||"—"))
                  , React.createElement('div', { style: {fontSize:12,color:C.textLight},}, React.createElement('span', { style: {background:rc+"22",color:rc,borderRadius:8,padding:"2px 8px",fontWeight:700},}, rl), u.phone&&React.createElement('span', { style: {marginLeft:8},}, "📱 "+u.phone), u.address&&React.createElement('span', { style: {marginLeft:8},}, "📍 "+u.address))
                )
                , React.createElement('div', { style: {display:"flex",gap:6,flexShrink:0,flexWrap:"wrap"},}
                  , React.createElement(Btn, { small: true, variant: "ghost", C: C, onClick: function(){setEditUser(u);},}, "✏️")
                  , React.createElement(Btn, { small: true, variant: "purple", C: C, onClick: function(){sendCreds(u);},}, "📧")
                  , u.role!=="admin"&&React.createElement(Btn, { small: true, variant: u.blocked?"success":"danger", C: C, onClick: function(){toggleBlock(u);},}, u.blocked?"🔓":"🔒")
                )
              )
            )
          );
        })
      )
      , editUser&&React.createElement(EditUserModal, { user: editUser, onSave: saveEdit, onClose: function(){setEditUser(null);}, C: C,})
      , showAdd&&React.createElement(AddUserModal, { users: users, onAdd: addNewUser, onClose: function(){setShowAdd(false);}, C: C,})
    )
  );
}
function EditUserModal(props) {
  var user=props.user, C=props.C;
  var s1=useState(user.firstName||""); var firstName=s1[0]; var setFirstName=s1[1];
  var s2=useState(user.lastName||""); var lastName=s2[0]; var setLastName=s2[1];
  var s3=useState(user.email||""); var email=s3[0]; var setEmail=s3[1];
  var s4=useState(user.phone||""); var phone=s4[0]; var setPhone=s4[1];
  var s5=useState(user.docType||"DNI"); var docType=s5[0]; var setDocType=s5[1];
  var s6=useState(user.docNum||""); var docNum=s6[0]; var setDocNum=s6[1];
  var s7=useState(user.role||"owner"); var role=s7[0]; var setRole=s7[1];
  var s8=useState(user.address||""); var address=s8[0]; var setAddress=s8[1];
  var s9=useState(""); var newPass=s9[0]; var setNewPass=s9[1];
  var s10=useState({}); var errors=s10[0]; var setErrors=s10[1];
  function submit(){
    if(!firstName.trim()||!lastName.trim()){setErrors({name:"Nombre y apellido obligatorios."});return;}
    var updated=Object.assign({},user,{firstName:firstName.trim(),lastName:lastName.trim(),email:email,phone:phone,docType:docType,docNum:docNum,role:role,address:address.trim()});
    if(newPass.length>=4) updated.password=newPass;
    props.onSave(updated);
  }
  return (
    React.createElement(Modal, { title: "Editar: "+fullName(user), onClose: props.onClose, C: C,}
      , errors.name&&React.createElement('div', { style: {color:C.red,fontSize:12,marginBottom:10},}, errors.name)
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"},}
        , React.createElement(Field, { label: "Nombre *" , C: C,}, React.createElement('input', { value: firstName, onChange: function(e){setFirstName(e.target.value);}, placeholder: "Nombre",}))
        , React.createElement(Field, { label: "Apellido *" , C: C,}, React.createElement('input', { value: lastName, onChange: function(e){setLastName(e.target.value);}, placeholder: "Apellido",}))
      )
      , React.createElement(Field, { label: "Email", C: C,}, React.createElement('input', { type: "email", value: email, onChange: function(e){setEmail(e.target.value);},}))
      , React.createElement(Field, { label: "Teléfono / WhatsApp"  , C: C,}, React.createElement('input', { value: phone, onChange: function(e){setPhone(sanitizePhone(e.target.value));}, placeholder: "999999999", maxLength: 9,}))
      , React.createElement(Field, { label: "Dirección", C: C,}, React.createElement('input', { value: address, onChange: function(e){setAddress(e.target.value);}, placeholder: "Ej: Av. Principal 123, Lima"    ,}))
      , React.createElement(Field, { label: "Rol", C: C,}, React.createElement('select', { value: role, onChange: function(e){setRole(e.target.value);},}, React.createElement('option', { value: "owner",}, "Dueño"), React.createElement('option', { value: "vet",}, "Veterinario"), React.createElement('option', { value: "admin",}, "Admin")))
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"160px 1fr",gap:"0 10px"},}
        , React.createElement(Field, { label: "Tipo doc." , C: C,}, React.createElement('select', { value: docType, onChange: function(e){setDocType(e.target.value);},}, React.createElement('option', { value: "DNI",}, "DNI"), React.createElement('option', { value: "CE",}, "Carnet"), React.createElement('option', { value: "PAS",}, "Pasaporte")))
        , React.createElement(Field, { label: "Nº documento" , C: C,}, React.createElement('input', { value: docNum, onChange: function(e){setDocNum(e.target.value);},}))
      )
      , React.createElement(PasswordField, { label: "Nueva contrasena (vacio = no cambiar)"     , value: newPass, onChange: function(e){setNewPass(e.target.value);}, C: C,})
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:8},}, React.createElement(Btn, { onClick: submit, full: true, C: C,}, "Guardar"), React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar"))
    )
  );
}
function AddUserModal(props) {
  var users=props.users, C=props.C;
  var s1=useState(""); var firstName=s1[0]; var setFirstName=s1[1];
  var s2=useState(""); var lastName=s2[0]; var setLastName=s2[1];
  var s3=useState(""); var email=s3[0]; var setEmail=s3[1];
  var s4=useState(""); var pass=s4[0]; var setPass=s4[1];
  var s5=useState("owner"); var role=s5[0]; var setRole=s5[1];
  var s6=useState("DNI"); var docType=s6[0]; var setDocType=s6[1];
  var s7=useState(""); var docNum=s7[0]; var setDocNum=s7[1];
  var s8=useState(""); var phone=s8[0]; var setPhone=s8[1];
  var s9=useState({}); var errors=s9[0]; var setErrors=s9[1];
  function submit(){
    var e={};
    if(!firstName.trim()) e.firstName="Nombre obligatorio.";
    if(!lastName.trim()) e.lastName="Apellido obligatorio.";
    if(!email.trim()) e.email="Email obligatorio.";
    else { var exists=false; for(var i=0;i<users.length;i++){if(users[i].email===email){exists=true;break;}} if(exists) e.email="Email ya registrado."; }
    if(!pass||pass.length<4) e.pass="Mínimo 4 caracteres.";
    var de=validateDoc(docType,docNum); if(de) e.docNum=de;
    if(Object.keys(e).length){setErrors(e);return;}
    var nu={id:"u"+genId(),role:role,firstName:firstName.trim(),lastName:lastName.trim(),email:email.trim(),password:pass,docType:docType,docNum:docNum,phone:phone.trim(),address:address.trim(),blocked:false};
    props.onAdd(nu);
  }
  return (
    React.createElement(Modal, { title: "Crear nuevo usuario"  , onClose: props.onClose, C: C,}
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"},}
        , React.createElement(Field, { label: "Nombre *" , error: errors.firstName, C: C,}, React.createElement('input', { value: firstName, onChange: function(e){setFirstName(e.target.value);}, className: errors.firstName?"err":"",}))
        , React.createElement(Field, { label: "Apellido *" , error: errors.lastName, C: C,}, React.createElement('input', { value: lastName, onChange: function(e){setLastName(e.target.value);}, className: errors.lastName?"err":"",}))
      )
      , React.createElement(Field, { label: "Rol", C: C,}, React.createElement('select', { value: role, onChange: function(e){setRole(e.target.value);},}, React.createElement('option', { value: "owner",}, "Dueño"), React.createElement('option', { value: "vet",}, "Veterinario"), React.createElement('option', { value: "admin",}, "Admin")))
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"160px 1fr",gap:"0 10px"},}
        , React.createElement(Field, { label: "Tipo doc." , C: C,}, React.createElement('select', { value: docType, onChange: function(e){setDocType(e.target.value);},}, React.createElement('option', { value: "DNI",}, "DNI"), React.createElement('option', { value: "CE",}, "Carnet"), React.createElement('option', { value: "PAS",}, "Pasaporte")))
        , React.createElement(Field, { label: "Nº documento" , error: errors.docNum, C: C,}, React.createElement('input', { value: docNum, onChange: function(e){setDocNum(e.target.value);}, className: errors.docNum?"err":"",}))
      )
      , React.createElement(Field, { label: "Telefono / WhatsApp"  , C: C,}, React.createElement('input', { value: phone, onChange: function(e){setPhone(sanitizePhone(e.target.value));}, placeholder: "999999999", maxLength: 9,}))
      , React.createElement(Field, { label: "Email *" , error: errors.email, C: C,}, React.createElement('input', { type: "email", value: email, onChange: function(e){setEmail(e.target.value);}, className: errors.email?"err":"",}))
      , React.createElement(PasswordField, { label: "Contrasena *" , value: pass, onChange: function(e){setPass(e.target.value);}, error: errors.pass, C: C,})
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:8},}, React.createElement(Btn, { onClick: submit, full: true, C: C,}, "Crear"), React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar"))
    )
  );
}
function BlockedPanel(props) {
  var blockedDays=props.blockedDays, setBlockedDays=props.setBlockedDays, push=props.push, C=props.C;
  var isMobile=useIsMobile();
  var s1=useState("single"); var mode=s1[0]; var setMode=s1[1];
  var s2=useState(""); var dateFrom=s2[0]; var setDateFrom=s2[1];
  var s3=useState(""); var dateTo=s3[0]; var setDateTo=s3[1];
  var s4=useState(""); var reason=s4[0]; var setReason=s4[1];
  var s5=useState(""); var search=s5[0]; var setSearch=s5[1];
  var s6=useState([]); var selected=s6[0]; var setSelected=s6[1];
  var s7=useState(""); var err=s7[0]; var setErr=s7[1];
  function getDates(from,to){ var dates=[],cur=new Date(from),end=new Date(to); while(cur<=end){dates.push(cur.toISOString().slice(0,10));cur.setDate(cur.getDate()+1);} return dates; }
  async function addBlock(){
    setErr("");
    if(!dateFrom){setErr("Fecha de inicio obligatoria.");return;}
    if(mode==="range"&&!dateTo){setErr("Fecha de fin obligatoria.");return;}
    if(mode==="range"&&dateTo<dateFrom){setErr("La fecha de fin debe ser posterior.");return;}
    var dates=mode==="range"?getDates(dateFrom,dateTo):[dateFrom];
    var newEntries=dates.filter(function(d){return !blockedDays.find(function(b){return b.date===d;});}).map(function(d){return {date:d,reason:reason||"No disponible"};});
    if(newEntries.length===0){push("Esos dias ya estan bloqueados","warning");return;}
    var nb=blockedDays.concat(newEntries).sort(function(a,b){return a.date.localeCompare(b.date);});
    await sSet(KEYS.blocked,nb); setBlockedDays(nb); setDateFrom(""); setDateTo(""); setReason("");
    push(newEntries.length+" dia(s) bloqueado(s)");
  }
  async function removeSelected(){
    if(selected.length===0)return;
    if(!confirm("Desbloquear "+selected.length+" dia(s)?"))return;
    var nb=blockedDays.filter(function(b){return selected.indexOf(b.date)<0;});
    await sSet(KEYS.blocked,nb); setBlockedDays(nb); setSelected([]);
    push(selected.length+" dia(s) desbloqueado(s)");
  }
  async function removeSingle(date){ var nb=blockedDays.filter(function(b){return b.date!==date;}); await sSet(KEYS.blocked,nb); setBlockedDays(nb); setSelected(function(s){return s.filter(function(x){return x!==date;});}); push("Dia "+fmtDate(date)+" desbloqueado"); }
  var filtered=blockedDays.filter(function(b){ if(!search) return true; return fmtDate(b.date).indexOf(search)>=0||b.date.indexOf(search)>=0||b.reason.toLowerCase().indexOf(search.toLowerCase())>=0; });
  function toggleSel(date){ setSelected(function(s){ return s.indexOf(date)>=0?s.filter(function(x){return x!==date;}):s.concat([date]); }); }
  return (
    React.createElement('div', null
      , React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark,marginBottom:4},}, "Dias Bloqueados" )
      , React.createElement('p', { style: {color:C.textMid,fontSize:13,marginBottom:16},}, "Los duenos no pueden solicitar citas en estos dias"        )
      , React.createElement(Card, { C: C, style: {marginBottom:18},}
        , React.createElement('h3', { style: {fontWeight:800,color:C.brownDark,marginBottom:14,fontSize:14},}, "Bloquear dias" )
        , React.createElement('div', { style: {display:"flex",marginBottom:14,background:C.peach,borderRadius:10,padding:4},}
          , ["single","range"].map(function(m){return React.createElement('button', { key: m, onClick: function(){setMode(m);setErr("");}, style: {flex:1,padding:"8px 0",borderRadius:8,background:mode===m?C.surface:"transparent",border:"none",fontWeight:700,color:mode===m?C.brownDark:C.textMid,fontSize:13},}, m==="single"?"Un dia":"Rango de dias");})
        )
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"},}
          , React.createElement(Field, { label: mode==="range"?"Fecha inicio *":"Fecha *", C: C,}, React.createElement('input', { type: "date", value: dateFrom, onChange: function(e){setDateFrom(e.target.value);}, min: today(),}))
          , mode==="range"?React.createElement(Field, { label: "Fecha fin *"  , C: C,}, React.createElement('input', { type: "date", value: dateTo, onChange: function(e){setDateTo(e.target.value);}, min: dateFrom||today(),})):React.createElement('div', null)
          , React.createElement('div', { style: {gridColumn:"1/-1"},}, React.createElement(Field, { label: "Motivo (opcional)" , C: C,}, React.createElement('input', { value: reason, onChange: function(e){setReason(e.target.value);}, placeholder: "Feriado, mantenimiento..." ,})))
        )
        , err&&React.createElement('div', { style: {color:C.red,fontSize:12,marginBottom:10},}, err)
        , React.createElement(Btn, { onClick: addBlock, disabled: !dateFrom||(mode==="range"&&!dateTo), C: C,}, "Bloquear")
      )
      , blockedDays.length>0&&(
        React.createElement('div', null
          , React.createElement('div', { style: {display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"},}
            , React.createElement('span', { style: {fontSize:13,color:C.textMid},}, blockedDays.length+" dia(s) bloqueado(s)")
            , selected.length>0&&React.createElement(Btn, { small: true, variant: "danger", C: C, onClick: removeSelected,}, "Desbloquear ("+selected.length+")")
          )
          , React.createElement('div', { style: {marginBottom:10},}, React.createElement('input', { placeholder: "Buscar fecha o motivo..."   , value: search, onChange: function(e){setSearch(e.target.value);},}))
          , filtered.length===0&&React.createElement('p', { style: {color:C.textLight,textAlign:"center",padding:20,fontSize:13},}, "Sin resultados" )
          , filtered.map(function(b){
            var isSel=selected.indexOf(b.date)>=0;
            return (
              React.createElement('div', { key: b.date, style: {display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"1.5px solid "+(isSel?C.red:C.border),background:isSel?C.redLight:C.surface,marginBottom:6,cursor:"pointer"}, onClick: function(){toggleSel(b.date);},}
                , React.createElement('div', { style: {width:18,height:18,borderRadius:4,border:"2px solid "+(isSel?C.red:C.border),background:isSel?C.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},}, isSel&&React.createElement('span', { style: {color:"#fff",fontSize:11},}, "v"))
                , React.createElement('div', { style: {fontSize:22,flexShrink:0},}, "🚫")
                , React.createElement('div', { style: {flex:1,minWidth:0},}
                  , React.createElement('div', { style: {fontWeight:800,fontSize:13,color:C.brownDark},}, fmtDate(b.date))
                  , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, b.reason)
                )
                , React.createElement(Btn, { small: true, variant: "danger", C: C, onClick: function(e){e.stopPropagation();removeSingle(b.date);},}, "🔓")
              )
            );
          })
        )
      )
      , blockedDays.length===0&&React.createElement('p', { style: {color:C.textLight,textAlign:"center",padding:40},}, "No hay dias bloqueados."   )
    )
  );
}

// ============================================================
// CALENDARIO - CalendarView, solicitudes, citas
// ============================================================
