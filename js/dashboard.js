function ProximasCitasCard(props) {
  var upcoming=props.upcoming, getPet=props.getPet, getOwner=props.getOwner, C=props.C;
  var s=useState(false); var open=s[0]; var setOpen=s[1];
  return (
    <div style={{borderRadius:16,border:"1px solid "+C.border,overflow:"hidden"}}>
      <button onClick={function(){setOpen(function(o){return !o;});}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",background:C.surface,border:"none",cursor:"pointer",textAlign:"left"}}>
        <h3 style={{fontWeight:800,color:C.brownDark,fontSize:14,margin:0}}>{"Próximas citas ("+(upcoming.length)+")"}</h3>
        <span style={{color:C.brown,fontSize:18,fontWeight:700}}>{open?"▾":"▸"}</span>
      </button>
      {open&&(
        <div style={{background:C.surface,borderTop:"1px solid "+C.border}}>
          {upcoming.length===0
            ?<p style={{color:C.textLight,fontSize:13,padding:"12px 20px"}}>No hay citas</p>
            :upcoming.map(function(a){
              var pet=getPet(a.petId), owner=getOwner(a.ownerId);
              return (
                <div key={a.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 20px",borderBottom:"1px solid "+C.border}}>
                  <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={32} C={C}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pet&&pet.name}</div>
                    <div style={{fontSize:11,color:C.textMid}}>{fmtDate(a.date)+" - "+a.time+" - "+fullName(owner)}</div>
                  </div>
                  <StatusBadge status={a.status} C={C}/>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
function Dashboard(props) {
  var pets=props.pets, records=props.records, users=props.users, appointments=props.appointments, C=props.C;
  var isMobile=useIsMobile();
  var owners=users.filter(function(u){return u.role==="owner";});
  var thisMonth=new Date().toISOString().slice(0,7);
  var monthRecs=records.filter(function(r){return r.date.startsWith(thisMonth);});
  var upcoming=appointments.filter(function(a){return a.date>=today()&&a.status!=="cancelled";}).sort(function(a,b){return a.date.localeCompare(b.date)||a.time.localeCompare(b.time);}).slice(0,6);
  var byType=["Consulta","Vacunación","Cirugía","Urgencia","Control"].map(function(t){return {type:t,count:records.filter(function(r){return r.type===t;}).length};}).filter(function(x){return x.count>0;});
  var attRecs=records.filter(function(r){return r.attended===true&&r.duration;});
  var avgDur=attRecs.length>0?Math.round(attRecs.reduce(function(s,r){return s+r.duration;},0)/attRecs.length):null;
  var absentCount=records.filter(function(r){return r.attended===false;}).length;
  function getPet(id){return byId(pets,id);}
  function getOwner(id){return byId(users,id);}
  return (
    <div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark,marginBottom:4}}>Dashboard</h2>
      <p style={{color:C.textMid,marginBottom:16,fontSize:13}}>{new Date().toLocaleDateString("es-PE",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</p>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:16}}>
        <StatCard icon="🐾" label="Pacientes"  value={pets.length}      color={C.brown} C={C}/>
        <StatCard icon="👥" label="Dueños"     value={owners.length}    color={C.blue}  C={C}/>
        <StatCard icon="📋" label="Historias"  value={records.length}   color={C.green} C={C}/>
        <StatCard icon="📅" label="Este mes"   value={monthRecs.length} color={C.red}   C={C}/>
      </div>
      {(avgDur||absentCount>0)&&(
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12,marginBottom:16}}>
          {avgDur&&<StatCard icon="⏱️" label="Duración media/cita" value={avgDur+" min"} color={C.purple} C={C}/>}
          {absentCount>0&&<StatCard icon="x" label="No asistieron" value={absentCount} color={C.yellow} C={C}/>}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
        <Card C={C}>
          <h3 style={{fontWeight:800,color:C.brownDark,marginBottom:14,fontSize:14}}>Atenciones por tipo</h3>
          {byType.length===0?<p style={{color:C.textLight,fontSize:13}}>Sin datos</p>:byType.map(function(item){
            return (
              <div key={item.type} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:13}}><span style={{color:C.text}}>{item.type}</span><span style={{fontWeight:700,color:C.brown}}>{item.count}</span></div>
                <div style={{background:C.peach,borderRadius:20,height:7}}><div style={{background:C.brown,borderRadius:20,height:7,width:(Math.round((item.count/records.length)*100))+"%",transition:"width .4s"}}/></div>
              </div>
            );
          })}
        </Card>
        <ProximasCitasCard upcoming={upcoming} getPet={getPet} getOwner={getOwner} C={C}/>
      </div>
    </div>
  );
}
function PatientsList(props) {
  var pets=props.pets, users=props.users, records=props.records, C=props.C;
  var isMobile=useIsMobile();
  var s=useState(""); var search=s[0]; var setSearch=s[1];
  var filtered=pets.filter(function(p){
    var s=search.toLowerCase();
    if(!s) return true;
    if(p.name.toLowerCase().indexOf(s)>=0) return true;
    if(p.species.toLowerCase().indexOf(s)>=0) return true;
    var own=byId(users,p.ownerId);
    if(own&&own.docNum&&own.docNum.indexOf(s)>=0) return true;
    if(own&&fullName(own).toLowerCase().indexOf(s)>=0) return true;
    return false;
  });
  function getOwner(id){return byId(users,id);}
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark}}>Pacientes</h2><p style={{color:C.textMid,fontSize:13}}>{pets.length+" registrados"}</p></div>
        <Btn C={C} onClick={props.onAdd}>+ Nueva mascota</Btn>
      </div>
      <div style={{marginBottom:14}}><input placeholder="Buscar por nombre, especie, dueño o N° doc..." value={search} onChange={function(e){setSearch(e.target.value);}}/></div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {filtered.map(function(pet){
          var owner=getOwner(pet.ownerId), count=records.filter(function(r){return r.petId===pet.id;}).length, age=calcAge(pet.dob);
          return (
            <Card key={pet.id} C={C}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}><PetAvatar photo={pet.photo} avatar={pet.avatar} size={54} C={C}/><div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,fontSize:15,color:C.brownDark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pet.name}</div><div style={{fontSize:13,color:C.textMid}}>{pet.species+(pet.breed?" - "+pet.breed:"")}</div>{age&&<div style={{fontSize:12,color:C.textLight}}>{age}</div>}<div style={{fontSize:12,color:C.textLight}}>{"Dueño: "+fullName(owner)}</div></div></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,paddingTop:10,borderTop:"1px solid "+C.border}}>
                <div style={{fontSize:12,color:C.textMid}}>{count+" hist."+(pet.weight?" - "+pet.weight+" kg":"")}</div>
                <div style={{display:"flex",gap:6}}>
                  <Btn small={true} variant="ghost" C={C} onClick={function(){props.onEdit(pet);}}>✏️</Btn>
                  <Btn small={true} variant="ghost" C={C} onClick={function(){props.onCarnet&&props.onCarnet(pet);}} title="Generar carnet">🪪</Btn>
                  <Btn small={true} variant="ghost" C={C} onClick={function(){props.onDelete(pet.id);}} style={{color:C.red}}>🗑️</Btn>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length===0&&<p style={{color:C.textLight,gridColumn:"1/-1",textAlign:"center",padding:40}}>Sin resultados.</p>}
      </div>
    </div>
  );
}
function RecordsList(props) {
  var records=props.records, pets=props.pets, users=props.users||[], onUpdateRecord=props.onUpdateRecord||null, C=props.C;
  var isMobile=useIsMobile();
  var s1=useState(""); var search=s1[0]; var setSearch=s1[1];
  var s2=useState("Todos"); var ftype=s2[0]; var setFtype=s2[1];
  var TYPES=["Todos","Consulta","Vacunación","Cirugía","Urgencia","Control"];
  var SPECIES=["Todas","Perro","Gato","Ave","Conejo","Reptil","Pez","Otro"];
  var s3=useState("Todas"); var fspecies=s3[0]; var setFspecies=s3[1];
  function getPet(id){return byId(pets,id);}
  var filtered=records.filter(function(r){
    var pet=getPet(r.petId);
    var s=search.toLowerCase();
    var ms=true;
    if(s){
      var owner=pet?byId(users,pet.ownerId):null;
      var matchPet=pet&&pet.name.toLowerCase().indexOf(s)>=0;
      var matchDiag=r.diagnosis.toLowerCase().indexOf(s)>=0;
      var matchOwner=owner&&fullName(owner).toLowerCase().indexOf(s)>=0;
      var matchDoc=owner&&owner.docNum&&owner.docNum.indexOf(s)>=0;
      ms=matchPet||matchDiag||matchOwner||matchDoc;
    }
    var speciesMatch=fspecies==="Todas"||(function(){var _pet=getPet(r.petId);return _pet&&_pet.species===fspecies;})();
    return ms&&(ftype==="Todos"||r.type===ftype)&&speciesMatch;
  }).sort(function(a,b){return b.date.localeCompare(a.date);});
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark}}>Historias Clínicas</h2><p style={{color:C.textMid,fontSize:13}}>{records.length+" registros"}</p></div>
        <Btn C={C} onClick={props.onAdd} disabled={pets.length===0}>+ Nueva historia</Btn>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:8,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:180}}><input placeholder="Buscar por mascota, diagnóstico, dueño o N° doc..." value={search} onChange={function(e){setSearch(e.target.value);}}/></div>
        <select value={ftype} onChange={function(e){setFtype(e.target.value);}} style={{width:"auto",minWidth:130}}>{TYPES.map(function(t){return <option key={t}>{t}</option>;})}</select>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {SPECIES.map(function(sp){
          var active=fspecies===sp;
          return <button key={sp} onClick={function(){setFspecies(sp);}} style={{padding:"5px 12px",borderRadius:20,border:"1.5px solid "+(active?C.brown:C.border),background:active?C.brown:"transparent",color:active?"#fff":C.textMid,fontSize:12,fontWeight:700,cursor:"pointer"}}>{sp}</button>;
        })}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(function(r){
          var pet=getPet(r.petId);
          return (
            <Card key={r.id} C={C} style={{padding:"12px 14px"}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={40} C={C}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><span style={{fontWeight:800,fontSize:14,color:C.brownDark}}>{pet&&pet.name}</span><Badge type={r.type}/>{r.attended===true&&<StatusBadge status="attended" C={C}/>}{r.attended===false&&<StatusBadge status="absent" C={C}/>}</div>
                    {pet&&(function(){var own=null;for(var _i=0;_i<props.users.length;_i++){if(props.users[_i].id===pet.ownerId){own=props.users[_i];break;}} return own?<div style={{fontSize:11,color:C.textLight}}>{"Dueño: "+fullName(own)}</div>:null;})()}
                    <div style={{display:"flex",gap:4}}><Btn small={true} variant="ghost" C={C} onClick={function(){props.onEdit(r);}}>✏️</Btn><Btn small={true} variant="ghost" C={C} onClick={function(){props.onDelete(r.id);}} style={{color:C.red}}>🗑️</Btn></div>
                  </div>
                  <div style={{fontSize:12,color:C.textLight,marginBottom:8}}>
                  {fmtDate(r.date)+(r.weight?" - "+r.weight+" kg":"")+(r.duration?" - "+r.duration+" min":"")}
                  {(function(){var pet2=getPet(r.petId);var own=null;return own?<span style={{marginLeft:8,background:C.tan+"22",color:C.brownDark,borderRadius:6,padding:"1px 6px",fontSize:11}}>{"👤 "+(own.docNum||"—")+" · "+fullName(own)}</span>:null;})()}
                </div>
                  <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:8}}>
                    <div style={{background:C.peach,borderRadius:10,padding:"7px 10px"}}><div style={{fontSize:10,fontWeight:700,color:C.textMid,marginBottom:2}}>DIAGNOSTICO</div><div style={{fontSize:13,color:C.text}}>{r.diagnosis||"—"}</div></div>
                    <div style={{background:C.greenLight,borderRadius:10,padding:"7px 10px"}}><div style={{fontSize:10,fontWeight:700,color:C.textMid,marginBottom:2}}>TRATAMIENTO</div><div style={{fontSize:13,color:C.text}}>{r.treatment||"—"}</div></div>
                  </div>
                  {r.items&&r.items.length>0&&<OwnerItemsDisplay items={r.items} record={r} onUpdateRecord={props.onUpdateRecord} C={C}/>}
                  {r.nextVisit&&<div style={{marginTop:6,fontSize:12,background:C.blueLight,color:C.blue,borderRadius:8,padding:"4px 10px",display:"inline-block",fontWeight:700}}>{"Próxima: "+fmtDate(r.nextVisit)}</div>}
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length===0&&<p style={{color:C.textLight,textAlign:"center",padding:40}}>Sin registros.</p>}
      </div>
    </div>
  );
}
function MyPets(props) {
  var pets=props.pets, records=props.records, C=props.C;
  var isMobile=useIsMobile();
  function getLast(id){var recs=records.filter(function(r){return r.petId===id;}).sort(function(a,b){return b.date.localeCompare(a.date);}); return recs.length>0?recs[0]:null;}
  if(pets.length===0) return (
    <div style={{textAlign:"center",padding:60}}>
      <div style={{fontSize:56,marginBottom:12}}>🐾</div>
      <h3 style={{color:C.brownDark,marginBottom:8}}>No tienes mascotas registradas</h3>
      <p style={{color:C.textMid,fontSize:14}}>Contacta a tu veterinaria.</p>
    </div>
  );
  return (
    <div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark,marginBottom:4}}>Mis Mascotas</h2>
      <p style={{color:C.textMid,fontSize:13,marginBottom:16}}>Toca una mascota para ver su historial</p>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {pets.map(function(pet){
          var last=getLast(pet.id), count=records.filter(function(r){return r.petId===pet.id;}).length, age=calcAge(pet.dob);
          return (
            <Card key={pet.id} C={C} style={{cursor:"pointer"}} onClick={function(){props.onSelect(pet);}}>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                <PetAvatar photo={pet.photo} avatar={pet.avatar} size={60} C={C}/>
                <div><div style={{fontWeight:800,fontSize:17,color:C.brownDark}}>{pet.name}</div><div style={{color:C.textMid,fontSize:13}}>{pet.species+(pet.breed?" - "+pet.breed:"")}</div>{age&&<div style={{fontSize:12,color:C.textLight}}>{age}</div>}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                <div style={{background:C.peach,borderRadius:10,padding:"6px 4px",textAlign:"center"}}><div style={{fontSize:14}}>⚖️</div><div style={{fontSize:11,fontWeight:700,color:C.brown}}>{pet.weight?pet.weight+"kg":"—"}</div></div>
                <div style={{background:C.peach,borderRadius:10,padding:"6px 4px",textAlign:"center"}}><div style={{fontSize:14}}>📋</div><div style={{fontSize:11,fontWeight:700,color:C.brown}}>{count+" hist."}</div></div>
                <div style={{background:C.peach,borderRadius:10,padding:"6px 4px",textAlign:"center"}}><div style={{fontSize:14}}>🎨</div><div style={{fontSize:11,fontWeight:700,color:C.brown,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pet.color||"—"}</div></div>
              </div>
              {last&&<div style={{fontSize:12,color:C.textMid,borderTop:"1px solid "+C.border,paddingTop:8}}>{"Ultima: "+fmtDate(last.date)}</div>}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <Btn variant="outline" small={true} full={true} C={C} onClick={function(){props.onSelect(pet);}}>Ver historial</Btn>
                <Btn variant="ghost" small={true} C={C} onClick={function(){props.onCarnet&&props.onCarnet(pet);}} title="Carnet">🪪</Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function OwnerItemsDisplay(props) {
  var items=props.items, record=props.record, onUpdateRecord=props.onUpdateRecord, C=props.C;
  var s1=useState(false); var uploading=s1[0]; var setUploading=s1[1];

  async function handleAddFile(itemId,e) {
    var files=Array.from(e.target.files||[]);
    setUploading(true);
    var updatedItems=items.map(function(x){return Object.assign({},x,{files:x.files?x.files.slice():[]});});
    for(var _i=0;_i<files.length;_i++){
      var f=files[_i];
      if(f.size>3*1024*1024){alert("Máximo 3 MB por archivo.");continue;}
      var b64=await toBase64(f);
      var fEntry={id:genId(),file:b64,fileName:f.name};
      updatedItems=updatedItems.map(function(x){return x.id===itemId?Object.assign({},x,{files:x.files.concat([fEntry])}):x;});
    }
    e.target.value="";
    setUploading(false);
    if(onUpdateRecord){
      onUpdateRecord(Object.assign({},record,{items:updatedItems}));
    }
  }

  function handleRemoveFile(itemId,fileId) {
    var updatedItems=items.map(function(x){
      return x.id===itemId?Object.assign({},x,{files:(x.files||[]).filter(function(f){return f.id!==fileId;})}):x;
    });
    if(onUpdateRecord) onUpdateRecord(Object.assign({},record,{items:updatedItems}));
  }

  return (
    <div style={{marginBottom:8}}>
      <div style={{fontSize:11,fontWeight:700,color:C.textMid,marginBottom:6}}>{"TRATAMIENTOS Y SOLICITUDES"}</div>
      {items.map(function(item,idx){
        var isSol=item.type==="solicitud";
        var files=item.files||[];
        var cl=isSol?C.purple:C.green;
        var bg=isSol?C.purpleLight:C.greenLight;
        return (
          <div key={item.id||idx} style={{marginBottom:6,background:bg,borderRadius:8,padding:"7px 10px",border:"1px solid "+(isSol?C.purple+"33":C.green+"33")}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
              <span style={{fontSize:11,fontWeight:800,color:cl,flexShrink:0,minWidth:18}}>{(idx+1)+"."}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,color:C.text,fontWeight:600}}>{item.text}</div>
                {isSol&&(
                  <div style={{marginTop:6}}>
                    {files.map(function(f){
                      return (
                        <div key={f.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                          <a href={f.file} download={f.fileName} style={{fontSize:11,color:C.green,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:3}}>
                            <span>{"📎"}</span><span style={{...sOverflow,maxWidth:180}}>{f.fileName}</span>
                          </a>
                          {onUpdateRecord&&<button onClick={function(){handleRemoveFile(item.id,f.id);}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:12,padding:"0 2px",lineHeight:1}}>{"×"}</button>}
                        </div>
                      );
                    })}
                    {onUpdateRecord&&(
                      <label style={{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,marginTop:4}}>
                        <div style={{background:C.purple,color:"#fff",borderRadius:8,padding:"4px 12px",fontSize:11,fontWeight:700}}>
                          {uploading?"Subiendo...":files.length>0?"+ Agregar archivo":"📎 Adjuntar resultado"}
                        </div>
                        <input type="file" accept="image/*,application/pdf" style={{display:"none"}} multiple onChange={function(e){handleAddFile(item.id,e);}} disabled={uploading}/>
                      </label>
                    )}
                    {files.length===0&&(
                      <span style={{fontSize:11,color:C.yellow,fontWeight:700,background:C.yellowLight,borderRadius:6,padding:"2px 8px"}}>{"⏳ Pendiente de adjuntar"}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function OwnerHistory(props) {
  var pets=props.pets, records=props.records, selectedPet=props.selectedPet, C=props.C;
  var isMobile=useIsMobile();
  var petRecords=records.filter(function(r){return r.petId===(selectedPet&&selectedPet.id);}).sort(function(a,b){return b.date.localeCompare(a.date);});
  return (
    <div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark,marginBottom:12}}>Historial Clínico</h2>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {pets.map(function(p){
          var active=selectedPet&&selectedPet.id===p.id;
          return <button key={p.id} onClick={function(){props.onSelectPet(p);}} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderRadius:20,background:active?C.brown:C.peach,color:active?C.navIcon:C.brownDark,border:"none",fontWeight:700,fontSize:13,cursor:"pointer"}}>{p.avatar+" "+p.name}</button>;
        })}
      </div>
      {!selectedPet?<p style={{color:C.textLight,textAlign:"center",padding:40}}>Selecciona una mascota.</p>:petRecords.length===0?<p style={{color:C.textLight,textAlign:"center",padding:40}}>Sin registros todavia.</p>:
        <div>
          {petRecords.map(function(r){
            return (
              <Card key={r.id} C={C} style={{marginBottom:14,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}><Badge type={r.type}/><span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{fmtDate(r.date)}</span></div>
                {r.weight&&<div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.peach,borderRadius:12,padding:"7px 12px",marginBottom:10}}><span style={{fontSize:18}}>⚖️</span><div><div style={{fontSize:10,fontWeight:700,color:C.textMid}}>PESO EN ESTA VISITA</div><div style={{fontSize:17,fontWeight:800,color:C.brownDark}}>{r.weight+" kg"}</div></div></div>}
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{background:C.blueLight,borderRadius:10,padding:"8px 10px"}}><div style={{fontSize:10,fontWeight:700,color:C.textMid,marginBottom:2}}>DIAGNOSTICO</div><div style={{fontSize:13,color:C.text}}>{r.diagnosis||"—"}</div></div>
                  <div style={{background:C.greenLight,borderRadius:10,padding:"8px 10px"}}><div style={{fontSize:10,fontWeight:700,color:C.textMid,marginBottom:2}}>TRATAMIENTO</div><div style={{fontSize:13,color:C.text}}>{r.treatment||"—"}</div></div>
                </div>
                                {r.items&&r.items.length>0&&(
                  <OwnerItemsDisplay items={r.items} record={r} onUpdateRecord={props.onUpdateRecord} C={C}/>
                )}
                {r.notes&&<div style={{fontSize:12,color:C.textMid,fontStyle:"italic",marginBottom:6}}>{r.notes}</div>}
                {r.nextVisit&&<div style={{fontSize:12,background:C.blueLight,color:C.blue,borderRadius:8,padding:"4px 10px",display:"inline-block",fontWeight:700}}>{"Próxima: "+fmtDate(r.nextVisit)}</div>}
              </Card>
            );
          })}
        </div>
      }
    </div>
  );
}