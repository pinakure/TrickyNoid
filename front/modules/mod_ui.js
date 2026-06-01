/*
  user interface stuff for the web audio module player
  (c) 2012-2015 firehawk/tda
*/

var notelist=new Array("C-", "C#", "D-", "D#", "E-", "F-", "F#", "G-", "G#", "A-", "A#", "B-");

var ft2volcmds=new Array("m", "v", "^", "-", "+", "s", "~", "p", "&lt;", "&gt;"); // 0x5 .. 0xe

function notef(n,s,v,c,d,cc)
{
  function prn(n) { return (n==254)?"===":("<span class=\"note\">"+notelist[n&0x0f]+(n>>4)+"</span>"); }
  function prv(v) { return (v<=0x40)?hb(v):(ft2volcmds[(v-0x50)>>4]+hn(v&0x0f)); }

  // 14 chars per channel (max 112)
  if (cc<=8) return ((n<255) ? (prn(n)+" ") : ("... "))+
    (s ? ("<span class=\"sample\">"+hb(s)+"</span> ") : (".. "))+
    ( (v!=255)?("<span class=\"volume\">"+prv(v)+"</span> "):(".. "))+
    ((c!=0x2e) ? ("<span class=\"command\">"+String.fromCharCode(c)+hb(d)+"</span>") : "...")+
    "|";

  // 11 chars (max 110)
  if (cc<=10) return ((n<255) ? prn(n) : ("..."))+
    (s ? ("<span class=\"sample\">"+hb(s)+"</span>") : (".."))+
    ( (v!=255)?("<span class=\"volume\">"+prv(v)+"</span>"):(".."))+
    ((c!=0x2e) ? ("<span class=\"command\">"+String.fromCharCode(c)+hb(d)+"</span>") : "...")+
    "|";

  // 9 chars (max 108)
  if (cc<=12) return ((n<255) ? prn(n) : ("..."))+
    (s ? ("<span class=\"sample\">"+hb(s)+"</span>") :
    ((v!=255)?("<span class=\"volume\">"+prv(v)+"</span>"):("..")))+
    ((c!=0x2e) ? ("<span class=\"command\">"+String.fromCharCode(c)+hb(d)+"</span>") : "...")+
    "|";

  // 7 chars (max 112)
  if (cc<=16) return ((n<255) ? prn(n) : ("..."))+
    ((c!=0x2e) ? ("<span class=\"command\">"+String.fromCharCode(c)+hb(d)+"</span>") :
    ( s ? ("<span class=\"sample\">"+hb(s)+"</span>.") : ( (v!=255)?("<span class=\"volume\">"+prv(v)+"</span>."):("...")))
    )+"|";

  // 3 chars (max 96)
  return ((n<255) ? prn(n) :
    (s ? (".<span class=\"sample\">"+hb(s)+"</span>") :
    ((c!=0x2e) ? ("<span class=\"command\">"+String.fromCharCode(c)+hb(d)+"</span>") :
    ((v!=255) ? (" <span class=\"volume\">"+prv(v)+"</span>"):("...")))));
}

function hn(n)
{
  if (typeof n == "undefined") return "0";
  var s=(n&0x0f).toString(16);
  return s.toUpperCase();
}

function hb(n)
{
  if (typeof n == "undefined") return "00";
  var s=n.toString(16);
  if (s.length==1) s='0'+s;
  return s.toUpperCase();
}

function hw(n)
{
  if (typeof n == "undefined") return "0000";
  var s=n.toString(16);
  if (s.length==3) s='0'+s;
  else if (s.length==2) s='00'+s;
  else if (s.length==1) s='000'+s;
  return s.toUpperCase();
}

function pad(s,l)
{
  var ps=s;
  if (ps.length > l) ps=ps.substring(0,l-1);
  while (ps.length < l) ps+=" ";
  return ps;
}

function rpe(s)
{
  var rs="";
  for(var i=0;i<s.length;i++) {
    if (s[i]=='>') rs+="&gt;"
    else if (s[i]=='<') rs+='&lt';
    else if (s[i]=='&') rs+='&amp;';
    else rs+=s[i];
  }
  return rs;
}

function vu(l)
{
  var f=Math.round(l*20);
  var b="";

  b='<span style="color:#afa;">';
  for(i=0;i<10;i++) b+=(i<f)?"&#x00BB;":"&nbsp;";
  b+='</span><span style="color:#fea;">';
  for(;i<16;i++) b+=(i<f)?"&#x00BB;":"&nbsp;";
  b+='</span><span style="color:#faa;">';
  for(;i<20;i++) b+=(i<f)?"&#x00BB;":"&nbsp;";
  b+='</span>';

  return b;
}

