import {products, buildMessage, normalizeCart, totalUnits} from './catalog.js';
const $=s=>document.querySelector(s);
const STORAGE='rs-pedido-v1',CONTACT='rs-contacto-v1',WHATSAPP='5491126647681';
let cart={},contact={name:'',note:''},category='Todos',query='',sort='featured',lastOrderFocus=null,toastTimer;
try{cart=normalizeCart(JSON.parse(localStorage.getItem(STORAGE)||'{}'));contact={...contact,...JSON.parse(localStorage.getItem(CONTACT)||'{}')}}catch{cart={}}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600)}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(cart));localStorage.setItem(CONTACT,JSON.stringify(contact))}catch{toast('El navegador no permite guardar. La lista durará mientras esta página siga abierta.')}}
function save(){persist();updateCounters();renderProducts();renderOrder()}
function updateCounters(){const n=totalUnits(cart);$('#order-count').textContent=n;$('#floating-count').textContent=n}
const categories=['Todos','Depósitos de expansión','Tapas','Accesorios'];
function renderCategories(){$('#category-list').innerHTML=categories.map(c=>'<button class="category '+(c===category?'active':'')+'" data-category="'+c+'" aria-pressed="'+(c===category)+'"><span>'+c+'</span><b>'+products.filter(p=>c==='Todos'||p.category===c).length+'</b></button>').join('')}
const normalized=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function renderProducts(){
 let found=products.filter(p=>(category==='Todos'||p.category===category)&&normalized(p.name+' '+p.sku+' '+p.description+' '+p.category).includes(normalized(query.trim())));
 if(sort==='sku')found.sort((a,b)=>a.sku.localeCompare(b.sku,undefined,{numeric:true}));
 if(sort==='name')found.sort((a,b)=>a.name.localeCompare(b.name,'es'));
 $('#results-count').textContent=found.length+' producto'+(found.length!==1?'s':'');
 $('#no-results').hidden=found.length>0;
 $('#product-grid').innerHTML=found.map(p=>'<article class="product-card '+(cart[p.sku]?'selected':'')+'"><button class="product-picture" data-detail="'+p.sku+'" aria-label="Ver detalle de '+p.name+', SKU '+p.sku+'"><span class="category-tag">'+p.category+'</span><img src="assets/'+p.image+'" alt="'+p.name+'" loading="lazy" width="250" height="190"></button><div class="product-body"><span class="sku">SKU / '+p.sku+'</span><h3>'+p.name+'</h3><p>'+p.description+'</p><button class="product-add" data-add="'+p.sku+'" aria-label="Agregar '+p.name+', SKU '+p.sku+' al pedido"><span>'+(cart[p.sku]?'Agregado · sumar otra':'Agregar al pedido')+'</span><span>'+(cart[p.sku]?cart[p.sku]:'+')+'</span></button></div></article>').join('');
}
function add(sku){const p=products.find(p=>p.sku===sku);if(!p)return;if((cart[sku]||0)>=999){toast('Máximo de 999 unidades por producto.');return}cart[sku]=(cart[sku]||0)+1;save();toast('SKU '+sku+' agregado a tu pedido')}
function renderOrder(){
 const selected=products.filter(p=>cart[p.sku]);
 $('#order-bottom').hidden=!selected.length;
 if(!selected.length){$('#order-items').innerHTML='<div class="empty-order"><span>＋</span><h3>Tu próximo pedido empieza acá.</h3><p>Elegí las piezas que necesitás y sumalas a tu lista.</p><button class="button dark-button" id="browse-products">Explorar productos ↗</button></div>';return}
 $('#order-items').innerHTML=selected.map(p=>'<article class="order-row"><img src="assets/'+p.image+'" alt="'+p.name+'"><div><span class="sku">SKU / '+p.sku+'</span><h3>'+p.name+'</h3><div class="quantity"><button data-qty="'+p.sku+'" data-delta="-1" aria-label="Restar una unidad de SKU '+p.sku+'" '+(cart[p.sku]<=1?'disabled':'')+'>−</button><input type="number" min="1" max="999" step="1" value="'+cart[p.sku]+'" data-quantity="'+p.sku+'" aria-label="Cantidad de SKU '+p.sku+'"><button data-qty="'+p.sku+'" data-delta="1" aria-label="Sumar una unidad de SKU '+p.sku+'" '+(cart[p.sku]>=999?'disabled':'')+'>+</button></div></div><button class="remove-item" data-remove="'+p.sku+'" aria-label="Quitar SKU '+p.sku+'">×</button></article>').join('');
 $('#order-summary').textContent=selected.length+' SKU · '+totalUnits(cart)+' unidades';
}
function openOrder(){lastOrderFocus=document.activeElement;$('#order-dialog').showModal();document.body.classList.add('modal-open')}
function closeOrder(){$('#order-dialog').close()}
function detail(sku){const p=products.find(p=>p.sku===sku);if(!p)return;$('#product-detail').innerHTML='<div class="detail-layout"><div class="detail-image"><img src="assets/'+p.image+'" alt="'+p.name+'"></div><div class="detail-copy"><span class="sku">SKU / '+p.sku+'</span><h2 id="product-title">'+p.name+'</h2><p>'+p.description+'. Fabricado por RS Autopartes.</p><p>Consultá precio, disponibilidad y compatibilidad antes de confirmar tu pedido.</p><button class="button red" data-add="'+p.sku+'">Agregar al pedido <span>+</span></button><a class="small-link" target="_blank" rel="noopener" href="https://rsautopartes.com.ar/catalogo/catalogo_2026.pdf">Ver catálogo original ↗</a></div></div>';$('#product-dialog').showModal();document.body.classList.add('modal-open')}
document.addEventListener('click',e=>{
 const addButton=e.target.closest('[data-add]');if(addButton)add(addButton.dataset.add);
 const detailButton=e.target.closest('[data-detail]');if(detailButton)detail(detailButton.dataset.detail);
 const cat=e.target.closest('[data-category]');if(cat){category=cat.dataset.category;renderCategories();renderProducts()}
 if(e.target.closest('[data-open-order]'))openOrder();
 const qty=e.target.closest('[data-qty]');if(qty){cart[qty.dataset.qty]=Math.min(999,Math.max(1,cart[qty.dataset.qty]+Number(qty.dataset.delta)));save()}
 const remove=e.target.closest('[data-remove]');if(remove){delete cart[remove.dataset.remove];save();toast('Producto quitado del pedido')}
 if(e.target.closest('#browse-products')){closeOrder();$('#catalogo').scrollIntoView()}
});
$('#product-search').addEventListener('input',e=>{query=e.target.value;renderProducts()});
$('#sort').addEventListener('change',e=>{sort=e.target.value;renderProducts()});
$('#clear-search').addEventListener('click',()=>{query='';category='Todos';$('#product-search').value='';renderCategories();renderProducts()});
$('#close-order').addEventListener('click',closeOrder);
$('#close-product').addEventListener('click',()=>$('#product-dialog').close());
for(const dialog of document.querySelectorAll('dialog')){
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');if(dialog.id==='order-dialog')lastOrderFocus?.focus()});
}
$('#order-items').addEventListener('change',e=>{if(!e.target.matches('[data-quantity]'))return;const sku=e.target.dataset.quantity;cart[sku]=Math.min(999,Math.max(1,Math.trunc(Number(e.target.value))||1));save()});
$('#clear-order').addEventListener('click',()=>{if(confirm('¿Querés quitar todos los productos de tu lista?')){cart={};save();toast('Lista vaciada')}});
$('#customer').value=typeof contact.name==='string'?contact.name:'';
$('#order-note').value=typeof contact.note==='string'?contact.note:'';
for(const selector of ['#customer','#order-note'])$(selector).addEventListener('input',()=>{contact={name:$('#customer').value,note:$('#order-note').value};persist()});
$('#send-whatsapp').addEventListener('click',()=>{if(!Object.keys(cart).length)return;const msg=buildMessage(cart,{name:$('#customer').value,note:$('#order-note').value});window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')});
const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});
$('#navigation').addEventListener('click',e=>{if(e.target.closest('a')){$('#navigation').classList.remove('open');menu.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('#product-search').focus()}});
window.addEventListener('storage',e=>{if(e.key===STORAGE){try{cart=normalizeCart(JSON.parse(e.newValue||'{}'));updateCounters();renderProducts();renderOrder()}catch{}}});
$('#year').textContent=new Date().getFullYear();
renderCategories();renderProducts();renderOrder();updateCounters();
