function palette(dark) {
  return {
    // Base backgrounds
    cream:dark?"#111827":"#F0F4F8",         // main bg: dark navy / light steel-blue
    peach:dark?"#1E2A3A":"#E2EAF4",         // card secondary bg
    tan:dark?"#2D4A6B":"#B8CFE8",           // accent/border highlight

    // Primary action color (teal/navy)
    brown:dark?"#4DB8C8":"#1E7A8C",         // primary buttons, links
    brownDark:dark?"#7DD4E0":"#145A6A",     // headings, dark text

    // Success (emerald green)
    green:dark?"#34C98A":"#0D9B6A",
    greenLight:dark?"#0A2E1E":"#D1F5E8",

    // Info (sky blue)
    blue:dark?"#60B4E8":"#2E86C1",
    blueLight:dark?"#0A1D2E":"#D6EAF8",

    // Danger (coral red)
    red:dark?"#F07070":"#E05252",
    redLight:dark?"#2E1010":"#FDEAEA",

    // Warning (amber)
    yellow:dark?"#F5C842":"#D4900A",
    yellowLight:dark?"#2A1E00":"#FFF3CD",

    // Accent (violet)
    purple:dark?"#A880E0":"#7B4FCC",
    purpleLight:dark?"#1A1030":"#EDE6FA",

    // Text
    text:dark?"#E8F0F8":"#1A2B3C",
    textMid:dark?"#8AABB8":"#4A6275",
    textLight:dark?"#4A6882":"#8BA4B5",

    // Surfaces
    surface:dark?"#1A2535":"#FFFFFF",
    border:dark?"#2A3F58":"#CBD8E4",

    // Nav (dark slate)
    topbar:dark?"#0D1929":"#1A3A5C",
    sidebar:dark?"#0D1929":"#1A3A5C",
    navIcon:dark?"#7DD4E0":"#FFFFFF",
    navIconDim:dark?"#4A6882":"rgba(255,255,255,0.55)",
  };
}
var buildCss=function(C){ return "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@600&display=swap');\n*{box-sizing:border-box;margin:0;padding:0;}html{font-size:16px;}body{font-family:'Nunito',sans-serif;background:"+C.cream+";color:"+C.text+";-webkit-text-size-adjust:100%;}\n::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:"+C.peach+";}::-webkit-scrollbar-thumb{background:"+C.tan+";border-radius:3px;}\ninput,select,textarea{font-family:'Nunito',sans-serif;border:1.5px solid "+C.border+";border-radius:10px;padding:11px 14px;background:"+C.surface+";color:"+C.text+";width:100%;font-size:16px;outline:none;transition:border-color .2s;-webkit-appearance:none;appearance:none;}\ninput:focus,select:focus,textarea:focus{border-color:"+C.brown+";box-shadow:0 0 0 3px "+C.brown+"33;}\ninput.err,select.err,textarea.err{border-color:"+C.red+";}\nbutton{font-family:'Nunito',sans-serif;cursor:pointer;border:none;border-radius:10px;font-weight:700;transition:all .18s;-webkit-tap-highlight-color:transparent;}\nbutton:active{transform:scale(.97);}\nlabel{font-size:13px;font-weight:700;color:"+C.brownDark+";display:block;margin-bottom:5px;}\n@keyframes slideUp{from{transform:translateY(24px);opacity:0;}to{transform:translateY(0);opacity:1;}}\n@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}"; };
function simEmail(email,subject,push){ push("Email -> "+(email||"?")+" : "+subject,"success"); }
function simWA(phone,msg,push){ if(phone) push("WhatsApp -> "+phone+" : "+msg.slice(0,40),"success"); }
function byId(arr,id){ for(var _i=0;_i<arr.length;_i++){if(arr[_i].id===id)return arr[_i];} return null; }
var sOverflow={overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"};
function byField(arr,field,val){ for(var _i=0;_i<arr.length;_i++){if(arr[_i][field]===val)return arr[_i];} return null; }