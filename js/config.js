// ─── SUPABASE CONFIG ─────────────────────────────────
// Reemplaza con los valores de tu proyecto Supabase:
var SUPA_URL = "https://YOUR_PROJECT_REF.supabase.co";
var SUPA_KEY = "YOUR_ANON_PUBLIC_KEY";

// Mapa de KEYS → tablas Supabase
var KEYS = {
  users:"vc_users", pets:"vc_pets", records:"vc_records",
  session:"vc_session",
  appts:"vc_appointments", notifs:"vc_notifications",
  blocked:"vc_blocked_days", reqs:"vc_appt_requests"
};

function supaH() {
  return { "Content-Type":"application/json","apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Prefer":"return=representation" };
}

// ─── MAPPERS snake_case ↔ camelCase ──────────────────────
function mapUser(r){ if(!r)return null; return {id:r.id,role:r.role,firstName:r.first_name,lastName:r.last_name,email:r.email,password:r.password,docType:r.doc_type||"DNI",docNum:r.doc_num||"",phone:r.phone||"",blocked:r.blocked||false}; }
function userToDb(u){ return {id:u.id,role:u.role,first_name:u.firstName||"",last_name:u.lastName||"",email:u.email,password:u.password,doc_type:u.docType||"DNI",doc_num:u.docNum||"",phone:u.phone||"",blocked:u.blocked||false}; }
function mapPet(r){ if(!r)return null; return {id:r.id,ownerId:r.owner_id,name:r.name,species:r.species||"Perro",breed:r.breed||"",sex:r.sex||"Macho",dob:r.dob||"",weight:r.weight||"",color:r.color||"",avatar:r.avatar||"🐾",photo:r.photo||""}; }
function petToDb(p){ return {id:p.id,owner_id:p.ownerId,name:p.name,species:p.species||"Perro",breed:p.breed||"",sex:p.sex||"Macho",dob:p.dob||"",weight:p.weight||"",color:p.color||"",avatar:p.avatar||"🐾",photo:p.photo||""}; }
function mapRecord(r){ if(!r)return null; return {id:r.id,petId:r.pet_id,vetId:r.vet_id,date:r.date,type:r.type||"Consulta",diagnosis:r.diagnosis||"",treatment:r.treatment||"",notes:r.notes||"",nextVisit:r.next_visit||"",weight:r.weight||"",attended:r.attended,duration:r.duration,items:r.items||[]}; }
function recordToDb(r){ return {id:r.id,pet_id:r.petId,vet_id:r.vetId,date:r.date,type:r.type||"Consulta",diagnosis:r.diagnosis||"",treatment:r.treatment||"",notes:r.notes||"",next_visit:r.nextVisit||"",weight:r.weight||"",attended:r.attended!=null?r.attended:null,duration:r.duration||null,items:r.items||[]}; }
function mapAppt(r){ if(!r)return null; return {id:r.id,petId:r.pet_id,ownerId:r.owner_id,vetId:r.vet_id,date:r.date,time:r.time,type:r.type||"Consulta",notes:r.notes||"",status:r.status||"pending",attended:r.attended}; }
function apptToDb(a){ return {id:a.id,pet_id:a.petId,owner_id:a.ownerId,vet_id:a.vetId,date:a.date,time:a.time,type:a.type||"Consulta",notes:a.notes||"",status:a.status||"pending",attended:a.attended!=null?a.attended:null}; }
function mapReq(r){ if(!r)return null; return {id:r.id,petId:r.pet_id,ownerId:r.owner_id,vetId:r.vet_id,date:r.date,time:r.time,type:r.type||"Consulta",notes:r.notes||"",status:r.status||"pending",ts:r.ts||Date.now()}; }
function reqToDb(q){ return {id:q.id,pet_id:q.petId,owner_id:q.ownerId,vet_id:q.vetId,date:q.date,time:q.time,type:q.type||"Consulta",notes:q.notes||"",status:q.status||"pending",ts:q.ts||Date.now()}; }
function mapNotif(r){ if(!r)return null; return {id:r.id,toId:r.to_id,msg:r.msg,icon:r.icon||"🔔",actionId:r.action_id||"",read:r.read||false,ts:r.ts||Date.now()}; }
function notifToDb(n){ return {id:n.id,to_id:n.toId,msg:n.msg,icon:n.icon||"🔔",action_id:n.actionId||"",read:n.read||false,ts:n.ts||Date.now()}; }
function mapBlocked(r){ return {date:r.date,reason:r.reason||"No disponible"}; }

// ─── SUPABASE REST HELPERS ───────────────────────────────
async function sbAll(table){ try{ var r=await fetch(SUPA_URL+"/rest/v1/"+table+"?select=*&order=created_at.asc",{headers:supaH()}); return r.ok?await r.json():[];}catch(e){return[];} }
async function sbUpsertRow(table,row){ try{ var r=await fetch(SUPA_URL+"/rest/v1/"+table+"?on_conflict=id",{method:"POST",headers:Object.assign({},supaH(),{"Prefer":"resolution=merge-duplicates,return=representation"}),body:JSON.stringify([row])}); return r.ok;}catch(e){return false;} }
async function sbUpsertMany(table,rows){ try{ var r=await fetch(SUPA_URL+"/rest/v1/"+table+"?on_conflict=id",{method:"POST",headers:Object.assign({},supaH(),{"Prefer":"resolution=merge-duplicates,return=representation"}),body:JSON.stringify(rows)}); return r.ok;}catch(e){return false;} }
async function sbPatch(table,id,data){ try{ var r=await fetch(SUPA_URL+"/rest/v1/"+table+"?id=eq."+id,{method:"PATCH",headers:supaH(),body:JSON.stringify(data)}); return r.ok;}catch(e){return false;} }
async function sbDel(table,id){ try{ var r=await fetch(SUPA_URL+"/rest/v1/"+table+"?id=eq."+id,{method:"DELETE",headers:supaH()}); return r.ok;}catch(e){return false;} }
async function sbDelWhere(table,col,val){ try{ var r=await fetch(SUPA_URL+"/rest/v1/"+table+"?"+col+"=eq."+encodeURIComponent(val),{method:"DELETE",headers:supaH()}); return r.ok;}catch(e){return false;} }

// ─── sGet / sSet: wrappers que mantienen compatibilidad con el App ──
async function sGet(k) {
  try {
    if(k===KEYS.session){ return localStorage.getItem("vc_session")||null; }
    var rows=[];
    if(k===KEYS.users)    { rows=await sbAll("vc_users");    return rows.map(mapUser); }
    if(k===KEYS.pets)     { rows=await sbAll("vc_pets");     return rows.map(mapPet); }
    if(k===KEYS.records)  { rows=await sbAll("vc_records");  return rows.map(mapRecord); }
    if(k===KEYS.appts)    { rows=await sbAll("vc_appointments"); return rows.map(mapAppt); }
    if(k===KEYS.reqs)     { rows=await sbAll("vc_appt_requests"); return rows.map(mapReq); }
    if(k===KEYS.notifs)   { rows=await sbAll("vc_notifications"); return rows.map(mapNotif); }
    if(k===KEYS.blocked)  { rows=await sbAll("vc_blocked_days"); return rows.map(mapBlocked); }
    return null;
  } catch(e){ return null; }
}
async function sSet(k,v) {
  try {
    if(k===KEYS.session){ if(v===null||v==="null") localStorage.removeItem("vc_session"); else localStorage.setItem("vc_session",v); return; }
    if(!Array.isArray(v)) return;
    if(k===KEYS.users)   { await sbUpsertMany("vc_users", v.map(userToDb)); return; }
    if(k===KEYS.pets)    { await sbUpsertMany("vc_pets", v.map(petToDb)); return; }
    if(k===KEYS.records) { await sbUpsertMany("vc_records", v.map(recordToDb)); return; }
    if(k===KEYS.appts)   { await sbUpsertMany("vc_appointments", v.map(apptToDb)); return; }
    if(k===KEYS.reqs)    { await sbUpsertMany("vc_appt_requests", v.map(reqToDb)); return; }
    if(k===KEYS.notifs)  { await sbUpsertMany("vc_notifications", v.map(notifToDb)); return; }
    if(k===KEYS.blocked) { await sbUpsertMany("vc_blocked_days", v.map(mapBlocked)); return; }
  } catch(e){}
}