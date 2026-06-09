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
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark}}>Gestión de Usuarios</h2>
        <Btn C={C} onClick={function(){setShowAdd(true);}}>+ Nuevo usuario</Btn>
      </div>
      <p style={{color:C.textMid,fontSize:13,marginBottom:16}}>{users.length+" usuarios registrados"}</p>
      <div style={{marginBottom:14}}><input placeholder="Buscar por nombre o email..." value={search} onChange={function(e){setSearch(e.target.value);}}/></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(function(u){
          var rc=roleColor[u.role]||C.green;
          var rl=roleLabel[u.role]||u.role;
          return (
            <Card key={u.id} C={C} style={{padding:"14px 16px",opacity:u.blocked?0.65:1}}>
              <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{width:44,height:44,borderRadius:12,background:rc+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{u.role==="admin"?"🛡️":u.role==="vet"?"🩺":"👤"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:15,color:C.brownDark}}>{fullName(u)}{u.blocked&&<span style={{marginLeft:8,background:C.redLight,color:C.red,borderRadius:8,padding:"2px 8px",fontSize:11}}>BLOQUEADO</span>}</div>
                  <div style={{fontSize:12,color:C.textMid}}>{u.email+" - "+u.docType+": "+(u.docNum||"—")}</div>
                  <div style={{fontSize:12,color:C.textLight}}><span style={{background:rc+"22",color:rc,borderRadius:8,padding:"2px 8px",fontWeight:700}}>{rl}</span>{u.phone&&<span style={{marginLeft:8}}>{"📱 "+u.phone}</span>}</div>
                </div>
                <div style={{display:"flex",gap:6,flexShrink:0,flexWrap:"wrap"}}>
                  <Btn small={true} variant="ghost" C={C} onClick={function(){setEditUser(u);}}>✏️</Btn>
                  <Btn small={true} variant="purple" C={C} onClick={function(){sendCreds(u);}}>📧</Btn>
                  {u.role!=="admin"&&<Btn small={true} variant={u.blocked?"success":"danger"} C={C} onClick={function(){toggleBlock(u);}}>{u.blocked?"🔓":"🔒"}</Btn>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {editUser&&<EditUserModal user={editUser} onSave={saveEdit} onClose={function(){setEditUser(null);}} C={C}/>}
      {showAdd&&<AddUserModal users={users} onAdd={addNewUser} onClose={function(){setShowAdd(false);}} C={C}/>}
    </div>
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
  var s8=useState(""); var newPass=s8[0]; var setNewPass=s8[1];
  var s9=useState({}); var errors=s9[0]; var setErrors=s9[1];
  function submit(){
    if(!firstName.trim()||!lastName.trim()){setErrors({name:"Nombre y apellido obligatorios."});return;}
    var updated=Object.assign({},user,{firstName:firstName.trim(),lastName:lastName.trim(),email:email,phone:phone,docType:docType,docNum:docNum,role:role});
    if(newPass.length>=4) updated.password=newPass;
    props.onSave(updated);
  }
  return (
    <Modal title={"Editar: "+fullName(user)} onClose={props.onClose} C={C}>
      {errors.name&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{errors.name}</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
        <Field label="Nombre *" C={C}><input value={firstName} onChange={function(e){setFirstName(e.target.value);}} placeholder="Nombre"/></Field>
        <Field label="Apellido *" C={C}><input value={lastName} onChange={function(e){setLastName(e.target.value);}} placeholder="Apellido"/></Field>
      </div>
      <Field label="Email" C={C}><input type="email" value={email} onChange={function(e){setEmail(e.target.value);}}/></Field>
      <Field label="Telefono / WhatsApp" C={C}><input value={phone} onChange={function(e){setPhone(sanitizePhone(e.target.value));}} placeholder="999999999" maxLength={9}/></Field>
      <Field label="Rol" C={C}><select value={role} onChange={function(e){setRole(e.target.value);}}><option value="owner">Dueño</option><option value="vet">Veterinario</option><option value="admin">Admin</option></select></Field>
      <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:"0 10px"}}>
        <Field label="Tipo doc." C={C}><select value={docType} onChange={function(e){setDocType(e.target.value);}}><option value="DNI">DNI</option><option value="CE">Carnet</option><option value="PAS">Pasaporte</option></select></Field>
        <Field label="Nº documento" C={C}><input value={docNum} onChange={function(e){setDocNum(e.target.value);}}/></Field>
      </div>
      <PasswordField label="Nueva contrasena (vacio = no cambiar)" value={newPass} onChange={function(e){setNewPass(e.target.value);}} C={C}/>
      <div style={{display:"flex",gap:10,marginTop:8}}><Btn onClick={submit} full={true} C={C}>Guardar</Btn><Btn variant="ghost" onClick={props.onClose} full={true} C={C}>Cancelar</Btn></div>
    </Modal>
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
    var nu={id:"u"+genId(),role:role,firstName:firstName.trim(),lastName:lastName.trim(),email:email.trim(),password:pass,docType:docType,docNum:docNum,phone:phone.trim(),blocked:false};
    props.onAdd(nu);
  }
  return (
    <Modal title="Crear nuevo usuario" onClose={props.onClose} C={C}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
        <Field label="Nombre *" error={errors.firstName} C={C}><input value={firstName} onChange={function(e){setFirstName(e.target.value);}} className={errors.firstName?"err":""}/></Field>
        <Field label="Apellido *" error={errors.lastName} C={C}><input value={lastName} onChange={function(e){setLastName(e.target.value);}} className={errors.lastName?"err":""}/></Field>
      </div>
      <Field label="Rol" C={C}><select value={role} onChange={function(e){setRole(e.target.value);}}><option value="owner">Dueño</option><option value="vet">Veterinario</option><option value="admin">Admin</option></select></Field>
      <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:"0 10px"}}>
        <Field label="Tipo doc." C={C}><select value={docType} onChange={function(e){setDocType(e.target.value);}}><option value="DNI">DNI</option><option value="CE">Carnet</option><option value="PAS">Pasaporte</option></select></Field>
        <Field label="Nº documento" error={errors.docNum} C={C}><input value={docNum} onChange={function(e){setDocNum(e.target.value);}} className={errors.docNum?"err":""}/></Field>
      </div>
      <Field label="Telefono / WhatsApp" C={C}><input value={phone} onChange={function(e){setPhone(sanitizePhone(e.target.value));}} placeholder="999999999" maxLength={9}/></Field>
      <Field label="Email *" error={errors.email} C={C}><input type="email" value={email} onChange={function(e){setEmail(e.target.value);}} className={errors.email?"err":""}/></Field>
      <PasswordField label="Contrasena *" value={pass} onChange={function(e){setPass(e.target.value);}} error={errors.pass} C={C}/>
      <div style={{display:"flex",gap:10,marginTop:8}}><Btn onClick={submit} full={true} C={C}>Crear</Btn><Btn variant="ghost" onClick={props.onClose} full={true} C={C}>Cancelar</Btn></div>
    </Modal>
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
    <div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark,marginBottom:4}}>Dias Bloqueados</h2>
      <p style={{color:C.textMid,fontSize:13,marginBottom:16}}>Los duenos no pueden solicitar citas en estos dias</p>
      <Card C={C} style={{marginBottom:18}}>
        <h3 style={{fontWeight:800,color:C.brownDark,marginBottom:14,fontSize:14}}>Bloquear dias</h3>
        <div style={{display:"flex",marginBottom:14,background:C.peach,borderRadius:10,padding:4}}>
          {["single","range"].map(function(m){return <button key={m} onClick={function(){setMode(m);setErr("");}} style={{flex:1,padding:"8px 0",borderRadius:8,background:mode===m?C.surface:"transparent",border:"none",fontWeight:700,color:mode===m?C.brownDark:C.textMid,fontSize:13}}>{m==="single"?"Un dia":"Rango de dias"}</button>;})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
          <Field label={mode==="range"?"Fecha inicio *":"Fecha *"} C={C}><input type="date" value={dateFrom} onChange={function(e){setDateFrom(e.target.value);}} min={today()}/></Field>
          {mode==="range"?<Field label="Fecha fin *" C={C}><input type="date" value={dateTo} onChange={function(e){setDateTo(e.target.value);}} min={dateFrom||today()}/></Field>:<div/>}
          <div style={{gridColumn:"1/-1"}}><Field label="Motivo (opcional)" C={C}><input value={reason} onChange={function(e){setReason(e.target.value);}} placeholder="Feriado, mantenimiento..."/></Field></div>
        </div>
        {err&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{err}</div>}
        <Btn onClick={addBlock} disabled={!dateFrom||(mode==="range"&&!dateTo)} C={C}>Bloquear</Btn>
      </Card>
      {blockedDays.length>0&&(
        <div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
            <span style={{fontSize:13,color:C.textMid}}>{blockedDays.length+" dia(s) bloqueado(s)"}</span>
            {selected.length>0&&<Btn small={true} variant="danger" C={C} onClick={removeSelected}>{"Desbloquear ("+selected.length+")"}</Btn>}
          </div>
          <div style={{marginBottom:10}}><input placeholder="Buscar fecha o motivo..." value={search} onChange={function(e){setSearch(e.target.value);}}/></div>
          {filtered.length===0&&<p style={{color:C.textLight,textAlign:"center",padding:20,fontSize:13}}>Sin resultados</p>}
          {filtered.map(function(b){
            var isSel=selected.indexOf(b.date)>=0;
            return (
              <div key={b.date} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"1.5px solid "+(isSel?C.red:C.border),background:isSel?C.redLight:C.surface,marginBottom:6,cursor:"pointer"}} onClick={function(){toggleSel(b.date);}}>
                <div style={{width:18,height:18,borderRadius:4,border:"2px solid "+(isSel?C.red:C.border),background:isSel?C.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{isSel&&<span style={{color:"#fff",fontSize:11}}>v</span>}</div>
                <div style={{fontSize:22,flexShrink:0}}>🚫</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:13,color:C.brownDark}}>{fmtDate(b.date)}</div>
                  <div style={{fontSize:12,color:C.textMid}}>{b.reason}</div>
                </div>
                <Btn small={true} variant="danger" C={C} onClick={function(e){e.stopPropagation();removeSingle(b.date);}}>🔓</Btn>
              </div>
            );
          })}
        </div>
      )}
      {blockedDays.length===0&&<p style={{color:C.textLight,textAlign:"center",padding:40}}>No hay dias bloqueados.</p>}
    </div>
  );
}