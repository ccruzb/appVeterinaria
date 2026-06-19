
function App() {
  var dark=useDark(); var C=palette(dark);
  var s0=useState(false); var ready=s0[0]; var setReady=s0[1];
  var s1=useState(null); var user=s1[0]; var setUser=s1[1];
  var s2=useState([]); var users=s2[0]; var setUsers=s2[1];
  var s3=useState([]); var pets=s3[0]; var setPets=s3[1];
  var s4=useState([]); var records=s4[0]; var setRecords=s4[1];
  var s5=useState([]); var appointments=s5[0]; var setAppointments=s5[1];
  var s6=useState([]); var apptReqs=s6[0]; var setApptReqs=s6[1];
  var s7=useState([]); var notifs=s7[0]; var setNotifs=s7[1];
  var s8=useState([]); var blockedDays=s8[0]; var setBlockedDays=s8[1];
  var s9=useState(""); var tab=s9[0]; var setTab=s9[1];
  var s10=useState(null); var modal=s10[0]; var setModal=s10[1];
  var s11=useState(null); var selPet=s11[0]; var setSelPet=s11[1];
  var s12=useState(null); var pendingAppt=s12[0]; var setPendingAppt=s12[1];
  var s13=useState(null); var clinicalModal=s13[0]; var setClinicalModal=s13[1];
  var s14=useState(null); var carnetModal=s14[0]; var setCarnetModal=s14[1];
  var s14b=useState(false); var showChangePwd=s14b[0]; var setShowChangePwd=s14b[1];
  var s15=useState([]); var surgeries=s15[0]; var setSurgeries=s15[1];
  var s16=useState(null); var surgeryModal=s16[0]; var setSurgeryModal=s16[1];
  var tt=useToast(); var toasts=tt.toasts; var push=tt.push;
  var recentKeys=useMemo(function(){return new Set();},[]);

  useEffect(function(){
    var _readyTimeout=setTimeout(function(){setReady(true);},3000);
    (async function(){
      try {
        var u=await sGet(KEYS.users); if(!u||!u.length){u=SEED_USERS;await sSet(KEYS.users,u);}
        var p=await sGet(KEYS.pets); if(!p){p=SEED_PETS;await sSet(KEYS.pets,p);}
        var r=await sGet(KEYS.records); if(!r){r=SEED_RECORDS;await sSet(KEYS.records,r);}
        var a=await sGet(KEYS.appts); if(!a){a=SEED_APPTS;await sSet(KEYS.appts,a);}
        var rq=await sGet(KEYS.reqs); if(!rq){rq=SEED_REQS;await sSet(KEYS.reqs,rq);}
        var n=await sGet(KEYS.notifs); if(!n){n=[];}
        var bd=await sGet(KEYS.blocked); if(!bd){bd=[];}
        try{ var sv=localStorage.getItem("vc_surgeries"); setSurgeries(sv?JSON.parse(sv):[]);}catch(e){}
        setUsers(u);setPets(p);setRecords(r);setAppointments(a);setApptReqs(rq);setNotifs(n);setBlockedDays(bd);
        var sid=await sGet(KEYS.session);
        if(sid){var su=byId(u,sid); if(su){setUser(su);setTab(su.role==="admin"?"dashboard":su.role==="vet"?"dashboard":"mypets");}}
      } catch(initErr) {
        console.error("VetCare init error:", initErr);
      } finally {
        clearTimeout(_readyTimeout);
        setReady(true);
      }
    })();
  },[]);

  async function pushNotif(toId,msg,icon,extra){
    icon=icon||"🔔"; extra=extra||{};
    var key=toId+"|"+msg.slice(0,40);
    if(recentKeys.has(key))return;
    recentKeys.add(key); setTimeout(function(){recentKeys.delete(key);},8000);
    var notif=Object.assign({id:genId(),toId:toId,msg:msg,icon:icon,ts:Date.now(),read:false},extra);
    setNotifs(function(prev){var next=prev.concat([notif]);sSet(KEYS.notifs,next);return next;});
  }
  function markRead(ids){ setNotifs(function(prev){var next=prev.map(function(n){return ids.indexOf(n.id)>=0?Object.assign({},n,{read:true}):n;});sSet(KEYS.notifs,next);return next;}); }
  function handleNotifAction(notif){
    if(notif.actionId){
      var appt=byId(appointments,notif.actionId);
      if(appt&&appt.status==="pending") setPendingAppt(appt);
      else push("Esta cita ya fue procesada","warning");
    }
  }
  function handleLogin(u,allUsers){ setUsers(allUsers); setUser(u); setTab(u.role==="admin"?"dashboard":u.role==="vet"?"dashboard":"mypets"); }
  async function handleLogout(){ await sSet(KEYS.session,null); setUser(null); setTab(""); setModal(null); setSelPet(null); setPendingAppt(null); setClinicalModal(null); }
  async function savePet(f){
    var np=f.id&&pets.find(function(p){return p.id===f.id;})?pets.map(function(p){return p.id===f.id?f:p;}):pets.concat([Object.assign({},f,{id:"p"+genId()})]);
    await sSet(KEYS.pets,np); setPets(np); setModal(null); push(f.id?"Mascota actualizada":"Mascota registrada");
  }
  async function deletePet(id){
    if(!confirm("Eliminar esta mascota?"))return;
    var np=pets.filter(function(p){return p.id!==id;}); await sSet(KEYS.pets,np); setPets(np);
    var nr=records.filter(function(r){return r.petId!==id;}); await sSet(KEYS.records,nr); setRecords(nr);
  }
  async function saveRecord(f){
    var nr=f.id&&records.find(function(r){return r.id===f.id;})?records.map(function(r){return r.id===f.id?f:r;}):records.concat([Object.assign({},f,{id:"r"+genId()})]);
    await sSet(KEYS.records,nr); setRecords(nr); setModal(null); push(f.id?"Historia actualizada":"Historia guardada");
  }
  async function deleteRecord(id){
    if(!confirm("Eliminar este registro?"))return;
    var nr=records.filter(function(r){return r.id!==id;}); await sSet(KEYS.records,nr); setRecords(nr);
  }
  async function saveAppt(f){
    var pet=byId(pets,f.petId);
    var owner=pet?byId(users,pet.ownerId):null;
    var isNew=!appointments.find(function(a){return a.id===f.id;});
    var newA;
    if(isNew){
      var newAppt=Object.assign({},f,{id:"a"+genId(),ownerId:pet&&pet.ownerId,vetId:"u1",status:"pending",attended:null});
      newA=appointments.concat([newAppt]);
      if(owner){ await pushNotif(owner.id,"Nueva cita: "+fmtDate(f.date)+" "+f.time+" hs ("+f.type+")","📅",{actionId:newAppt.id}); simEmail(owner.email,"Nueva cita - "+(pet&&pet.name),push); simWA(owner.phone,"Nueva cita "+fmtDate(f.date),push); }
    } else {
      newA=appointments.map(function(a){return a.id===f.id?Object.assign({},a,f):a;});
    }
    await sSet(KEYS.appts,newA); setAppointments(newA); setModal(null); push(isNew?"Cita programada":"Cita actualizada");
  }
  async function cancelAppt(a,mode){
    if(mode==="delete"){if(!confirm("Eliminar permanentemente?"))return; var na0=appointments.filter(function(x){return x.id!==a.id;}); await sSet(KEYS.appts,na0); setAppointments(na0); push("Cita eliminada"); return;}
    if(!confirm("Cancelar esta cita?"))return;
    var na=appointments.map(function(x){return x.id===a.id?Object.assign({},x,{status:"cancelled"}):x;});
    await sSet(KEYS.appts,na); setAppointments(na);
    var pet=byId(pets,a.petId); var owner=byId(users,a.ownerId); var vet=byId(users,a.vetId);
    if(mode==="owner"){ if(vet){await pushNotif(vet.id,fullName(owner)+" rechazo la cita de "+(pet&&pet.name),"❌");simEmail(vet.email,"Cita rechazada",push);} }
    else { if(owner){await pushNotif(owner.id,"Tu cita del "+fmtDate(a.date)+" fue cancelada","❌");simEmail(owner.email,"Cita cancelada",push);simWA(owner.phone,"Cita cancelada",push);} }
    push("Cita cancelada");
  }
  async function rescheduleAppt(a,mode){
    if(mode==="confirmed"){
      var na=appointments.map(function(x){return x.id===a.id?Object.assign({},x,{status:"confirmed"}):x;});
      await sSet(KEYS.appts,na); setAppointments(na);
      var pet=byId(pets,a.petId); var vet=byId(users,a.vetId);
      if(vet){await pushNotif(vet.id,fullName(user)+" confirmo la cita de "+(pet&&pet.name),"✅");simEmail(vet.email,"Cita confirmada",push);}
      push("Cita confirmada");
    } else {
      var _pet2=byId(pets,a.petId); var _vet2=byId(users,a.vetId);
      if(_vet2){ await pushNotif(_vet2.id,fullName(user)+" solicita reprogramar la cita de "+(_pet2&&_pet2.name)+" del "+fmtDate(a.date)+" "+a.time,"🔄"); simEmail(_vet2.email,"Solicitud de reprogramacion",push); simWA(_vet2.phone,"Solicitud de reprogramacion",push); }
      setModal({type:"apptForm",data:Object.assign({},a,{id:null,status:"pending",date:"",time:""})});
    }
  }
  var confirmReq=useCallback(async function(apptIds){
    var targets=appointments.filter(function(a){return apptIds.indexOf(a.id)>=0;});
    var count=0;
    for(var i=0;i<targets.length;i++){
      var a=targets[i]; var pet=byId(pets,a.petId); var owner=byId(users,a.ownerId);
      if(owner){await pushNotif(owner.id,"Dr. confirma tu cita de "+(pet&&pet.name)+" "+fmtDate(a.date),"📨",{actionId:a.id});simEmail(owner.email,"Confirmacion de cita",push);simWA(owner.phone,"Confirma tu cita de "+fmtDate(a.date),push);count++;}
    }
    push("Solicitudes enviadas a "+count+" dueno(s)");
  },[appointments,pets,users,push]);
  async function confirmAll(){
    var pending=appointments.filter(function(a){return a.status==="pending";}).map(function(a){return a.id;});
    if(!pending.length){push("Sin citas pendientes","warning");return;}
    await confirmReq(pending);
  }
  async function sendApptReq(req){
    var pet=byId(pets,req.petId);
    var newReq=Object.assign({},req,{id:"rq"+genId(),ownerId:user.id,status:"pending",ts:Date.now()});
    var nrq=apptReqs.concat([newReq]); await sSet(KEYS.reqs,nrq); setApptReqs(nrq);
    var vetAdmins=users.filter(function(u){return u.role==="vet"||u.role==="admin";});
    for(var j=0;j<vetAdmins.length;j++){var v=vetAdmins[j];await pushNotif(v.id,fullName(user)+" solicita cita para "+(pet&&pet.name)+" "+fmtDate(req.date),"📋");simEmail(v.email,"Solicitud de cita",push);simWA(v.phone,"Nueva solicitud de cita",push);}
    push("Solicitud enviada al veterinario");
  }
  async function approveReq(req){
    var pet=byId(pets,req.petId); var owner=byId(users,req.ownerId);
    var newAppt={petId:req.petId,date:req.date,time:req.time,type:req.type,notes:req.notes,id:"a"+genId(),ownerId:req.ownerId,vetId:"u1",status:"confirmed",attended:null};
    var newA=appointments.concat([newAppt]); await sSet(KEYS.appts,newA); setAppointments(newA);
    var nrq=apptReqs.map(function(r){return r.id===req.id?Object.assign({},r,{status:"approved"}):r;}); await sSet(KEYS.reqs,nrq); setApptReqs(nrq);
    if(owner){await pushNotif(owner.id,"Tu solicitud para "+(pet&&pet.name)+" fue aprobada","✅",{actionId:newAppt.id});simEmail(owner.email,"Solicitud aprobada",push);simWA(owner.phone,"Tu cita fue aprobada! "+fmtDate(req.date),push);}
    push("Solicitud aprobada y cita creada");
  }
  async function rejectReq(req){
    var pet=byId(pets,req.petId); var owner=byId(users,req.ownerId);
    var nrq=apptReqs.map(function(r){return r.id===req.id?Object.assign({},r,{status:"rejected"}):r;}); await sSet(KEYS.reqs,nrq); setApptReqs(nrq);
    if(owner){await pushNotif(owner.id,"Tu solicitud para "+(pet&&pet.name)+" fue rechazada","❌");simEmail(owner.email,"Solicitud rechazada",push);simWA(owner.phone,"Tu solicitud fue rechazada",push);}
    push("Solicitud rechazada");
  }
  function openClinical(appt,pet){
    var existing=null; for(var i=0;i<records.length;i++){if(records[i].petId===appt.petId&&records[i].date===appt.date){existing=records[i];break;}}
    setClinicalModal({appt:appt,pet:pet,existingRecord:existing});
  }
  async function confirmAndAttend(appt){
    var na=appointments.map(function(a){return a.id===appt.id?Object.assign({},a,{status:"confirmed"}):a;});
    await sSet(KEYS.appts,na); setAppointments(na);
    var pet=byId(pets,appt.petId);
    var existing=null; for(var j=0;j<records.length;j++){if(records[j].petId===appt.petId&&records[j].date===appt.date){existing=records[j];break;}}
    setClinicalModal({appt:Object.assign({},appt,{status:"confirmed"}),pet:pet,existingRecord:existing});
    push("Cita confirmada - abriendo historia clinica...");
  }
  async function updateRecord(updated){
    var nr=records.map(function(r){return r.id===updated.id?updated:r;});
    await sSet(KEYS.records,nr); setRecords(nr); push("Archivos guardados");
  }
  async function saveClinicalRecord(record,apptId){
    var nr=record.id&&records.find(function(r){return r.id===record.id;})?records.map(function(r){return r.id===record.id?record:r;}):records.concat([record]);
    await sSet(KEYS.records,nr); setRecords(nr);
    var na=appointments.map(function(a){return a.id===apptId?Object.assign({},a,{status:"attended",attended:true}):a;});
    await sSet(KEYS.appts,na); setAppointments(na);
    setClinicalModal(null);
    var pet=byId(pets,record.petId); var appt=byId(appointments,apptId); var owner=appt?byId(users,appt.ownerId):null;
    if(owner){await pushNotif(owner.id,"Historia clinica de "+(pet&&pet.name)+" fue registrada","📋");simEmail(owner.email,"Historia clinica actualizada",push);}
    push("Historia guardada - Cita marcada como atendida");
  }
  async function changePassword(newPwd){
    var nu=users.map(function(u){return u.id===user.id?Object.assign({},u,{password:newPwd}):u;});
    await sSet(KEYS.users,nu); setUsers(nu);
    setUser(function(u){return Object.assign({},u,{password:newPwd});});
    setShowChangePwd(false); push("Contrasena actualizada exitosamente");
  }
  async function saveSurgery(s){
    var ns=s.id&&surgeries.find(function(x){return x.id===s.id;})?surgeries.map(function(x){return x.id===s.id?s:x;}):surgeries.concat([s]);
    setSurgeries(ns); try{localStorage.setItem("vc_surgeries",JSON.stringify(ns));}catch(e){}
    setSurgeryModal(null); push(s.id&&surgeries.find(function(x){return x.id===s.id;})?"Cirugia actualizada":"Cirugia registrada");
  }
  async function deleteSurgery(id){
    if(!confirm("Eliminar esta cirugia?"))return;
    var ns=surgeries.filter(function(x){return x.id!==id;}); setSurgeries(ns);
    try{localStorage.setItem("vc_surgeries",JSON.stringify(ns));}catch(e){}
    push("Cirugia eliminada");
  }

  var isVet=user&&user.role==="vet"; var isAdmin=user&&user.role==="admin"; var isOwner=user&&user.role==="owner";
  var ownerPets=user?pets.filter(function(p){return p.ownerId===user.id;}):[]; 
  var owners=users.filter(function(u){return u.role==="owner";});
  var blockedList=blockedDays.map(function(b){return b.date;});
  var calProps={appointments:appointments,apptReqs:apptReqs,pets:pets,users:users,user:user,onAdd:function(){setModal({type:"apptForm",data:null});},onEdit:function(a){setModal({type:"apptForm",data:a});},onConfirmReq:confirmReq,onConfirmAll:confirmAll,onCancel:cancelAppt,onReschedule:rescheduleAppt,onApprove:approveReq,onReject:rejectReq,onSendReq:sendApptReq,onOpenClinical:openClinical,onConfirmAndAttend:confirmAndAttend,blockedDays:blockedDays,C:C};

  if(!ready) return React.createElement('div',null,
    React.createElement('style',null,buildCss(palette(false))),
    React.createElement('div',{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#FDF6EC",gap:16}},
      React.createElement('div',{style:{fontSize:48}},"🐾"),
      React.createElement('div',{style:{fontSize:14,color:"#4A6275",fontFamily:"sans-serif"}},"Cargando VetCare...")
    )
  );
  if(!user) return React.createElement('div',null,
    React.createElement('style',null,buildCss(C)),
    React.createElement(AuthScreen,{onLogin:handleLogin,users:users,C:C})
  );
  return React.createElement('div',null,
    React.createElement('style',null,buildCss(C)),
    React.createElement(Toast,{toasts:toasts,C:C}),
    React.createElement(Shell,{user:user,tab:tab,setTab:function(t){setTab(t);setSelPet(null);setModal(null);},onLogout:handleLogout,onChangePassword:function(){setShowChangePwd(true);},notifications:notifs,onMarkRead:markRead,onNotifAction:handleNotifAction,C:C},
      isAdmin&&tab==="dashboard"&&React.createElement(Dashboard,{pets:pets,records:records,users:users,appointments:appointments,C:C}),
      isAdmin&&tab==="users"&&React.createElement(AdminUsersPanel,{users:users,setUsers:setUsers,push:push,C:C}),
      isAdmin&&tab==="blocked"&&React.createElement(BlockedPanel,{blockedDays:blockedDays,setBlockedDays:setBlockedDays,push:push,C:C}),
      isAdmin&&tab==="surgeries"&&React.createElement(SurgeriesList,{surgeries:surgeries,pets:pets,users:users,onAdd:function(){setSurgeryModal({data:null});},onEdit:function(s){setSurgeryModal({data:s});},onDelete:deleteSurgery,C:C}),
      isAdmin&&tab==="calendar"&&React.createElement(CalendarView,Object.assign({},calProps)),
      isVet&&tab==="dashboard"&&React.createElement(Dashboard,{pets:pets,records:records,users:users,appointments:appointments,C:C}),
      isVet&&tab==="pets"&&React.createElement(PatientsList,{pets:pets,users:users,records:records,onAdd:function(){setModal({type:"petForm",data:null});},onEdit:function(p){setModal({type:"petForm",data:p});},onDelete:deletePet,onCarnet:function(p){var own=byId(users,p.ownerId);setCarnetModal({pet:p,owner:own});},C:C}),
      isVet&&tab==="records"&&React.createElement(RecordsList,{pets:pets,users:users,records:records,onAdd:function(){setModal({type:"recordForm",data:null});},onEdit:function(r){setModal({type:"recordForm",data:r});},onDelete:deleteRecord,onUpdateRecord:updateRecord,C:C}),
      isVet&&tab==="surgeries"&&React.createElement(SurgeriesList,{surgeries:surgeries,pets:pets,users:users,onAdd:function(){setSurgeryModal({data:null});},onEdit:function(s){setSurgeryModal({data:s});},onDelete:deleteSurgery,C:C}),
      isVet&&tab==="physio"&&React.createElement(PhysioConstants,{C:C}),
      isVet&&tab==="calendar"&&React.createElement(CalendarView,Object.assign({},calProps)),
      isOwner&&tab==="mypets"&&React.createElement(MyPets,{pets:ownerPets,records:records,surgeries:surgeries,onSelect:function(p){setSelPet(p);setTab("history");},onCarnet:function(p){var own=byId(users,p.ownerId);setCarnetModal({pet:p,owner:own});},C:C}),
      isOwner&&tab==="history"&&React.createElement(OwnerHistory,{pets:ownerPets,records:records,selectedPet:selPet,onSelectPet:setSelPet,onUpdateRecord:updateRecord,C:C}),
      isOwner&&tab==="calendar"&&React.createElement(CalendarView,Object.assign({},calProps,{pets:ownerPets,apptReqs:apptReqs.filter(function(r){return r.ownerId===user.id;})}))
    ),
    modal&&modal.type==="petForm"&&React.createElement(PetForm,{owners:owners,existing:modal.data,onSave:savePet,onClose:function(){setModal(null);},C:C,isOwner:isOwner}),
    modal&&modal.type==="recordForm"&&React.createElement(RecordForm,{pets:pets,users:users,vetId:user.id,existing:modal.data,onSave:saveRecord,onClose:function(){setModal(null);},C:C}),
    modal&&modal.type==="apptForm"&&React.createElement(ApptForm,{pets:pets,owners:owners,existing:modal.data,allAppts:appointments,blockedDays:blockedList,onSave:saveAppt,onClose:function(){setModal(null);},C:C,allowBlocked:isVet||isAdmin}),
    pendingAppt&&React.createElement(ApptActionModal,{appointment:pendingAppt,pets:pets,users:users,onConfirm:function(a){rescheduleAppt(a,"confirmed");},onReject:function(a){cancelAppt(a,"owner");},onClose:function(){setPendingAppt(null);},C:C}),
    showChangePwd&&user&&React.createElement(ChangePasswordModal,{user:user,onSave:changePassword,onClose:function(){setShowChangePwd(false);},C:C}),
    surgeryModal&&React.createElement(SurgeryForm,{pets:pets,users:users,vetId:user.id,existing:surgeryModal.data,onSave:saveSurgery,onClose:function(){setSurgeryModal(null);},C:C}),
    carnetModal&&React.createElement(CarnetModal,{pet:carnetModal.pet,owner:carnetModal.owner,onClose:function(){setCarnetModal(null);},C:C}),
    clinicalModal&&React.createElement(ClinicalNoteModal,{appointment:clinicalModal.appt,pet:clinicalModal.pet,vetId:user.id,existingRecord:clinicalModal.existingRecord,onSave:saveClinicalRecord,onClose:function(){setClinicalModal(null);},C:C})
  );
}

try {
  ReactDOM.render(React.createElement(App), document.getElementById("root"));
  setTimeout(function(){
    var ld=document.getElementById("loading");
    if(ld){ ld.classList.add("hide"); setTimeout(function(){ld.style.display="none";},600); }
  }, 300);
} catch(err) {
  document.getElementById("loading").innerHTML = "<div style=\"padding:40px;text-align:center;font-family:sans-serif\"><h2 style=\"color:#c00\">Error al cargar VetCare</h2><pre style=\"font-size:12px;color:#333;white-space:pre-wrap\">"+err.message+"</pre></div>";
  console.error("VetCare render error:", err);
}