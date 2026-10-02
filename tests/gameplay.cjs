const vm=require('node:vm'), fs=require('node:fs'), assert=require('node:assert/strict');
const noop=()=>{};const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),createPattern:()=>({})},{get:(t,p)=>t[p]||noop,set:(t,p,v)=>(t[p]=v,true)});
const elements={};function el(){return {listeners:{},addEventListener(name,fn){(this.listeners[name]??=[]).push(fn)},emit(name,e){for(const fn of this.listeners[name]||[])fn(e)},getBoundingClientRect:()=>({left:0,top:0,width:132,height:132}),setPointerCapture:noop,hasPointerCapture:()=>true,releasePointerCapture:noop,style:{setProperty:noop},classList:{add:noop,remove:noop,toggle:noop},children:[],appendChild(v){this.children.push(v)},append:noop,querySelector:()=>el(),setAttribute:noop,getContext:()=>ctx,width:168,height:168,clientWidth:720,clientHeight:786,dataset:{},hidden:false,innerHTML:''};}
const document={getElementById:id=>elements[id]||=el(),createElement:el,createTextNode:t=>({textContent:t}),body:el(),addEventListener:noop};
const saved=new Map();const windowEvents={};const sandbox={document,window:{addEventListener:(name,fn)=>(windowEvents[name]??=[]).push(fn),devicePixelRatio:1,innerWidth:720,innerHeight:786},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},navigator:{},performance:{now:()=>0},setTimeout:noop,setInterval:noop,clearInterval:noop,clearTimeout:noop,requestAnimationFrame:noop,getComputedStyle:()=>({fontFamily:'sans-serif'}),console,Math,Uint8Array,Int32Array};
let source=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8').split('<script>')[1].split('</script>')[0];source=source.replace(/if \(window.claude && window.claude.hot && window.claude.hot.ready\)[\s\S]*?\}\)\(\);\s*$/,`globalThis.test={globePoint,globeOffset,crossPole,CHANNELS,dist,updateBalls,beginRound,LEVELS,seaAt,seaLine,geo,landAt,updateCampaign,chooseUpgrade,continueVoyage,FireControl,installTouchGuard,Input,controlPlayer,firePlayer,updateAdventure,updateShip,damage,step,render,endMatch,resize,wind,cam,delta,refreshVoyage,toMenu,boot,get voyage(){return voyage},get mission(){return mission},get ships(){return ships},get treasure(){return treasure},get balls(){return balls},get state(){return state},get terr(){return terr},get time(){return matchT},setTime(t){simTime=t}};})();`);
vm.createContext(sandbox);vm.runInContext(source,sandbox);const g=sandbox.test;

g.boot({});
function start(i=0){g.beginRound('campaign',i);return g.ships[0]}
for(let i=0;i<10;i++){
 const s=start(i),m=g.mission;
 assert.equal(g.state,'play');assert.equal(m.index,i);
 for(const ship of g.ships)assert.ok(g.seaAt(ship,25),`Level ${i+1} ship spawn is sea`);
 for(const chest of g.treasure)assert.ok(g.seaAt(chest,60));
 let prev=m.center;for(const p of m.route){assert.ok(g.seaLine(prev,p,30));prev=p;}
 assert.ok(g.treasure.filter(t=>t.arctic).length>=6);g.resize();g.render(0);g.step(1/60);
}
assert.ok(g.landAt(...Object.values(g.geo(20,20))));assert.ok(!g.landAt(...Object.values(g.geo(-140,0))));
let s=start();const chest=g.treasure[0];s.x=chest.x+90;s.y=chest.y;g.updateAdventure(.01);assert.equal(s.cargo,null);
s.x=chest.x+70;g.updateAdventure(.01);assert.ok(s.cargo);assert.ok(g.treasure.length>=6);
s.hp=30;s.speed=100;s.x=s.home.x;s.y=s.home.y;const bank=g.voyage.treasure;g.updateAdventure(.01);assert.equal(s.hp,100);assert.equal(s.speed,100);assert.equal(s.cargo,null);assert.equal(g.voyage.treasure,bank+2);
s=start();s.cargo={value:4};s.invuln=0;g.damage(s,101,null);assert.ok(g.treasure.some(t=>t.value===4));g.updateCampaign(.01);assert.equal(g.state,'results');g.continueVoyage();assert.equal(g.mission.index,0);
// The first level is an untimed, enemy-free tutorial with guided completion.
s=start();assert.equal(g.ships.length,1);g.step(240);assert.equal(g.state,'play');assert.equal(g.time,0);
s=start();let training=g.mission.trainingChest;assert.ok(g.dist(s.x,s.y,training.x,training.y)>220);s.x=training.x;s.y=training.y;g.updateAdventure(.01);g.updateCampaign(.01);assert.equal(g.mission.tutorialStep,1);
s.x=s.home.x;s.y=s.home.y;g.updateAdventure(.01);g.updateCampaign(.01);assert.equal(g.mission.tutorialStep,2);s.anchored=true;g.updateCampaign(.01);assert.equal(g.mission.tutorialStep,3);g.firePlayer();g.updateCampaign(.01);assert.equal(g.state,'results');assert.equal(g.voyage.next,1);assert.ok(g.voyage.pendingBonus);g.continueVoyage();assert.equal(g.time,60);
// Flagship missions still complete normally.
s=start(4);g.mission.flagship.invuln=0;g.damage(g.mission.flagship,1000,s);g.updateCampaign(.01);assert.equal(g.state,'results');
// Capture demands correct order AND anchoring.
s=start(1);let m=g.mission;s.x=m.flags[1].x;s.y=m.flags[1].y;s.anchored=true;g.updateCampaign(5);assert.equal(m.progress,0);
s.x=m.flags[0].x;s.y=m.flags[0].y;s.anchored=false;g.updateCampaign(5);assert.equal(m.progress,0);
for(const f of m.flags){s.x=f.x;s.y=f.y;s.anchored=true;g.updateCampaign(m.level.hold+.01)}assert.equal(g.state,'results');
// Escort waits for the player, follows a clear route and can be lost.
s=start(2);m=g.mission;s.x=m.merchant.x+600;let mx=m.merchant.x;g.updateCampaign(1);assert.equal(m.merchant.x,mx);
for(let i=0;i<1000&&g.state==='play';i++){s.x=m.merchant.x;s.y=m.merchant.y;g.updateCampaign(.05)}assert.equal(g.state,'results');assert.equal(m.waypoint,m.route.length);
s=start(2);g.mission.merchant.invuln=0;g.damage(g.mission.merchant,1000,null);g.updateCampaign(.01);assert.equal(elements.resulttitle.textContent,'TRY AGAIN');
// Storm warning permits escape, strike damages once; only surviving its timer wins.
s=start(3);s.invuln=0;for(let i=0;i<41;i++)g.updateCampaign(.1);assert.equal(g.mission.storms.length,1);assert.equal(s.hp,100);for(let i=0;i<20;i++)g.updateCampaign(.1);assert.equal(s.hp,78);g.updateCampaign(.1);assert.equal(s.hp,78);
s=start(3);s.invuln=0;for(let i=0;i<41;i++)g.updateCampaign(.1);s.x+=200;for(let i=0;i<20;i++)g.updateCampaign(.1);assert.equal(s.hp,100);
s=start(3);g.endMatch();assert.equal(elements.resulttitle.textContent,'LEVEL COMPLETE');s=start(4);g.endMatch();assert.equal(elements.resulttitle.textContent,'TRY AGAIN');
// Boss armor alternates and blocks damage only while closed.
s=start(9);m=g.mission;m.flagship.invuln=0;g.setTime(0);g.updateCampaign(.01);g.damage(m.flagship,11,s);assert.equal(m.flagship.hp,360);g.setTime(4);g.updateCampaign(.01);g.damage(m.flagship,11,s);assert.equal(m.flagship.hp,349);
// Held fire has a short cadence and independent pointer capture.
s=start();const event=(id,x=66,y=66)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',button:0,preventDefault:noop});
elements.wheel.emit('pointerdown',event(10));elements.wheel.emit('pointermove',event(10,66,24));assert.equal(g.Input.heading,-Math.PI/2);
elements.fire.emit('pointerdown',event(20));assert.equal(g.balls.length,10);elements.fire.emit('pointerdown',event(21));assert.equal(g.balls.length,10);assert.equal(g.Input.steerId,10);
g.setTime(.25);g.controlPlayer(.01);assert.equal(g.balls.length,20);elements.fire.emit('pointercancel',event(20));g.setTime(.5);g.controlPlayer(.01);assert.equal(g.balls.length,20);g.Input.reset();assert.equal(g.Input.steerId,null);
for(const type of ['touchstart','touchmove','touchend','gesturestart','gesturechange','dblclick']){let prevented=false;elements.app.emit(type,{cancelable:true,preventDefault(){prevented=true}});assert.ok(prevented,type)}
g.toMenu();let prevented=false;elements.app.emit('touchmove',{cancelable:true,preventDefault(){prevented=true}});assert.equal(prevented,false);
// Bonus rewards once, applies a permanent upgrade, persists and continues.
g.voyage.credits=0;g.beginRound('bonus');s=g.ships[0];g.terr.counts[s.owner]=Math.ceil(g.terr.water*.051);g.endMatch();assert.equal(g.voyage.credits,1);g.endMatch();assert.equal(g.voyage.credits,1);
g.chooseUpgrade('hull');assert.equal(g.voyage.upgrades.hull,1);assert.equal(g.voyage.credits,0);g.chooseUpgrade('hull');assert.equal(g.voyage.upgrades.hull,1);
assert.ok([...saved.values()].some(v=>String(v).includes('"hull":1')));s=start();assert.equal(s.maxHp,120);s.hp=20;s.x=s.home.x;s.y=s.home.y;g.updateAdventure(.01);assert.equal(s.hp,120);
g.beginRound('bonus');for(let i=0;i<3602&&g.state==='play';i++)g.step(1/60);assert.equal(g.state,'results');assert.equal(g.time,0);
// Northern straits fit the entire hull all along each widened passage, including the date line.
for(const {a,b} of g.CHANNELS)for(let t=0;t<=1;t+=.02){const p=g.globePoint(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t);assert.ok(g.seaAt(p,32),'Navigable channel clearance');}
s=start();for(const chest of g.treasure.filter(t=>t.arctic)){assert.ok(chest.y<320,'Treasure remains in Arctic latitudes');assert.ok(g.seaAt(chest,32));}
// Pole crossing reflects latitude and shifts longitude 180 degrees instead of teleporting to Antarctica.
let p=g.globePoint(300,-10);assert.equal(p.x,1500);assert.equal(p.y,10);assert.ok(p.flip);p=g.globePoint(300,2410);assert.equal(p.x,1500);assert.equal(p.y,2390);
assert.equal(g.dist(300,5,1500,5),10);assert.equal(g.dist(2395,400,5,400),10);assert.ok(g.dist(300,5,300,2395)>1000);
s=start();s.x=300;s.y=1;s.heading=-Math.PI/2;s.speed=120;s.sailSet=1;g.wind.dir=0;g.wind.vx=1;g.wind.vy=0;g.updateShip(s,.1);assert.ok(s.y<20&&s.x>1400);assert.ok(s.heading>0);assert.equal(s.grounded,false);
g.cam.x=s.x;g.cam.y=1;g.render(0);
// Cannonballs follow the same pole crossing and can hit on the opposite meridian.
s=start(4);const foe=g.ships[1];s.x=300;s.y=1;foe.x=1500;foe.y=8;foe.heading=0;foe.invuln=0;const hp=foe.hp;g.balls.push({x:300,y:1,vx:0,vy:-430,t:0,life:1,owner:s});g.updateBalls(.02);assert.equal(foe.hp,hp-11);
// Paint ownership agrees across the same polar seam.
g.beginRound('bonus');s=g.ships[0];g.terr.paint(300,1,28,s.owner,s.color);assert.equal(g.terr.ownerAt(1500,5),s.owner);
// Two slots collect nearby boxes, leave a third, bank together and drop separately.
s=start();s.x=1200;s.y=100;g.treasure.length=0;
g.treasure.push({x:s.x,y:s.y,value:2,readyAt:0},{x:s.x,y:s.y,value:4,readyAt:0},{x:s.x,y:s.y,value:2,readyAt:0});
g.updateAdventure(.01);assert.equal(s.cargo.boxes.length,2);assert.equal(s.cargo.value,6);assert.equal(g.treasure.length,1);g.updateAdventure(.01);assert.equal(g.treasure.length,1);
const beforeBank=g.voyage.treasure;s.x=s.home.x;s.y=s.home.y;g.updateAdventure(.01);assert.equal(s.gold,6);assert.equal(s.deliveries,2);assert.equal(s.cargo,null);assert.equal(g.voyage.treasure,beforeBank+6);
s=start();s.x=1200;s.y=100;g.treasure.length=0;g.treasure.push({x:s.x,y:s.y,value:2,readyAt:0},{x:s.x,y:s.y,value:4,readyAt:0});g.updateAdventure(.01);s.invuln=0;g.damage(s,999,null);assert.equal(s.cargo,null);assert.deepEqual(Array.from(g.treasure,t=>t.value).sort(),[2,4]);assert.ok(g.treasure.every(t=>t.readyAt===1));
// Full simulation catches invalid actor state across all mission types.
for(let level=1;level<10;level++){s=start(level);for(let frame=0;frame<12000&&g.state==='play';frame++){g.step(1/60);if(frame%600===0)g.render(frame/60)}assert.equal(g.state,'results');for(const ship of g.ships){assert.ok(Number.isFinite(ship.x)&&Number.isFinite(ship.hp));assert.ok(ship.hp>=0&&ship.hp<=ship.maxHp)}}
console.log('PASS: two-box pickup/capacity/banking/separate drops, enemy-free tutorial, Arctic treasure, navigable straits, pole/date-line crossing, ten mission setups and full simulations, Earth routes, treasure circle and banking, drive-through repair, objective success/failure, boss armor, held fire, multitouch and zoom guards');
