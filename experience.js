const canvas=document.querySelector('#precision-scene');
const host=document.querySelector('.hero-visual');
const toggle=document.querySelector('#scene-toggle');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let paused=motion.matches, visible=true, onScreen=true, renderer, scene, camera, group, frame=0, last=0, time=0, targetX=0,targetY=0;
function updateToggle(){toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Reanudar animación 3D':'Pausar animación 3D');toggle.innerHTML='<span aria-hidden="true">'+(paused?'▷':'Ⅱ')+'</span><span class="toggle-label">'+(paused?'Animar':'Pausar')+'</span>'}
updateToggle();
async function init(){
 try{
 const T=await import('./vendor/three.module.js');
 renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<600?1.3:1.7));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 scene=new T.Scene();camera=new T.PerspectiveCamera(35,1,.1,50);camera.position.set(0,.15,9.2);
 // Soft studio environment built locally; no remote HDR, textures or tracking.
 const studio=document.createElement('canvas');studio.width=1024;studio.height=512;
 const ctx=studio.getContext('2d');ctx.fillStyle='#aaa6b1';ctx.fillRect(0,0,1024,512);
 const grad=ctx.createLinearGradient(0,0,0,512);grad.addColorStop(0,'#faf8ff');grad.addColorStop(.45,'#beb9c5');grad.addColorStop(.65,'#5a5263');grad.addColorStop(1,'#e4dfec');ctx.fillStyle=grad;ctx.fillRect(0,0,1024,512);
 ctx.fillStyle='#ffffff';ctx.fillRect(120,30,140,280);ctx.fillRect(650,60,70,250);ctx.fillStyle='#edb8bf';ctx.fillRect(850,90,100,230);
 const texture=new T.CanvasTexture(studio);texture.mapping=T.EquirectangularReflectionMapping;
 const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromEquirectangular(texture);scene.environment=env.texture;texture.dispose();pmrem.dispose();
 const hemi=new T.HemisphereLight(0xffffff,0x6e476c,3);scene.add(hemi);
 const key=new T.DirectionalLight(0xffffff,4);key.position.set(-3,5,6);scene.add(key);
 const fill=new T.DirectionalLight(0xffbfc8,2);fill.position.set(4,-2,3);scene.add(fill);
 const chrome=new T.MeshStandardMaterial({color:0xd7d6df,metalness:.95,roughness:.19});
 const satin=new T.MeshStandardMaterial({color:0xaaa9b7,metalness:.88,roughness:.28});
 const red=new T.MeshPhysicalMaterial({color:0xc71935,metalness:.57,roughness:.2,clearcoat:1,clearcoatRoughness:.16});
 const dark=new T.MeshStandardMaterial({color:0x37313e,metalness:.78,roughness:.23});
 const glass=new T.MeshPhysicalMaterial({color:0xf8e4ed,metalness:0,roughness:.07,transmission:.55,thickness:.4,ior:1.48,transparent:true,opacity:.8,clearcoat:1});
 group=new T.Group();group.rotation.set(.4,-.45,-.2);scene.add(group);
 function torus(radius,tube,material,z){const mesh=new T.Mesh(new T.TorusGeometry(radius,tube,20,100),material);mesh.position.z=z;group.add(mesh);return mesh}
 const outer=torus(1.7,.135,chrome,-.25);torus(1.49,.05,dark,-.22);torus(1.45,.1,red,-.13);torus(1.08,.16,satin,.05);torus(.86,.045,chrome,.24);torus(.63,.11,red,.43);torus(.35,.09,chrome,.58);
 const face=new T.Mesh(new T.CylinderGeometry(.47,.47,.16,64),satin);face.rotation.x=Math.PI/2;face.position.z=.48;group.add(face);
 const center=new T.Mesh(new T.CylinderGeometry(.16,.16,.22,48),dark);center.rotation.x=Math.PI/2;center.position.z=.62;group.add(center);
 // Radial ribs make the sculpture read as mechanical precision rather than a generic orb.
 const ribs=new T.Group();group.add(ribs);
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const rib=new T.Mesh(new T.BoxGeometry(.11,.36,.15),i%3===0?chrome:satin);rib.position.set(Math.sin(a)*1.25,Math.cos(a)*1.25,-.04);rib.rotation.z=-a; ribs.add(rib)}
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const bolt=new T.Mesh(new T.CylinderGeometry(.075,.075,.08,6),chrome);bolt.rotation.x=Math.PI/2;bolt.position.set(Math.cos(a)*1.71,Math.sin(a)*1.71,-.08);group.add(bolt)}
 const halo=torus(2.03,.035,glass,-.7);halo.rotation.y=.1;
 const resize=()=>{const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderStatic()};
 new ResizeObserver(resize).observe(host);
 function renderStatic(){if(renderer&&scene&&camera)renderer.render(scene,camera)}
 function loop(now){
  frame=0;if(!visible||!onScreen||paused)return;
  const dt=Math.min((now-last)/1000||0,.04);last=now;time+=dt;
  group.rotation.x+=(.42+targetY*.18-group.rotation.x)*.045;
  group.rotation.y+=(-.42+targetX*.25-group.rotation.y)*.045;
  group.rotation.z=-.22+Math.sin(time*.22)*.13;
  group.position.y=Math.sin(time*.65)*.09;
  ribs.rotation.z=time*.035;halo.rotation.z=-time*.03;
  renderer.render(scene,camera);frame=requestAnimationFrame(loop);
 }
 function resume(){if(!frame&&!paused&&visible&&onScreen){last=performance.now();frame=requestAnimationFrame(loop)}}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0}
 toggle.addEventListener('click',()=>{paused=!paused;updateToggle();if(paused)stop();else resume()});
 motion.addEventListener('change',e=>{paused=e.matches;updateToggle();if(paused)stop();else resume()});
 document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)resume();else stop()});
 new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;if(onScreen)resume();else stop()},{threshold:.05}).observe(host);
 host.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=host.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*2;targetY=((e.clientY-r.top)/r.height-.5)*2});
 host.addEventListener('pointerleave',()=>{targetX=targetY=0});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stop();host.classList.remove('scene-ready');toggle.hidden=true});
 host.classList.add('scene-ready');host.dataset.renderer='three-webgl';resize();resume();
 window.addEventListener('pagehide',e=>{stop();if(!e.persisted){renderer.dispose();env.dispose()}});
 window.addEventListener('pageshow',e=>{if(e.persisted)resume()});
 }catch(error){host.dataset.renderer='fallback';toggle.hidden=true;console.info('RS: usando la composición estática; WebGL no está disponible.')}
}
init();
