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
    <div ref={canvasRef} id="pet-carnet" style={{width:340,background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.25)",fontFamily:"'Nunito',sans-serif",margin:"0 auto"}}>
      {/* Header */}
      <div style={{background:cardBg,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:48,height:48,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🐾</div>
        <div>
          <div style={{color:"#fff",fontWeight:800,fontSize:14,letterSpacing:1}}>{clinicName.toUpperCase()}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:11}}>Registro de Mascota</div>
        </div>
      </div>
      {/* Body */}
      <div style={{display:"flex",padding:16,gap:14,background:"linear-gradient(135deg,#FDF6EC 0%,#F9E4CC 100%)"}}>
        {/* Photo */}
        <div style={{flexShrink:0}}>
          {pet.photo
            ?<img src={pet.photo} alt={pet.name} style={{width:90,height:110,borderRadius:10,objectFit:"cover",border:"3px solid "+cardBg}}/>
            :<div style={{width:90,height:110,borderRadius:10,background:cardBg+"22",border:"3px solid "+cardBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>{pet.avatar||"🐾"}</div>
          }
          <div style={{textAlign:"center",marginTop:6,fontSize:22}}>{huella}</div>
        </div>
        {/* Info */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,fontSize:20,color:cardBg,marginBottom:2}}>{pet.name}</div>
          <div style={{fontSize:11,color:"#999",marginBottom:10,fontWeight:600,letterSpacing:0.5}}>{"CARNET DE IDENTIDAD"}</div>
          {[
            ["Especie:",pet.species||"—"],
            ["Raza:",pet.breed||"—"],
            ["Sexo:",( pet.sex||"—")+" "+sexIcon],
            ["Color:",pet.color||"—"],
            ["Nacimiento:",pet.dob?pet.dob.split("-").reverse().join("/"):"—"],
            ["Peso:",pet.weight?pet.weight+" kg":"—"],
          ].map(function(row){
            return (
              <div key={row[0]} style={{display:"flex",gap:6,marginBottom:3}}>
                <span style={{fontSize:11,fontWeight:700,color:"#999",minWidth:72,flexShrink:0}}>{row[0]}</span>
                <span style={{fontSize:11,color:"#333",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row[1]}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Barcode-style strip */}
      <div style={{background:cardBg+"15",borderTop:"1px solid "+cardBg+"33",padding:"8px 16px",display:"flex",gap:4,alignItems:"center"}}>
        {Array.from({length:30}).map(function(_,i){
          var h=[2,3,5,2,4,3,2,5,2,3,4,2,3,2,5,3,2,4,3,2,5,2,3,4,2,3,2,5,3,2][i%30];
          return <div key={i} style={{width:2,height:h*3,background:cardBg,borderRadius:1,opacity:0.6+((i%3)*0.1)}}/>;
        })}
      </div>
      {/* Footer */}
      <div style={{background:cardBg,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600}}>DUEÑO</div>
          <div style={{fontSize:12,color:"#fff",fontWeight:700}}>{fullName(owner)}</div>
          {owner&&owner.phone&&<div style={{fontSize:10,color:"rgba(255,255,255,0.8)"}}>{owner.phone}</div>}
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontWeight:600}}>ID MASCOTA</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.9)",fontFamily:"monospace",fontWeight:700}}>{pet.id.toUpperCase()}</div>
        </div>
      </div>
    </div>
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
    <Modal title={"Carnet de "+pet.name} onClose={props.onClose} C={C}>
      <p style={{color:C.textMid,fontSize:13,marginBottom:16,textAlign:"center"}}>Carnet de identidad virtual de tu mascota</p>
      <PetCarnet pet={pet} owner={owner} C={C}/>
      {msg&&<div style={{marginTop:12,padding:"8px 12px",background:C.greenLight,borderRadius:10,fontSize:12,color:C.green,fontWeight:600,textAlign:"center"}}>{msg}</div>}
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <Btn onClick={downloadCarnet} disabled={downloading} full={true} C={C} variant="success">
          {downloading?"Generando...":"📥 Imprimir / Guardar PDF"}
        </Btn>
        <Btn variant="ghost" onClick={props.onClose} full={true} C={C}>Cerrar</Btn>
      </div>
    </Modal>
  );
}