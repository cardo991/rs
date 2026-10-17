export const products=[
{sku:'1002',name:'Depósito de expansión',category:'Depósitos de expansión',description:'Línea refrigeración',image:'deposito-1002.png'},
{sku:'1474',name:'Tapa de depósito legítima',category:'Tapas',description:'Línea tapas de expansión',image:'tapa.png'},
{sku:'1214',name:'Depósito de expansión',category:'Depósitos de expansión',description:'Línea refrigeración',image:'deposito-1214.png'},
{sku:'1436',name:'Tapa de aceite',category:'Tapas',description:'Línea lubricación',image:'aceite.png'},
{sku:'1004',name:'Depósito de expansión',category:'Depósitos de expansión',description:'Línea refrigeración',image:'deposito-1004.png'},
{sku:'1468',name:'Tapa metálica de depósito',category:'Tapas',description:'Línea tapas de expansión',image:'tapa-1468.png'},
{sku:'1003',name:'Depósito de expansión',category:'Depósitos de expansión',description:'Línea refrigeración',image:'deposito-1003.png'},
{sku:'1045',name:'Tapa de cadena de distribución',category:'Tapas',description:'Código 1045 · versión 128',image:'cadena.png'},
{sku:'1064',name:'Tapa de cadena de distribución',category:'Tapas',description:'Código 1064 · versión 147',image:'cadena.png'},
{sku:'1144',name:'Portabicicletas',category:'Accesorios',description:'Línea accesorios del automotor',image:'portabici.png'}
];
export function normalizeCart(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return {};
 return Object.fromEntries(products.flatMap(p=>{const n=Number(value[p.sku]);return Number.isFinite(n)&&n>=1?[[p.sku,Math.min(999,Math.floor(n))]]:[]}));
}
export function totalUnits(cart){return Object.values(normalizeCart(cart)).reduce((a,b)=>a+b,0)}
export function buildMessage(cart,{name='',note=''}={}){
 const valid=normalizeCart(cart),selected=products.filter(p=>valid[p.sku]);
 if(!selected.length)return '';
 const lines=['Hola RS Autopartes, quisiera consultar precio y disponibilidad de este pedido:',''];
 if(name.trim())lines.push('Nombre / empresa: '+name.trim(),'');
 for(const p of selected)lines.push('• SKU '+p.sku+' | '+p.name+' | Cantidad: '+valid[p.sku]);
 lines.push('','Total: '+selected.length+' SKU / '+totalUnits(valid)+' unidades.');
 if(note.trim())lines.push('','Consulta: '+note.trim());
 lines.push('','Quedo a la espera de la confirmación de precio, stock y compatibilidad. ¡Gracias!');
 return lines.join('\n');
}
