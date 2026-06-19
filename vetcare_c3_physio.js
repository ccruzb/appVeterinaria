
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
    React.createElement(Modal, { title: existing?"Editar mascota":"Nueva mascota", onClose: props.onClose, C: C,}
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",alignItems:"center",marginBottom:20},}
        , React.createElement(PetAvatar, { photo: photo, avatar: avatar, size: 88, C: C,})
        , React.createElement('label', { htmlFor: "pet-photo", style: {marginTop:10,cursor:"pointer"},}, React.createElement('div', { style: {background:C.peach,color:C.brownDark,borderRadius:10,padding:"7px 18px",fontSize:13,fontWeight:700},}, uploading?"Cargando...":photo?"Cambiar foto":"Subir foto"))
        , React.createElement('input', { id: "pet-photo", type: "file", accept: "image/*", onChange: handlePhoto, style: {display:"none"},})
        , photo&&React.createElement('button', { onClick: function(){setPhoto("");}, style: {marginTop:4,fontSize:12,color:C.red,background:"none",border:"none",cursor:"pointer",fontWeight:600},}, "Quitar foto" )
        , errors.photo&&React.createElement('div', { style: {color:C.red,fontSize:12,marginTop:4},}, errors.photo)
      )
      , isOwner&&existing?(
        React.createElement('div', { style: {background:C.yellowLight,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:C.yellow,fontWeight:600},}, "Solo puedes actualizar la foto. El veterinario edita los demas datos."          )
      ):(
        React.createElement('div', null
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"},}
            , React.createElement(Field, { label: "Nombre *" , error: errors.name, C: C,}, React.createElement('input', { value: petName, onChange: function(e){setPetName(e.target.value);}, placeholder: "Ej: Luna" , className: errors.name?"err":"",}))
            , React.createElement(Field, { label: "Especie", C: C,}, React.createElement('select', { value: species, onChange: function(e){setSpecies(e.target.value);setBreed("");},}, ["Perro","Gato","Ave","Conejo","Reptil","Pez","Otro"].map(function(sp){return React.createElement('option', { key: sp,}, sp);})))
            , React.createElement('div', { style: {gridColumn:"1/-1"},}, React.createElement(Field, { label: "Raza", C: C,}, React.createElement(BreedSelect, { species: species, value: breed, onChange: setBreed,})))
            , React.createElement(Field, { label: "Color", C: C,}, React.createElement('input', { value: color, onChange: function(e){setColor(e.target.value);}, placeholder: "Ej: Dorado" ,}))
            , React.createElement(Field, { label: "Sexo", C: C,}, React.createElement('select', { value: sex, onChange: function(e){setSex(e.target.value);},}, React.createElement('option', { value: "Macho",}, "Macho"), React.createElement('option', { value: "Hembra",}, "Hembra"), React.createElement('option', { value: "No determinado" ,}, "No determinado" )))
            , React.createElement(Field, { label: "Fecha de nacimiento *"   , error: errors.dob, C: C,}, React.createElement('input', { type: "date", value: dob, onChange: function(e){setDob(e.target.value);}, max: today(), className: errors.dob?"err":"",}))
            , React.createElement(Field, { label: "Peso (kg)" , C: C,}, React.createElement('input', { value: weight, onChange: function(e){setWeight(e.target.value);}, placeholder: "Ej: 4.5" , inputMode: "decimal",}))
          )
          , dob&&React.createElement('div', { style: {background:C.greenLight,borderRadius:10,padding:"8px 14px",marginBottom:14,fontSize:13,color:C.green,fontWeight:700},}, "Edad: "+calcAge(dob))
          , React.createElement(Field, { label: "Dueño *" , error: errors.ownerId, C: C,}, React.createElement('select', { value: ownerId, onChange: function(e){setOwnerId(e.target.value);}, className: errors.ownerId?"err":"",}, React.createElement('option', { value: "",}, "Seleccionar"), owners.map(function(o){return React.createElement('option', { key: o.id, value: o.id,}, fullName(o));})))
          , !photo&&React.createElement(Field, { label: "Emoji", C: C,}, React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"},}, AVATARS.map(function(a){return React.createElement('button', { key: a, onClick: function(){setAvatar(a);}, style: {fontSize:22,background:avatar===a?C.peach:C.surface,border:"2px solid "+(avatar===a?C.brown:C.border),borderRadius:8,padding:4,cursor:"pointer"},}, a);})))
        )
      )
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:8},}, React.createElement(Btn, { onClick: submit, full: true, C: C,}, "Guardar"), React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar"))
    )
  );
}

function TreatmentItemsField(props) {
  var items=props.items, itemText=props.itemText, itemType=props.itemType, C=props.C;
  var onItemTextChange=props.onItemTextChange, onItemTypeChange=props.onItemTypeChange;
  var onAdd=props.onAdd, onRemove=props.onRemove, onAddFile=props.onAddFile, onRemoveFile=props.onRemoveFile;
  return (
    React.createElement('div', { style: {marginBottom:14},}
      , React.createElement('label', { style: {color:C.brownDark,fontSize:13,fontWeight:700,display:"block",marginBottom:6},}, "Tratamientos y solicitudes")
      , items.map(function(item,idx){
        var isSol=item.type==="solicitud";
        var bg=isSol?C.purpleLight:C.greenLight;
        var cl=isSol?C.purple:C.green;
        var ic=isSol?"📋":"💊";
        var files=item.files||[];
        return (
          React.createElement('div', { key: item.id, style: {display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,background:bg,borderRadius:10,padding:"10px 12px",border:"1px solid "+(isSol?C.purple+"44":C.green+"44")},}
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:4,flexShrink:0,marginTop:2},}
              , React.createElement('span', { style: {fontSize:12,fontWeight:800,color:cl},}, (idx+1)+".")
              , React.createElement('span', { style: {fontSize:16},}, ic)
            )
            , React.createElement('div', { style: {flex:1,minWidth:0},}
              , React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:600,marginBottom:isSol?6:0},}, item.text)
              , isSol&&(
                React.createElement('div', null
                  , files.map(function(f){
                    return (
                      React.createElement('div', { key: f.id, style: {display:"flex",alignItems:"center",gap:6,marginBottom:4,background:"rgba(255,255,255,0.6)",borderRadius:6,padding:"3px 8px"},}
                        , React.createElement('span', { style: {fontSize:11,color:C.green,fontWeight:700,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, "📎 "+f.fileName)
                        , React.createElement('button', { onClick: function(){onRemoveFile&&onRemoveFile(item.id,f.id);}, style: {background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:13,lineHeight:1,padding:"1px 3px",flexShrink:0},}, "×")
                      )
                    );
                  })
                  , React.createElement('label', { style: {cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,marginTop:2},}
                    , React.createElement('div', { style: {background:C.purple,color:"#fff",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:4},}
                      , React.createElement('span', null, "📎")
                      , React.createElement('span', null, files.length>0?"+ Agregar archivo":"Adjuntar resultado")
                    )
                    , React.createElement('span', { style: {fontSize:10,color:C.textLight},}, "PDF/JPG/PNG · máx 3MB")
                    , React.createElement('input', { type: "file", accept: "image/*,application/pdf", style: {display:"none"}, multiple: true, onChange: function(e){onAddFile&&onAddFile(item.id,e);},})
                  )
                )
              )
            )
            , React.createElement('button', { onClick: function(){onRemove(item.id);}, style: {background:"none",border:"none",color:C.red,fontSize:18,cursor:"pointer",flexShrink:0,lineHeight:1,padding:2},}, "×")
          )
        );
      })
      , React.createElement('div', { style: {background:C.surface,borderRadius:12,border:"1px solid "+C.border,padding:12,marginTop:4},}
        , React.createElement('div', { style: {display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"},}
          , ["tratamiento","solicitud"].map(function(t){
            var active=itemType===t;
            var ic=t==="tratamiento"?"💊 Tratamiento":"📋 Solicitud doc.";
            return React.createElement('button', { key: t, type: "button", onClick: function(){onItemTypeChange(t);}, style: {padding:"6px 14px",borderRadius:20,border:"1.5px solid "+(active?C.brown:C.border),background:active?C.brown:"transparent",color:active?"#fff":C.textMid,fontSize:12,fontWeight:700,cursor:"pointer"},}, ic);
          })
        )
        , React.createElement('div', { style: {display:"flex",gap:8},}
          , React.createElement('input', {
            value: itemText,
            onChange: function(e){onItemTextChange(e.target.value);},
            onKeyDown: function(e){if(e.key==="Enter"){e.preventDefault();onAdd();}},
            placeholder: itemType==="solicitud"?"Ej: Electrocardiograma, Radiografía...":"Ej: 250ml Inyección A, 1 tableta Panadol...",
            style: {flex:1,fontSize:14},}
          )
          , React.createElement('button', { type: "button", onClick: onAdd, style: {padding:"0 16px",background:C.brown,border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:18,cursor:"pointer",flexShrink:0},}, "+")
        )
        , React.createElement('div', { style: {fontSize:11,color:C.textLight,marginTop:4},}, "Presiona Enter o + para agregar")
      )
    )
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
    React.createElement('div', { style: {marginBottom:14},}
      , React.createElement('label', { style: {color:C.brownDark,fontSize:13,fontWeight:700,display:"block",marginBottom:5},}, "Paciente *")
      /* Selected chip */
      , selectedPet&&!focused&&(
        React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,background:C.peach,borderRadius:12,padding:"10px 14px",marginBottom:6,border:"2px solid "+C.brown,cursor:"pointer"}, onClick: function(){setFocused(true);onSearch("");},}
          , React.createElement(PetAvatar, { photo: selectedPet.photo, avatar: selectedPet.avatar, size: 40, C: C,})
          , React.createElement('div', { style: {flex:1,minWidth:0},}
            , React.createElement('div', { style: {fontWeight:800,fontSize:14,color:C.brownDark},}, selectedPet.name)
            , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, selectedPet.species+" - "+selectedPet.breed)
            , selectedOwner&&React.createElement('div', { style: {fontSize:11,color:C.textLight},}, (selectedOwner.docNum||"—")+" · "+fullName(selectedOwner))
          )
          , React.createElement('span', { style: {fontSize:11,color:C.brown,fontWeight:700},}, "✏️ Cambiar" )
        )
      )
      /* Search input */
      , (!selectedPet||focused)&&(
        React.createElement('div', null
          , React.createElement('div', { style: {position:"relative",marginBottom:6},}
            , React.createElement('input', {
              value: search,
              onChange: function(e){onSearch(e.target.value);if(!focused)setFocused(true);},
              onFocus: function(){setFocused(true);},
              placeholder: "Buscar por N° doc., nombre del dueño o mascota..."        ,
              className: error?"err":"",
              style: {paddingLeft:36},
              autoComplete: "off",}
            )
            , React.createElement('span', { style: {position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:C.textLight},}, "🔍")
          )
          , focused&&filtered.length===0&&search.length>0&&(
            React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:12,padding:"12px 16px",textAlign:"center",color:C.textLight,fontSize:13},}, "Sin resultados para \""
                 , search, "\""
            )
          )
          , focused&&filtered.length>0&&(
            React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:12,overflow:"hidden",maxHeight:220,overflowY:"auto",boxShadow:"0 4px 16px rgba(0,0,0,0.08)"},}
              , filtered.map(function(p){
                var owner=null;
                for(var _i=0;_i<users.length;_i++){if(users[_i].id===p.ownerId){owner=users[_i];break;}}
                var docNum=(owner&&owner.docNum)||"—";
                var isSelected=p.id===value;
                return (
                  React.createElement('div', { key: p.id, onClick: function(){selectPet(p);},
                    style: {display:"flex",gap:10,alignItems:"center",padding:"10px 14px",borderBottom:"1px solid "+C.border,background:isSelected?C.peach:"transparent",cursor:"pointer"},}
                    , React.createElement(PetAvatar, { photo: p.photo, avatar: p.avatar, size: 38, C: C,})
                    , React.createElement('div', { style: {flex:1,minWidth:0},}
                      , React.createElement('div', { style: {fontWeight:700,fontSize:13,color:C.brownDark},}, p.name)
                      , React.createElement('div', { style: {fontSize:11,color:C.textMid},}, p.species+" - "+p.breed)
                      , React.createElement('div', { style: {fontSize:11,color:C.textLight,display:"flex",gap:8,flexWrap:"wrap",marginTop:2},}
                        , React.createElement('span', { style: {background:C.tan+"33",color:C.brownDark,borderRadius:6,padding:"1px 6px",fontWeight:700},}, "📄 "+docNum)
                        , React.createElement('span', null, fullName(owner))
                      )
                    )
                    , isSelected&&React.createElement('span', { style: {color:C.green,fontSize:18},}, "✅")
                  )
                );
              })
            )
          )
        )
      )
      , error&&React.createElement('div', { style: {color:C.red,fontSize:12,marginTop:4,fontWeight:600},}, "⚠ "+error)
    )
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
    React.createElement(Modal, { title: existing?"Editar historia":"Nueva historia clínica", onClose: props.onClose, C: C,}
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"},}
        , React.createElement(PetSearchField, { pets: pets, users: users, value: petId, onChange: function(id){setPetId(id);}, search: petSearch, onSearch: setPetSearch, error: errors.petId, C: C,})
        , React.createElement(Field, { label: "Tipo", C: C,}, React.createElement('select', { value: type, onChange: function(e){setType(e.target.value);},}, TYPES.map(function(t){return React.createElement('option', { key: t,}, t);})))
        , React.createElement(Field, { label: "Fecha *" , error: errors.date, C: C,}, React.createElement('input', { type: "date", value: recDate, onChange: function(e){setRecDate(e.target.value);}, max: today(), className: errors.date?"err":"",}))
        , React.createElement(Field, { label: "Peso (kg)" , C: C,}, React.createElement('input', { value: recWeight, onChange: function(e){setRecWeight(e.target.value);}, placeholder: "Ej: 12.5" , inputMode: "decimal",}))
        , React.createElement('div', { style: {gridColumn:"1/-1"},}, React.createElement(Field, { label: "Diagnóstico *" , error: errors.diagnosis, C: C,}, React.createElement('input', { value: diagnosis, onChange: function(e){setDiagnosis(e.target.value);}, placeholder: "Ej: Otitis externa"  , className: errors.diagnosis?"err":"",})))
        , React.createElement('div', { style: {gridColumn:"1/-1"},}, React.createElement(Field, { label: "Próxima visita" , C: C,}
        , React.createElement('div', { style: {display:"flex",gap:8,alignItems:"center"},}
          , React.createElement('input', { type: "date", value: nextVisit, onChange: function(e){setNextVisit(e.target.value);}, min: today(), style: {flex:1},})
          , nextVisit&&React.createElement('button', { type: "button", onClick: function(){setNextVisit("");}, title: "Borrar fecha" , style: {background:"none",border:"none",color:C.red,fontSize:20,cursor:"pointer",padding:"0 4px",lineHeight:1,flexShrink:0},}, "×")
        )
      ))
      )
      , React.createElement(TreatmentItemsField, { items: items, itemText: itemText, itemType: itemType, onItemTextChange: setItemText, onItemTypeChange: setItemType, onAdd: addItem, onRemove: removeItem, onAddFile: handleItemFile, onRemoveFile: removeItemFile, C: C,})
      , React.createElement(Field, { label: "Notas", C: C,}, React.createElement('textarea', { rows: 2, value: notes, onChange: function(e){setNotes(e.target.value);},}))
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"},}
        , React.createElement(Field, { label: "Fue atendido?" , C: C,}, React.createElement('select', { value: attended===null?"":attended?"si":"no", onChange: function(e){setAttended(e.target.value===""?null:e.target.value==="si");},}, React.createElement('option', { value: "",}, "Sin marcar" ), React.createElement('option', { value: "si",}, "Si, atendido" ), React.createElement('option', { value: "no",}, "No asistio" )))
        , React.createElement(Field, { label: "Duración (min)" , C: C,}, React.createElement('input', { type: "number", value: duration, onChange: function(e){setDuration(e.target.value);}, placeholder: "Ej: 30" , min: 1, max: 240,}))
      )
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:8},}, React.createElement(Btn, { onClick: submit, full: true, C: C,}, "Guardar"), React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar"))
    )
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
    React.createElement(Modal, { title: existing?"Editar cita":"Nueva cita", onClose: props.onClose, C: C,}
      , React.createElement(PetSearchField, { pets: pets, users: owners, value: petId, onChange: function(id){setPetId(id);}, search: petSearch, onSearch: setPetSearch, error: errors.petId, C: C,})
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"},}
        , React.createElement(Field, { label: "Tipo", C: C,}, React.createElement('select', { value: type, onChange: function(e){setType(e.target.value);},}, TYPES.map(function(t){return React.createElement('option', { key: t,}, t);})))
        , React.createElement('div', { style: {gridColumn:"1/-1"},}, React.createElement(Field, { label: "Fecha *" , error: errors.date, C: C,}, React.createElement('input', { type: "date", value: date, onChange: function(e){setDate(e.target.value);setTime("");}, min: today(), className: errors.date?"err":"",})))
      )
      , isBlocked&&React.createElement('div', { style: {background:C.redLight,borderRadius:10,padding:"10px 14px",marginBottom:14,color:C.red,fontSize:13,fontWeight:700},}, "Dia bloqueado." )
      , date&&!isBlocked&&(
        React.createElement(Field, { label: freeSlots.length===0?"Sin disponibilidad":"Horario *", error: errors.time, C: C,}
          , freeSlots.length===0?React.createElement('p', { style: {color:C.red,fontSize:13},}, "Sin horarios disponibles."  )
            :React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"},}, freeSlots.map(function(t){return React.createElement('button', { key: t, type: "button", onClick: function(){setTime(t);}, style: {padding:"6px 10px",borderRadius:8,border:"1.5px solid "+(time===t?C.brown:C.border),background:time===t?C.brown:"transparent",color:time===t?"#fff":C.text,fontSize:12,fontWeight:700,cursor:"pointer"},}, t);}))
        )
      )
      , selOwner&&React.createElement('div', { style: {background:C.blueLight,borderRadius:10,padding:"8px 12px",marginBottom:14,fontSize:13,color:C.blue,fontWeight:600},}, fullName(selOwner)+" - "+selOwner.email)
      , React.createElement(Field, { label: "Notas", C: C,}, React.createElement('textarea', { rows: 2, value: notes, onChange: function(e){setNotes(e.target.value);}, placeholder: "Indicaciones...",}))
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:8},}, React.createElement(Btn, { onClick: submit, full: true, C: C, disabled: isBlocked,}, "Guardar cita" ), React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar"))
    )
  );
}

// ============================================================
// CIRUGÍAS - SurgeryForm, SurgeryDetail, SurgeriesList
// ============================================================

function SurgeryForm(props) {
  var pets=props.pets, users=props.users||[], vetId=props.vetId, existing=props.existing, C=props.C;
  var SURGERY_TYPES=["Castración","Esterilización","Ortopedia","Extracción dental","Masa/Tumor","Cesárea","Oftalmológica","Digestiva","Urológica","Traumatología","Otra"];
  var ANESTHESIA=["Local","General inhalatoria","General inyectable","Sedación","Epidural"];
  var RISK=["Bajo","Moderado","Alto","Crítico"];

  var s1=useState(existing&&existing.petId||""); var petId=s1[0]; var setPetId=s1[1];
  var s1b=useState(""); var petSearch=s1b[0]; var setPetSearch=s1b[1];
  var s2=useState(existing&&existing.date||today()); var date=s2[0]; var setDate=s2[1];
  var s3=useState(existing&&existing.surgeryType||"Castración"); var surgeryType=s3[0]; var setSurgeryType=s3[1];
  var s4=useState(existing&&existing.customType||""); var customType=s4[0]; var setCustomType=s4[1];
  var s5=useState(existing&&existing.diagnosis||""); var diagnosis=s5[0]; var setDiagnosis=s5[1];
  var s6=useState(existing&&existing.anesthesia||"General inhalatoria"); var anesthesia=s6[0]; var setAnesthesia=s6[1];
  var s7=useState(existing&&existing.duration||""); var duration=s7[0]; var setDuration=s7[1];
  var s8=useState(existing&&existing.riskLevel||"Bajo"); var riskLevel=s8[0]; var setRiskLevel=s8[1];
  var s9=useState(existing&&existing.surgeon||""); var surgeon=s9[0]; var setSurgeon=s9[1];
  var s10=useState(existing&&existing.assistant||""); var assistant=s10[0]; var setAssistant=s10[1];
  // Pre-op
  var s11=useState(existing&&existing.preWeight||""); var preWeight=s11[0]; var setPreWeight=s11[1];
  var s12=useState(existing&&existing.preFasting||""); var preFasting=s12[0]; var setPreFasting=s12[1];
  var s13=useState(existing&&existing.preExams||""); var preExams=s13[0]; var setPreExams=s13[1];
  var s14=useState(existing&&existing.preMeds||""); var preMeds=s14[0]; var setPreMeds=s14[1];
  var s15=useState(existing&&existing.preNotes||""); var preNotes=s15[0]; var setPreNotes=s15[1];
  // Intra-op
  var s16=useState(existing&&existing.procedure||""); var procedure=s16[0]; var setProcedure=s16[1];
  var s17=useState(existing&&existing.instruments||""); var instruments=s17[0]; var setInstruments=s17[1];
  var s18=useState(existing&&existing.complications||"Ninguna"); var complications=s18[0]; var setComplications=s18[1];
  var s19=useState(existing&&existing.intraItems||[]); var intraItems=s19[0]; var setIntraItems=s19[1];
  var s19b=useState(""); var intraText=s19b[0]; var setIntraText=s19b[1];
  // Post-op
  var s20=useState(existing&&existing.postInstructions||""); var postInstructions=s20[0]; var setPostInstructions=s20[1];
  var s21=useState(existing&&existing.postMeds||""); var postMeds=s21[0]; var setPostMeds=s21[1];
  var s22=useState(existing&&existing.nextVisit||""); var nextVisit=s22[0]; var setNextVisit=s22[1];
  var s23=useState(existing&&existing.postNotes||""); var postNotes=s23[0]; var setPostNotes=s23[1];
  var s24=useState(existing&&existing.outcome||"Exitosa"); var outcome=s24[0]; var setOutcome=s24[1];
  // Files
  var s25=useState(existing&&existing.files||[]); var files=s25[0]; var setFiles=s25[1];
  var s26=useState({}); var errors=s26[0]; var setErrors=s26[1];
  var s27=useState(0); var tab=s27[0]; var setTab=s27[1];

  function addIntraItem(){ if(!intraText.trim())return; setIntraItems(function(p){return p.concat([{id:genId(),text:intraText.trim()}]);}); setIntraText(""); }
  function removeIntraItem(id){ setIntraItems(function(p){return p.filter(function(x){return x.id!==id;});}); }

  async function handleFile(e){
    var fs=Array.from(e.target.files||[]);
    for(var i=0;i<fs.length;i++){
      var f=fs[i];
      if(f.size>5*1024*1024){alert("Máximo 5MB por archivo.");continue;}
      var b64=await toBase64(f);
      setFiles(function(p){return p.concat([{id:genId(),file:b64,fileName:f.name,type:f.type}]);});
    }
    e.target.value="";
  }
  function removeFile(id){ setFiles(function(p){return p.filter(function(x){return x.id!==id;});}); }

  function validate(){
    var e={};
    if(!petId) e.petId="Selecciona una mascota.";
    if(!date) e.date="Fecha obligatoria.";
    if(!diagnosis.trim()) e.diagnosis="Diagnóstico obligatorio.";
    if(!procedure.trim()) e.procedure="Describe el procedimiento.";
    return e;
  }

  function submit(){
    var e=validate(); if(Object.keys(e).length){setErrors(e);setTab(0);return;}
    props.onSave({
      id:existing&&existing.id||("s"+genId()),
      petId:petId, vetId:vetId, date:date,
      surgeryType:surgeryType==="Otra"?customType:surgeryType,
      diagnosis:diagnosis, anesthesia:anesthesia, duration:duration,
      riskLevel:riskLevel, surgeon:surgeon, assistant:assistant,
      preWeight:preWeight, preFasting:preFasting, preExams:preExams,
      preMeds:preMeds, preNotes:preNotes,
      procedure:procedure, instruments:instruments,
      complications:complications, intraItems:intraItems,
      postInstructions:postInstructions, postMeds:postMeds,
      nextVisit:nextVisit, postNotes:postNotes, outcome:outcome,
      files:files, createdAt:existing&&existing.createdAt||new Date().toISOString()
    });
  }

  var TABS=["Pre-operatorio","Intraoperatorio","Post-operatorio","Archivos"];
  var riskColor={Bajo:C.green,Moderado:C.yellow,Alto:C.red,Crítico:"#8B0000"};

  return (
    React.createElement(Modal, { title: existing?"Editar cirugía":"Nueva cirugía", onClose: props.onClose, C: C,}
      , React.createElement(PetSearchField, { pets: pets, users: users, value: petId, onChange: function(id){setPetId(id);setErrors({});}, search: petSearch, onSearch: setPetSearch, error: errors.petId, C: C,})
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"},}
        , React.createElement('div', { style: {gridColumn:"1/-1"},}
          , React.createElement(Field, { label: "Tipo de cirugía"  , C: C,}
            , React.createElement('select', { value: surgeryType, onChange: function(e){setSurgeryType(e.target.value);},}
              , SURGERY_TYPES.map(function(t){return React.createElement('option', { key: t,}, t);})
            )
          )
          , surgeryType==="Otra"&&React.createElement(Field, { label: "Especificar tipo" , C: C,}, React.createElement('input', { value: customType, onChange: function(e){setCustomType(e.target.value);}, placeholder: "Ej: Esplenectomía" ,}))
        )
        , React.createElement(Field, { label: "Fecha *" , error: errors.date, C: C,}, React.createElement('input', { type: "date", value: date, onChange: function(e){setDate(e.target.value);}, max: today(), className: errors.date?"err":"",}))
        , React.createElement(Field, { label: "Nivel de riesgo"  , C: C,}
          , React.createElement('select', { value: riskLevel, onChange: function(e){setRiskLevel(e.target.value);}, style: {color:riskColor[riskLevel],fontWeight:700},}
            , RISK.map(function(r){return React.createElement('option', { key: r, style: {color:riskColor[r]},}, r);})
          )
        )
        , React.createElement(Field, { label: "Anestesia", C: C,}, React.createElement('select', { value: anesthesia, onChange: function(e){setAnesthesia(e.target.value);},}, ANESTHESIA.map(function(a){return React.createElement('option', { key: a,}, a);})))
        , React.createElement(Field, { label: "Duración (min)" , C: C,}, React.createElement('input', { type: "number", value: duration, onChange: function(e){setDuration(e.target.value);}, placeholder: "Ej: 45" , min: 1,}))
        , React.createElement(Field, { label: "Cirujano principal" , C: C,}, React.createElement('input', { value: surgeon, onChange: function(e){setSurgeon(e.target.value);}, placeholder: "Nombre del cirujano"  ,}))
        , React.createElement(Field, { label: "Asistente", C: C,}, React.createElement('input', { value: assistant, onChange: function(e){setAssistant(e.target.value);}, placeholder: "Nombre del asistente"  ,}))
        , React.createElement('div', { style: {gridColumn:"1/-1"},}, React.createElement(Field, { label: "Diagnóstico / Indicación quirúrgica *"    , error: errors.diagnosis, C: C,}, React.createElement('textarea', { rows: 2, value: diagnosis, onChange: function(e){setDiagnosis(e.target.value);setErrors({});}, placeholder: "Ej: Piometra cerrada..."  , className: errors.diagnosis?"err":"",})))
      )

      /* Sub-tabs */
      , React.createElement('div', { style: {display:"flex",marginBottom:16,background:C.peach,borderRadius:10,padding:4,gap:2},}
        , TABS.map(function(t,i){
          var active=tab===i;
          return React.createElement('button', { key: t, onClick: function(){setTab(i);}, style: {flex:1,padding:"7px 4px",borderRadius:8,background:active?C.surface:"transparent",border:"none",fontWeight:700,color:active?C.brownDark:C.textMid,fontSize:11,cursor:"pointer"},}, t);
        })
      )

      /* PRE-OP */
      , tab===0&&(
        React.createElement('div', null
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"},}
            , React.createElement(Field, { label: "Peso pre-op (kg)"  , C: C,}, React.createElement('input', { value: preWeight, onChange: function(e){setPreWeight(e.target.value);}, placeholder: "Ej: 12.5" , inputMode: "decimal",}))
            , React.createElement(Field, { label: "Horas de ayuno"  , C: C,}, React.createElement('input', { type: "number", value: preFasting, onChange: function(e){setPreFasting(e.target.value);}, placeholder: "Ej: 8" , min: 0,}))
          )
          , React.createElement(Field, { label: "Exámenes pre-operatorios" , C: C,}, React.createElement('textarea', { rows: 2, value: preExams, onChange: function(e){setPreExams(e.target.value);}, placeholder: "Hemograma, bioquímica, radiografías..."  ,}))
          , React.createElement(Field, { label: "Medicación pre-operatoria" , C: C,}, React.createElement('textarea', { rows: 2, value: preMeds, onChange: function(e){setPreMeds(e.target.value);}, placeholder: "Premedicación, antibiótico profiláctico..."  ,}))
          , React.createElement(Field, { label: "Notas pre-operatorias" , C: C,}, React.createElement('textarea', { rows: 2, value: preNotes, onChange: function(e){setPreNotes(e.target.value);}, placeholder: "Observaciones del estado del paciente antes de la cirugía..."        ,}))
        )
      )

      /* INTRA-OP */
      , tab===1&&(
        React.createElement('div', null
          , React.createElement(Field, { label: "Descripción del procedimiento *"   , error: errors.procedure, C: C,}
            , React.createElement('textarea', { rows: 4, value: procedure, onChange: function(e){setProcedure(e.target.value);setErrors({});}, placeholder: "Describe paso a paso el procedimiento quirúrgico realizado..."       , className: errors.procedure?"err":"",})
          )
          , React.createElement(Field, { label: "Instrumental utilizado" , C: C,}, React.createElement('textarea', { rows: 2, value: instruments, onChange: function(e){setInstruments(e.target.value);}, placeholder: "Bisturí, pinzas, suturas utilizadas..."   ,}))
          , React.createElement('div', { style: {marginBottom:14},}
            , React.createElement('label', { style: {color:C.brownDark},}, "Medicamentos / materiales intraop."   )
            , intraItems.map(function(item,idx){
              return (
                React.createElement('div', { key: item.id, style: {display:"flex",gap:8,alignItems:"center",marginBottom:6,background:C.blueLight,borderRadius:8,padding:"6px 10px"},}
                  , React.createElement('span', { style: {fontSize:11,fontWeight:800,color:C.blue},}, (idx+1)+".")
                  , React.createElement('span', { style: {flex:1,fontSize:13,color:C.text},}, item.text)
                  , React.createElement('button', { onClick: function(){removeIntraItem(item.id);}, style: {background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:16},}, "×")
                )
              );
            })
            , React.createElement('div', { style: {display:"flex",gap:8,marginTop:6},}
              , React.createElement('input', { value: intraText, onChange: function(e){setIntraText(e.target.value);}, onKeyDown: function(e){if(e.key==="Enter"){e.preventDefault();addIntraItem();}}, placeholder: "Ej: Ketamina 5mg/kg IV..."   , style: {flex:1},})
              , React.createElement('button', { onClick: addIntraItem, style: {padding:"0 14px",background:C.blue,border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer"},}, "+")
            )
          )
          , React.createElement(Field, { label: "Complicaciones", C: C,}, React.createElement('textarea', { rows: 2, value: complications, onChange: function(e){setComplications(e.target.value);}, placeholder: "Ninguna / Descripción de complicaciones..."    ,}))
        )
      )

      /* POST-OP */
      , tab===2&&(
        React.createElement('div', null
          , React.createElement(Field, { label: "Resultado", C: C,}
            , React.createElement('select', { value: outcome, onChange: function(e){setOutcome(e.target.value);},}
              , ["Exitosa","Exitosa con complicaciones","Fallida","El paciente no sobrevivió"].map(function(o){return React.createElement('option', { key: o,}, o);})
            )
          )
          , React.createElement(Field, { label: "Instrucciones post-operatorias" , C: C,}, React.createElement('textarea', { rows: 3, value: postInstructions, onChange: function(e){setPostInstructions(e.target.value);}, placeholder: "Reposo, cuidados de herida, restricciones..."    ,}))
          , React.createElement(Field, { label: "Medicación post-operatoria" , C: C,}, React.createElement('textarea', { rows: 2, value: postMeds, onChange: function(e){setPostMeds(e.target.value);}, placeholder: "Antibióticos, analgésicos, antiinflamatorios..."  ,}))
          , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"center"},}
            , React.createElement('div', { style: {flex:1},}, React.createElement(Field, { label: "Próxima revisión" , C: C,}, React.createElement('input', { type: "date", value: nextVisit, onChange: function(e){setNextVisit(e.target.value);}, min: today(),})))
            , nextVisit&&React.createElement('button', { type: "button", onClick: function(){setNextVisit("");}, style: {background:"none",border:"none",color:C.red,fontSize:20,cursor:"pointer",marginTop:8},}, "×")
          )
          , React.createElement(Field, { label: "Notas post-operatorias" , C: C,}, React.createElement('textarea', { rows: 2, value: postNotes, onChange: function(e){setPostNotes(e.target.value);}, placeholder: "Evolución, observaciones del alta..."   ,}))
        )
      )

      /* ARCHIVOS */
      , tab===3&&(
        React.createElement('div', null
          , React.createElement('div', { style: {marginBottom:14},}
            , React.createElement('label', { style: {color:C.brownDark,fontSize:13,fontWeight:700,display:"block",marginBottom:8},}, "Archivos adjuntos (radiografías, fotos, resultados)")
            , files.map(function(f){
              var isImg=f.type&&f.type.startsWith("image/");
              return (
                React.createElement('div', { key: f.id, style: {display:"flex",alignItems:"center",gap:10,marginBottom:8,background:C.surface,borderRadius:10,padding:"8px 12px",border:"1px solid "+C.border},}
                  , isImg&&React.createElement('img', { src: f.file, alt: f.fileName, style: {width:44,height:44,borderRadius:6,objectFit:"cover",flexShrink:0},})
                  , !isImg&&React.createElement('div', { style: {width:44,height:44,borderRadius:6,background:C.peach,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0},}, "📄")
                  , React.createElement('span', { style: {flex:1,fontSize:12,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, f.fileName)
                  , React.createElement('button', { onClick: function(){removeFile(f.id);}, style: {background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:18,flexShrink:0},}, "×")
                )
              );
            })
            , React.createElement('label', { style: {cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,marginTop:4},}
              , React.createElement('div', { style: {background:C.blue,color:"#fff",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700},}, "📎 Agregar archivos")
              , React.createElement('span', { style: {fontSize:11,color:C.textLight},}, "Imágenes, PDF · máx 5MB")
              , React.createElement('input', { type: "file", accept: "image/*,application/pdf", multiple: true, style: {display:"none"}, onChange: handleFile,})
            )
          )
        )
      )

      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:16},}
        , React.createElement(Btn, { onClick: submit, full: true, C: C, variant: "success",}, "💾 Guardar cirugía")
        , React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cancelar")
      )
    )
  );
}

function SurgeryCard(props) {
  var s=props.surgery, pets=props.pets, users=props.users||[], C=props.C;
  var pet=byId(pets,s.petId);
  var vet=byId(users,s.vetId);
  var s1=useState(false); var expanded=s1[0]; var setExpanded=s1[1];
  var riskColor={Bajo:C.green,Moderado:C.yellow,Alto:C.red,Crítico:"#8B0000"};
  var outcomeColor={"Exitosa":C.green,"Exitosa con complicaciones":C.yellow,"Fallida":C.red,"El paciente no sobrevivió":"#8B0000"};
  return (
    React.createElement('div', { style: {background:C.surface,borderRadius:16,border:"1px solid "+C.border,marginBottom:14,overflow:"hidden"},}
      /* Header */
      , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"center",padding:"14px 16px",cursor:"pointer"}, onClick: function(){setExpanded(function(v){return !v;});},}
        , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 44, C: C,})
        , React.createElement('div', { style: {flex:1,minWidth:0},}
          , React.createElement('div', { style: {display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:2},}
            , React.createElement('span', { style: {fontWeight:800,fontSize:15,color:C.brownDark},}, pet&&pet.name)
            , React.createElement('span', { style: {background:C.peach,color:C.brownDark,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700},}, "🔬 "+s.surgeryType)
            , React.createElement('span', { style: {background:(riskColor[s.riskLevel]||C.green)+"22",color:riskColor[s.riskLevel]||C.green,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700},}, s.riskLevel)
          )
          , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, fmtDate(s.date)+(s.duration?" · "+s.duration+" min":"")+(vet?" · "+fullName(vet):""))
          , s.outcome&&React.createElement('div', { style: {fontSize:12,color:outcomeColor[s.outcome]||C.green,fontWeight:700,marginTop:2},}, "● "+s.outcome)
        )
        , React.createElement('div', { style: {display:"flex",gap:6,flexShrink:0},}
          , React.createElement(Btn, { small: true, variant: "ghost", C: C, onClick: function(e){e.stopPropagation();props.onEdit(s);},}, "✏️")
          , React.createElement(Btn, { small: true, variant: "ghost", C: C, onClick: function(e){e.stopPropagation();props.onDelete(s.id);}, style: {color:C.red},}, "🗑️")
          , React.createElement('span', { style: {color:C.textLight,fontSize:18,lineHeight:"32px"},}, expanded?"▾":"▸")
        )
      )
      /* Detail */
      , expanded&&(
        React.createElement('div', { style: {borderTop:"1px solid "+C.border,padding:"14px 16px"},}
          /* Pre-op */
          , (s.preWeight||s.preFasting||s.preExams||s.preMeds||s.preNotes)&&(
            React.createElement('div', { style: {marginBottom:12},}
              , React.createElement('div', { style: {fontWeight:800,fontSize:12,color:C.textMid,marginBottom:6,letterSpacing:1},}, "PRE-OPERATORIO")
              , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},}
                , s.preWeight&&React.createElement('div', { style: {background:C.peach,borderRadius:8,padding:"6px 10px"},}, React.createElement('div', { style: {fontSize:10,color:C.textMid,fontWeight:700},}, "PESO"), React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:600},}, s.preWeight+" kg"))
                , s.preFasting&&React.createElement('div', { style: {background:C.peach,borderRadius:8,padding:"6px 10px"},}, React.createElement('div', { style: {fontSize:10,color:C.textMid,fontWeight:700},}, "AYUNO"), React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:600},}, s.preFasting+" horas"))
                , s.preExams&&React.createElement('div', { style: {gridColumn:"1/-1",background:C.blueLight,borderRadius:8,padding:"6px 10px"},}, React.createElement('div', { style: {fontSize:10,color:C.textMid,fontWeight:700},}, "EXÁMENES"), React.createElement('div', { style: {fontSize:12,color:C.text},}, s.preExams))
                , s.preMeds&&React.createElement('div', { style: {gridColumn:"1/-1",background:C.greenLight,borderRadius:8,padding:"6px 10px"},}, React.createElement('div', { style: {fontSize:10,color:C.textMid,fontWeight:700},}, "PREMEDICACIÓN"), React.createElement('div', { style: {fontSize:12,color:C.text},}, s.preMeds))
              )
            )
          )
          /* Intra-op */
          , React.createElement('div', { style: {marginBottom:12},}
            , React.createElement('div', { style: {fontWeight:800,fontSize:12,color:C.textMid,marginBottom:6,letterSpacing:1},}, "INTRAOPERATORIO")
            , React.createElement('div', { style: {background:C.peach,borderRadius:8,padding:"8px 10px",marginBottom:6},}, React.createElement('div', { style: {fontSize:10,color:C.textMid,fontWeight:700,marginBottom:2},}, "ANESTESIA"), React.createElement('div', { style: {fontSize:12,color:C.text},}, s.anesthesia))
            , s.procedure&&React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:8,padding:"8px 10px",marginBottom:6},}, React.createElement('div', { style: {fontSize:10,color:C.textMid,fontWeight:700,marginBottom:2},}, "PROCEDIMIENTO"), React.createElement('div', { style: {fontSize:12,color:C.text},}, s.procedure))
            , s.intraItems&&s.intraItems.length>0&&React.createElement('div', { style: {marginBottom:6},}, s.intraItems.map(function(item,i){return React.createElement('div', { key: item.id, style: {fontSize:12,color:C.text,padding:"2px 0"},}, (i+1)+". "+item.text);}))
            , s.complications&&s.complications!=="Ninguna"&&React.createElement('div', { style: {background:C.redLight,borderRadius:8,padding:"6px 10px"},}, React.createElement('div', { style: {fontSize:10,color:C.red,fontWeight:700},}, "COMPLICACIONES"), React.createElement('div', { style: {fontSize:12,color:C.red},}, s.complications))
          )
          /* Post-op */
          , (s.postInstructions||s.postMeds||s.nextVisit)&&(
            React.createElement('div', { style: {marginBottom:12},}
              , React.createElement('div', { style: {fontWeight:800,fontSize:12,color:C.textMid,marginBottom:6,letterSpacing:1},}, "POST-OPERATORIO")
              , s.postInstructions&&React.createElement('div', { style: {background:C.greenLight,borderRadius:8,padding:"6px 10px",marginBottom:6},}, React.createElement('div', { style: {fontSize:10,color:C.textMid,fontWeight:700},}, "INSTRUCCIONES"), React.createElement('div', { style: {fontSize:12,color:C.text},}, s.postInstructions))
              , s.postMeds&&React.createElement('div', { style: {background:C.blueLight,borderRadius:8,padding:"6px 10px",marginBottom:6},}, React.createElement('div', { style: {fontSize:10,color:C.textMid,fontWeight:700},}, "MEDICACIÓN"), React.createElement('div', { style: {fontSize:12,color:C.text},}, s.postMeds))
              , s.nextVisit&&React.createElement('div', { style: {display:"inline-block",background:C.blueLight,color:C.blue,borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700},}, "📅 Revisión: "+fmtDate(s.nextVisit))
            )
          )
          /* Files */
          , s.files&&s.files.length>0&&(
            React.createElement('div', null
              , React.createElement('div', { style: {fontWeight:800,fontSize:12,color:C.textMid,marginBottom:6,letterSpacing:1},}, "ARCHIVOS")
              , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"},}
                , s.files.map(function(f){
                  var isImg=f.type&&f.type.startsWith("image/");
                  return (
                    React.createElement('a', { key: f.id, href: f.file, download: f.fileName, style: {textDecoration:"none"},}
                      , isImg
                        ?React.createElement('img', { src: f.file, alt: f.fileName, style: {width:64,height:64,borderRadius:8,objectFit:"cover",border:"1px solid "+C.border},})
                        :React.createElement('div', { style: {width:64,height:64,borderRadius:8,background:C.peach,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"1px solid "+C.border,fontSize:24},}, "📄", React.createElement('span', { style: {fontSize:9,color:C.textMid,marginTop:2,textAlign:"center",overflow:"hidden",width:56},}, f.fileName))
                      
                    )
                  );
                })
              )
            )
          )
        )
      )
    )
  );
}

function SurgeriesList(props) {
  var surgeries=props.surgeries, pets=props.pets, users=props.users||[], C=props.C;
  var isMobile=useIsMobile();
  var s1=useState(""); var search=s1[0]; var setSearch=s1[1];
  var s2=useState("Todas"); var fspecies=s2[0]; var setFspecies=s2[1];
  var s3=useState("Todos"); var ftype=s3[0]; var setFtype=s3[1];
  var SPECIES=["Todas","Perro","Gato","Ave","Conejo","Reptil","Pez","Otro"];
  var TYPES=["Todos","Castración","Esterilización","Ortopedia","Extracción dental","Masa/Tumor","Cesárea","Oftalmológica","Digestiva","Urológica","Traumatología","Otra"];

  var filtered=surgeries.filter(function(s){
    var pet=byId(pets,s.petId);
    var sr=search.toLowerCase();
    var matchSearch=!sr||(pet&&pet.name.toLowerCase().indexOf(sr)>=0)||s.surgeryType.toLowerCase().indexOf(sr)>=0||s.diagnosis.toLowerCase().indexOf(sr)>=0;
    var matchSpecies=fspecies==="Todas"||(pet&&pet.species===fspecies);
    var matchType=ftype==="Todos"||s.surgeryType===ftype;
    return matchSearch&&matchSpecies&&matchType;
  }).sort(function(a,b){return b.date.localeCompare(a.date);});

  return (
    React.createElement('div', null
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:10},}
        , React.createElement('div', null
          , React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark},}, "Cirugías")
          , React.createElement('p', { style: {color:C.textMid,fontSize:13},}, surgeries.length+" registradas")
        )
        , React.createElement(Btn, { C: C, onClick: props.onAdd, disabled: pets.length===0,}, "+ Nueva cirugía")
      )
      , React.createElement('div', { style: {display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"},}
        , React.createElement('div', { style: {flex:1,minWidth:180},}, React.createElement('input', { placeholder: "Buscar por mascota, tipo o diagnóstico..."     , value: search, onChange: function(e){setSearch(e.target.value);},}))
        , React.createElement('select', { value: fspecies, onChange: function(e){setFspecies(e.target.value);}, style: {width:"auto",minWidth:110},}, SPECIES.map(function(s){return React.createElement('option', { key: s,}, s);}))
        , React.createElement('select', { value: ftype, onChange: function(e){setFtype(e.target.value);}, style: {width:"auto",minWidth:140},}, TYPES.map(function(t){return React.createElement('option', { key: t,}, t);}))
      )
      , filtered.length===0
        ?React.createElement('div', { style: {textAlign:"center",padding:40,color:C.textLight},}
            , React.createElement('div', { style: {fontSize:48,marginBottom:12},}, "🔬")
            , React.createElement('p', null, surgeries.length===0?"Aún no hay cirugías registradas":"Sin resultados para tu búsqueda")
          )
        :filtered.map(function(s){
            return React.createElement(SurgeryCard, { key: s.id, surgery: s, pets: pets, users: users, onEdit: props.onEdit, onDelete: props.onDelete, C: C,});
          })
      
    )
  );
}

// ============================================================
// APP - Componente principal, estado global, handlers
// ============================================================

// ============================================================
// CONSTANTES FISIOLÓGICAS
// ============================================================

var PHYSIO_DATA = {
  "Perro": {
    icon: "🐶",
    color: "#2E86C1",
    sections: [
      {
        title: "Signos Vitales",
        icon: "❤️",
        items: [
          { param: "Frecuencia Cardíaca", value: "60 – 140 lpm", note: "Varía según tamaño: razas grandes 60-90, pequeñas 100-140" },
          { param: "Frecuencia Respiratoria", value: "10 – 30 rpm", note: "En reposo" },
          { param: "Temperatura Rectal", value: "37.5 – 39.2 °C", note: "Promedio 38.5 °C" },
          { param: "Presión Arterial Sistólica", value: "110 – 160 mmHg", note: "" },
          { param: "Tiempo Llenado Capilar", value: "< 2 segundos", note: "" }
        ]
      },
      {
        title: "Parámetros Hematológicos",
        icon: "🩸",
        items: [
          { param: "Eritrocitos (RBC)", value: "5.5 – 8.5 × 10⁶/µL", note: "" },
          { param: "Hematocrito (HCT)", value: "37 – 55 %", note: "" },
          { param: "Hemoglobina", value: "12 – 18 g/dL", note: "" },
          { param: "Leucocitos (WBC)", value: "6,000 – 17,000 /µL", note: "" },
          { param: "Plaquetas", value: "200,000 – 500,000 /µL", note: "" }
        ]
      },
      {
        title: "Bioquímica Sérica",
        icon: "🧪",
        items: [
          { param: "Glucosa", value: "70 – 110 mg/dL", note: "" },
          { param: "BUN (Urea)", value: "7 – 27 mg/dL", note: "" },
          { param: "Creatinina", value: "0.5 – 1.5 mg/dL", note: "" },
          { param: "ALT (GPT)", value: "10 – 58 U/L", note: "" },
          { param: "Fosfatasa Alcalina", value: "20 – 150 U/L", note: "" },
          { param: "Proteínas Totales", value: "5.4 – 7.1 g/dL", note: "" },
          { param: "Calcio", value: "8.9 – 11.4 mg/dL", note: "" }
        ]
      },
      {
        title: "Datos Reproductivos",
        icon: "🔄",
        items: [
          { param: "Gestación", value: "58 – 65 días", note: "Promedio 63 días" },
          { param: "Pubertad (hembra)", value: "6 – 12 meses", note: "Según raza" },
          { param: "Ciclo estral", value: "6 – 12 meses", note: "" }
        ]
      }
    ]
  },
  "Gato": {
    icon: "🐱",
    color: "#8E44AD",
    sections: [
      {
        title: "Signos Vitales",
        icon: "❤️",
        items: [
          { param: "Frecuencia Cardíaca", value: "120 – 240 lpm", note: "Promedio 180 lpm" },
          { param: "Frecuencia Respiratoria", value: "20 – 30 rpm", note: "En reposo" },
          { param: "Temperatura Rectal", value: "38.0 – 39.5 °C", note: "Promedio 38.6 °C" },
          { param: "Presión Arterial Sistólica", value: "120 – 170 mmHg", note: "" },
          { param: "Tiempo Llenado Capilar", value: "< 2 segundos", note: "" }
        ]
      },
      {
        title: "Parámetros Hematológicos",
        icon: "🩸",
        items: [
          { param: "Eritrocitos (RBC)", value: "5.0 – 10.0 × 10⁶/µL", note: "" },
          { param: "Hematocrito (HCT)", value: "29 – 48 %", note: "" },
          { param: "Hemoglobina", value: "8 – 15 g/dL", note: "" },
          { param: "Leucocitos (WBC)", value: "5,500 – 19,500 /µL", note: "" },
          { param: "Plaquetas", value: "300,000 – 700,000 /µL", note: "" }
        ]
      },
      {
        title: "Bioquímica Sérica",
        icon: "🧪",
        items: [
          { param: "Glucosa", value: "70 – 120 mg/dL", note: "Puede subir por estrés" },
          { param: "BUN (Urea)", value: "14 – 36 mg/dL", note: "" },
          { param: "Creatinina", value: "0.8 – 2.4 mg/dL", note: "" },
          { param: "ALT (GPT)", value: "6 – 83 U/L", note: "" },
          { param: "Fosfatasa Alcalina", value: "12 – 65 U/L", note: "" },
          { param: "Proteínas Totales", value: "5.7 – 7.8 g/dL", note: "" },
          { param: "Calcio", value: "7.8 – 11.0 mg/dL", note: "" }
        ]
      },
      {
        title: "Datos Reproductivos",
        icon: "🔄",
        items: [
          { param: "Gestación", value: "58 – 68 días", note: "Promedio 65 días" },
          { param: "Pubertad (hembra)", value: "4 – 10 meses", note: "" },
          { param: "Ciclo estral", value: "Poliéstrica estacional", note: "" }
        ]
      }
    ]
  },
  "Ave": {
    icon: "🦜",
    color: "#27AE60",
    sections: [
      {
        title: "Signos Vitales",
        icon: "❤️",
        items: [
          { param: "Frecuencia Cardíaca", value: "200 – 400 lpm", note: "Varía mucho según especie y tamaño" },
          { param: "Frecuencia Respiratoria", value: "25 – 60 rpm", note: "" },
          { param: "Temperatura Corporal", value: "40.0 – 42.0 °C", note: "Aves tienen temperatura más alta" },
          { param: "Peso corporal normal", value: "Especie-dependiente", note: "Monitorear pérdida > 5% del peso" }
        ]
      },
      {
        title: "Parámetros Hematológicos",
        icon: "🩸",
        items: [
          { param: "Eritrocitos (RBC)", value: "2.5 – 4.5 × 10⁶/µL", note: "Nucleados en aves" },
          { param: "Hematocrito (HCT)", value: "35 – 55 %", note: "" },
          { param: "Hemoglobina", value: "12 – 18 g/dL", note: "" },
          { param: "Leucocitos (WBC)", value: "3,000 – 10,000 /µL", note: "Heterófilos en lugar de neutrófilos" }
        ]
      },
      {
        title: "Bioquímica Sérica",
        icon: "🧪",
        items: [
          { param: "Glucosa", value: "200 – 350 mg/dL", note: "Aves tienen glucosa basal más alta" },
          { param: "Ácido Úrico", value: "2 – 10 mg/dL", note: "Equivalente a urea en mamíferos" },
          { param: "ALT / AST", value: "< 100 U/L", note: "" },
          { param: "Calcio total", value: "8 – 11 mg/dL", note: "Hembras en postura: hasta 30 mg/dL" }
        ]
      },
      {
        title: "Datos Reproductivos",
        icon: "🔄",
        items: [
          { param: "Incubación (periquito)", value: "18 días", note: "" },
          { param: "Incubación (loro/cacatúa)", value: "21 – 30 días", note: "" },
          { param: "Pubertad", value: "6 – 24 meses", note: "Varía por especie" }
        ]
      }
    ]
  },
  "Conejo": {
    icon: "🐰",
    color: "#E67E22",
    sections: [
      {
        title: "Signos Vitales",
        icon: "❤️",
        items: [
          { param: "Frecuencia Cardíaca", value: "130 – 325 lpm", note: "Promedio 205 lpm" },
          { param: "Frecuencia Respiratoria", value: "30 – 60 rpm", note: "" },
          { param: "Temperatura Rectal", value: "38.5 – 40.0 °C", note: "" },
          { param: "Tiempo Llenado Capilar", value: "< 2 segundos", note: "" }
        ]
      },
      {
        title: "Parámetros Hematológicos",
        icon: "🩸",
        items: [
          { param: "Eritrocitos (RBC)", value: "4.0 – 7.0 × 10⁶/µL", note: "" },
          { param: "Hematocrito (HCT)", value: "33 – 50 %", note: "" },
          { param: "Hemoglobina", value: "10 – 15 g/dL", note: "" },
          { param: "Leucocitos (WBC)", value: "5,000 – 12,000 /µL", note: "Linfocitos predominan (40-75%)" }
        ]
      },
      {
        title: "Bioquímica Sérica",
        icon: "🧪",
        items: [
          { param: "Glucosa", value: "75 – 150 mg/dL", note: "" },
          { param: "BUN (Urea)", value: "13 – 29 mg/dL", note: "" },
          { param: "Creatinina", value: "0.5 – 2.5 mg/dL", note: "" },
          { param: "Calcio total", value: "5.6 – 12.5 mg/dL", note: "Conejos excretan calcio por orina (normal)" }
        ]
      },
      {
        title: "Datos Reproductivos",
        icon: "🔄",
        items: [
          { param: "Gestación", value: "29 – 35 días", note: "Promedio 31 días" },
          { param: "Pubertad hembra", value: "4 – 6 meses", note: "" },
          { param: "Pubertad macho", value: "5 – 8 meses", note: "" },
          { param: "Ovulación", value: "Inducida por la monta", note: "" }
        ]
      }
    ]
  },
  "Reptil": {
    icon: "🦎",
    color: "#16A085",
    sections: [
      {
        title: "Signos Vitales",
        icon: "❤️",
        items: [
          { param: "Frecuencia Cardíaca", value: "20 – 80 lpm", note: "Depende temperatura ambiental" },
          { param: "Frecuencia Respiratoria", value: "4 – 20 rpm", note: "Muy variable" },
          { param: "Temperatura Corporal", value: "25 – 35 °C", note: "Ectotermos — depende del ambiente" },
          { param: "Temperatura óptima (iguana)", value: "30 – 37 °C", note: "Zona de preferencia térmica" }
        ]
      },
      {
        title: "Bioquímica Sérica",
        icon: "🧪",
        items: [
          { param: "Glucosa", value: "60 – 120 mg/dL", note: "Varía por especie" },
          { param: "Ácido Úrico", value: "2 – 8 mg/dL", note: "Principal metabolito nitrogenado" },
          { param: "Calcio total", value: "8 – 12 mg/dL", note: "Hembras en reproducción pueden duplicarlo" },
          { param: "Fósforo", value: "1.5 – 4.0 mg/dL", note: "Relación Ca:P debe ser ≥ 1.5:1" }
        ]
      },
      {
        title: "Notas Clínicas",
        icon: "📋",
        items: [
          { param: "Muda de piel", value: "Cada 4 – 8 semanas", note: "Ecdisis incompleta indica problema" },
          { param: "Ayuno preoperatorio", value: "24 – 48 horas", note: "" },
          { param: "Período digestión", value: "2 – 4 días post ingesta", note: "No manejar durante este período" }
        ]
      }
    ]
  },
  "Otro": {
    icon: "🐾",
    color: "#7F8C8D",
    sections: [
      {
        title: "Cobayo (Cavia porcellus)",
        icon: "🐹",
        items: [
          { param: "Frecuencia Cardíaca", value: "230 – 380 lpm", note: "" },
          { param: "Frecuencia Respiratoria", value: "42 – 104 rpm", note: "" },
          { param: "Temperatura Rectal", value: "37.2 – 39.5 °C", note: "" },
          { param: "Gestación", value: "59 – 72 días", note: "Promedio 63 días — crías precociales" }
        ]
      },
      {
        title: "Hurón (Mustela putorius)",
        icon: "🦔",
        items: [
          { param: "Frecuencia Cardíaca", value: "180 – 250 lpm", note: "" },
          { param: "Frecuencia Respiratoria", value: "33 – 36 rpm", note: "" },
          { param: "Temperatura Rectal", value: "37.8 – 40.0 °C", note: "" },
          { param: "Gestación", value: "41 – 43 días", note: "" }
        ]
      },
      {
        title: "Rata (Rattus norvegicus)",
        icon: "🐀",
        items: [
          { param: "Frecuencia Cardíaca", value: "250 – 450 lpm", note: "" },
          { param: "Frecuencia Respiratoria", value: "70 – 115 rpm", note: "" },
          { param: "Temperatura Rectal", value: "35.9 – 37.5 °C", note: "" },
          { param: "Gestación", value: "20 – 22 días", note: "" }
        ]
      }
    ]
  }
};

function PhysioConstants(props) {
  var C = props.C;
  var isMobile = useIsMobile();
  var SPECIES_LIST = ["Perro","Gato","Ave","Conejo","Reptil","Otro"];
  var s1 = useState("Perro"); var selSpecies = s1[0]; var setSelSpecies = s1[1];
  var s2 = useState(null); var openSection = s2[0]; var setOpenSection = s2[1];
  var data = PHYSIO_DATA[selSpecies];

  return React.createElement('div', null,
    React.createElement('div', { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4, flexWrap:"wrap", gap:10 }},
      React.createElement('div', null,
        React.createElement('h2', { style: { fontFamily:"'Playfair Display',serif", fontSize:isMobile?22:26, color:C.brownDark, marginBottom:2 }}, "Constantes Fisiológicas"),
        React.createElement('p', { style: { color:C.textMid, fontSize:13 }}, "Valores de referencia por especie")
      )
    ),

    React.createElement('div', { style: { display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }},
      SPECIES_LIST.map(function(sp) {
        var d = PHYSIO_DATA[sp];
        var active = selSpecies === sp;
        return React.createElement('button', {
          key: sp,
          onClick: function() { setSelSpecies(sp); setOpenSection(null); },
          style: {
            display:"flex", alignItems:"center", gap:6,
            padding: isMobile?"8px 12px":"10px 16px",
            borderRadius:12,
            border:"2px solid " + (active ? d.color : C.border),
            background: active ? d.color + "18" : C.surface,
            color: active ? d.color : C.textMid,
            fontWeight: active ? 800 : 600,
            fontSize:13, cursor:"pointer",
            transition:"all .15s"
          }
        }, d.icon, " ", sp);
      })
    ),

    data && React.createElement('div', null,
      React.createElement('div', { style: { display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background: data.color+"18", borderRadius:14, marginBottom:16, border:"1.5px solid "+data.color+"44" }},
        React.createElement('div', { style: { fontSize:40 }}, data.icon),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize:18, fontWeight:800, color:data.color }}, selSpecies),
          React.createElement('div', { style: { fontSize:12, color:C.textMid, marginTop:2 }}, data.sections.length + " categorías de referencia")
        )
      ),

      data.sections.map(function(section, si) {
        var isOpen = openSection === si || openSection === null;
        return React.createElement('div', { key: si, style: { marginBottom:10, borderRadius:14, border:"1px solid "+C.border, overflow:"hidden" }},
          React.createElement('button', {
            onClick: function() { setOpenSection(isOpen && openSection === si ? null : si); },
            style: {
              width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"14px 18px", background: isOpen ? data.color+"0F" : C.surface,
              border:"none", cursor:"pointer", textAlign:"left"
            }
          },
            React.createElement('div', { style: { display:"flex", alignItems:"center", gap:10 }},
              React.createElement('span', { style: { fontSize:20 }}, section.icon),
              React.createElement('span', { style: { fontWeight:800, fontSize:15, color:C.brownDark }}, section.title)
            ),
            React.createElement('span', { style: { color:C.textLight, fontSize:18, transition:"transform .2s", display:"inline-block", transform: isOpen?"rotate(90deg)":"rotate(0deg)" }}, "›")
          ),

          isOpen && React.createElement('div', { style: { overflowX:"auto" }},
            React.createElement('table', { style: { width:"100%", borderCollapse:"collapse" }},
              React.createElement('thead', null,
                React.createElement('tr', { style: { background:C.peach }},
                  React.createElement('th', { style: { padding:"8px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:C.textMid, textTransform:"uppercase", letterSpacing:0.8, borderBottom:"1px solid "+C.border }}, "Parámetro"),
                  React.createElement('th', { style: { padding:"8px 14px", textAlign:"center", fontSize:11, fontWeight:800, color:C.textMid, textTransform:"uppercase", letterSpacing:0.8, borderBottom:"1px solid "+C.border, whiteSpace:"nowrap" }}, "Valor de referencia"),
                  !isMobile && React.createElement('th', { style: { padding:"8px 14px", textAlign:"left", fontSize:11, fontWeight:800, color:C.textMid, textTransform:"uppercase", letterSpacing:0.8, borderBottom:"1px solid "+C.border }}, "Nota")
                )
              ),
              React.createElement('tbody', null,
                section.items.map(function(item, ii) {
                  return React.createElement('tr', { key: ii, style: { background: ii%2===0 ? C.surface : C.cream }},
                    React.createElement('td', { style: { padding:"10px 14px", fontSize:13, fontWeight:600, color:C.text, borderBottom:"1px solid "+C.border+"55" }}, item.param),
                    React.createElement('td', { style: { padding:"10px 14px", fontSize:13, fontWeight:800, color:data.color, textAlign:"center", borderBottom:"1px solid "+C.border+"55", whiteSpace:"nowrap" }}, item.value),
                    !isMobile && React.createElement('td', { style: { padding:"10px 14px", fontSize:12, color:C.textLight, borderBottom:"1px solid "+C.border+"55" }}, item.note||"—")
                  );
                })
              )
            ),
            isMobile && React.createElement('div', { style: { padding:"8px 14px 12px" }},
              section.items.map(function(item, ii) {
                return item.note ? React.createElement('div', { key: ii, style: { fontSize:11, color:C.textLight, marginBottom:2 }},
                  React.createElement('span', { style: { fontWeight:700, color:C.textMid }}, item.param + ": "),
                  item.note
                ) : null;
              })
            )
          )
        );
      })
    )
  );
}
