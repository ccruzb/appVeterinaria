function PetForm(props) {
  var owners=props.owners, existing=props.existing, isOwner=props.isOwner, C=props.C;
  var AVATARS=["🐶","🐱","🐰","🐦","🐠","🦜","🐹","🦎","🐢"];
  var s1=useState(existing&&existing.name||""); var petName=s1[0]; var setPetName=s1[1];
  var s2=useState(existing&&existing.species||"Perro"); var species=s2[0]; var setSpecies=s2[1];
  var s3=useState(existing&&existing.breed||""); var breed=s3[0]; var setBreed=s3[1];
  var s4=useState(existing&&existing.dob||""); var dob=s4[0]; var setDob=s4[1];
  var s5=useState(existing&&existing.weight||""); var weight=s5[0]; var setWeight=s5[1];
  var s6=useState(existing&&existing.color||""); var color=s6[0]; var setColor=s6[1];
  var s7=useState(existing&&existing.avatar||"🐶"); var avatar=s7[0]; var setAvatar=s7[1];
  var s8=useState(existing&&existing.photo||""); var photo=s8[0]; var setPhoto=s8[1];
  var s9=useState(existing&&existing.ownerId||(owners.length>0?owners[0].id:"")); var ownerId=s9[0]; var setOwnerId=s9[1];
  var s10=useState(existing&&existing.sex||"Macho"); var sex=s10[0]; var setSex=s10[1];
  var s11=useState({}); var errors=s11[0]; var setErrors=s11[1];
  var s12=useState(false); var uploading=s12[0]; var setUploading=s12[1];
  async function handlePhoto(e){ var file=e.target.files[0]; if(!file)return; if(file.size>2*1024*1024){setErrors(function(er){return Object.assign({},er,{photo:"Máximo 2 MB."});}); return;} setUploading(true); var b64=await toBase64(file); setPhoto(b64); setUploading(false); }
  function submit(){
    var e={};
    if(!petName.trim()) e.name="Nombre obligatorio.";
    if(!dob) e.dob="Fecha obligatoria.";
    else if(new Date(dob)>new Date()) e.dob="No puede ser futura.";
    if(!ownerId) e.ownerId="Selecciona un dueño.";
    if(Object.keys(e).length){setErrors(e);return;}
    props.onSave(Object.assign({},existing||{},{name:petName,species:species,breed:breed,sex:sex,dob:dob,weight:weight,color:color,avatar:avatar,photo:photo,ownerId:ownerId}));
  }
  return (
    <Modal title={existing?"Editar mascota":"Nueva mascota"} onClose={props.onClose} C={C}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:20}}>
        <PetAvatar photo={photo} avatar={avatar} size={88} C={C}/>
        <label htmlFor="pet-photo" style={{marginTop:10,cursor:"pointer"}}><div style={{background:C.peach,color:C.brownDark,borderRadius:10,padding:"7px 18px",fontSize:13,fontWeight:700}}>{uploading?"Cargando...":photo?"Cambiar foto":"Subir foto"}</div></label>
        <input id="pet-photo" type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
        {photo&&<button onClick={function(){setPhoto("");}} style={{marginTop:4,fontSize:12,color:C.red,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Quitar foto</button>}
        {errors.photo&&<div style={{color:C.red,fontSize:12,marginTop:4}}>{errors.photo}</div>}
      </div>
      {isOwner&&existing?(
        <div style={{background:C.yellowLight,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:C.yellow,fontWeight:600}}>Solo puedes actualizar la foto. El veterinario edita los demas datos.</div>
      ):(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
            <Field label="Nombre *" error={errors.name} C={C}><input value={petName} onChange={function(e){setPetName(e.target.value);}} placeholder="Ej: Luna" className={errors.name?"err":""}/></Field>
            <Field label="Especie" C={C}><select value={species} onChange={function(e){setSpecies(e.target.value);setBreed("");}}>{["Perro","Gato","Ave","Conejo","Reptil","Pez","Otro"].map(function(sp){return <option key={sp}>{sp}</option>;})}</select></Field>
            <div style={{gridColumn:"1/-1"}}><Field label="Raza" C={C}><BreedSelect species={species} value={breed} onChange={setBreed}/></Field></div>
            <Field label="Color" C={C}><input value={color} onChange={function(e){setColor(e.target.value);}} placeholder="Ej: Dorado"/></Field>
            <Field label="Sexo" C={C}><select value={sex} onChange={function(e){setSex(e.target.value);}}><option value="Macho">Macho</option><option value="Hembra">Hembra</option><option value="No determinado">No determinado</option></select></Field>
            <Field label="Fecha de nacimiento *" error={errors.dob} C={C}><input type="date" value={dob} onChange={function(e){setDob(e.target.value);}} max={today()} className={errors.dob?"err":""}/></Field>
            <Field label="Peso (kg)" C={C}><input value={weight} onChange={function(e){setWeight(e.target.value);}} placeholder="Ej: 4.5" inputMode="decimal"/></Field>
          </div>
          {dob&&<div style={{background:C.greenLight,borderRadius:10,padding:"8px 14px",marginBottom:14,fontSize:13,color:C.green,fontWeight:700}}>{"Edad: "+calcAge(dob)}</div>}
          <Field label="Dueño *" error={errors.ownerId} C={C}><select value={ownerId} onChange={function(e){setOwnerId(e.target.value);}} className={errors.ownerId?"err":""}><option value="">Seleccionar</option>{owners.map(function(o){return <option key={o.id} value={o.id}>{fullName(o)}</option>;})}</select></Field>
          {!photo&&<Field label="Emoji" C={C}><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{AVATARS.map(function(a){return <button key={a} onClick={function(){setAvatar(a);}} style={{fontSize:22,background:avatar===a?C.peach:C.surface,border:"2px solid "+(avatar===a?C.brown:C.border),borderRadius:8,padding:4,cursor:"pointer"}}>{a}</button>;})}</div></Field>}
        </div>
      )}
      <div style={{display:"flex",gap:10,marginTop:8}}><Btn onClick={submit} full={true} C={C}>Guardar</Btn><Btn variant="ghost" onClick={props.onClose} full={true} C={C}>Cancelar</Btn></div>
    </Modal>
  );
}

function TreatmentItemsField(props) {
  var items=props.items, itemText=props.itemText, itemType=props.itemType, C=props.C;
  var onItemTextChange=props.onItemTextChange, onItemTypeChange=props.onItemTypeChange;
  var onAdd=props.onAdd, onRemove=props.onRemove, onAddFile=props.onAddFile, onRemoveFile=props.onRemoveFile;
  return (
    <div style={{marginBottom:14}}>
      <label style={{color:C.brownDark,fontSize:13,fontWeight:700,display:"block",marginBottom:6}}>{"Tratamientos y solicitudes"}</label>
      {items.map(function(item,idx){
        var isSol=item.type==="solicitud";
        var bg=isSol?C.purpleLight:C.greenLight;
        var cl=isSol?C.purple:C.green;
        var ic=isSol?"📋":"💊";
        var files=item.files||[];
        return (
          <div key={item.id} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,background:bg,borderRadius:10,padding:"10px 12px",border:"1px solid "+(isSol?C.purple+"44":C.green+"44")}}>
            <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0,marginTop:2}}>
              <span style={{fontSize:12,fontWeight:800,color:cl}}>{(idx+1)+"."}</span>
              <span style={{fontSize:16}}>{ic}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,color:C.text,fontWeight:600,marginBottom:isSol?6:0}}>{item.text}</div>
              {isSol&&(
                <div>
                  {files.map(function(f){
                    return (
                      <div key={f.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,background:"rgba(255,255,255,0.6)",borderRadius:6,padding:"3px 8px"}}>
                        <span style={{fontSize:11,color:C.green,fontWeight:700,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{"📎 "+f.fileName}</span>
                        <button onClick={function(){onRemoveFile&&onRemoveFile(item.id,f.id);}} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13,lineHeight:1,padding:"1px 3px",flexShrink:0}}>{"×"}</button>
                      </div>
                    );
                  })}
                  <label style={{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,marginTop:2}}>
                    <div style={{background:C.purple,color:"#fff",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                      <span>{"📎"}</span>
                      <span>{files.length>0?"+ Agregar archivo":"Adjuntar resultado"}</span>
                    </div>
                    <span style={{fontSize:10,color:C.textLight}}>{"PDF/JPG/PNG · máx 3MB"}</span>
                    <input type="file" accept="image/*,application/pdf" style={{display:"none"}} multiple onChange={function(e){onAddFile&&onAddFile(item.id,e);}}/>
                  </label>
                </div>
              )}
            </div>
            <button onClick={function(){onRemove(item.id);}} style={{background:"none",border:"none",color:C.red,fontSize:18,cursor:"pointer",flexShrink:0,lineHeight:1,padding:2}}>{"×"}</button>
          </div>
        );
      })}
      <div style={{background:C.surface,borderRadius:12,border:"1px solid "+C.border,padding:12,marginTop:4}}>
        <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
          {["tratamiento","solicitud"].map(function(t){
            var active=itemType===t;
            var ic=t==="tratamiento"?"💊 Tratamiento":"📋 Solicitud doc.";
            return <button key={t} type="button" onClick={function(){onItemTypeChange(t);}} style={{padding:"6px 14px",borderRadius:20,border:"1.5px solid "+(active?C.brown:C.border),background:active?C.brown:"transparent",color:active?"#fff":C.textMid,fontSize:12,fontWeight:700,cursor:"pointer"}}>{ic}</button>;
          })}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input
            value={itemText}
            onChange={function(e){onItemTextChange(e.target.value);}}
            onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();onAdd();}}}
            placeholder={itemType==="solicitud"?"Ej: Electrocardiograma, Radiografía...":"Ej: 250ml Inyección A, 1 tableta Panadol..."}
            style={{flex:1,fontSize:14}}
          />
          <button type="button" onClick={onAdd} style={{padding:"0 16px",background:C.brown,border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:18,cursor:"pointer",flexShrink:0}}>{"+"}</button>
        </div>
        <div style={{fontSize:11,color:C.textLight,marginTop:4}}>{"Presiona Enter o + para agregar"}</div>
      </div>
    </div>
  );
}

function PetSearchField(props) {
  var pets=props.pets, users=props.users||[], C=props.C;
  var value=props.value, onChange=props.onChange;
  var search=props.search, onSearch=props.onSearch;
  var error=props.error;
  var s1=useState(false); var focused=s1[0]; var setFocused=s1[1];

  var filtered=pets.filter(function(p){
    if(!search) return true;
    var owner=byId(users,p.ownerId);
    var doc=(owner&&owner.docNum)||"";
    var nm=fullName(owner).toLowerCase();
    var pnm=p.name.toLowerCase();
    var srch=search.toLowerCase();
    return doc.indexOf(srch)>=0||nm.indexOf(srch)>=0||pnm.indexOf(srch)>=0;
  });

  var selectedPet=byId(pets,value);
  var selectedOwner=selectedPet?byId(users,selectedPet.ownerId):null;

  function selectPet(pet) {
    onChange(pet.id);
    onSearch("");
    setFocused(false);
  }

  return (
    <div style={{marginBottom:14}}>
      <label style={{color:C.brownDark,fontSize:13,fontWeight:700,display:"block",marginBottom:5}}>{"Paciente *"}</label>
      {/* Selected chip */}
      {selectedPet&&!focused&&(
        <div style={{display:"flex",alignItems:"center",gap:10,background:C.peach,borderRadius:12,padding:"10px 14px",marginBottom:6,border:"2px solid "+C.brown,cursor:"pointer"}} onClick={function(){setFocused(true);onSearch("");}}>
          <PetAvatar photo={selectedPet.photo} avatar={selectedPet.avatar} size={40} C={C}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:800,fontSize:14,color:C.brownDark}}>{selectedPet.name}</div>
            <div style={{fontSize:12,color:C.textMid}}>{selectedPet.species+" - "+selectedPet.breed}</div>
            {selectedOwner&&<div style={{fontSize:11,color:C.textLight}}>{(selectedOwner.docNum||"—")+" · "+fullName(selectedOwner)}</div>}
          </div>
          <span style={{fontSize:11,color:C.brown,fontWeight:700}}>✏️ Cambiar</span>
        </div>
      )}
      {/* Search input */}
      {(!selectedPet||focused)&&(
        <div>
          <div style={{position:"relative",marginBottom:6}}>
            <input
              value={search}
              onChange={function(e){onSearch(e.target.value);if(!focused)setFocused(true);}}
              onFocus={function(){setFocused(true);}}
              placeholder="Buscar por N° doc., nombre del dueño o mascota..."
              className={error?"err":""}
              style={{paddingLeft:36}}
              autoComplete="off"
            />
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:C.textLight}}>{"🔍"}</span>
          </div>
          {focused&&filtered.length===0&&search.length>0&&(
            <div style={{background:C.surface,border:"1px solid "+C.border,borderRadius:12,padding:"12px 16px",textAlign:"center",color:C.textLight,fontSize:13}}>
              Sin resultados para "{search}"
            </div>
          )}
          {focused&&filtered.length>0&&(
            <div style={{background:C.surface,border:"1px solid "+C.border,borderRadius:12,overflow:"hidden",maxHeight:220,overflowY:"auto",boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}>
              {filtered.map(function(p){
                var owner=null;
                for(var _i=0;_i<users.length;_i++){if(users[_i].id===p.ownerId){owner=users[_i];break;}}
                var docNum=(owner&&owner.docNum)||"—";
                var isSelected=p.id===value;
                return (
                  <div key={p.id} onClick={function(){selectPet(p);}}
                    style={{display:"flex",gap:10,alignItems:"center",padding:"10px 14px",borderBottom:"1px solid "+C.border,background:isSelected?C.peach:"transparent",cursor:"pointer"}}>
                    <PetAvatar photo={p.photo} avatar={p.avatar} size={38} C={C}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.brownDark}}>{p.name}</div>
                      <div style={{fontSize:11,color:C.textMid}}>{p.species+" - "+p.breed}</div>
                      <div style={{fontSize:11,color:C.textLight,display:"flex",gap:8,flexWrap:"wrap",marginTop:2}}>
                        <span style={{background:C.tan+"33",color:C.brownDark,borderRadius:6,padding:"1px 6px",fontWeight:700}}>{"📄 "+docNum}</span>
                        <span>{fullName(owner)}</span>
                      </div>
                    </div>
                    {isSelected&&<span style={{color:C.green,fontSize:18}}>{"✅"}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {error&&<div style={{color:C.red,fontSize:12,marginTop:4,fontWeight:600}}>{"⚠ "+error}</div>}
    </div>
  );
}
function RecordForm(props) {
  var pets=props.pets, users=props.users||[], vetId=props.vetId, existing=props.existing, C=props.C;
  var TYPES=["Consulta","Vacunación","Cirugía","Urgencia","Control"];
  var s1=useState(existing&&existing.petId||(pets.length>0?pets[0].id:"")); var petId=s1[0]; var setPetId=s1[1];
  var s1b=useState(""); var petSearch=s1b[0]; var setPetSearch=s1b[1];
  var s2=useState(existing&&existing.date||today()); var recDate=s2[0]; var setRecDate=s2[1];
  var s3=useState(existing&&existing.type||"Consulta"); var type=s3[0]; var setType=s3[1];
  var s4=useState(existing&&existing.diagnosis||""); var diagnosis=s4[0]; var setDiagnosis=s4[1];
  var s5=useState(existing&&existing.treatment||""); var treatment=s5[0]; var setTreatment=s5[1];
  var s6=useState(existing&&existing.notes||""); var notes=s6[0]; var setNotes=s6[1];
  var s7=useState(existing&&existing.nextVisit||""); var nextVisit=s7[0]; var setNextVisit=s7[1];
  var s8=useState(existing&&existing.weight||""); var recWeight=s8[0]; var setRecWeight=s8[1];
  var s9=useState(existing&&existing.attended!=null?existing.attended:null); var attended=s9[0]; var setAttended=s9[1];
  var s10=useState(existing&&existing.duration||""); var duration=s10[0]; var setDuration=s10[1];
  var s11=useState({}); var errors=s11[0]; var setErrors=s11[1];
  var s12=useState(existing&&existing.items&&existing.items.length>0?existing.items:[]); var items=s12[0]; var setItems=s12[1];
  var s13=useState(""); var itemText=s13[0]; var setItemText=s13[1];
  var s14=useState("tratamiento"); var itemType=s14[0]; var setItemType=s14[1];
  function addItem(){ if(!itemText.trim())return; setItems(function(prev){return prev.concat([{id:genId(),text:itemText.trim(),type:itemType,files:[]}]);}); setItemText(""); }
  function removeItem(id){ setItems(function(prev){return prev.filter(function(x){return x.id!==id;});}); }
  async function handleItemFile(itemId,e){
    var files=Array.from(e.target.files||[]);
    for(var _i=0;_i<files.length;_i++){
      var f=files[_i];
      if(f.size>3*1024*1024){alert("Máximo 3 MB por archivo.");continue;}
      var b64=await toBase64(f);
      var fEntry={id:genId(),file:b64,fileName:f.name};
      setItems(function(prev){return prev.map(function(x){return x.id===itemId?Object.assign({},x,{files:(x.files||[]).concat([fEntry])}):x;});});
    }
    e.target.value="";
  }
  function removeItemFile(itemId,fileId){
    setItems(function(prev){return prev.map(function(x){return x.id===itemId?Object.assign({},x,{files:(x.files||[]).filter(function(f){return f.id!==fileId;})}):x;});});
  }
    function submit(){
    var e={};
    if(!petId) e.petId="Selecciona un paciente.";
    if(!recDate) e.date="Fecha obligatoria.";
    if(!diagnosis.trim()) e.diagnosis="Diagnóstico obligatorio.";
    if(Object.keys(e).length){setErrors(e);return;}
    props.onSave(Object.assign({},existing||{},{petId:petId,date:recDate,type:type,diagnosis:diagnosis,treatment:treatment,notes:notes,nextVisit:nextVisit,weight:recWeight,vetId:vetId,attended:attended,duration:duration?parseInt(duration):null,items:items}));
  }
  return (
    <Modal title={existing?"Editar historia":"Nueva historia clínica"} onClose={props.onClose} C={C}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <PetSearchField pets={pets} users={users} value={petId} onChange={function(id){setPetId(id);}} search={petSearch} onSearch={setPetSearch} error={errors.petId} C={C}/>
        <Field label="Tipo" C={C}><select value={type} onChange={function(e){setType(e.target.value);}}>{TYPES.map(function(t){return <option key={t}>{t}</option>;})}</select></Field>
        <Field label="Fecha *" error={errors.date} C={C}><input type="date" value={recDate} onChange={function(e){setRecDate(e.target.value);}} max={today()} className={errors.date?"err":""}/></Field>
        <Field label="Peso (kg)" C={C}><input value={recWeight} onChange={function(e){setRecWeight(e.target.value);}} placeholder="Ej: 12.5" inputMode="decimal"/></Field>
        <div style={{gridColumn:"1/-1"}}><Field label="Diagnóstico *" error={errors.diagnosis} C={C}><input value={diagnosis} onChange={function(e){setDiagnosis(e.target.value);}} placeholder="Ej: Otitis externa" className={errors.diagnosis?"err":""}/></Field></div>
        <div style={{gridColumn:"1/-1"}}><Field label="Próxima visita" C={C}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input type="date" value={nextVisit} onChange={function(e){setNextVisit(e.target.value);}} min={today()} style={{flex:1}}/>
          {nextVisit&&<button type="button" onClick={function(){setNextVisit("");}} title="Borrar fecha" style={{background:"none",border:"none",color:C.red,fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1,flexShrink:0}}>{"×"}</button>}
        </div>
      </Field></div>
      </div>
      <TreatmentItemsField items={items} itemText={itemText} itemType={itemType} onItemTextChange={setItemText} onItemTypeChange={setItemType} onAdd={addItem} onRemove={removeItem} onAddFile={handleItemFile} onRemoveFile={removeItemFile} C={C}/>
      <Field label="Notas" C={C}><textarea rows={2} value={notes} onChange={function(e){setNotes(e.target.value);}}/></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <Field label="Fue atendido?" C={C}><select value={attended===null?"":attended?"si":"no"} onChange={function(e){setAttended(e.target.value===""?null:e.target.value==="si");}}><option value="">Sin marcar</option><option value="si">Si, atendido</option><option value="no">No asistio</option></select></Field>
        <Field label="Duración (min)" C={C}><input type="number" value={duration} onChange={function(e){setDuration(e.target.value);}} placeholder="Ej: 30" min={1} max={240}/></Field>
      </div>
      <div style={{display:"flex",gap:10,marginTop:8}}><Btn onClick={submit} full={true} C={C}>Guardar</Btn><Btn variant="ghost" onClick={props.onClose} full={true} C={C}>Cancelar</Btn></div>
    </Modal>
  );
}
function ApptForm(props) {
  var pets=props.pets, owners=props.owners, existing=props.existing, allAppts=props.allAppts, blockedDays=props.blockedDays, allowBlocked=props.allowBlocked, C=props.C;
  var TYPES=["Consulta","Vacunación","Cirugía","Urgencia","Control"];
  var s1=useState(existing&&existing.petId||(pets.length>0?pets[0].id:"")); var petId=s1[0]; var setPetId=s1[1];
  var s1b=useState(""); var petSearch=s1b[0]; var setPetSearch=s1b[1];
  var s2=useState(existing&&existing.date||""); var date=s2[0]; var setDate=s2[1];
  var s3=useState(existing&&existing.time||""); var time=s3[0]; var setTime=s3[1];
  var s4=useState(existing&&existing.type||"Consulta"); var type=s4[0]; var setType=s4[1];
  var s5=useState(existing&&existing.notes||""); var notes=s5[0]; var setNotes=s5[1];
  var s6=useState({}); var errors=s6[0]; var setErrors=s6[1];
  var isBlocked=!allowBlocked&&blockedDays.indexOf(date)>=0;
  var usedSlots=useMemo(function(){ return allAppts.filter(function(a){return a.date===date&&a.status!=="cancelled"&&a.id!==(existing&&existing.id);}).map(function(a){return a.time;}); },[allAppts,date,existing]);
  var freeSlots=useMemo(function(){ return TIME_SLOTS.filter(function(t){return usedSlots.indexOf(t)<0;}); },[usedSlots]);
  function submit(){
    var e={};
    if(!petId) e.petId="Selecciona una mascota.";
    if(!date) e.date="Fecha obligatoria.";
    else if(date<today()) e.date="No puede ser pasada.";
    else if(isBlocked) e.date="Dia bloqueado.";
    if(!time) e.time="Selecciona un horario.";
    if(Object.keys(e).length){setErrors(e);return;}
    props.onSave(Object.assign({},existing||{},{petId:petId,date:date,time:time,type:type,notes:notes}));
  }
  var selPet=byId(pets,petId);
  var selOwner=selPet?byId(owners,selPet.ownerId):null;
  return (
    <Modal title={existing?"Editar cita":"Nueva cita"} onClose={props.onClose} C={C}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <Field label="Mascota *" error={errors.petId} C={C}><select value={petId} onChange={function(e){setPetId(e.target.value);}} className={errors.petId?"err":""}><option value="">Seleccionar</option>{pets.map(function(p){return <option key={p.id} value={p.id}>{p.name}</option>;})}</select></Field>
        <Field label="Tipo" C={C}><select value={type} onChange={function(e){setType(e.target.value);}}>{TYPES.map(function(t){return <option key={t}>{t}</option>;})}</select></Field>
        <div style={{gridColumn:"1/-1"}}><Field label="Fecha *" error={errors.date} C={C}><input type="date" value={date} onChange={function(e){setDate(e.target.value);setTime("");}} min={today()} className={errors.date?"err":""}/></Field></div>
      </div>
      {isBlocked&&<div style={{background:C.redLight,borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.red,fontSize:13,fontWeight:700}}>Dia bloqueado.</div>}
      {date&&!isBlocked&&(
        <Field label={freeSlots.length===0?"Sin disponibilidad":"Horario *"} error={errors.time} C={C}>
          {freeSlots.length===0?<p style={{color:C.red,fontSize:13}}>Sin horarios disponibles.</p>
            :<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{freeSlots.map(function(t){return <button key={t} type="button" onClick={function(){setTime(t);}} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid "+(time===t?C.brown:C.border),background:time===t?C.brown:"transparent",color:time===t?"#fff":C.text,fontSize:12,fontWeight:700,cursor:"pointer"}}>{t}</button>;})}</div>}
        </Field>
      )}
      {selOwner&&<div style={{background:C.blueLight,borderRadius:10,padding:"8px 12px",marginBottom:14,fontSize:13,color:C.blue,fontWeight:600}}>{fullName(selOwner)+" - "+selOwner.email}</div>}
      <Field label="Notas" C={C}><textarea rows={2} value={notes} onChange={function(e){setNotes(e.target.value);}} placeholder="Indicaciones..."/></Field>
      <div style={{display:"flex",gap:10,marginTop:8}}><Btn onClick={submit} full={true} C={C} disabled={isBlocked}>Guardar cita</Btn><Btn variant="ghost" onClick={props.onClose} full={true} C={C}>Cancelar</Btn></div>
    </Modal>
  );
}