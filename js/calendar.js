function CalendarView(props) {
  var appointments=props.appointments, apptReqs=props.apptReqs, pets=props.pets, users=props.users, user=props.user;
  var onAdd=props.onAdd, onEdit=props.onEdit, onConfirmReq=props.onConfirmReq, onConfirmAll=props.onConfirmAll;
  var onCancel=props.onCancel, onReschedule=props.onReschedule, onApprove=props.onApprove, onReject=props.onReject;
  var onSendReq=props.onSendReq, onOpenClinical=props.onOpenClinical, onConfirmAndAttend=props.onConfirmAndAttend;
  var blockedDays=props.blockedDays, C=props.C;
  var isMobile=useIsMobile();
  var isVet=user.role==="vet", isAdmin=user.role==="admin", isOwner=user.role==="owner";
  var s1=useState(today()); var selDate=s1[0]; var setSelDate=s1[1];
  var s2=useState(function(){var d=new Date();return {y:d.getFullYear(),m:d.getMonth()};}); var vm=s2[0]; var setVm=s2[1];
  var s3=useState(null); var detailAppt=s3[0]; var setDetailAppt=s3[1];
  var s4=useState(false); var showCancelled=s4[0]; var setShowCancelled=s4[1];
  var s5=useState(false); var showReqModal=s5[0]; var setShowReqModal=s5[1];
  var s6=useState(false); var reqsOpen=s6[0]; var setReqsOpen=s6[1];
  var s7=useState(false); var confOpen=s7[0]; var setConfOpen=s7[1];
  var s8=useState(0); var reqPage=s8[0]; var setReqPage=s8[1];
  var s9=useState(0); var confPage=s9[0]; var setConfPage=s9[1];
  var PER=5;
  var blockedList=blockedDays.map(function(b){return b.date;});
  var myAppts=isVet||isAdmin?appointments:appointments.filter(function(a){return a.ownerId===user.id;});
  var active=myAppts.filter(function(a){return a.status!=="cancelled";});
  var cancelled=myAppts.filter(function(a){return a.status==="cancelled";});
  var pendingReqs=(isVet||isAdmin)?apptReqs.filter(function(r){return r.status==="pending";}).sort(function(a,b){return b.ts-a.ts;}):[];
  function getPet(id){return byId(pets,id);}
  function getUser(id){return byId(users,id);}
  var firstDay=new Date(vm.y,vm.m,1);
  var lastDay=new Date(vm.y,vm.m+1,0);
  var startDow=firstDay.getDay();
  var days=[]; for(var i=0;i<startDow;i++) days.push(null); for(var d=1;d<=lastDay.getDate();d++) days.push(d);
  function isoDate(d){ var mm=String(vm.m+1).padStart?String(vm.m+1).padStart(2,"0"):(vm.m+1<10?"0"+(vm.m+1):""+(vm.m+1)); var dd=d<10?"0"+d:""+d; return vm.y+"-"+mm+"-"+dd; }
  var monthName=new Date(vm.y,vm.m,1).toLocaleDateString("es-PE",{month:"long",year:"numeric"});
  var todayAppts=active.filter(function(a){return a.date===selDate;}).sort(function(a,b){return a.time.localeCompare(b.time);});
  var upcoming=active.filter(function(a){return a.date>=today();}).sort(function(a,b){return a.date.localeCompare(b.date)||a.time.localeCompare(b.time);});
  var pendingUp=upcoming.filter(function(a){return a.status==="pending";});
  var confirmedUp=upcoming.filter(function(a){return a.status==="confirmed";});
  var totalReqPages=Math.ceil(pendingReqs.length/PER);
  var reqSlice=pendingReqs.slice(reqPage*PER,(reqPage+1)*PER);
  var totalConfPages=Math.ceil(confirmedUp.length/PER);
  var confSlice=confirmedUp.slice(confPage*PER,(confPage+1)*PER);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark}}>{isOwner?"Mis Citas":"Calendario de Citas"}</h2>
          <p style={{color:C.textMid,fontSize:13}}>{active.length+" activa(s)"+(pendingReqs.length>0?" - "+pendingReqs.length+" solicitud(es)":"")}</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {isOwner&&<Btn small={true} variant="purple" C={C} onClick={function(){setShowReqModal(true);}}>Solicitar cita</Btn>}
          {(isVet||isAdmin)&&pendingUp.length>0&&<Btn variant="warning" small={true} C={C} onClick={onConfirmAll}>{"Solicitar confirmacion ("+pendingUp.length+")"}</Btn>}
          {(isVet||isAdmin)&&<Btn small={true} C={C} onClick={function(){onAdd();}}>+ Nueva cita</Btn>}
        </div>
      </div>
      {pendingReqs.length>0&&(
        <div style={{marginBottom:14,borderRadius:16,border:"1.5px solid "+C.purple,overflow:"hidden"}}>
          <button onClick={function(){setReqsOpen(function(o){return !o;});}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:C.purpleLight,border:"none",cursor:"pointer",textAlign:"left"}}>
            <span style={{fontWeight:800,color:C.purple,fontSize:14}}>{"Solicitudes pendientes ("+(pendingReqs.length)+")"}</span>
            <span style={{color:C.purple,fontSize:16}}>{reqsOpen?"▾":"▸"}</span>
          </button>
          {reqsOpen&&(
            <div style={{background:C.surface}}>
              {reqSlice.map(function(req){
                var pet=getPet(req.petId),owner=getUser(req.ownerId);
                return (
                  <div key={req.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 14px",borderBottom:"1px solid "+C.border,flexWrap:"wrap"}}>
                    <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={36} C={C}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(pet&&pet.name||"")+" - "+fullName(owner)}</div>
                      <div style={{fontSize:12,color:C.textMid}}>{fmtDate(req.date)+" - "+req.time+" hs - "}<Badge type={req.type}/></div>
                      {req.notes&&<div style={{fontSize:11,color:C.textLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{"Nota: "+req.notes}</div>}
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button onClick={function(){onApprove(req);}} title="Aprobar" style={sBtnIcon(C,C.green,C.greenLight,34)}>{"✅"}</button>
                      <button onClick={function(){onReject(req);}} title="Rechazar" style={sBtnIcon(C,C.red,C.redLight,34)}>{"❌"}</button>
                    </div>
                  </div>
                );
              })}
              {totalReqPages>1&&(
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 14px",borderTop:"1px solid "+C.border}}>
                  <button onClick={function(){setReqPage(function(p){return Math.max(0,p-1);});}} disabled={reqPage===0} style={{background:C.peach,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,opacity:reqPage===0?0.4:1}}>{"<"}</button>
                  <span style={{fontSize:13,color:C.textMid}}>{(reqPage+1)+"/"+totalReqPages}</span>
                  <button onClick={function(){setReqPage(function(p){return Math.min(totalReqPages-1,p+1);});}} disabled={reqPage===totalReqPages-1} style={{background:C.peach,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,opacity:reqPage===totalReqPages-1?0.4:1}}>{">"}</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
        <Card C={C} style={{padding:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <button onClick={function(){setVm(function(v){var m=v.m-1;return m<0?{y:v.y-1,m:11}:{y:v.y,m:m};});}} style={{background:C.peach,border:"none",borderRadius:8,width:30,height:30,fontSize:16,cursor:"pointer",color:C.brownDark}}>{"<"}</button>
            <span style={{fontWeight:800,fontSize:14,color:C.brownDark,textTransform:"capitalize"}}>{monthName}</span>
            <button onClick={function(){setVm(function(v){var m=v.m+1;return m>11?{y:v.y+1,m:0}:{y:v.y,m:m};});}} style={{background:C.peach,border:"none",borderRadius:8,width:30,height:30,fontSize:16,cursor:"pointer",color:C.brownDark}}>{">"}</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
            {["Do","Lu","Ma","Mi","Ju","Vi","Sa"].map(function(d){return <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:C.textLight,padding:"3px 0"}}>{d}</div>;})}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {days.map(function(d,i){
              if(!d) return <div key={i}/>;
              var iso=isoDate(d);
              var ap=active.filter(function(a){return a.date===iso;});
              var isT=iso===today(), isSel=iso===selDate;
              var isBlk=blockedList.indexOf(iso)>=0;
              return (
                <button key={i} onClick={function(){setSelDate(iso);}} style={{aspectRatio:"1",borderRadius:8,border:"none",background:isSel?C.brown:isBlk?C.redLight:isT?C.peach:"transparent",color:isSel?"#fff":isBlk?C.red:isT?C.brownDark:C.text,fontWeight:isSel||isT?800:400,fontSize:12,cursor:"pointer",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:0}}>
                  {isBlk?"X":d}
                  {!isBlk&&ap.length>0&&<div style={{position:"absolute",bottom:1,display:"flex",gap:2}}>{ap.slice(0,3).map(function(_,i2){return <div key={i2} style={{width:3,height:3,borderRadius:50,background:isSel?"#ffffffaa":C.brown}}/>;})}</div>}
                </button>
              );
            })}
          </div>
        </Card>
        <Card C={C} style={{padding:16}}>
          <div style={{fontWeight:800,fontSize:14,color:C.brownDark,marginBottom:12}}>{fmtDate(selDate)}</div>
          {blockedList.indexOf(selDate)>=0&&<div style={{background:C.redLight,borderRadius:10,padding:"8px 12px",marginBottom:10,color:C.red,fontSize:13,fontWeight:700}}>Dia bloqueado</div>}
          {todayAppts.length===0?<p style={{color:C.textLight,fontSize:13,textAlign:"center",padding:"20px 0"}}>Sin citas este dia</p>
            :todayAppts.map(function(a){
              var pet=getPet(a.petId),owner=getUser(a.ownerId);
              return (
                <div key={a.id} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid "+C.border,cursor:"pointer"}} onClick={function(){setDetailAppt(a);}}>
                  <div style={{fontSize:12,fontWeight:800,color:C.brown,minWidth:40,flexShrink:0}}>{a.time}</div>
                  <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={32} C={C}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:12,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(pet&&pet.name||"")+((isVet||isAdmin)&&owner?" - "+fullName(owner):"")}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}><Badge type={a.type}/><StatusBadge status={a.status} C={C}/></div>
                  </div>
                </div>
              );
            })}
        </Card>
      </div>
      {pendingUp.length>0&&(isVet||isAdmin)&&(
        <Card C={C} style={{padding:16,marginBottom:12}}>
          <div style={{fontWeight:800,fontSize:14,color:C.brownDark,marginBottom:10}}>{"Pendientes de atención ("+pendingUp.length+")"}</div>
          {pendingUp.map(function(a){
            var pet=getPet(a.petId),owner=getUser(a.ownerId);
            return (
              <div key={a.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+C.border,flexWrap:"wrap"}}>
                <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={34} C={C}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(pet&&pet.name||"")+" - "+fullName(owner)}</div>
                  <div style={{fontSize:12,color:C.textMid}}>{fmtDate(a.date)+" - "+a.time+" hs"}</div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap"}}>
                  <button onClick={function(){onConfirmAndAttend(a);}} title="Confirmar y atender" style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",background:C.green,border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>{"Atender"}</button>
                  <button onClick={function(){onConfirmReq([a.id]);}} title="Solicitar confirmación" style={sBtnIcon(C,C.yellow,C.yellowLight)}>{"📨"}</button>
                  <button onClick={function(){onCancel(a,"vet");}} title="Cancelar" style={{width:32,height:32,background:C.redLight,border:"1px solid "+C.red,borderRadius:8,color:C.red,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:0.7}}>{"x"}</button>
                </div>
              </div>
            );
          })}
        </Card>
      )}
      {confirmedUp.length>0&&(isVet||isAdmin)&&(
        <div style={{marginBottom:14,borderRadius:16,border:"1.5px solid "+C.green,overflow:"hidden"}}>
          <button onClick={function(){setConfOpen(function(o){return !o;});}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:C.greenLight,border:"none",cursor:"pointer",textAlign:"left"}}>
            <span style={{fontWeight:800,color:C.green,fontSize:14}}>{"Citas confirmadas próximas ("+confirmedUp.length+")"}</span>
            <span style={{color:C.green,fontSize:16}}>{confOpen?"▾":"▸"}</span>
          </button>
          {confOpen&&(
            <div style={{background:C.surface}}>
              {confSlice.map(function(a){
                var pet=getPet(a.petId),owner=getUser(a.ownerId);
                return (
                  <div key={a.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 14px",borderBottom:"1px solid "+C.border,flexWrap:"wrap"}}>
                    <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={36} C={C}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(pet&&pet.name||"")+" - "+fullName(owner)}</div>
                      <div style={{fontSize:12,color:C.textMid}}>{fmtDate(a.date)+" - "+a.time+" hs"}</div>
                    </div>
                    <div style={{display:"flex",gap:4,flexShrink:0}}>
                      <button onClick={function(){onOpenClinical(a,pet);}} title="Atender" style={sBtnIcon(C,C.blue,C.blueLight,34)}>{"🩺"}</button>
                      <button onClick={function(){onEdit(a);}} title="Editar" style={sBtnIcon(C,C.brownDark,C.peach,34)}>{"✏️"}</button>
                      <button onClick={function(){onCancel(a,"vet");}} title="Cancelar" style={{width:34,height:34,borderRadius:10,background:C.redLight,border:"1px solid "+C.red,color:C.red,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{"x"}</button>
                    </div>
                  </div>
                );
              })}
              {totalConfPages>1&&(
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 14px",borderTop:"1px solid "+C.border}}>
                  <button onClick={function(){setConfPage(function(p){return Math.max(0,p-1);});}} disabled={confPage===0} style={{background:C.peach,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,opacity:confPage===0?0.4:1}}>{"<"}</button>
                  <span style={{fontSize:13,color:C.textMid}}>{(confPage+1)+"/"+totalConfPages}</span>
                  <button onClick={function(){setConfPage(function(p){return Math.min(totalConfPages-1,p+1);});}} disabled={confPage===totalConfPages-1} style={{background:C.peach,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,opacity:confPage===totalConfPages-1?0.4:1}}>{">"}</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {isOwner&&upcoming.length>0&&(
        <Card C={C} style={{padding:16,marginBottom:12}}>
          <div style={{fontWeight:800,fontSize:14,color:C.brownDark,marginBottom:10}}>Mis próximas citas</div>
          {upcoming.map(function(a){
            var pet=getPet(a.petId);
            return (
              <div key={a.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+C.border,flexWrap:"wrap"}}>
                <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={32} C={C}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13,color:C.text}}>{pet&&pet.name}</div>
                  <div style={{fontSize:12,color:C.textMid}}>{fmtDate(a.date)+" - "+a.time+" hs"}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}><Badge type={a.type}/><StatusBadge status={a.status} C={C}/></div>
                </div>
                {(a.status==="pending"||a.status==="confirmed")&&(
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    {a.status==="pending"&&<button onClick={function(){onReschedule(a,"confirmed");}} title="Confirmar" style={sBtnIcon(C,C.green,C.greenLight)}>{"✅"}</button>}
                    <button onClick={function(){onReschedule(a,"reschedule");}} title="Reprogramar" style={sBtnIcon(C,C.blue,C.blueLight)}>{"🔄"}</button>
                    <button onClick={function(){onCancel(a,"owner");}} title="Cancelar" style={sBtnIcon(C,C.red,C.redLight)}>{"❌"}</button>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}
      {cancelled.length>0&&(
        <Card C={C} style={{padding:16,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontWeight:800,fontSize:14,color:C.brownDark}}>{"Canceladas ("+cancelled.length+")"}</span>
            <button onClick={function(){setShowCancelled(function(v){return !v;});}} style={{background:"none",border:"none",color:C.blue,fontWeight:700,fontSize:13,cursor:"pointer"}}>{showCancelled?"Ocultar":"Ver"}</button>
          </div>
          {showCancelled&&cancelled.sort(function(a,b){return b.date.localeCompare(a.date);}).map(function(a){
            var pet=getPet(a.petId);
            return (
              <div key={a.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+C.border,opacity:0.75}}>
                <PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={34} C={C}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13,color:C.textMid}}>{pet&&pet.name}</div><div style={{fontSize:12,color:C.textLight}}>{fmtDate(a.date)+" - "+a.time+" hs"}</div></div>
                <Btn small={true} variant="outline" C={C} onClick={function(){onReschedule(a,"reschedule");}}>Reprog.</Btn>
              </div>
            );
          })}
        </Card>
      )}
      {detailAppt&&(function(){
        var pet=getPet(detailAppt.petId), owner=getUser(detailAppt.ownerId);
        var isConf=detailAppt.status==="confirmed";
        return (
          <Modal title="Detalle de cita" onClose={function(){setDetailAppt(null);}} C={C}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}><PetAvatar photo={pet&&pet.photo} avatar={pet&&pet.avatar} size={60} C={C}/><div><div style={{fontWeight:800,fontSize:18,color:C.brownDark}}>{pet&&pet.name}</div><div style={{color:C.textMid,fontSize:13}}>{pet&&pet.species}</div></div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              <div style={{background:C.peach,borderRadius:10,padding:"8px 12px"}}><div style={{fontSize:11,fontWeight:700,color:C.textMid}}>Fecha</div><div style={{fontSize:13,color:C.text,fontWeight:700}}>{fmtDate(detailAppt.date)}</div></div>
              <div style={{background:C.peach,borderRadius:10,padding:"8px 12px"}}><div style={{fontSize:11,fontWeight:700,color:C.textMid}}>Hora</div><div style={{fontSize:13,color:C.text,fontWeight:700}}>{detailAppt.time+" hs"}</div></div>
              <div style={{background:C.peach,borderRadius:10,padding:"8px 12px"}}><div style={{fontSize:11,fontWeight:700,color:C.textMid}}>Dueño</div><div style={{fontSize:13,color:C.text,fontWeight:700}}>{fullName(owner)}</div></div>
              <div style={{background:C.peach,borderRadius:10,padding:"8px 12px"}}><div style={{fontSize:11,fontWeight:700,color:C.textMid}}>Estado</div><div style={{fontSize:13,color:C.text,fontWeight:700}}><StatusBadge status={detailAppt.status} C={C}/></div></div>
            </div>
            {isVet&&isConf&&(
              <div style={{background:C.greenLight,borderRadius:12,padding:"12px 14px",marginBottom:14,border:"1.5px solid "+C.green}}>
                <div style={{fontWeight:700,color:C.green,fontSize:13,marginBottom:8}}>Cita confirmada - listo para atender</div>
                <Btn variant="success" full={true} C={C} onClick={function(){setDetailAppt(null);onOpenClinical(detailAppt,pet);}}>Atender - Llenar historia clínica</Btn>
              </div>
            )}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {(isVet||isAdmin)&&<Btn variant="ghost" small={true} C={C} onClick={function(){setDetailAppt(null);onEdit(detailAppt);}}>Editar</Btn>}
              {(isVet||isAdmin)&&detailAppt.status==="pending"&&<Btn variant="warning" small={true} C={C} onClick={function(){setDetailAppt(null);onConfirmReq([detailAppt.id]);}}>Solicitar confirm.</Btn>}
              {isOwner&&detailAppt.status==="pending"&&<Btn variant="success" small={true} C={C} onClick={function(){setDetailAppt(null);onReschedule(detailAppt,"confirmed");}}>Confirmar</Btn>}
              {isOwner&&detailAppt.status==="pending"&&<Btn variant="danger" small={true} C={C} onClick={function(){setDetailAppt(null);onCancel(detailAppt,"owner");}}>Rechazar</Btn>}
              {(isVet||isAdmin)&&detailAppt.status!=="cancelled"&&<Btn variant="danger" small={true} C={C} onClick={function(){setDetailAppt(null);onCancel(detailAppt,"vet");}}>Cancelar</Btn>}
            </div>
          </Modal>
        );
      })()}
      {showReqModal&&<RequestApptModal pets={pets.filter(function(p){return p.ownerId===user.id;})} appointments={appointments} blockedList={blockedList} onSend={onSendReq} onClose={function(){setShowReqModal(false);}} C={C}/>}
    </div>
  );
}