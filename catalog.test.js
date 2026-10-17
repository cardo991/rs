import test from 'node:test';
import assert from 'node:assert/strict';
import {products,normalizeCart,buildMessage,totalUnits} from './catalog.js';
test('el pedido conserva SKU válidos y limita cantidades corruptas',()=>{
 assert.deepEqual(normalizeCart({'1002':3.8,'1474':2000,'no-existe':10,'1436':-3,'1468':'abc'}),{'1002':3,'1474':999});
 for(const value of [null,[],false,'text'])assert.deepEqual(normalizeCart(value),{});
});
test('el mensaje incluye cada SKU y su cantidad sin duplicarlos',()=>{
 const text=buildMessage({'1002':4,'1474':2},{name:'Repuestos Sur',note:'Para retirar'});
 assert.match(text,/SKU 1002.*Cantidad: 4/);
 assert.match(text,/SKU 1474.*Cantidad: 2/);
 assert.match(text,/2 SKU \/ 6 unidades/);
 assert.match(text,/Repuestos Sur/);
 assert.match(text,/Para retirar/);
 assert.equal((text.match(/SKU 1002/g)||[]).length,1);
 assert.equal(totalUnits({'1002':4,'1474':2}),6);
 assert.equal(decodeURIComponent(encodeURIComponent(text)),text);
});
test('un pedido vacío no genera una consulta accidental',()=>assert.equal(buildMessage({}),''));
test('todos los productos tienen SKU único e imagen',()=>{
 assert.equal(new Set(products.map(p=>p.sku)).size,products.length);
 products.forEach(p=>assert.ok(p.sku&&p.image&&p.name));
});
