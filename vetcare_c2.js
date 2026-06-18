
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
    React.createElement('div', null
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10},}
        , React.createElement('div', null
          , React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark},}, isOwner?"Mis Citas":"Calendario de Citas")
          , React.createElement('p', { style: {color:C.textMid,fontSize:13},}, active.length+" activa(s)"+(pendingReqs.length>0?" - "+pendingReqs.length+" solicitud(es)":""))
        )
        , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"},}
          , isOwner&&React.createElement(Btn, { small: true, variant: "purple", C: C, onClick: function(){setShowReqModal(true);},}, "Solicitar cita" )
          , (isVet||isAdmin)&&pendingUp.length>0&&React.createElement(Btn, { variant: "warning", small: true, C: C, onClick: onConfirmAll,}, "Solicitar confirmacion ("+pendingUp.length+")")
          , (isVet||isAdmin)&&React.createElement(Btn, { small: true, C: C, onClick: function(){onAdd();},}, "+ Nueva cita"  )
        )
      )
      , pendingReqs.length>0&&(
        React.createElement('div', { style: {marginBottom:14,borderRadius:16,border:"1.5px solid "+C.purple,overflow:"hidden"},}
          , React.createElement('button', { onClick: function(){setReqsOpen(function(o){return !o;});}, style: {width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:C.purpleLight,border:"none",cursor:"pointer",textAlign:"left"},}
            , React.createElement('span', { style: {fontWeight:800,color:C.purple,fontSize:14},}, "Solicitudes pendientes ("+(pendingReqs.length)+")")
            , React.createElement('span', { style: {color:C.purple,fontSize:16},}, reqsOpen?"▾":"▸")
          )
          , reqsOpen&&(
            React.createElement('div', { style: {background:C.surface},}
              , reqSlice.map(function(req){
                var pet=getPet(req.petId),owner=getUser(req.ownerId);
                return (
                  React.createElement('div', { key: req.id, style: {display:"flex",gap:10,alignItems:"center",padding:"10px 14px",borderBottom:"1px solid "+C.border,flexWrap:"wrap"},}
                    , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 36, C: C,})
                    , React.createElement('div', { style: {flex:1,minWidth:0},}
                      , React.createElement('div', { style: {fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, (pet&&pet.name||"")+" - "+fullName(owner))
                      , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, fmtDate(req.date)+" - "+req.time+" hs - ", React.createElement(Badge, { type: req.type,}))
                      , req.notes&&React.createElement('div', { style: {fontSize:11,color:C.textLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, "Nota: "+req.notes)
                    )
                    , React.createElement('div', { style: {display:"flex",gap:6,flexShrink:0},}
                      , React.createElement('button', { onClick: function(){onApprove(req);}, title: "Aprobar", style: sBtnIcon(C,C.green,C.greenLight,34),}, "✅")
                      , React.createElement('button', { onClick: function(){onReject(req);}, title: "Rechazar", style: sBtnIcon(C,C.red,C.redLight,34),}, "❌")
                    )
                  )
                );
              })
              , totalReqPages>1&&(
                React.createElement('div', { style: {display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 14px",borderTop:"1px solid "+C.border},}
                  , React.createElement('button', { onClick: function(){setReqPage(function(p){return Math.max(0,p-1);});}, disabled: reqPage===0, style: {background:C.peach,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,opacity:reqPage===0?0.4:1},}, "<")
                  , React.createElement('span', { style: {fontSize:13,color:C.textMid},}, (reqPage+1)+"/"+totalReqPages)
                  , React.createElement('button', { onClick: function(){setReqPage(function(p){return Math.min(totalReqPages-1,p+1);});}, disabled: reqPage===totalReqPages-1, style: {background:C.peach,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,opacity:reqPage===totalReqPages-1?0.4:1},}, ">")
                )
              )
            )
          )
        )
      )
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16,marginBottom:16},}
        , React.createElement(Card, { C: C, style: {padding:16},}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14},}
            , React.createElement('button', { onClick: function(){setVm(function(v){var m=v.m-1;return m<0?{y:v.y-1,m:11}:{y:v.y,m:m};});}, style: {background:C.peach,border:"none",borderRadius:8,width:30,height:30,fontSize:16,cursor:"pointer",color:C.brownDark},}, "<")
            , React.createElement('span', { style: {fontWeight:800,fontSize:14,color:C.brownDark,textTransform:"capitalize"},}, monthName)
            , React.createElement('button', { onClick: function(){setVm(function(v){var m=v.m+1;return m>11?{y:v.y+1,m:0}:{y:v.y,m:m};});}, style: {background:C.peach,border:"none",borderRadius:8,width:30,height:30,fontSize:16,cursor:"pointer",color:C.brownDark},}, ">")
          )
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6},}
            , ["Do","Lu","Ma","Mi","Ju","Vi","Sa"].map(function(d){return React.createElement('div', { key: d, style: {textAlign:"center",fontSize:11,fontWeight:700,color:C.textLight,padding:"3px 0"},}, d);})
          )
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2},}
            , days.map(function(d,i){
              if(!d) return React.createElement('div', { key: i,});
              var iso=isoDate(d);
              var ap=active.filter(function(a){return a.date===iso;});
              var isT=iso===today(), isSel=iso===selDate;
              var isBlk=blockedList.indexOf(iso)>=0;
              return (
                React.createElement('button', { key: i, onClick: function(){setSelDate(iso);}, style: {aspectRatio:"1",borderRadius:8,border:"none",background:isSel?C.brown:isBlk?C.redLight:isT?C.peach:"transparent",color:isSel?"#fff":isBlk?C.red:isT?C.brownDark:C.text,fontWeight:isSel||isT?800:400,fontSize:12,cursor:"pointer",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:0},}
                  , isBlk?"X":d
                  , !isBlk&&ap.length>0&&React.createElement('div', { style: {position:"absolute",bottom:1,display:"flex",gap:2},}, ap.slice(0,3).map(function(_,i2){return React.createElement('div', { key: i2, style: {width:3,height:3,borderRadius:50,background:isSel?"#ffffffaa":C.brown},});}))
                )
              );
            })
          )
        )
        , React.createElement(Card, { C: C, style: {padding:16},}
          , React.createElement('div', { style: {fontWeight:800,fontSize:14,color:C.brownDark,marginBottom:12},}, fmtDate(selDate))
          , blockedList.indexOf(selDate)>=0&&React.createElement('div', { style: {background:C.redLight,borderRadius:10,padding:"8px 12px",marginBottom:10,color:C.red,fontSize:13,fontWeight:700},}, "Dia bloqueado" )
          , todayAppts.length===0?React.createElement('p', { style: {color:C.textLight,fontSize:13,textAlign:"center",padding:"20px 0"},}, "Sin citas este dia"   )
            :todayAppts.map(function(a){
              var pet=getPet(a.petId),owner=getUser(a.ownerId);
              return (
                React.createElement('div', { key: a.id, style: {display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid "+C.border,cursor:"pointer"}, onClick: function(){setDetailAppt(a);},}
                  , React.createElement('div', { style: {fontSize:12,fontWeight:800,color:C.brown,minWidth:40,flexShrink:0},}, a.time)
                  , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 32, C: C,})
                  , React.createElement('div', { style: {flex:1,minWidth:0},}
                    , React.createElement('div', { style: {fontWeight:700,fontSize:12,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, (pet&&pet.name||"")+((isVet||isAdmin)&&owner?" - "+fullName(owner):""))
                    , React.createElement('div', { style: {display:"flex",gap:4,flexWrap:"wrap",marginTop:2},}, React.createElement(Badge, { type: a.type,}), React.createElement(StatusBadge, { status: a.status, C: C,}))
                  )
                )
              );
            })
        )
      )
      , pendingUp.length>0&&(isVet||isAdmin)&&(
        React.createElement(Card, { C: C, style: {padding:16,marginBottom:12},}
          , React.createElement('div', { style: {fontWeight:800,fontSize:14,color:C.brownDark,marginBottom:10},}, "Pendientes de atención ("+pendingUp.length+")")
          , pendingUp.map(function(a){
            var pet=getPet(a.petId),owner=getUser(a.ownerId);
            return (
              React.createElement('div', { key: a.id, style: {display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+C.border,flexWrap:"wrap"},}
                , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 34, C: C,})
                , React.createElement('div', { style: {flex:1,minWidth:0},}
                  , React.createElement('div', { style: {fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, (pet&&pet.name||"")+" - "+fullName(owner))
                  , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, fmtDate(a.date)+" - "+a.time+" hs")
                )
                , React.createElement('div', { style: {display:"flex",gap:4,flexShrink:0,flexWrap:"wrap"},}
                  , React.createElement('button', { onClick: function(){onConfirmAndAttend(a);}, title: "Confirmar y atender"  , style: {display:"flex",alignItems:"center",gap:4,padding:"6px 10px",background:C.green,border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"},}, "Atender")
                  , React.createElement('button', { onClick: function(){onConfirmReq([a.id]);}, title: "Solicitar confirmación" , style: sBtnIcon(C,C.yellow,C.yellowLight),}, "📨")
                  , React.createElement('button', { onClick: function(){onCancel(a,"vet");}, title: "Cancelar", style: {width:32,height:32,background:C.redLight,border:"1px solid "+C.red,borderRadius:8,color:C.red,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:0.7},}, "x")
                )
              )
            );
          })
        )
      )
      , confirmedUp.length>0&&(isVet||isAdmin)&&(
        React.createElement('div', { style: {marginBottom:14,borderRadius:16,border:"1.5px solid "+C.green,overflow:"hidden"},}
          , React.createElement('button', { onClick: function(){setConfOpen(function(o){return !o;});}, style: {width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:C.greenLight,border:"none",cursor:"pointer",textAlign:"left"},}
            , React.createElement('span', { style: {fontWeight:800,color:C.green,fontSize:14},}, "Citas confirmadas próximas ("+confirmedUp.length+")")
            , React.createElement('span', { style: {color:C.green,fontSize:16},}, confOpen?"▾":"▸")
          )
          , confOpen&&(
            React.createElement('div', { style: {background:C.surface},}
              , confSlice.map(function(a){
                var pet=getPet(a.petId),owner=getUser(a.ownerId);
                return (
                  React.createElement('div', { key: a.id, style: {display:"flex",gap:10,alignItems:"center",padding:"10px 14px",borderBottom:"1px solid "+C.border,flexWrap:"wrap"},}
                    , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 36, C: C,})
                    , React.createElement('div', { style: {flex:1,minWidth:0},}
                      , React.createElement('div', { style: {fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, (pet&&pet.name||"")+" - "+fullName(owner))
                      , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, fmtDate(a.date)+" - "+a.time+" hs")
                    )
                    , React.createElement('div', { style: {display:"flex",gap:4,flexShrink:0},}
                      , React.createElement('button', { onClick: function(){onOpenClinical(a,pet);}, title: "Atender", style: sBtnIcon(C,C.blue,C.blueLight,34),}, "🩺")
                      , React.createElement('button', { onClick: function(){onEdit(a);}, title: "Editar", style: sBtnIcon(C,C.brownDark,C.peach,34),}, "✏️")
                      , React.createElement('button', { onClick: function(){onCancel(a,"vet");}, title: "Cancelar", style: {width:34,height:34,borderRadius:10,background:C.redLight,border:"1px solid "+C.red,color:C.red,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},}, "x")
                    )
                  )
                );
              })
              , totalConfPages>1&&(
                React.createElement('div', { style: {display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 14px",borderTop:"1px solid "+C.border},}
                  , React.createElement('button', { onClick: function(){setConfPage(function(p){return Math.max(0,p-1);});}, disabled: confPage===0, style: {background:C.peach,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,opacity:confPage===0?0.4:1},}, "<")
                  , React.createElement('span', { style: {fontSize:13,color:C.textMid},}, (confPage+1)+"/"+totalConfPages)
                  , React.createElement('button', { onClick: function(){setConfPage(function(p){return Math.min(totalConfPages-1,p+1);});}, disabled: confPage===totalConfPages-1, style: {background:C.peach,border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,opacity:confPage===totalConfPages-1?0.4:1},}, ">")
                )
              )
            )
          )
        )
      )
      , isOwner&&upcoming.length>0&&(
        React.createElement(Card, { C: C, style: {padding:16,marginBottom:12},}
          , React.createElement('div', { style: {fontWeight:800,fontSize:14,color:C.brownDark,marginBottom:10},}, "Mis próximas citas"  )
          , upcoming.map(function(a){
            var pet=getPet(a.petId);
            return (
              React.createElement('div', { key: a.id, style: {display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+C.border,flexWrap:"wrap"},}
                , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 32, C: C,})
                , React.createElement('div', { style: {flex:1,minWidth:0},}
                  , React.createElement('div', { style: {fontWeight:700,fontSize:13,color:C.text},}, pet&&pet.name)
                  , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, fmtDate(a.date)+" - "+a.time+" hs")
                  , React.createElement('div', { style: {display:"flex",gap:4,flexWrap:"wrap",marginTop:2},}, React.createElement(Badge, { type: a.type,}), React.createElement(StatusBadge, { status: a.status, C: C,}))
                )
                , (a.status==="pending"||a.status==="confirmed")&&(
                  React.createElement('div', { style: {display:"flex",gap:4,flexShrink:0},}
                    , a.status==="pending"&&React.createElement('button', { onClick: function(){onReschedule(a,"confirmed");}, title: "Confirmar", style: sBtnIcon(C,C.green,C.greenLight),}, "✅")
                    , React.createElement('button', { onClick: function(){onReschedule(a,"reschedule");}, title: "Reprogramar", style: sBtnIcon(C,C.blue,C.blueLight),}, "🔄")
                    , React.createElement('button', { onClick: function(){onCancel(a,"owner");}, title: "Cancelar", style: sBtnIcon(C,C.red,C.redLight),}, "❌")
                  )
                )
              )
            );
          })
        )
      )
      , cancelled.length>0&&(
        React.createElement(Card, { C: C, style: {padding:16,marginBottom:14},}
          , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10},}
            , React.createElement('span', { style: {fontWeight:800,fontSize:14,color:C.brownDark},}, "Canceladas ("+cancelled.length+")")
            , React.createElement('button', { onClick: function(){setShowCancelled(function(v){return !v;});}, style: {background:"none",border:"none",color:C.blue,fontWeight:700,fontSize:13,cursor:"pointer"},}, showCancelled?"Ocultar":"Ver")
          )
          , showCancelled&&cancelled.sort(function(a,b){return b.date.localeCompare(a.date);}).map(function(a){
            var pet=getPet(a.petId);
            return (
              React.createElement('div', { key: a.id, style: {display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+C.border,opacity:0.75},}
                , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 34, C: C,})
                , React.createElement('div', { style: {flex:1,minWidth:0},}, React.createElement('div', { style: {fontWeight:700,fontSize:13,color:C.textMid},}, pet&&pet.name), React.createElement('div', { style: {fontSize:12,color:C.textLight},}, fmtDate(a.date)+" - "+a.time+" hs"))
                , React.createElement(Btn, { small: true, variant: "outline", C: C, onClick: function(){onReschedule(a,"reschedule");},}, "Reprog.")
              )
            );
          })
        )
      )
      , detailAppt&&(function(){
        var pet=getPet(detailAppt.petId), owner=getUser(detailAppt.ownerId);
        var isConf=detailAppt.status==="confirmed";
        return (
          React.createElement(Modal, { title: "Detalle de cita"  , onClose: function(){setDetailAppt(null);}, C: C,}
            , React.createElement('div', { style: {display:"flex",gap:14,alignItems:"center",marginBottom:16},}, React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 60, C: C,}), React.createElement('div', null, React.createElement('div', { style: {fontWeight:800,fontSize:18,color:C.brownDark},}, pet&&pet.name), React.createElement('div', { style: {color:C.textMid,fontSize:13},}, pet&&pet.species)))
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14},}
              , React.createElement('div', { style: {background:C.peach,borderRadius:10,padding:"8px 12px"},}, React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid},}, "Fecha"), React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:700},}, fmtDate(detailAppt.date)))
              , React.createElement('div', { style: {background:C.peach,borderRadius:10,padding:"8px 12px"},}, React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid},}, "Hora"), React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:700},}, detailAppt.time+" hs"))
              , React.createElement('div', { style: {background:C.peach,borderRadius:10,padding:"8px 12px"},}, React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid},}, "Dueño"), React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:700},}, fullName(owner)))
              , React.createElement('div', { style: {background:C.peach,borderRadius:10,padding:"8px 12px"},}, React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid},}, "Estado"), React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:700},}, React.createElement(StatusBadge, { status: detailAppt.status, C: C,})))
            )
            , isVet&&isConf&&(
              React.createElement('div', { style: {background:C.greenLight,borderRadius:12,padding:"12px 14px",marginBottom:14,border:"1.5px solid "+C.green},}
                , React.createElement('div', { style: {fontWeight:700,color:C.green,fontSize:13,marginBottom:8},}, "Cita confirmada - listo para atender"     )
                , React.createElement(Btn, { variant: "success", full: true, C: C, onClick: function(){setDetailAppt(null);onOpenClinical(detailAppt,pet);},}, "Atender - Llenar historia clínica"    )
              )
            )
            , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"},}
              , (isVet||isAdmin)&&React.createElement(Btn, { variant: "ghost", small: true, C: C, onClick: function(){setDetailAppt(null);onEdit(detailAppt);},}, "Editar")
              , (isVet||isAdmin)&&detailAppt.status==="pending"&&React.createElement(Btn, { variant: "warning", small: true, C: C, onClick: function(){setDetailAppt(null);onConfirmReq([detailAppt.id]);},}, "Solicitar confirm." )
              , isOwner&&detailAppt.status==="pending"&&React.createElement(Btn, { variant: "success", small: true, C: C, onClick: function(){setDetailAppt(null);onReschedule(detailAppt,"confirmed");},}, "Confirmar")
              , isOwner&&detailAppt.status==="pending"&&React.createElement(Btn, { variant: "danger", small: true, C: C, onClick: function(){setDetailAppt(null);onCancel(detailAppt,"owner");},}, "Rechazar")
              , (isVet||isAdmin)&&detailAppt.status!=="cancelled"&&React.createElement(Btn, { variant: "danger", small: true, C: C, onClick: function(){setDetailAppt(null);onCancel(detailAppt,"vet");},}, "Cancelar")
            )
          )
        );
      })()
      , showReqModal&&React.createElement(RequestApptModal, { pets: pets.filter(function(p){return p.ownerId===user.id;}), appointments: appointments, blockedList: blockedList, onSend: onSendReq, onClose: function(){setShowReqModal(false);}, C: C,})
    )
  );
}

// ============================================================
// CARNET - PetCarnet, CarnetModal
// ============================================================

function PetCarnet(props) {
  var pet=props.pet, owner=props.owner, C=props.C;
  var canvasRef=props.canvasRef;
  var sexIcon=pet.sex==="Hembra"?"♀":"♂";
  var speciesHuella={"Perro":"🐾","Gato":"🐾","Ave":"🦶","Conejo":"🐾","Reptil":"🦎","Pez":"🐟","Otro":"🐾"};
  var huella=speciesHuella[pet.species]||"🐾";
  var speciesBg={"Perro":"#8B4513","Gato":"#6B3E26","Ave":"#2E8B57","Conejo":"#8B6914","Reptil":"#4A7C59","Pez":"#1E6B8C","Otro":"#6B3E26"};
  var cardBg=speciesBg[pet.species]||"#6B3E26";
  var clinicName="VetCare Clinica Veterinaria";
  return (
    React.createElement('div', { ref: canvasRef, id: "pet-carnet", style: {width:340,background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.25)",fontFamily:"'Nunito',sans-serif",margin:"0 auto"},}
      /* Header */
      , React.createElement('div', { style: {background:cardBg,padding:"14px 16px",display:"flex",alignItems:"center",gap:12},}
        , React.createElement('div', { style: {width:48,height:48,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28},}, "🐾")
        , React.createElement('div', null
          , React.createElement('div', { style: {color:"#fff",fontWeight:800,fontSize:14,letterSpacing:1},}, clinicName.toUpperCase())
          , React.createElement('div', { style: {color:"rgba(255,255,255,0.8)",fontSize:11},}, "Registro de Mascota"  )
        )
      )
      /* Body */
      , React.createElement('div', { style: {display:"flex",padding:16,gap:14,background:"linear-gradient(135deg,#FDF6EC 0%,#F9E4CC 100%)"},}
        /* Photo */
        , React.createElement('div', { style: {flexShrink:0},}
          , pet.photo
            ?React.createElement('img', { src: pet.photo, alt: pet.name, style: {width:90,height:110,borderRadius:10,objectFit:"cover",border:"3px solid "+cardBg},})
            :React.createElement('div', { style: {width:90,height:110,borderRadius:10,background:cardBg+"22",border:"3px solid "+cardBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48},}, pet.avatar||"🐾")
          
          , React.createElement('div', { style: {textAlign:"center",marginTop:6,fontSize:22},}, huella)
        )
        /* Info */
        , React.createElement('div', { style: {flex:1,minWidth:0},}
          , React.createElement('div', { style: {fontWeight:800,fontSize:20,color:cardBg,marginBottom:2},}, pet.name)
          , React.createElement('div', { style: {fontSize:11,color:"#999",marginBottom:10,fontWeight:600,letterSpacing:0.5},}, "CARNET DE IDENTIDAD")
          , [
            ["Especie:",pet.species||"—"],
            ["Raza:",pet.breed||"—"],
            ["Sexo:",( pet.sex||"—")+" "+sexIcon],
            ["Color:",pet.color||"—"],
            ["Nacimiento:",pet.dob?pet.dob.split("-").reverse().join("/"):"—"],
            ["Peso:",pet.weight?pet.weight+" kg":"—"],
          ].map(function(row){
            return (
              React.createElement('div', { key: row[0], style: {display:"flex",gap:6,marginBottom:3},}
                , React.createElement('span', { style: {fontSize:11,fontWeight:700,color:"#999",minWidth:72,flexShrink:0},}, row[0])
                , React.createElement('span', { style: {fontSize:11,color:"#333",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, row[1])
              )
            );
          })
        )
      )
      /* Barcode-style strip */
      , React.createElement('div', { style: {background:cardBg+"15",borderTop:"1px solid "+cardBg+"33",padding:"8px 16px",display:"flex",gap:4,alignItems:"center"},}
        , Array.from({length:30}).map(function(_,i){
          var h=[2,3,5,2,4,3,2,5,2,3,4,2,3,2,5,3,2,4,3,2,5,2,3,4,2,3,2,5,3,2][i%30];
          return React.createElement('div', { key: i, style: {width:2,height:h*3,background:cardBg,borderRadius:1,opacity:0.6+((i%3)*0.1)},});
        })
      )
      /* Footer */
      , React.createElement('div', { style: {background:cardBg,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"},}
        , React.createElement('div', null
          , React.createElement('div', { style: {fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600},}, "DUEÑO")
          , React.createElement('div', { style: {fontSize:12,color:"#fff",fontWeight:700},}, fullName(owner))
          , owner&&owner.phone&&React.createElement('div', { style: {fontSize:10,color:"rgba(255,255,255,0.8)"},}, owner.phone)
        )
        , React.createElement('div', { style: {textAlign:"right"},}
          , React.createElement('div', { style: {fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600},}, "ID MASCOTA" )
          , React.createElement('div', { style: {fontSize:11,color:"rgba(255,255,255,0.9)",fontFamily:"monospace",fontWeight:700},}, pet.id.toUpperCase())
        )
      )
    )
  );
}

function CarnetModal(props) {
  var pet=props.pet, owner=props.owner, C=props.C;
  var s1=useState(false); var downloading=s1[0]; var setDownloading=s1[1];
  var s2=useState(""); var msg=s2[0]; var setMsg=s2[1];

  function downloadCarnet() {
    setDownloading(true);
    var el=document.getElementById("pet-carnet");
    if(!el){setMsg("No se pudo generar el carnet.");setDownloading(false);return;}
    // Use html2canvas-style: create a screenshot via DOM serialization
    // Since we can't import html2canvas, use a CSS print approach
    var printWin=window.open("","_blank","width=400,height=600");
    if(!printWin){setMsg("Permite ventanas emergentes para descargar.");setDownloading(false);return;}
    var styles='<style>body{margin:0;padding:20px;font-family:Nunito,sans-serif;background:#f5f5f5;display:flex;align-items:center;justify-content:center;min-height:100vh;} @media print{body{background:#fff;padding:0;}}</style>';
    var googleFonts='<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet"/>';
    printWin.document.write("<!DOCTYPE html><html><head><title>Carnet - "+pet.name+"</title>"+googleFonts+styles+"</head><body>"+el.outerHTML+"</body></html>");
    printWin.document.close();
    setTimeout(function(){
      printWin.focus();
      printWin.print();
      setDownloading(false);
      setMsg("Se abrió el carnet para imprimir o guardar como PDF.");
    },1000);
  }

  return (
    React.createElement(Modal, { title: "Carnet de "+pet.name, onClose: props.onClose, C: C,}
      , React.createElement('p', { style: {color:C.textMid,fontSize:13,marginBottom:16,textAlign:"center"},}, "Carnet de identidad virtual de tu mascota"      )
      , React.createElement(PetCarnet, { pet: pet, owner: owner, C: C,})
      , msg&&React.createElement('div', { style: {marginTop:12,padding:"8px 12px",background:C.greenLight,borderRadius:10,fontSize:12,color:C.green,fontWeight:600,textAlign:"center"},}, msg)
      , React.createElement('div', { style: {display:"flex",gap:10,marginTop:16},}
        , React.createElement(Btn, { onClick: downloadCarnet, disabled: downloading, full: true, C: C, variant: "success",}
          , downloading?"Generando...":"📥 Imprimir / Guardar PDF"
        )
        , React.createElement(Btn, { variant: "ghost", onClick: props.onClose, full: true, C: C,}, "Cerrar")
      )
    )
  );
}

// ============================================================
// DASHBOARD - Dashboard, PatientsList, RecordsList, MyPets, OwnerHistory
// ============================================================

function ProximasCitasCard(props) {
  var upcoming=props.upcoming, getPet=props.getPet, getOwner=props.getOwner, C=props.C;
  var s=useState(false); var open=s[0]; var setOpen=s[1];
  return (
    React.createElement('div', { style: {borderRadius:16,border:"1px solid "+C.border,overflow:"hidden"},}
      , React.createElement('button', { onClick: function(){setOpen(function(o){return !o;});}, style: {width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",background:C.surface,border:"none",cursor:"pointer",textAlign:"left"},}
        , React.createElement('h3', { style: {fontWeight:800,color:C.brownDark,fontSize:14,margin:0},}, "Próximas citas ("+(upcoming.length)+")")
        , React.createElement('span', { style: {color:C.brown,fontSize:18,fontWeight:700},}, open?"▾":"▸")
      )
      , open&&(
        React.createElement('div', { style: {background:C.surface,borderTop:"1px solid "+C.border},}
          , upcoming.length===0
            ?React.createElement('p', { style: {color:C.textLight,fontSize:13,padding:"12px 20px"},}, "No hay citas"  )
            :upcoming.map(function(a){
              var pet=getPet(a.petId), owner=getOwner(a.ownerId);
              return (
                React.createElement('div', { key: a.id, style: {display:"flex",gap:10,alignItems:"center",padding:"10px 20px",borderBottom:"1px solid "+C.border},}
                  , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 32, C: C,})
                  , React.createElement('div', { style: {flex:1,minWidth:0},}
                    , React.createElement('div', { style: {fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, pet&&pet.name)
                    , React.createElement('div', { style: {fontSize:11,color:C.textMid},}, fmtDate(a.date)+" - "+a.time+" - "+fullName(owner))
                  )
                  , React.createElement(StatusBadge, { status: a.status, C: C,})
                )
              );
            })
        )
      )
    )
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
    React.createElement('div', null
      , React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark,marginBottom:4},}, "Dashboard")
      , React.createElement('p', { style: {color:C.textMid,marginBottom:16,fontSize:13},}, new Date().toLocaleDateString("es-PE",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}))
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:16},}
        , React.createElement(StatCard, { icon: "🐾", label: "Pacientes",  value: pets.length,      color: C.brown, C: C,})
        , React.createElement(StatCard, { icon: "👥", label: "Dueños",     value: owners.length,    color: C.blue,  C: C,})
        , React.createElement(StatCard, { icon: "📋", label: "Historias",  value: records.length,   color: C.green, C: C,})
        , React.createElement(StatCard, { icon: "📅", label: "Este mes" ,   value: monthRecs.length, color: C.red,   C: C,})
      )
      , (avgDur||absentCount>0)&&(
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12,marginBottom:16},}
          , avgDur&&React.createElement(StatCard, { icon: "⏱️", label: "Duración media/cita" , value: avgDur+" min", color: C.purple, C: C,})
          , absentCount>0&&React.createElement(StatCard, { icon: "x", label: "No asistieron" , value: absentCount, color: C.yellow, C: C,})
        )
      )
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16},}
        , React.createElement(Card, { C: C,}
          , React.createElement('h3', { style: {fontWeight:800,color:C.brownDark,marginBottom:14,fontSize:14},}, "Atenciones por tipo"  )
          , byType.length===0?React.createElement('p', { style: {color:C.textLight,fontSize:13},}, "Sin datos" ):byType.map(function(item){
            return (
              React.createElement('div', { key: item.type, style: {marginBottom:10},}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:13},}, React.createElement('span', { style: {color:C.text},}, item.type), React.createElement('span', { style: {fontWeight:700,color:C.brown},}, item.count))
                , React.createElement('div', { style: {background:C.peach,borderRadius:20,height:7},}, React.createElement('div', { style: {background:C.brown,borderRadius:20,height:7,width:(Math.round((item.count/records.length)*100))+"%",transition:"width .4s"},}))
              )
            );
          })
        )
        , React.createElement(ProximasCitasCard, { upcoming: upcoming, getPet: getPet, getOwner: getOwner, C: C,})
      )
    )
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
    React.createElement('div', null
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10},}
        , React.createElement('div', null, React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark},}, "Pacientes"), React.createElement('p', { style: {color:C.textMid,fontSize:13},}, pets.length+" registrados"))
        , React.createElement(Btn, { C: C, onClick: props.onAdd,}, "+ Nueva mascota"  )
      )
      , React.createElement('div', { style: {marginBottom:14},}, React.createElement('input', { placeholder: "Buscar por nombre, especie, dueño o N° doc..."       , value: search, onChange: function(e){setSearch(e.target.value);},}))
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:14},}
        , filtered.map(function(pet){
          var owner=getOwner(pet.ownerId), count=records.filter(function(r){return r.petId===pet.id;}).length, age=calcAge(pet.dob);
          return (
            React.createElement(Card, { key: pet.id, C: C,}
              , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"flex-start"},}, React.createElement(PetAvatar, { photo: pet.photo, avatar: pet.avatar, size: 54, C: C,}), React.createElement('div', { style: {flex:1,minWidth:0},}, React.createElement('div', { style: {fontWeight:800,fontSize:15,color:C.brownDark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, pet.name), React.createElement('div', { style: {fontSize:13,color:C.textMid},}, pet.species+(pet.breed?" - "+pet.breed:"")), age&&React.createElement('div', { style: {fontSize:12,color:C.textLight},}, age), React.createElement('div', { style: {fontSize:12,color:C.textLight},}, "Dueño: "+fullName(owner))))
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12,paddingTop:10,borderTop:"1px solid "+C.border},}
                , React.createElement('div', { style: {fontSize:12,color:C.textMid},}, count+" hist."+(pet.weight?" - "+pet.weight+" kg":""))
                , React.createElement('div', { style: {display:"flex",gap:6},}
                  , React.createElement(Btn, { small: true, variant: "ghost", C: C, onClick: function(){props.onEdit(pet);},}, "✏️")
                  , React.createElement(Btn, { small: true, variant: "ghost", C: C, onClick: function(){props.onCarnet&&props.onCarnet(pet);}, title: "Generar carnet" ,}, "🪪")
                  , React.createElement(Btn, { small: true, variant: "ghost", C: C, onClick: function(){props.onDelete(pet.id);}, style: {color:C.red},}, "🗑️")
                )
              )
            )
          );
        })
        , filtered.length===0&&React.createElement('p', { style: {color:C.textLight,gridColumn:"1/-1",textAlign:"center",padding:40},}, "Sin resultados." )
      )
    )
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
    React.createElement('div', null
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10},}
        , React.createElement('div', null, React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark},}, "Historias Clínicas" ), React.createElement('p', { style: {color:C.textMid,fontSize:13},}, records.length+" registros"))
        , React.createElement(Btn, { C: C, onClick: props.onAdd, disabled: pets.length===0,}, "+ Nueva historia"  )
      )
      , React.createElement('div', { style: {display:"flex",gap:10,marginBottom:8,flexWrap:"wrap"},}
        , React.createElement('div', { style: {flex:1,minWidth:180},}, React.createElement('input', { placeholder: "Buscar por mascota, diagnóstico, dueño o N° doc..."       , value: search, onChange: function(e){setSearch(e.target.value);},}))
        , React.createElement('select', { value: ftype, onChange: function(e){setFtype(e.target.value);}, style: {width:"auto",minWidth:130},}, TYPES.map(function(t){return React.createElement('option', { key: t,}, t);}))
      )
      , React.createElement('div', { style: {display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"},}
        , SPECIES.map(function(sp){
          var active=fspecies===sp;
          return React.createElement('button', { key: sp, onClick: function(){setFspecies(sp);}, style: {padding:"5px 12px",borderRadius:20,border:"1.5px solid "+(active?C.brown:C.border),background:active?C.brown:"transparent",color:active?"#fff":C.textMid,fontSize:12,fontWeight:700,cursor:"pointer"},}, sp);
        })
      )
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10},}
        , filtered.map(function(r){
          var pet=getPet(r.petId);
          return (
            React.createElement(Card, { key: r.id, C: C, style: {padding:"12px 14px"},}
              , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"flex-start"},}
                , React.createElement(PetAvatar, { photo: pet&&pet.photo, avatar: pet&&pet.avatar, size: 40, C: C,})
                , React.createElement('div', { style: {flex:1,minWidth:0},}
                  , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:4},}
                    , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"},}, React.createElement('span', { style: {fontWeight:800,fontSize:14,color:C.brownDark},}, pet&&pet.name), React.createElement(Badge, { type: r.type,}), r.attended===true&&React.createElement(StatusBadge, { status: "attended", C: C,}), r.attended===false&&React.createElement(StatusBadge, { status: "absent", C: C,}))
                    , pet&&(function(){var own=null;for(var _i=0;_i<props.users.length;_i++){if(props.users[_i].id===pet.ownerId){own=props.users[_i];break;}} return own?React.createElement('div', { style: {fontSize:11,color:C.textLight},}, "Dueño: "+fullName(own)):null;})()
                    , React.createElement('div', { style: {display:"flex",gap:4},}, React.createElement(Btn, { small: true, variant: "ghost", C: C, onClick: function(){props.onEdit(r);},}, "✏️"), React.createElement(Btn, { small: true, variant: "ghost", C: C, onClick: function(){props.onDelete(r.id);}, style: {color:C.red},}, "🗑️"))
                  )
                  , React.createElement('div', { style: {fontSize:12,color:C.textLight,marginBottom:8},}
                  , fmtDate(r.date)+(r.weight?" - "+r.weight+" kg":"")+(r.duration?" - "+r.duration+" min":"")
                  , (function(){var pet2=getPet(r.petId);var own=null;return own?React.createElement('span', { style: {marginLeft:8,background:C.tan+"22",color:C.brownDark,borderRadius:6,padding:"1px 6px",fontSize:11},}, "👤 "+(own.docNum||"—")+" · "+fullName(own)):null;})()
                )
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:8},}
                    , React.createElement('div', { style: {background:C.peach,borderRadius:10,padding:"7px 10px"},}, React.createElement('div', { style: {fontSize:10,fontWeight:700,color:C.textMid,marginBottom:2},}, "DIAGNOSTICO"), React.createElement('div', { style: {fontSize:13,color:C.text},}, r.diagnosis||"—"))
                    , React.createElement('div', { style: {background:C.greenLight,borderRadius:10,padding:"7px 10px"},}, React.createElement('div', { style: {fontSize:10,fontWeight:700,color:C.textMid,marginBottom:2},}, "TRATAMIENTO"), React.createElement('div', { style: {fontSize:13,color:C.text},}, r.treatment||"—"))
                  )
                  , r.items&&r.items.length>0&&React.createElement(OwnerItemsDisplay, { items: r.items, record: r, onUpdateRecord: props.onUpdateRecord, C: C,})
                  , r.nextVisit&&React.createElement('div', { style: {marginTop:6,fontSize:12,background:C.blueLight,color:C.blue,borderRadius:8,padding:"4px 10px",display:"inline-block",fontWeight:700},}, "Próxima: "+fmtDate(r.nextVisit))
                )
              )
            )
          );
        })
        , filtered.length===0&&React.createElement('p', { style: {color:C.textLight,textAlign:"center",padding:40},}, "Sin registros." )
      )
    )
  );
}
function MyPets(props) {
  var pets=props.pets, records=props.records, C=props.C;
  var isMobile=useIsMobile();
  function getLast(id){var recs=records.filter(function(r){return r.petId===id;}).sort(function(a,b){return b.date.localeCompare(a.date);}); return recs.length>0?recs[0]:null;}
  if(pets.length===0) return (
    React.createElement('div', { style: {textAlign:"center",padding:60},}
      , React.createElement('div', { style: {fontSize:56,marginBottom:12},}, "🐾")
      , React.createElement('h3', { style: {color:C.brownDark,marginBottom:8},}, "No tienes mascotas registradas"   )
      , React.createElement('p', { style: {color:C.textMid,fontSize:14},}, "Contacta a tu veterinaria."   )
    )
  );
  return (
    React.createElement('div', null
      , React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark,marginBottom:4},}, "Mis Mascotas" )
      , React.createElement('p', { style: {color:C.textMid,fontSize:13,marginBottom:16},}, "Toca una mascota para ver su historial"      )
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:14},}
        , pets.map(function(pet){
          var last=getLast(pet.id), count=records.filter(function(r){return r.petId===pet.id;}).length, age=calcAge(pet.dob);
          return (
            React.createElement(Card, { key: pet.id, C: C, style: {cursor:"pointer"}, onClick: function(){props.onSelect(pet);},}
              , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"center",marginBottom:12},}
                , React.createElement(PetAvatar, { photo: pet.photo, avatar: pet.avatar, size: 60, C: C,})
                , React.createElement('div', null, React.createElement('div', { style: {fontWeight:800,fontSize:17,color:C.brownDark},}, pet.name), React.createElement('div', { style: {color:C.textMid,fontSize:13},}, pet.species+(pet.breed?" - "+pet.breed:"")), age&&React.createElement('div', { style: {fontSize:12,color:C.textLight},}, age))
              )
              , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10},}
                , React.createElement('div', { style: {background:C.peach,borderRadius:10,padding:"6px 4px",textAlign:"center"},}, React.createElement('div', { style: {fontSize:14},}, "⚖️"), React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.brown},}, pet.weight?pet.weight+"kg":"—"))
                , React.createElement('div', { style: {background:C.peach,borderRadius:10,padding:"6px 4px",textAlign:"center"},}, React.createElement('div', { style: {fontSize:14},}, "📋"), React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.brown},}, count+" hist."))
                , React.createElement('div', { style: {background:C.peach,borderRadius:10,padding:"6px 4px",textAlign:"center"},}, React.createElement('div', { style: {fontSize:14},}, "🎨"), React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.brown,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},}, pet.color||"—"))
              )
              , last&&React.createElement('div', { style: {fontSize:12,color:C.textMid,borderTop:"1px solid "+C.border,paddingTop:8},}, "Ultima: "+fmtDate(last.date))
              , React.createElement('div', { style: {display:"flex",gap:8,marginTop:10},}
                , React.createElement(Btn, { variant: "outline", small: true, full: true, C: C, onClick: function(){props.onSelect(pet);},}, "Ver historial" )
                , React.createElement(Btn, { variant: "ghost", small: true, C: C, onClick: function(){props.onCarnet&&props.onCarnet(pet);}, title: "Carnet",}, "🪪")
              )
            )
          );
        })
      )
    )
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
    React.createElement('div', { style: {marginBottom:8},}
      , React.createElement('div', { style: {fontSize:11,fontWeight:700,color:C.textMid,marginBottom:6},}, "TRATAMIENTOS Y SOLICITUDES")
      , items.map(function(item,idx){
        var isSol=item.type==="solicitud";
        var files=item.files||[];
        var cl=isSol?C.purple:C.green;
        var bg=isSol?C.purpleLight:C.greenLight;
        return (
          React.createElement('div', { key: item.id||idx, style: {marginBottom:6,background:bg,borderRadius:8,padding:"7px 10px",border:"1px solid "+(isSol?C.purple+"33":C.green+"33")},}
            , React.createElement('div', { style: {display:"flex",alignItems:"flex-start",gap:6},}
              , React.createElement('span', { style: {fontSize:11,fontWeight:800,color:cl,flexShrink:0,minWidth:18},}, (idx+1)+".")
              , React.createElement('div', { style: {flex:1,minWidth:0},}
                , React.createElement('div', { style: {fontSize:13,color:C.text,fontWeight:600},}, item.text)
                , isSol&&(
                  React.createElement('div', { style: {marginTop:6},}
                    , files.map(function(f){
                      return (
                        React.createElement('div', { key: f.id, style: {display:"flex",alignItems:"center",gap:6,marginBottom:3},}
                          , React.createElement('a', { href: f.file, download: f.fileName, style: {fontSize:11,color:C.green,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:3},}
                            , React.createElement('span', null, "📎"), React.createElement('span', { style: {...sOverflow,maxWidth:180},}, f.fileName)
                          )
                          , onUpdateRecord&&React.createElement('button', { onClick: function(){handleRemoveFile(item.id,f.id);}, style: {background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:12,padding:"0 2px",lineHeight:1},}, "×")
                        )
                      );
                    })
                    , onUpdateRecord&&(
                      React.createElement('label', { style: {cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,marginTop:4},}
                        , React.createElement('div', { style: {background:C.purple,color:"#fff",borderRadius:8,padding:"4px 12px",fontSize:11,fontWeight:700},}
                          , uploading?"Subiendo...":files.length>0?"+ Agregar archivo":"📎 Adjuntar resultado"
                        )
                        , React.createElement('input', { type: "file", accept: "image/*,application/pdf", style: {display:"none"}, multiple: true, onChange: function(e){handleAddFile(item.id,e);}, disabled: uploading,})
                      )
                    )
                    , files.length===0&&(
                      React.createElement('span', { style: {fontSize:11,color:C.yellow,fontWeight:700,background:C.yellowLight,borderRadius:6,padding:"2px 8px"},}, "⏳ Pendiente de adjuntar")
                    )
                  )
                )
              )
            )
          )
        );
      })
    )
  );
}
function OwnerHistory(props) {
  var pets=props.pets, records=props.records, selectedPet=props.selectedPet, C=props.C;
  var isMobile=useIsMobile();
  var petRecords=records.filter(function(r){return r.petId===(selectedPet&&selectedPet.id);}).sort(function(a,b){return b.date.localeCompare(a.date);});
  return (
    React.createElement('div', null
      , React.createElement('h2', { style: {fontFamily:"'Playfair Display',serif",fontSize:isMobile?22:26,color:C.brownDark,marginBottom:12},}, "Historial Clínico" )
      , React.createElement('div', { style: {display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"},}
        , pets.map(function(p){
          var active=selectedPet&&selectedPet.id===p.id;
          return React.createElement('button', { key: p.id, onClick: function(){props.onSelectPet(p);}, style: {display:"flex",alignItems:"center",gap:8,padding:"7px 14px",borderRadius:20,background:active?C.brown:C.peach,color:active?C.navIcon:C.brownDark,border:"none",fontWeight:700,fontSize:13,cursor:"pointer"},}, p.avatar+" "+p.name);
        })
      )
      , !selectedPet?React.createElement('p', { style: {color:C.textLight,textAlign:"center",padding:40},}, "Selecciona una mascota."  ):petRecords.length===0?React.createElement('p', { style: {color:C.textLight,textAlign:"center",padding:40},}, "Sin registros todavia."  ):
        React.createElement('div', null
          , petRecords.map(function(r){
            return (
              React.createElement(Card, { key: r.id, C: C, style: {marginBottom:14,padding:"12px 14px"},}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8},}, React.createElement(Badge, { type: r.type,}), React.createElement('span', { style: {fontSize:12,color:C.textLight,fontWeight:600},}, fmtDate(r.date)))
                , r.weight&&React.createElement('div', { style: {display:"inline-flex",alignItems:"center",gap:8,background:C.peach,borderRadius:12,padding:"7px 12px",marginBottom:10},}, React.createElement('span', { style: {fontSize:18},}, "⚖️"), React.createElement('div', null, React.createElement('div', { style: {fontSize:10,fontWeight:700,color:C.textMid},}, "PESO EN ESTA VISITA"   ), React.createElement('div', { style: {fontSize:17,fontWeight:800,color:C.brownDark},}, r.weight+" kg")))
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:8,marginBottom:8},}
                  , React.createElement('div', { style: {background:C.blueLight,borderRadius:10,padding:"8px 10px"},}, React.createElement('div', { style: {fontSize:10,fontWeight:700,color:C.textMid,marginBottom:2},}, "DIAGNOSTICO"), React.createElement('div', { style: {fontSize:13,color:C.text},}, r.diagnosis||"—"))
                  , React.createElement('div', { style: {background:C.greenLight,borderRadius:10,padding:"8px 10px"},}, React.createElement('div', { style: {fontSize:10,fontWeight:700,color:C.textMid,marginBottom:2},}, "TRATAMIENTO"), React.createElement('div', { style: {fontSize:13,color:C.text},}, r.treatment||"—"))
                )
                                , r.items&&r.items.length>0&&(
                  React.createElement(OwnerItemsDisplay, { items: r.items, record: r, onUpdateRecord: props.onUpdateRecord, C: C,})
                )
                , r.notes&&React.createElement('div', { style: {fontSize:12,color:C.textMid,fontStyle:"italic",marginBottom:6},}, r.notes)
                , r.nextVisit&&React.createElement('div', { style: {fontSize:12,background:C.blueLight,color:C.blue,borderRadius:8,padding:"4px 10px",display:"inline-block",fontWeight:700},}, "Próxima: "+fmtDate(r.nextVisit))
              )
            );
          })
        )
      
    )
  );
}

// ============================================================
// FORMULARIOS - PetForm, RecordForm, ApptForm, TreatmentItemsField
// ============================================================
