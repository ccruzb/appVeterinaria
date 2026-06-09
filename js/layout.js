function Shell(props) {
  var user=props.user, tab=props.tab, setTab=props.setTab, onLogout=props.onLogout;
  var notifications=props.notifications, onMarkRead=props.onMarkRead, onNotifAction=props.onNotifAction, C=props.C;
  var isMobile=useIsMobile();
  var isVet=user.role==="vet", isAdmin=user.role==="admin";
  var vetTabs=[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"pets",icon:"🐾",label:"Pacientes"},{id:"records",icon:"📋",label:"Historias"},{id:"calendar",icon:"📅",label:"Calendario"}];
  var ownerTabs=[{id:"mypets",icon:"🐾",label:"Mascotas"},{id:"history",icon:"📋",label:"Historial"},{id:"calendar",icon:"📅",label:"Citas"}];
  var adminTabs=[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"users",icon:"👥",label:"Usuarios"},{id:"calendar",icon:"📅",label:"Calendario"},{id:"blocked",icon:"🚫",label:"Bloqueados"}];
  var tabs=isAdmin?adminTabs:isVet?vetTabs:ownerTabs;
  var name=fullName(user);
  if(isMobile) return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",background:C.cream}}>
      <div style={{background:C.topbar,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:20,background:C.tan,borderRadius:8,padding:"3px 7px"}}>🐾</span>
          <span style={{fontFamily:"'Playfair Display',serif",color:C.navIcon,fontSize:17}}>VetCare</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <NotifBell notifications={notifications} userId={user.id} onMarkRead={onMarkRead} onNotifAction={onNotifAction} C={C}/>
          <span style={{color:C.tan,fontSize:12,fontWeight:600,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name.split(" ")[0]}</span>
          <button onClick={onLogout} style={{background:C.tan+"33",border:"1px solid "+C.tan+"44",borderRadius:8,color:C.navIcon,fontSize:12,padding:"6px 10px",fontWeight:700}}>Salir</button>
        </div>
      </div>
      <div style={{flex:1,padding:"18px 14px",overflowY:"auto"}}>{props.children}</div>
      <div style={{background:C.sidebar,display:"flex",borderTop:"1px solid "+C.tan+"22",position:"sticky",bottom:0,zIndex:50}}>
        {tabs.map(function(t){
          var active=tab===t.id;
          return <button key={t.id} onClick={function(){setTab(t.id);}} style={{flex:1,padding:"8px 4px 10px",background:"transparent",border:"none",color:active?C.navIcon:C.navIconDim,display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontSize:9,fontWeight:700,borderTop:active?"2px solid "+C.tan:"2px solid transparent"}}><NavIcon icon={t.icon} active={active} C={C}/>{t.label}</button>;
        })}
      </div>
    </div>
  );
  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      <div style={{width:220,background:C.sidebar,display:"flex",flexDirection:"column",padding:"24px 14px",position:"fixed",top:0,left:0,bottom:0,zIndex:10}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:48,height:48,borderRadius:14,background:C.tan,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 6px"}}>🐾</div>
          <div style={{fontFamily:"'Playfair Display',serif",color:C.navIcon,fontSize:19}}>VetCare</div>
          <div style={{color:C.tan,fontSize:10,marginTop:1}}>{isAdmin?"Panel Admin":isVet?"Panel Veterinario":"Portal Dueños"}</div>
        </div>
        <nav style={{flex:1}}>
          {tabs.map(function(t){
            var active=tab===t.id;
            return <button key={t.id} onClick={function(){setTab(t.id);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 12px",marginBottom:4,borderRadius:12,background:active?C.tan+"44":"transparent",border:active?"1px solid "+C.tan+"55":"1px solid transparent",color:active?C.navIcon:C.navIconDim,fontWeight:700,fontSize:13,textAlign:"left"}}><NavIcon icon={t.icon} active={active} C={C}/>{t.label}</button>;
          })}
        </nav>
        <div style={{borderTop:"1px solid "+C.tan+"33",paddingTop:14}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{color:C.tan,fontSize:12,fontWeight:600,...sOverflow,flex:1}}>{name}</div>
            <NotifBell notifications={notifications} userId={user.id} onMarkRead={onMarkRead} onNotifAction={onNotifAction} C={C}/>
          </div>
          <Btn onClick={onLogout} variant="outline" small={true} full={true} C={C} style={{borderColor:C.tan+"55",color:C.navIconDim}}>Salir</Btn>
        </div>
      </div>
      <div style={{marginLeft:220,flex:1,padding:"26px 26px",background:C.cream,minHeight:"100vh"}}>{props.children}</div>
    </div>
  );
}
function AuthScreen(props) {
  var onLogin=props.onLogin, C=props.C;
  var s0=useState("login"); var mode=s0[0]; var setMode=s0[1];
  var s1=useState(""); var firstName=s1[0]; var setFirstName=s1[1];
  var s2=useState(""); var lastName=s2[0]; var setLastName=s2[1];
  var s3=useState(""); var email=s3[0]; var setEmail=s3[1];
  var s4=useState(""); var pass=s4[0]; var setPass=s4[1];
  var s5=useState("owner"); var role=s5[0]; var setRole=s5[1];
  var s6=useState("DNI"); var docType=s6[0]; var setDocType=s6[1];
  var s7=useState(""); var docNum=s7[0]; var setDocNum=s7[1];
  var s8=useState(""); var phone=s8[0]; var setPhone=s8[1];
  var s9=useState({}); var errors=s9[0]; var setErrors=s9[1];
  var s10=useState(false); var loading=s10[0]; var setLoading=s10[1];
  function clrErr(k){ setErrors(function(e){ var n=Object.assign({},e); n[k]=""; return n; }); }
  function handleDocNum(v){
    if(docType==="DNI"){ setDocNum(v.replace(/\D/g,"").slice(0,8)); }
    else { var u=v.toUpperCase(); if(/^[A-Z]?\d*$/.test(u)) setDocNum(u.slice(0,9)); }
    clrErr("docNum");
  }
  function validate(){
    var e={};
    if(mode==="register"){
      if(!firstName.trim()) e.firstName="Nombre obligatorio.";
      if(!lastName.trim()) e.lastName="Apellido obligatorio.";
      var de=validateDoc(docType,docNum); if(de) e.docNum=de;
    }
    if(!email.trim()) e.email="Email obligatorio.";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email="Email no válido.";
    if(!pass) e.pass="Contraseña obligatoria.";
    else if(mode==="register"&&pass.length<4) e.pass="Mínimo 4 caracteres.";
    return e;
  }
  async function handle(){
    var e=validate(); if(Object.keys(e).length){setErrors(e);return;} setLoading(true);
    var stored=await sGet(KEYS.users);
    var users=stored||SEED_USERS;
    if(mode==="login"){
      var u=null;
      for(var i=0;i<users.length;i++){ if(users[i].email===email&&users[i].password===pass){u=users[i];break;} }
      if(!u){setErrors({pass:"Email o contrasena incorrectos."});setLoading(false);return;}
      if(u.blocked){setErrors({pass:"Cuenta bloqueada."});setLoading(false);return;}
      await sSet(KEYS.session,u.id); onLogin(u,users);
    } else {
      var exists=false;
      for(var j=0;j<users.length;j++){ if(users[j].email===email){exists=true;break;} }
      if(exists){setErrors({email:"Email ya registrado."});setLoading(false);return;}
      var nu={id:"u"+genId(),role:role,firstName:firstName.trim(),lastName:lastName.trim(),email:email.trim(),password:pass,docType:docType,docNum:docNum,phone:phone.trim(),blocked:false};
      var nl=users.concat([nu]);
      await sSet(KEYS.users,nl); await sSet(KEYS.session,nu.id); onLogin(nu,nl);
    }
    setLoading(false);
  }
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,"+C.peach+" 0%,"+C.cream+" 60%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:72,marginBottom:8,lineHeight:1}}>🐾</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,color:C.brownDark}}>VetCare</h1>
          <p style={{color:C.textMid,fontSize:14,marginTop:4}}>Sistema de Gestión Veterinaria</p>
        </div>
        <div style={{background:C.surface,borderRadius:16,border:"1px solid "+C.border,padding:24}}>
          <div style={{display:"flex",marginBottom:20,background:C.peach,borderRadius:10,padding:4}}>
            {["login","register"].map(function(m){
              return <button key={m} onClick={function(){setMode(m);setErrors({});}} style={{flex:1,padding:"9px 0",borderRadius:8,background:mode===m?C.surface:"transparent",border:"none",fontWeight:700,color:mode===m?C.brownDark:C.textMid,fontSize:14}}>{m==="login"?"Iniciar sesión":"Registrarme"}</button>;
            })}
          </div>
          {mode==="register"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
                <Field label="Nombre *" error={errors.firstName} C={C}><input placeholder="Tu nombre" value={firstName} onChange={function(e){setFirstName(e.target.value);clrErr("firstName");}} className={errors.firstName?"err":""}/></Field>
                <Field label="Apellido *" error={errors.lastName} C={C}><input placeholder="Tu apellido" value={lastName} onChange={function(e){setLastName(e.target.value);clrErr("lastName");}} className={errors.lastName?"err":""}/></Field>
              </div>
              <Field label="Tipo de cuenta" C={C}><select value={role} onChange={function(e){setRole(e.target.value);}}><option value="owner">Dueño de mascota</option><option value="vet">Veterinario</option></select></Field>
              <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:"0 10px"}}>
                <Field label="Tipo doc." C={C}><select value={docType} onChange={function(e){setDocType(e.target.value);setDocNum("");clrErr("docNum");}}><option value="DNI">DNI</option><option value="CE">Carnet</option><option value="PAS">Pasaporte</option></select></Field>
                <Field label={docType==="DNI"?"Nº DNI (8 digitos)":"Letra + 8 digitos"} error={errors.docNum} C={C}><input value={docNum} onChange={function(e){handleDocNum(e.target.value);}} placeholder={docType==="DNI"?"12345678":"A00000000"} className={errors.docNum?"err":""}/></Field>
              </div>
              <Field label="Telefono / WhatsApp" C={C}><input value={phone} onChange={function(e){setPhone(sanitizePhone(e.target.value));}} placeholder="999999999" inputMode="numeric" maxLength={9}/></Field>
            </div>
          )}
          <Field label="Email" error={errors.email} C={C}><input type="email" placeholder="correo@ejemplo.com" value={email} onChange={function(e){setEmail(e.target.value);clrErr("email");}} className={errors.email?"err":""}/></Field>
          <PasswordField label="Contraseña" value={pass} onChange={function(e){setPass(e.target.value);clrErr("pass");}} error={errors.pass} C={C}/>
          <Btn onClick={handle} disabled={loading} full={true} C={C} style={{marginTop:4}}>{loading?"...":mode==="login"?"Entrar":"Crear cuenta"}</Btn>
          {mode==="login"&&<div style={{marginTop:14,padding:"10px 12px",background:C.greenLight,borderRadius:10,fontSize:11,color:C.textMid,lineHeight:1.7}}>{"Admin: admin@vetcare.com / admin2025 | Vet: german@clinica.com / vetcare2025 | Dueño: carlos@mail.com / 1234"}</div>}
        </div>
      </div>
    </div>
  );
}
function ApptActionModal(props) {
  var appointment=props.appointment, pets=props.pets, users=props.users, C=props.C;
  if(!appointment) return null;
  var pet=byId(pets,appointment.petId);
  var owner=byId(users,appointment.ownerId);
  return (
    <Modal title="Confirmar cita" onClose={props.onClose} C={C}>
      <div style={{background:C.peach,borderRadius:14,padding:16,marginBottom:18,display:"flex",gap:14,alignItems:"center"}}>
        <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={60} C={C}/>
        <div><div style={{fontWeight:800,fontSize:18,color:C.brownDark}}>{pet&&pet.name}</div><div style={{color:C.textMid,fontSize:13}}>{pet&&pet.species}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        <div style={{background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:"8px 12px"}}><div style={{fontSize:11,fontWeight:700,color:C.textMid}}>Fecha</div><div style={{fontSize:14,color:C.text,fontWeight:700}}>{fmtDate(appointment.date)}</div></div>
        <div style={{background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:"8px 12px"}}><div style={{fontSize:11,fontWeight:700,color:C.textMid}}>Hora</div><div style={{fontSize:14,color:C.text,fontWeight:700}}>{appointment.time+" hs"}</div></div>
        <div style={{background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:"8px 12px"}}><div style={{fontSize:11,fontWeight:700,color:C.textMid}}>Tipo</div><div style={{fontSize:14,color:C.text,fontWeight:700}}>{appointment.type}</div></div>
        <div style={{background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:"8px 12px"}}><div style={{fontSize:11,fontWeight:700,color:C.textMid}}>Dueño</div><div style={{fontSize:14,color:C.text,fontWeight:700}}>{fullName(owner)}</div></div>
      </div>
      {appointment.notes&&<div style={{background:C.blueLight,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:C.blue}}>{"Nota: "+appointment.notes}</div>}
      <p style={{color:C.textMid,fontSize:14,marginBottom:16,textAlign:"center"}}>Confirmas tu asistencia a esta cita?</p>
      <div style={{display:"flex",gap:10}}>
        <Btn variant="success" full={true} C={C} onClick={function(){props.onConfirm(appointment);props.onClose();}}>Confirmar</Btn>
        <Btn variant="danger" full={true} C={C} onClick={function(){props.onReject(appointment);props.onClose();}}>No puedo asistir</Btn>
      </div>
    </Modal>
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
    <Modal title="Solicitar cita" onClose={props.onClose} C={C}>
      <div style={{marginBottom:14}}>
        <label style={{color:C.brownDark}}>{"Mascotas (maximo 3)"}</label>
        {errors.pets&&<div style={{color:C.red,fontSize:12,marginTop:4}}>{errors.pets}</div>}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
          {pets.map(function(p){
            var sel=selPets.indexOf(p.id)>=0;
            return <button key={p.id} type="button" onClick={function(){togglePet(p.id);}} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:20,border:"2px solid "+(sel?C.brown:C.border),background:sel?C.peach:"transparent",color:sel?C.brownDark:C.textMid,fontWeight:700,fontSize:13,cursor:"pointer"}}>{p.avatar+" "+p.name+(sel?" v":"")}</button>;
          })}
        </div>
      </div>
      <Field label="Tipo de atención" C={C}><select value={type} onChange={function(e){setType(e.target.value);}}>{TYPES.map(function(t){return <option key={t}>{t}</option>;})}</select></Field>
      <Field label="Fecha deseada *" error={errors.date} C={C}><input type="date" value={date} onChange={function(e){setDate(e.target.value);setTime("");clrErr("date");}} min={today()} className={errors.date?"err":""}/></Field>
      {isBlocked&&<div style={{background:C.redLight,borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.red,fontSize:13,fontWeight:700}}>Dia bloqueado. Elige otra fecha.</div>}
      {date&&!isBlocked&&(
        <Field label={freeSlots.length===0?"Sin horarios disponibles":"Horario *"} error={errors.time} C={C}>
          {freeSlots.length===0?<p style={{color:C.red,fontSize:13}}>Sin horarios libres este dia.</p>
            :<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {freeSlots.map(function(t){ return <button key={t} type="button" onClick={function(){setTime(t);clrErr("time");}} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid "+(time===t?C.brown:C.border),background:time===t?C.brown:"transparent",color:time===t?"#fff":C.text,fontSize:12,fontWeight:700,cursor:"pointer"}}>{t}</button>; })}
            </div>}
        </Field>
      )}
      <Field label="Motivo (opcional)" C={C}><textarea rows={2} value={notes} onChange={function(e){setNotes(e.target.value);}} placeholder="Describe el motivo..."/></Field>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <Btn onClick={submit} full={true} C={C} disabled={isBlocked||!date}>{"Enviar"+( selPets.length>1?" ("+selPets.length+" mascotas)":"")}</Btn>
        <Btn variant="ghost" onClick={props.onClose} full={true} C={C}>Cancelar</Btn>
      </div>
    </Modal>
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
    <Modal title={"Historia clínica: "+(pet&&pet.name||"")} onClose={props.onClose} C={C}>
      <div style={{display:"flex",gap:12,alignItems:"center",background:C.peach,borderRadius:12,padding:12,marginBottom:16}}>
        <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={48} C={C}/>
        <div>
          <div style={{fontWeight:800,fontSize:16,color:C.brownDark}}>{pet&&pet.name}</div>
          <div style={{fontSize:12,color:C.textMid}}>{pet&&(pet.species+" - "+pet.breed)}</div>
          <div style={{fontSize:12,color:C.textMid}}>{"Cita: "+fmtDate(appointment.date)+" "+appointment.time+" hs"}</div>
        </div>
      </div>
      <Field label="Diagnóstico *" error={errors.diagnosis} C={C}>
        <textarea rows={2} value={diagnosis} onChange={function(e){setDiagnosis(e.target.value);setErrors({});}} placeholder="Diagnóstico principal..."/>
      </Field>
      <TreatmentItemsField items={items} itemText={itemText} itemType={itemType} onItemTextChange={setItemText} onItemTypeChange={setItemType} onAdd={addItem} onRemove={removeItem} onAddFile={async function(itemId,e){var files=Array.from(e.target.files||[]);for(var _i=0;_i<files.length;_i++){var f=files[_i];if(f.size>3*1024*1024){alert("Máximo 3 MB por archivo.");continue;}var b64=await toBase64(f);var fe={id:genId(),file:b64,fileName:f.name};setItems(function(prev){return prev.map(function(x){return x.id===itemId?Object.assign({},x,{files:(x.files||[]).concat([fe])}):x;});});} e.target.value="";}} onRemoveFile={function(itemId,fileId){setItems(function(prev){return prev.map(function(x){return x.id===itemId?Object.assign({},x,{files:(x.files||[]).filter(function(f){return f.id!==fileId;})}):x;});});}} C={C}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <Field label="Peso (kg)" C={C}><input value={weight} onChange={function(e){setWeight(e.target.value);}} placeholder="Ej: 4.5" inputMode="decimal"/></Field>
        <Field label="Duración (min)" C={C}><input type="number" value={duration} onChange={function(e){setDuration(e.target.value);}} placeholder="Ej: 30" min={1} max={300}/></Field>
        <div style={{gridColumn:"1/-1"}}><Field label="Próxima visita" C={C}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input type="date" value={nextVisit} onChange={function(e){setNextVisit(e.target.value);}} min={today()} style={{flex:1}}/>
          {nextVisit&&<button type="button" onClick={function(){setNextVisit("");}} title="Borrar fecha" style={{background:"none",border:"none",color:C.red,fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1,flexShrink:0}}>{"×"}</button>}
        </div>
      </Field></div>
      </div>
      <Field label="Notas adicionales" C={C}><textarea rows={2} value={notes} onChange={function(e){setNotes(e.target.value);}} placeholder="Observaciones..."/></Field>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <Btn onClick={submit} full={true} C={C} variant="success">Guardar y marcar atendida</Btn>
        <Btn variant="ghost" onClick={props.onClose} full={true} C={C}>Cancelar</Btn>
      </div>
    </Modal>
  );
}