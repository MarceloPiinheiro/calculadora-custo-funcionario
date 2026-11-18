// Tabelas de 2026: atualizar apenas este bloco quando houver mudança
const T={
 inss:[[1621.00,.075],[2902.84,.09],[4354.27,.12],[8475.55,.14]],
 irrf:[[2428.80,0,0],[2826.65,.075,182.16],[3751.05,.15,394.16],[4664.68,.225,675.49],[Infinity,.275,908.73]],
 simplificado:607.20, dependente:189.59,
 reducao:{ate:5000,max:312.89,teto:7350,a:978.62,b:0.133145},
 fgts:.08, patronal:.20
};
const REG={s:{pat:false,rat:false,terc:false},iv:{pat:true,rat:true,terc:false},lp:{pat:true,rat:true,terc:true}};
const $=id=>document.getElementById(id);
const brl=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const pct=v=>(v*100).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+"%";

// Formata milhares com ponto (5.000) e aceita vírgula para centavos (5.000,50)
function lerSalario(el){
 let v=el.value.replace(/[^\d,]/g,"");
 if(!v){el.value="";return 0;}
 const partes=v.split(",");
 let inteiro=partes[0].replace(/^0+(?=\d)/,"")||"0";
 inteiro=inteiro.replace(/\B(?=(\d{3})+(?!\d))/g,".");
 if(partes.length>1){
  const centavos=partes.slice(1).join("").slice(0,2);
  el.value=`${inteiro},${centavos}`;
 }else{
  el.value=inteiro;
 }
 return parseFloat(el.value.replace(/\./g,"").replace(",","."))||0;
}

function inss(b){let prev=0,t=0;for(const [lim,r] of T.inss){if(b>prev)t+=(Math.min(b,lim)-prev)*r;prev=lim}return t}
function irrf(b,i,dep){
 const ded=Math.max(T.simplificado,i+dep*T.dependente);
 const base=Math.max(0,b-ded);
 const f=T.irrf.find(x=>base<=x[0]);
 const imp=Math.max(0,base*f[1]-f[2]);
 const R=T.reducao;let red=0;
 if(b<=R.ate)red=Math.min(imp,R.max);
 else if(b<=R.teto)red=Math.min(imp,Math.max(0,R.a-R.b*b));
 return Math.max(0,imp-red);
}

function calc(){
 const b=lerSalario($("sal"));
 const dep=Math.max(0,parseInt($("dep").value)||0);
 const r=REG[$("reg").value];
 $("wrat").hidden=!r.rat;$("wterc").hidden=!r.terc;
 const ratP=r.rat?(+$("rat").value)/100:0;
 const tercP=r.terc?(parseFloat($("terc").value)||0)/100:0;
 const patP=r.pat?T.patronal:0;

 const i=inss(b),ir=irrf(b,i,dep),liq=b-i-ir;
 const fgts=b*T.fgts,pat=b*patP,rat=b*ratP,terc=b*tercP;
 const p13=b/12,pfer=b/12*4/3;
 const encP=T.fgts+patP+ratP+tercP;
 const encProv=(p13+pfer)*encP;
 const total=b+fgts+pat+rat+terc+p13+pfer+encProv;

 const L=[["sec","Funcionário"],["","Salário bruto",b],["","(−) INSS do funcionário",-i],["","(−) IRRF",-ir],["tot","Líquido a receber",liq],
 ["sec","Empresa"],["","Salário bruto",b],["","FGTS (8%)",fgts]];
 if(r.pat)L.push(["","INSS patronal (20%)",pat]);
 if(r.rat)L.push(["","RAT",rat]);
 if(r.terc)L.push(["","Terceiros / Sistema S",terc]);
 L.push(["","Provisão de 13º",p13],["","Provisão de férias + 1/3",pfer],["","Encargos sobre as provisões",encProv],["tot","Custo total mensal",total]);

 $("rows").innerHTML=L.map(x=>x[0]==="sec"?`<tr class="sec"><td colspan="3">${x[1]}</td></tr>`:
  `<tr class="${x[0]}"><td>${x[1]}</td><td>${brl(x[2])}</td><td>${b?pct(x[2]/b):"–"}</td></tr>`).join("");
 $("k1").textContent=brl(total);$("k2").textContent=brl(liq);
 $("nota").textContent=r.pat?"":"No Simples Nacional (exceto Anexo IV), o INSS patronal e o RAT já estão incluídos no DAS e não há contribuição a terceiros.";
}
["sal","reg","rat","terc","dep"].forEach(id=>$(id).addEventListener("input",calc));
$("sal").addEventListener("blur",()=>{const b=lerSalario($("sal"));if(b>0)$("sal").value=b.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});});
calc();