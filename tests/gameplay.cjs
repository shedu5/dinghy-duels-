const vm=require('node:vm'), fs=require('node:fs'), assert=require('node:assert/strict');
const noop=()=>{};const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),createPattern:()=>({})},{get:(t,p)=>t[p]||noop,set:(t,p,v)=>(t[p]=v,true)});
const elements={};function el(){return {listeners:{},addEventListener(name,fn){(this.listeners[name]??=[]).push(fn)},emit(name,e){for(const fn of this.listeners[name]||[])fn(e)},getBoundingClientRect:()=>({left:0,top:0,width:132,height:132}),setPointerCapture:noop,hasPointerCapture:()=>true,releasePointerCapture:noop,style:{setProperty:noop},classList:{add:noop,remove:noop,toggle:noop},children:[],appendChild(v){this.children.push(v)},append:noop,querySelector:()=>el(),setAttribute:noop,getContext:()=>ctx,width:168,height:168,clientWidth:720,clientHeight:786,dataset:{},hidden:false,innerHTML:''};}
const document={getElementById:id=>elements[id]||=el(),createElement:el,createTextNode:t=>({textContent:t}),body:el(),addEventListener:noop};
const windowEvents={};const sandbox={document,window:{addEventListener:(name,fn)=>(windowEvents[name]??=[]).push(fn),devicePixelRatio:1,innerWidth:720,innerHeight:786},localStorage:{getItem:()=>null,setItem:noop},navigator:{},performance:{now:()=>0},setTimeout:noop,setInterval:noop,clearInterval:noop,clearTimeout:noop,requestAnimationFrame:noop,getComputedStyle:()=>({fontFamily:'sans-serif'}),console,Math,Uint8Array,Int32Array};
let source=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8').split('<script>')[1].split('</script>')[0];source=source.replace(/if \(window.claude && window.claude.hot && window.claude.hot.ready\)[\s\S]*?\}\)\(\);\s*$/,`globalThis.test={setupWorld,step,updateAdventure,updateShip,Input,controlPlayer,bind,updateBalls,shipCollisions,delta,bearing,resize,cam,wind,get balls(){return balls},toggleAnchor,damage,respawn,hitTentacle,totalScore,render,adventureHUD,endMatch,buildShareBar,get ships(){return ships},get treasure(){return treasure},get docks(){return docks},get kraken(){return kraken},get time(){return matchT},get state(){return state},get terr(){return terr},setTime(t){simTime=t},play(){state='play'}};})();`);
vm.createContext(sandbox);vm.runInContext(source,sandbox);const g=sandbox.test;
function setup(){g.setupWorld(true,0);g.buildShareBar();g.play();return g.ships[0]}
let s=setup();assert.equal(g.docks.length,5);assert.ok(g.treasure.length>=3);
let chest=g.treasure[0];s.x=chest.x;s.y=chest.y;g.updateAdventure(.01);assert.ok(s.cargo);assert.equal(s.gold,0);
s.x=s.home.x;s.y=s.home.y;g.updateAdventure(.01);assert.equal(s.gold,2);assert.equal(s.cargo,null);
s.cargo={value:4};s.gold=6;g.updateAdventure(.01);assert.equal(s.gold,8);assert.equal(s.cargo,null);
s.hp=40;s.sailLevel=0;s.speed=0;g.updateAdventure(1);assert.equal(s.hp,52);g.damage(s,11,g.ships[1]);g.updateAdventure(1);assert.equal(s.hp,41);
s=setup();s.cargo={value:4};g.damage(s,101,null);assert.ok(s.sunk);assert.equal(s.cargo,null);assert.ok(g.treasure.some(t=>t.value===4));g.respawn(s);assert.equal(s.hp,100);
s=setup();g.setTime(35);g.updateAdventure(.01);assert.equal(g.kraken.phase,'warning');s.x=1200;s.y=1200;const hp=s.hp;g.updateAdventure(4.99);assert.equal(s.hp,hp);g.updateAdventure(2.6);assert.equal(s.hp,hp-22);g.updateAdventure(.1);assert.equal(s.hp,hp-22);
const a=g.kraken.arms[0];for(let i=0;i<3;i++)assert.ok(g.hitTentacle({x:a.x,y:a.y}));assert.equal(a.hp,0);s.x=a.x;s.y=a.y;g.updateAdventure(5);assert.equal(s.hp,hp-22);g.updateAdventure(30);assert.equal(g.kraken.phase,'gone');
// Anchor brakes regardless of sail setting, holds against drift, repairs and releases.
s=setup();s.x=s.home.x;s.y=s.home.y;s.speed=100;s.hp=40;s.sailLevel=2;const sail=s.sailLevel;
g.toggleAnchor();assert.equal(s.anchored,true);assert.equal(s.sailLevel,sail);
for(let i=0;i<120;i++){g.updateShip(s,1/60);g.updateAdventure(1/60)}
assert.equal(s.speed,0);assert.ok(s.hp>40);assert.ok(s.repairing);
const x=s.x,y=s.y;g.updateShip(s,1);assert.equal(s.x,x);assert.equal(s.y,y);
g.toggleAnchor();assert.equal(s.anchored,false);assert.equal(s.sailLevel,sail);s.heading=0;g.updateShip(s,1/60);assert.ok(s.speed>0);
s.anchored=true;g.respawn(s);assert.equal(s.anchored,false);s.invuln=0;g.damage(s,101,null);g.toggleAnchor();assert.equal(s.anchored,false);
// Cross all four seams and a corner without losing speed, hull or cargo.
for(const edge of ['right','left','bottom','top','corner']) {
  s=setup();s.x=edge==='right'||edge==='corner'?2399:edge==='left'?1:1200;
  s.y=edge==='bottom'||edge==='corner'?2399:edge==='top'?1:1200;
  s.heading=edge==='left'?Math.PI:edge==='top'?-Math.PI/2:edge==='bottom'?Math.PI/2:edge==='corner'?Math.PI/4:0;
  g.wind.dir=s.heading-Math.PI/2;g.wind.vx=Math.cos(g.wind.dir);g.wind.vy=Math.sin(g.wind.dir);s.speed=120;s.sailSet=1;s.cargo={value:2};s.hp=73;
  g.updateShip(s,.1);
  assert.ok(s.x>=0&&s.x<2400&&s.y>=0&&s.y<2400);assert.equal(s.hp,73);assert.equal(s.cargo.value,2);assert.ok(s.speed>100);assert.equal(s.grounded,false);
  if(edge==='right'||edge==='corner')assert.ok(s.x<40);
  if(edge==='left')assert.ok(s.x>2360);
  if(edge==='bottom'||edge==='corner')assert.ok(s.y<40);
  if(edge==='top')assert.ok(s.y>2360);
}
// Territory paint and ownership queries cross both seams, including corners.
s=setup();g.terr.paint(1,1,28,s.owner,s.color);
assert.equal(g.terr.ownerAt(2398,2398),s.owner);assert.equal(g.terr.ownerAt(-2,-2),s.owner);
assert.equal(g.delta(2390),-10);assert.equal(g.delta(-2390),10);
assert.ok(Math.abs(g.bearing({x:2390,y:100},{x:10,y:100}))<1e-9);
// Cannonballs remain live and damage a ship on the far side of either seam.
for(const vertical of [false,true]) {
 s=setup();const enemy=g.ships[1];enemy.x=vertical?1200:5;enemy.y=vertical?5:1200;enemy.heading=0;enemy.invuln=0;
 g.balls.push({x:vertical?1200:2399,y:vertical?2399:1200,vx:vertical?0:430,vy:vertical?430:0,t:0,life:1,owner:s});g.updateBalls(.01);
 assert.equal(enemy.hp,89);assert.equal(g.balls.length,0);
}
// Camera takes the short route; map edges do not trigger bot obstacle avoidance.
s=setup();s.x=2;s.y=1200;s.speed=0;s.anchored=true;g.cam.x=2398;g.cam.y=1200;g.step(.01);assert.ok(Math.abs(g.delta(g.cam.x-2398))<10);
const bot=g.ships[1];bot.x=2390;bot.y=100;assert.equal(bot.brain.probe(0,150),false);
g.resize();for(const x of [1,2399])for(const y of [1,2399]){g.cam.x=x;g.cam.y=y;g.render(0);}
// Real pointer handlers: visible helm, direct heading, low-speed turn and multitouch isolation.
s=setup();s.x=1200;s.y=1200;s.heading=0;s.speed=0;s.sailLevel=0;
const input=g.Input;input.init(elements.game);g.bind('fireL',()=>input.fire[0]=true);g.bind('sailUp',()=>input.sailDelta=1);
const event=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',button:0,preventDefault:noop});
elements.wheel.emit('pointerdown',event(10,66,66));assert.equal(input.heading,null);
elements.wheel.emit('pointermove',event(10,66,24));assert.equal(input.heading,-Math.PI/2);
g.controlPlayer(1/60);assert.equal(s.rudder,-1);g.updateShip(s,1/60);assert.ok(s.heading<-.03);
// A second finger can fire or change sails without taking ownership of the helm.
elements.fireL.emit('pointerdown',event(20,300,700));elements.sailUp.emit('pointerdown',event(21,300,600));assert.equal(input.steerId,10);g.controlPlayer(1/60);assert.ok(g.balls.length>0);assert.equal(s.sailLevel,1);
elements.game.emit('pointerdown',event(22,100,100));assert.equal(input.steerId,10);
elements.wheel.emit('pointerup',event(20,66,24));assert.equal(input.steerId,10);
for(let i=0;i<90;i++){g.controlPlayer(1/60);g.updateShip(s,1/60)}assert.ok(Math.abs(s.heading+Math.PI/2)<.015,'Helm converges promptly without overshoot');
elements.wheel.emit('pointerup',event(10,66,24));g.controlPlayer(1/60);const held=s.heading;g.updateShip(s,1/60);assert.equal(s.heading,held);assert.equal(input.steerId,null);
// Water drag gets a floating origin and cancellation/focus loss cannot leave steering stuck.
elements.game.emit('pointerdown',event(30,200,200));assert.equal(input.heading,null);
elements.game.emit('pointermove',event(30,242,200));assert.equal(input.heading,0);
elements.game.emit('pointercancel',event(30,242,200));assert.equal(input.steerId,null);
elements.wheel.emit('pointerdown',event(40,108,66));elements.wheel.emit('lostpointercapture',event(40,108,66));assert.equal(input.steerId,null);
elements.wheel.emit('pointerdown',event(50,108,66));input.keys.KeyD=true;for(const fn of windowEvents.blur)fn();assert.equal(input.steerId,null);assert.equal(input.keyRudder(),0);
// Full-length simulated match: all bots participate, finite scores, clean end and restart.
s=setup();for(let i=0;i<9002;i++){g.step(1/60);if(i%120===0){g.render(i/60);g.adventureHUD(s);}}
assert.equal(g.state,'results');assert.equal(g.time,0);for(const o of g.ships){assert.ok(Number.isFinite(g.totalScore(o)));assert.ok(o.gold<=8);assert.ok(o.hp>=0&&o.hp<=100)}
console.log('Full match:',g.ships.map(s=>({name:s.name,gold:s.gold,score:g.totalScore(s).toFixed(1),hp:Math.round(s.hp)})));
s=setup();assert.equal(g.kraken,null);assert.equal(s.gold,0);assert.equal(s.cargo,null);
console.log('PASS: pickup/delivery/cap, cargo loss/respawn, repair/damage cooldown, warning/strike cadence/safe gaps/retreat, full match and restart');
