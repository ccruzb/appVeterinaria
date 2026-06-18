
function App() {
  var dark=useDark(); var C=palette(dark);
  var s0=useState(false); var ready=s0[0]; var setReady=s0[1];
  var s1=useState(null); var user=s1[0]; var setUser=s1[1];
  var s2=useState(""); var tab=s2[0]; var setTab=s2[1];
  var s3=useState([]); var users=s3[0]; var setUsers=s3[1];
  var s4=useState([]); var pets=s4[0]; var setPets=s4[1];
  var s5=useState([]); var records=s5[0]; var setRecords=s5[1];
  var s6=useState([]); var appointments=s6[0]; var setAppointments=s6[1];
  var s7=useState([]); var apptReqs=s7[0]; var setApptReqs=s7[1];
  var s8=useState([]); var notifs=s8[0]; var setNotifs=s8[1];
  var s9=useState([]); var blockedDays=s9[0]; var setBlockedDays=s9[1];
  var s10=useState(null); var modal=s10[0]; var setModal=s10[1];
  var s11=useState(null); var selPet=s11[0]; var setSelPet=s11[1];
  var s12=useState(null); var surgeryModal=s12[0]; var setSurgeryModal=s12[1];
  var s13=useState(null); var carnetModal=s13[0]; var setCarnetModal=s13[1];
  var s14=useState(false); var showChangePwd=s14[0]; var setShowChangePwd=s14[1];
  var s15=useState([]); var surgeries=s15[0]; var setSurgeries=s15[1];
  var tt=useToast(); var toasts=tt.toasts; var push=tt.push;

  useEffect(function(){
    var _t=setTimeout(function(){setReady(true);},4000);
    (async function(){
      try {
        var u=await sGet(KEYS.users); if(!u||!u.length){u=SEED_USERS;await sSet(KEYS.users,u);}
        var p=await sGet(KEYS.pets); if(!p||!p.length){p=SEED_PETS;await sSet(KEYS.pets,p);}
        var r=await sGet(KEYS.records); if(!r){r=SEED_RECORDS;await sSet(KEYS.records,r);}
        var a=await sGet(KEYS.appts); if(!a){a=SEED_APPTS;await sSet(KEYS.appts,a);}
        var rq=await sGet(KEYS.reqs); if(!rq){rq=SEED_REQS;await sSet(KEYS.reqs,rq);}
        var n=await sGet(KEYS.notifs); if(!n){n=[];}
        var bd=await sGet(KEYS.blocked); if(!bd){bd=[];}
        try{var sv=localStorage.getItem("vc_surgeries");setSurgeries(sv?JSON.parse(sv):[]);}catch(e){}
        setUsers(u);setPets(p);setRecords(r);setAppointments(a);setApptReqs(rq);setNotifs(n);setBlockedDays(bd);
        var sid=await sGet(KEYS.session);
        if(sid){var su=byId(u,sid); if(su){setUser(su);setTab(su.role==="admin"?"dashboard":su.role==="vet"?"dashboard":"mypets");}}
      } catch(e){ console.error("init error",e); }
      finally{clearTimeout(_t);setReady(true);}
    })();
  },[]);

  function handleLogin(u,allUsers){setUsers(allUsers);setUser(u);setTab(u.role==="admin"?"dashboard":u.role==="vet"?"dashboard":"mypets");}
  async function handleLogout(){await sSet(KEYS.session,null);setUser(null);setTab("");setModal(null);}
  function markRead(ids){setNotifs(function(prev){var next=prev.map(function(n){return ids.indexOf(n.id)>=0?Object.assign({},n,{read:true}):n;});sSet(KEYS.notifs,next);return next;});}
  async function savePet(f){var exists=pets.find(function(x){return x.id===f.id;});var np=exists?pets.map(function(x){return x.id===f.id?f:x;}):pets.concat([f]);await sSet(KEYS.pets,np);setPets(np);setModal(null);push("Paciente guardado");}
  async function deletePet(id){var np=pets.filter(function(x){return x.id!==id;});await sSet(KEYS.pets,np);setPets(np);push("Paciente eliminado","warning");}
  async function saveRecord(f){var exists=records.find(function(x){return x.id===f.id;});var nr=exists?records.map(function(x){return x.id===f.id?f:x;}):records.concat([f]);await sSet(KEYS.records,nr);setRecords(nr);setModal(null);push("Historia guardada");}
  async function deleteRecord(id){var nr=records.filter(function(x){return x.id!==id;});await sSet(KEYS.records,nr);setRecords(nr);push("Historia eliminada","warning");}
  async function saveAppt(f){var exists=appointments.find(function(x){return x.id===f.id;});var na=exists?appointments.map(function(x){return x.id===f.id?f:x;}):appointments.concat([f]);await sSet(KEYS.appts,na);setAppointments(na);setModal(null);push("Cita guardada");}
  async function cancelAppt(a){var na=appointments.map(function(x){return x.id===a.id?Object.assign({},x,{status:"cancelled"}):x;});await sSet(KEYS.appts,na);setAppointments(na);push("Cita cancelada","warning");}
  async function changePassword(newPwd){if(!user)return;var nu=users.map(function(x){return x.id===user.id?Object.assign({},x,{password:newPwd}):x;});await sSet(KEYS.users,nu);setUsers(nu);setUser(Object.assign({},user,{password:newPwd}));push("Contraseña actualizada");}
  async function saveSurgery(s){var exists=surgeries.find(function(x){return x.id===s.id;});var ns=exists?surgeries.map(function(x){return x.id===s.id?s:x;}):surgeries.concat([s]);setSurgeries(ns);try{localStorage.setItem("vc_surgeries",JSON.stringify(ns));}catch(e){}setSurgeryModal(null);push("Cirugía guardada");}
  async function deleteSurgery(id){var ns=surgeries.filter(function(x){return x.id!==id;});setSurgeries(ns);try{localStorage.setItem("vc_surgeries",JSON.stringify(ns));}catch(e){}push("Cirugía eliminada","warning");}

  var isAdmin=user&&user.role==="admin";
  var isVet=user&&user.role==="vet";
  var isOwner=user&&user.role==="owner";
  var allUsers=users;
  var ownerPets=isOwner?pets.filter(function(p){return p.ownerId===user.id;}):[];
  var calProps={pets:pets,users:allUsers,appointments:appointments,blockedDays:blockedDays,onAdd:function(){setModal({type:"apptForm",data:null});},C:C};

  if(!ready) return React.createElement('div',{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#F0F4F8",gap:16,fontFamily:"Nunito,sans-serif"}},
    React.createElement('div',{style:{fontSize:48}},'🐾'),
    React.createElement('div',{style:{fontSize:14,color:"#4A6275"}},'Cargando VetCare...')
  );

  if(!user) return React.createElement('div',null,
    React.createElement('style',null,buildCss(C)),
    React.createElement(AuthScreen,{onLogin:handleLogin,users:users,C:C})
  );

  return React.createElement('div',null,
    React.createElement('style',null,buildCss(C)),
    React.createElement(Toast,{toasts:toasts,C:C}),
    React.createElement(Shell,{
      user:user,tab:tab,
      setTab:function(t){setTab(t);setSelPet&&setSelPet(null);setModal(null);},
      onLogout:handleLogout,
      onChangePassword:function(){setShowChangePwd(true);},
      notifications:notifs,onMarkRead:markRead,onNotifAction:function(){},
      C:C
    },
      isAdmin&&tab==="dashboard"&&React.createElement(Dashboard,{pets:pets,records:records,users:allUsers,appointments:appointments,C:C}),
      isAdmin&&tab==="users"&&React.createElement(AdminUsersPanel,{users:allUsers,setUsers:setUsers,push:push,C:C}),
      isAdmin&&tab==="blocked"&&React.createElement(BlockedPanel,{blockedDays:blockedDays,setBlockedDays:setBlockedDays,push:push,C:C}),
      isAdmin&&tab==="surgeries"&&React.createElement(SurgeriesList,{surgeries:surgeries,pets:pets,users:allUsers,onAdd:function(){setSurgeryModal({data:null});},onEdit:function(s){setSurgeryModal({data:s});},onDelete:deleteSurgery,C:C}),
      isAdmin&&tab==="calendar"&&React.createElement(CalendarView,calProps),
      isVet&&tab==="dashboard"&&React.createElement(Dashboard,{pets:pets,records:records,users:allUsers,appointments:appointments,C:C}),
      isVet&&tab==="pets"&&React.createElement(PatientsList,{pets:pets,users:allUsers,records:records,onAdd:function(){setModal({type:"petForm",data:null});},onEdit:function(p){setModal({type:"petForm",data:p});},onDelete:deletePet,onCarnet:function(p){setCarnetModal({pet:p,owner:byId(allUsers,p.ownerId)});},C:C}),
      isVet&&tab==="records"&&React.createElement(RecordsList,{pets:pets,users:allUsers,records:records,onAdd:function(){setModal({type:"recordForm",data:null});},onEdit:function(r){setModal({type:"recordForm",data:r});},onDelete:deleteRecord,C:C}),
      isVet&&tab==="surgeries"&&React.createElement(SurgeriesList,{surgeries:surgeries,pets:pets,users:allUsers,onAdd:function(){setSurgeryModal({data:null});},onEdit:function(s){setSurgeryModal({data:s});},onDelete:deleteSurgery,C:C}),
      isVet&&tab==="calendar"&&React.createElement(CalendarView,calProps),
      isOwner&&tab==="mypets"&&React.createElement(MyPets,{pets:ownerPets,records:records,onSelect:function(p){setSelPet(p);setTab("history");},onCarnet:function(p){setCarnetModal({pet:p,owner:byId(allUsers,p.ownerId)});},C:C}),
      isOwner&&tab==="history"&&React.createElement(OwnerHistory,{pets:ownerPets,records:records,selectedPet:selPet,onSelectPet:setSelPet,C:C}),
      isOwner&&tab==="calendar"&&React.createElement(CalendarView,Object.assign({},calProps,{pets:ownerPets}))
    ),
    modal&&modal.type==="petForm"&&React.createElement(PetForm,{owners:allUsers,existing:modal.data,onSave:savePet,onClose:function(){setModal(null);},C:C,isOwner:isOwner}),
    modal&&modal.type==="recordForm"&&React.createElement(RecordForm,{pets:pets,users:allUsers,vetId:user.id,existing:modal.data,onSave:saveRecord,onClose:function(){setModal(null);},C:C}),
    modal&&modal.type==="apptForm"&&React.createElement(ApptForm,{pets:pets,owners:allUsers,existing:modal.data,blockedDays:blockedDays.map(function(b){return b.date;}),onSave:saveAppt,onClose:function(){setModal(null);},C:C,allowBlocked:isVet||isAdmin}),
    showChangePwd&&user&&React.createElement(ChangePasswordModal,{user:user,onSave:changePassword,onClose:function(){setShowChangePwd(false);},C:C}),
    surgeryModal&&React.createElement(SurgeryForm,{pets:pets,users:allUsers,vetId:user.id,existing:surgeryModal.data,onSave:saveSurgery,onClose:function(){setSurgeryModal(null);},C:C}),
    carnetModal&&React.createElement(CarnetModal,{pet:carnetModal.pet,owner:carnetModal.owner,onClose:function(){setCarnetModal(null);},C:C})
  );
}

try {
  ReactDOM.render(React.createElement(App), document.getElementById("root"));
  setTimeout(function(){
    var ld=document.getElementById("loading");
    if(ld){ld.classList.add("hide");setTimeout(function(){ld.style.display="none";},600);}
  }, 300);
} catch(err) {
  document.getElementById("loading").innerHTML = "<div style=\"padding:40px;text-align:center;font-family:sans-serif\"><h2 style=\"color:#c00\">Error al cargar VetCare</h2><pre style=\"font-size:12px;color:#333;white-space:pre-wrap\">"+err.message+"</pre></div>";
  console.error("VetCare render error:", err);
}