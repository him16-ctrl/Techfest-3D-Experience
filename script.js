// TECHFEST immersive 3D experience
const canvas = document.querySelector('#space');
let scene, camera, renderer, core, particles, mouseX = 0, mouseY = 0;
function initThree(){
  if(!window.THREE || !canvas) return;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, .1, 100);
  camera.position.set(0,0,9);
  renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth,window.innerHeight);
  const geometry = new THREE.IcosahedronGeometry(1.75,2);
  const material = new THREE.MeshStandardMaterial({color:0x56e9e1,metalness:.72,roughness:.22,wireframe:true,emissive:0x153e70,emissiveIntensity:.65});
  core = new THREE.Mesh(geometry,material); core.position.set(2.3,.1,-1.4); scene.add(core);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35,3),new THREE.MeshStandardMaterial({color:0x293b83,metalness:.9,roughness:.18,emissive:0x263d9c,emissiveIntensity:.45}));
  inner.position.copy(core.position); scene.add(inner); core.userData.inner=inner;
  const ringMat = new THREE.MeshBasicMaterial({color:0x54f1e4,transparent:true,opacity:.65});
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.25,.009,8,180),ringMat); ring.position.copy(core.position); ring.rotation.set(1.1,.35,.4); scene.add(ring); core.userData.ring=ring;
  const count=950, positions=new Float32Array(count*3);
  for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*25;positions[i*3+1]=(Math.random()-.5)*15;positions[i*3+2]=(Math.random()-.5)*18-2;}
  const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x8cafff,size:.018,transparent:true,opacity:.8}));scene.add(particles);
  scene.add(new THREE.AmbientLight(0x9bbcff,1.1));
  const light=new THREE.PointLight(0x54f1e4,5,20);light.position.set(2,3,4);scene.add(light);
  const violet=new THREE.PointLight(0x8c68ff,4,18);violet.position.set(-3,-2,2);scene.add(violet);
  window.addEventListener('pointermove',e=>{mouseX=(e.clientX/window.innerWidth-.5)*2;mouseY=(e.clientY/window.innerHeight-.5)*2;});
  window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
  const clock=new THREE.Clock();
  function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();core.rotation.x=t*.12+mouseY*.12;core.rotation.y=t*.18+mouseX*.18;core.userData.inner.rotation.y=-t*.13;core.userData.ring.rotation.z=t*.08;particles.rotation.y=t*.008;camera.position.x+=(mouseX*.28-camera.position.x)*.025;camera.position.y+=(-mouseY*.2-camera.position.y)*.025;camera.lookAt(0,0,0);renderer.render(scene,camera);}
  animate();
}
initThree();

// Scroll-driven motion and reveal transitions
if(window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-copy > *',{y:35,opacity:0,duration:1,stagger:.12,ease:'power3.out',delay:.15});
  gsap.to('.hero-copy',{y:-100,opacity:.2,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.from('.experience-copy',{x:-60,opacity:0,duration:1,scrollTrigger:{trigger:'.experience',start:'top 72%'}});
  gsap.from('.core-wrap',{scale:.72,opacity:0,duration:1.2,ease:'back.out(1.4)',scrollTrigger:{trigger:'.core-wrap',start:'top 80%'}});
  gsap.from('.event-card',{y:70,opacity:0,duration:.8,stagger:.18,ease:'power3.out',scrollTrigger:{trigger:'.event-grid',start:'top 78%'}});
  gsap.from('.manifesto-inner > *',{y:45,opacity:0,duration:.8,stagger:.12,scrollTrigger:{trigger:'.manifesto',start:'top 72%'}});
  gsap.from('.register-panel',{scale:.94,opacity:0,duration:1,scrollTrigger:{trigger:'.register',start:'top 80%'}});
}

// Interactive 3D-inspired core responds to pointer movement
const coreWrap=document.querySelector('.core-wrap');
if(coreWrap){coreWrap.addEventListener('pointermove',e=>{const r=coreWrap.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;coreWrap.style.transform=`perspective(900px) rotateY(${x*13}deg) rotateX(${-y*13}deg)`;});coreWrap.addEventListener('pointerleave',()=>coreWrap.style.transform='');}

// Mobile navigation toggle
const menu=document.querySelector('.menu-toggle');
if(menu){menu.addEventListener('click',()=>{const nav=document.querySelector('nav');const open=nav.style.display==='flex';nav.style.display=open?'none':'flex';if(!open){nav.style.position='absolute';nav.style.top='70px';nav.style.left='0';nav.style.right='0';nav.style.padding='25px';nav.style.background='#0b1020';nav.style.flexDirection='column';nav.style.alignItems='center';}});}
