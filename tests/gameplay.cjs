const vm=require('node:vm'), fs=require('node:fs'), assert=require('node:assert/strict');
const noop=()=>{};const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),createPattern:()=>({})},{get:(t,p)=>t[p]||noop,set:(t,p,v)=>(t[p]=v,true)});
const elements={};function el(){return {style:{setProperty:noop},classList:{add:noop,remove:noop,toggle:noop},children:[],appendChild(v){this.children.push(v)},append:noop,querySelector:()=>el(),setAttribute:noop,addEventListener:noop,getContext:()=>ctx,width:168,height:168,clientWidth:720,clientHeight:786,dataset:{},hidden:false,innerHTML:''};}
const document={getElementById:id=>elements[id]||=el(),createElement:el,createTextNode:t=>({textContent:t}),body:el(),addEventListener:noop};
const sandbox={document,window:{addEventListener:noop,devicePixelRatio:1,innerWidth:720,innerHeight:786},localStorage:{getItem:()=>null,setItem:noop},navigator:{},performance:{now:()=>0},setTimeout:noop,setInterval:noop,clearInterval:noop,clearTimeout:noop,requestAnimationFrame:noop,getComputedStyle:()=>({fontFamily:'sans-serif'}),console,Math,Uint8Array,Int32Array};
let source=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8').split('<script>')[1].split('</script>')[0];source=source.replace(/if \(window.claude && window.claude.hot && window.claude.hot.ready\)[\s\S]*?\}\)\(\);\s*$/,`globalThis.test={setupWorld,step,updateAdventure,updateShip,toggleAnchor,damage,respawn,hitTentacle,totalScore,render,adventureHUD,endMatch,buildShareBar,get ships(){return ships},get treasure(){return treasure},get docks(){return docks},get kraken(){return kraken},get time(){return matchT},get state(){return state},get terr(){return terr},setTime(t){simTime=t},play(){state='play'}};})();`);
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
// Full-length simulated match: all bots participate, finite scores, clean end and restart.
s=setup();for(let i=0;i<9002;i++){g.step(1/60);if(i%120===0){g.render(i/60);g.adventureHUD(s);}}
assert.equal(g.state,'results');assert.equal(g.time,0);for(const o of g.ships){assert.ok(Number.isFinite(g.totalScore(o)));assert.ok(o.gold<=8);assert.ok(o.hp>=0&&o.hp<=100)}
console.log('Full match:',g.ships.map(s=>({name:s.name,gold:s.gold,score:g.totalScore(s).toFixed(1),hp:Math.round(s.hp)})));
s=setup();assert.equal(g.kraken,null);assert.equal(s.gold,0);assert.equal(s.cargo,null);
console.log('PASS: pickup/delivery/cap, cargo loss/respawn, repair/damage cooldown, warning/strike cadence/safe gaps/retreat, full match and restart');
