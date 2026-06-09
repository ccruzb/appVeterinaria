const BREEDS = {
  Perro:["Beagle","Border Collie","Boxer","Bulldog Francés","Caniche","Chihuahua","Dálmata","Doberman","Golden Retriever","Husky Siberiano","Labrador Retriever","Mestizo","Pastor Alemán","Rottweiler","Shih Tzu","Yorkshire Terrier","Gran Danés","Pomerania"],
  Gato:["Angora Turco","Azul Ruso","Bengalí","British Shorthair","Maine Coon","Mestizo","Persa","Ragdoll","Scottish Fold","Siamés","Siberiano"],
  Ave:["Agapornis","Cacatúa","Canario","Guacamayo","Loro","Ninfa","Periquito"],
  Conejo:["Angora","Belier","Mini Rex","New Zealand","Rex"],
  Reptil:["Bearded Dragon","Gecko Leopardo","Iguana Verde","Tortuga de Tierra"],
  Pez:["Betta","Goldfish","Guppy","Neon Tetra"],
  Otro:["Cobayo","Erizo","Hurón","Rata"]
};;

const SEED_USERS = [
  { id:"u0", role:"admin", firstName:"Admin",    lastName:"VetCare",   email:"admin@vetcare.com",  password:"admin2025",   docType:"DNI", docNum:"00000001", blocked:false, phone:"" },
  { id:"u1", role:"vet",   firstName:"German",   lastName:"Cabrera",   email:"german@clinica.com", password:"vetcare2025", docType:"DNI", docNum:"12345678", blocked:false, phone:"" },
  { id:"u2", role:"owner", firstName:"Carlos",   lastName:"Ruiz",      email:"carlos@mail.com",    password:"1234",        docType:"DNI", docNum:"87654321", blocked:false, phone:"999111222" },
  { id:"u3", role:"owner", firstName:"Ana",      lastName:"Torres",    email:"ana@mail.com",       password:"1234",        docType:"DNI", docNum:"11223344", blocked:false, phone:"999333444" },
  { id:"u4", role:"owner", firstName:"Miguel",   lastName:"Fernandez", email:"miguel@mail.com",    password:"1234",        docType:"DNI", docNum:"22334455", blocked:false, phone:"999222333" },
  { id:"u5", role:"owner", firstName:"Lucia",    lastName:"Gomez",     email:"lucia@mail.com",     password:"1234",        docType:"DNI", docNum:"33445566", blocked:false, phone:"999333555" },
  { id:"u6", role:"owner", firstName:"Roberto",  lastName:"Sanchez",   email:"roberto@mail.com",   password:"1234",        docType:"DNI", docNum:"44556677", blocked:false, phone:"999444666" },
  { id:"u7", role:"owner", firstName:"Patricia", lastName:"Lopez",     email:"patricia@mail.com",  password:"1234",        docType:"DNI", docNum:"55667788", blocked:false, phone:"999555777" },
  { id:"u8", role:"owner", firstName:"Jorge",    lastName:"Martinez",  email:"jorge@mail.com",     password:"1234",        docType:"DNI", docNum:"66778899", blocked:false, phone:"999666888" },
  { id:"u9", role:"owner", firstName:"Sofia",    lastName:"Diaz",      email:"sofia@mail.com",     password:"1234",        docType:"DNI", docNum:"77889900", blocked:false, phone:"999777999" },
];
const SEED_PETS = [
  { id:"p1", ownerId:"u2", name:"Mochi",    species:"Gato",  breed:"Siames",  sex:"Hembra",           dob:"2020-03-15", weight:"4.2",  color:"Crema y marron", avatar:"🐱", photo:"" },
  { id:"p2", ownerId:"u2", name:"Rocky",    species:"Perro", breed:"Labrador Retriever", sex:"Macho",dob:"2018-07-22", weight:"28.5",color:"Amarillo",        avatar:"🐶", photo:"" },
  { id:"p3", ownerId:"u3", name:"Luna",     species:"Perro", breed:"Caniche",  sex:"Hembra",          dob:"2021-11-05", weight:"8.1", color:"Blanco",          avatar:"🐩", photo:"" },
  { id:"p4", ownerId:"u4", name:"Max",      species:"Perro", breed:"Golden Retriever",  sex:"Macho", dob:"2019-05-10", weight:"32.0",color:"Dorado",          avatar:"🐶", photo:"" },
  { id:"p5", ownerId:"u5", name:"Coco",     species:"Gato",  breed:"Persa",   sex:"Hembra",            dob:"2022-02-14", weight:"3.8", color:"Blanco",          avatar:"🐱", photo:"" },
  { id:"p6", ownerId:"u6", name:"Bruno",    species:"Perro", breed:"Pastor Aleman",   sex:"Macho",    dob:"2017-09-01", weight:"38.0",color:"Negro y marron",  avatar:"🐶", photo:"" },
  { id:"p7", ownerId:"u7", name:"Nala",     species:"Gato",  breed:"British Shorthair", sex:"Hembra",dob:"2021-06-20", weight:"4.5", color:"Gris",            avatar:"🐱", photo:"" },
  { id:"p8", ownerId:"u8", name:"Toby",     species:"Perro", breed:"Beagle",  sex:"Macho",           dob:"2020-11-30", weight:"12.5",color:"Tricolor",        avatar:"🐶", photo:"" },
  { id:"p9", ownerId:"u9", name:"Princesa", species:"Gato",  breed:"Ragdoll", sex:"Hembra",          dob:"2023-01-08", weight:"3.2", color:"Gris y blanco",   avatar:"🐱", photo:"" },
];
const SEED_RECORDS = [
  { id:"r1", petId:"p1", vetId:"u1", date:"2024-10-12", type:"Consulta",  diagnosis:"Dermatitis leve",         treatment:"Crema hidrocortisona 7 dias", notes:"Prurito dorsal",    nextVisit:"2026-06-15", weight:"4.1",  attended:true,  duration:20, items:[] },
  { id:"r2", petId:"p1", vetId:"u1", date:"2025-01-08", type:"Vacunación",diagnosis:"Control anual",           treatment:"Vacuna triple felina",        notes:"Sin reacciones",    nextVisit:"2026-06-20", weight:"4.2",  attended:true,  duration:15, items:[] },
  { id:"r3", petId:"p2", vetId:"u1", date:"2025-03-20", type:"Cirugía",   diagnosis:"Displasia de cadera leve",treatment:"Fisioterapia + meloxicam",    notes:"Buena recuperacion",nextVisit:"2026-06-25", weight:"28.5", attended:true,  duration:45, items:[] },
  { id:"r4", petId:"p3", vetId:"u1", date:"2025-05-02", type:"Consulta",  diagnosis:"Otitis externa",          treatment:"Gotas Otomax 10 dias",        notes:"Limpieza auditiva", nextVisit:"2026-07-01", weight:"8.0",  attended:false, duration:null,items:[] },
];
const SEED_APPTS = [
  { id:"a1", petId:"p1", ownerId:"u2", vetId:"u1", date:"2026-06-15", time:"09:00", type:"Vacunación", notes:"Control anual", status:"confirmed", attended:null },
  { id:"a2", petId:"p2", ownerId:"u2", vetId:"u1", date:"2026-06-20", time:"10:30", type:"Control", notes:"Revisión displasia", status:"pending", attended:null },
  { id:"a3", petId:"p3", ownerId:"u3", vetId:"u1", date:"2026-06-25", time:"11:00", type:"Consulta", notes:"Seguimiento otitis", status:"pending", attended:null },
  { id:"da0", petId:"p4", ownerId:"u4", vetId:"u1", date:"2026-07-08", time:"08:00", type:"Consulta", notes:"Control rutina", status:"confirmed", attended:null },
  { id:"da1", petId:"p5", ownerId:"u5", vetId:"u1", date:"2026-07-09", time:"09:30", type:"Vacunación", notes:"Revisión general", status:"confirmed", attended:null },
  { id:"da2", petId:"p6", ownerId:"u6", vetId:"u1", date:"2026-07-10", time:"10:00", type:"Control", notes:"Seguimiento", status:"confirmed", attended:null },
  { id:"da3", petId:"p7", ownerId:"u7", vetId:"u1", date:"2026-07-11", time:"11:30", type:"Consulta", notes:"Rutina", status:"confirmed", attended:null },
  { id:"da4", petId:"p8", ownerId:"u8", vetId:"u1", date:"2026-07-12", time:"12:00", type:"Control", notes:"Seguimiento", status:"confirmed", attended:null },
  { id:"da5", petId:"p9", ownerId:"u9", vetId:"u1", date:"2026-07-13", time:"08:30", type:"Consulta", notes:"Control rutina", status:"confirmed", attended:null },
  { id:"da6", petId:"p1", ownerId:"u2", vetId:"u1", date:"2026-07-14", time:"09:00", type:"Vacunación", notes:"Anual", status:"confirmed", attended:null }
];
const SEED_REQS = [
  { id:"rq0", petId:"p1", ownerId:"u2", date:"2026-07-15", time:"09:00", type:"Consulta",  notes:"Revisión rutina",    status:"pending", ts:1749000000 },
  { id:"rq1", petId:"p2", ownerId:"u3", date:"2026-07-15", time:"10:00", type:"Control",   notes:"Seguimiento",       status:"pending", ts:1749001000 },
  { id:"rq2", petId:"p3", ownerId:"u4", date:"2026-07-16", time:"09:00", type:"Vacunación",notes:"Vacuna anual",       status:"pending", ts:1749002000 },
  { id:"rq3", petId:"p4", ownerId:"u5", date:"2026-07-16", time:"10:00", type:"Consulta",  notes:"Primera visita",    status:"pending", ts:1749003000 },
  { id:"rq4", petId:"p5", ownerId:"u6", date:"2026-07-17", time:"08:00", type:"Control",   notes:"Rutina",            status:"pending", ts:1749004000 },
  { id:"rq5", petId:"p6", ownerId:"u7", date:"2026-07-17", time:"09:30", type:"Consulta",  notes:"Revisión",          status:"pending", ts:1749005000 },
  { id:"rq6", petId:"p7", ownerId:"u8", date:"2026-07-18", time:"10:00", type:"Vacunación",notes:"Control anual",      status:"pending", ts:1749006000 },
  { id:"rq7", petId:"p8", ownerId:"u9", date:"2026-07-18", time:"11:00", type:"Consulta",  notes:"Primer control",    status:"pending", ts:1749007000 }
];