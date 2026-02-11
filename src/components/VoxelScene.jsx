import { useRef, useEffect } from 'react'
import * as THREE from 'three'

// Shared helpers
function mat(color, emissive = false) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: emissive ? 0.3 : 0.6,
    metalness: emissive ? 0.1 : 0.05,
    ...(emissive ? { emissive: color, emissiveIntensity: 0.15 } : {})
  })
}

const BLACK = 0x171717
const RED = 0xDC2626
const GRAY = 0xD4D4D4
const MUTED = 0x737373

const blackMat = mat(BLACK)
const redMat = mat(RED, true)
const grayMat = mat(GRAY)
const mutedMat = mat(MUTED)

// ============================================================
// SCENE BUILDERS — each returns { scene, camera, animate(t) }
// ============================================================

function buildScene1_Builder() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 500)
  camera.position.set(0, 28, 50)
  camera.lookAt(0, 6, 0)

  const vGeo = new THREE.BoxGeometry(1, 1, 1)
  const island = new THREE.Group()

  // 3-color palette: dark, red, light
  const darkMat = mat(0x222222)
  const lightMat = mat(0xD4D4D4)
  const accentMat = mat(RED, true)
  const waterMat = new THREE.MeshStandardMaterial({color:0xD4D4D4, transparent:true, opacity:0.5, roughness:0.1})

  // Island terrain — floating cone shape
  const R = 10
  for(let x=-R;x<=R;x++) for(let z=-R;z<=R;z++){
    const d = Math.sqrt(x*x + z*z)
    if(d > R-1) continue
    const surfH = Math.floor(Math.sin(x*0.3)*Math.cos(z*0.3)*1.5)
    const isRiver = x>=1 && x<=3 && z>-2
    if(!isRiver){
      const m = new THREE.Mesh(vGeo, lightMat)
      m.position.set(x, surfH, z); m.castShadow=true; island.add(m)
    }
    const depth = Math.max(2, Math.floor((R-d)*0.9) + Math.floor(Math.sin(x*0.5+z*0.3)*2))
    for(let y=1;y<=depth;y++){
      const m = new THREE.Mesh(vGeo, darkMat)
      m.position.set(x, surfH-y, z); island.add(m)
    }
    if(isRiver){
      const m = new THREE.Mesh(vGeo, darkMat)
      m.position.set(x, surfH-1, z); island.add(m)
    }
  }

  // Tree — dark trunk + red canopy
  const treeX=-3, treeZ=-3, treeH=12
  for(let y=0;y<treeH;y++){
    const offX = Math.sin(y*0.3)*1.5
    const offZ = Math.cos(y*0.25)*1
    const thick = y<3 ? 2 : (y<6 ? 1 : 0)
    for(let tx=-thick;tx<=thick;tx++) for(let tz=-thick;tz<=thick;tz++){
      if(tx*tx+tz*tz > thick*thick+0.5) continue
      const m = new THREE.Mesh(vGeo, darkMat)
      m.position.set(treeX+offX+tx, y+1, treeZ+offZ+tz); m.castShadow=true; island.add(m)
    }
    if(y>5 && y%3===0){
      const bLen = 3+Math.random()*3
      const dx=(Math.random()-0.5), dz=(Math.random()-0.5)
      for(let b=1;b<bLen;b++){
        const m = new THREE.Mesh(vGeo, darkMat)
        m.position.set(treeX+offX+dx*b*2, y+1+b*0.5, treeZ+offZ+dz*b*2); island.add(m)
      }
    }
  }
  // Canopy — red
  const canopies = [
    {cx:treeX, cy:treeH+2, cz:treeZ, r:5},
    {cx:treeX+3, cy:treeH, cz:treeZ+2, r:4},
    {cx:treeX-3, cy:treeH+1, cz:treeZ-2, r:4},
    {cx:treeX+1, cy:treeH+4, cz:treeZ-3, r:3},
  ]
  canopies.forEach(sp => {
    for(let x=-sp.r;x<=sp.r;x++) for(let y=-sp.r;y<=sp.r;y++) for(let z=-sp.r;z<=sp.r;z++){
      if(x*x+y*y+z*z > sp.r*sp.r) continue
      if(Math.random()<0.4) continue
      const m = new THREE.Mesh(vGeo, accentMat)
      m.position.set(sp.cx+x, sp.cy+y, sp.cz+z); m.castShadow=true; island.add(m)
    }
  })

  // Floating rocks beneath
  const floatRocks = [{x:8,y:-6,z:5,s:2},{x:-9,y:-4,z:3,s:1.5},{x:3,y:-10,z:-6,s:2.5}]
  floatRocks.forEach(rock => {
    for(let x=-rock.s;x<=rock.s;x++) for(let y=-rock.s;y<=rock.s;y++) for(let z=-rock.s;z<=rock.s;z++){
      if(x*x+y*y+z*z > rock.s*rock.s+Math.random()) continue
      const m = new THREE.Mesh(vGeo, darkMat)
      m.position.set(rock.x+x, rock.y+y, rock.z+z); island.add(m)
    }
  })

  scene.add(island)

  // Water particles (river + waterfall) — light color
  const waterGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6)
  const waterParticles = []
  for(let i=0;i<80;i++){
    const m = new THREE.Mesh(waterGeo, waterMat)
    scene.add(m)
    waterParticles.push({
      mesh:m, x:1+Math.random()*2, y:0.3, z:-R+Math.random()*(R*2),
      speed:0.06+Math.random()*0.04, state:'river'
    })
  }

  // Falling particles — red
  const leafGeo = new THREE.BoxGeometry(0.2,0.2,0.2)
  const leafParticles = []
  for(let i=0;i<60;i++){
    const m = new THREE.Mesh(leafGeo, accentMat)
    scene.add(m)
    leafParticles.push({
      mesh:m, x:(Math.random()-0.5)*25, y:8+Math.random()*15, z:(Math.random()-0.5)*25,
      vy:0.03+Math.random()*0.03, vx:(Math.random()-0.5)*0.03, vz:(Math.random()-0.5)*0.03
    })
  }

  addLights(scene)

  let angle = 0, lastT = 0
  return { scene, camera, animate(t) {
    const dt = t - lastT; lastT = t
    const ease = t < 3 ? 0 : Math.min((t - 3) / 5, 1)
    angle += dt * 0.12 * ease
    camera.position.x = Math.sin(angle) * 46
    camera.position.z = Math.cos(angle) * 46
    camera.position.y = 28 + Math.sin(t * 0.3) * 1; camera.lookAt(0, 6, 0)

    // Island float
    island.position.y = Math.sin(t * 0.4) * 0.5

    // Water: river flow + waterfall
    waterParticles.forEach(wp => {
      if(wp.state==='river'){
        wp.z += wp.speed
        wp.mesh.position.set(wp.x, 0.3+Math.sin(t*3+wp.z)*0.08, wp.z)
        wp.mesh.position.add(island.position)
        if(wp.z > R-2){ wp.state='falling'; wp.fy=0 }
      } else {
        wp.fy += 0.015
        wp.mesh.position.set(wp.x, 0.3-wp.fy*wp.fy*2, wp.z+wp.fy*0.3)
        wp.mesh.position.add(island.position)
        wp.mesh.scale.y = 1+wp.fy*0.5
        if(wp.mesh.position.y < -20){
          wp.state='river'; wp.z=-R+Math.random()*3; wp.x=1+Math.random()*2; wp.fy=0
          wp.mesh.scale.y=1
        }
      }
    })

    // Falling leaves
    leafParticles.forEach(lp => {
      lp.y -= lp.vy
      lp.x += lp.vx + Math.sin(t+lp.y)*0.01
      lp.z += lp.vz + Math.cos(t*0.7+lp.y)*0.01
      lp.mesh.position.set(lp.x, lp.y, lp.z)
      lp.mesh.rotation.x += 0.01; lp.mesh.rotation.z += 0.008
      if(lp.y < -15){ lp.y=15+Math.random()*10; lp.x=(Math.random()-0.5)*25; lp.z=(Math.random()-0.5)*25 }
    })
  }}
}

function buildScene2_Compass() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 500)
  camera.position.set(0, 22, 38)
  camera.lookAt(0, 4, 0)

  const vGeo = new THREE.BoxGeometry(1, 1, 1)
  const island = new THREE.Group()

  // 3-color palette: dark, cream, red
  const darkMat = mat(0x222222)
  const creamMat = mat(0xE8DCC8)
  const accentMat = mat(RED, true)

  // Circular island terrain
  const R = 9
  for(let x=-R;x<=R;x++) for(let z=-R;z<=R;z++){
    const d = Math.sqrt(x*x+z*z)
    if(d > R) continue
    const surfH = Math.floor(Math.sin(x*0.25)*Math.cos(z*0.25)*1.5)
    const m = new THREE.Mesh(vGeo, creamMat)
    m.position.set(x, surfH, z); m.castShadow=true; island.add(m)
    const depth = Math.max(2, Math.floor((R-d)*0.7)+Math.floor(Math.sin(x*0.4)*2))
    for(let y=1;y<=depth;y++){
      const mb = new THREE.Mesh(vGeo, darkMat); mb.position.set(x, surfH-y, z); island.add(mb)
    }
  }

  // Lighthouse tower in center
  for(let y=0;y<12;y++){
    const thick = y<3 ? 2 : (y<8 ? 1 : 0)
    const tMat = y>=8 ? accentMat : darkMat
    for(let tx=-thick;tx<=thick;tx++) for(let tz=-thick;tz<=thick;tz++){
      if(tx*tx+tz*tz > thick*thick+0.5) continue
      const m = new THREE.Mesh(vGeo, tMat)
      m.position.set(tx, y+1, tz); m.castShadow=true; island.add(m)
    }
  }
  const beacon = new THREE.Mesh(new THREE.BoxGeometry(1.5,1.5,1.5), accentMat)
  beacon.position.set(0, 13, 0); island.add(beacon)

  // Direction markers at path ends (N/S/E/W)
  const dirs = [{dx:0,dz:R-1},{dx:0,dz:-(R-1)},{dx:R-1,dz:0},{dx:-(R-1),dz:0}]
  dirs.forEach(d => {
    for(let y=0;y<3;y++){
      const m = new THREE.Mesh(vGeo, y===2 ? accentMat : darkMat)
      m.position.set(d.dx, y+1, d.dz); m.castShadow=true; island.add(m)
    }
  })

  // Trees along edges — dark trunk, cream crown
  const treeSpots = [{x:-5,z:-5},{x:5,z:-4},{x:-4,z:5},{x:6,z:4},{x:-7,z:0},{x:0,z:-7}]
  treeSpots.forEach(ts => {
    if(Math.sqrt(ts.x*ts.x+ts.z*ts.z)>R-1) return
    for(let y=0;y<2;y++){const m=new THREE.Mesh(vGeo,darkMat);m.position.set(ts.x,y+1,ts.z);m.castShadow=true;island.add(m)}
    for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++) for(let dy=0;dy<2;dy++){
      if(dy===1&&(Math.abs(dx)+Math.abs(dz))>1) continue
      const m=new THREE.Mesh(vGeo,creamMat);m.position.set(ts.x+dx,3+dy,ts.z+dz);m.castShadow=true;island.add(m)
    }
  })

  // Floating rocks
  const rocks=[{x:12,y:-4,z:3,s:2},{x:-11,y:-3,z:-4,s:1.5},{x:4,y:-8,z:-9,s:2}]
  rocks.forEach(r=>{
    for(let x=-r.s;x<=r.s;x++) for(let y=-r.s;y<=r.s;y++) for(let z=-r.s;z<=r.s;z++){
      if(x*x+y*y+z*z>r.s*r.s+Math.random()) continue
      const m=new THREE.Mesh(vGeo,darkMat);m.position.set(r.x+x,r.y+y,r.z+z);island.add(m)
    }
  })

  scene.add(island)

  // Orbiting particles — red
  const orbiters=[]
  for(let i=0;i<15;i++){
    const m=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3), accentMat)
    scene.add(m)
    orbiters.push({mesh:m,angle:(i/15)*Math.PI*2,radius:3+Math.random()*2,height:10+Math.random()*5,speed:0.4+Math.random()*0.3})
  }

  addLights(scene)

  let camAngle=0, lastT2=0
  return { scene, camera, animate(t) {
    const dt=t-lastT2; lastT2=t
    const ease=t<3?0:Math.min((t-3)/5,1)
    camAngle+=dt*0.12*ease
    camera.position.x=Math.sin(camAngle)*34
    camera.position.z=Math.cos(camAngle)*34
    camera.position.y=22+Math.sin(t*0.3)*1; camera.lookAt(0,4,0)
    island.position.y=Math.sin(t*0.4)*0.4
    beacon.scale.setScalar(1+Math.sin(t*3)*0.15)
    orbiters.forEach(o=>{
      o.angle+=o.speed*0.008
      o.mesh.position.set(Math.cos(o.angle)*o.radius, o.height+Math.sin(t*0.5+o.angle)*1+island.position.y, Math.sin(o.angle)*o.radius)
      o.mesh.rotation.x+=0.01; o.mesh.rotation.z+=0.008
    })
  }}
}

function buildScene3_Steps() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 500)
  camera.position.set(0, 24, 42)
  camera.lookAt(0, 6, 0)

  const vGeo = new THREE.BoxGeometry(1, 1, 1)
  const island = new THREE.Group()

  // 3-color palette: dark, white, red
  const darkMat = mat(0x222222)
  const whiteMat = mat(0xF0F0F0)
  const accentMat = mat(RED, true)

  // Terraced mountain island — 4 levels stepping up
  const levels = [
    {y:0, r:10, m:whiteMat},
    {y:4, r:7, m:whiteMat},
    {y:8, r:5, m:darkMat},
    {y:12, r:3, m:whiteMat},
  ]
  levels.forEach((lv,li) => {
    for(let x=-lv.r;x<=lv.r;x++) for(let z=-lv.r;z<=lv.r;z++){
      const d=Math.sqrt(x*x+z*z)
      if(d>lv.r) continue
      const surfH=lv.y+Math.floor(Math.sin(x*0.3)*Math.cos(z*0.3))
      const m=new THREE.Mesh(vGeo,lv.m)
      m.position.set(x,surfH,z);m.castShadow=true;island.add(m)
      if(li===0){
        const depth=Math.max(2,Math.floor((lv.r-d)*0.8))
        for(let y=1;y<=depth;y++){
          const mb=new THREE.Mesh(vGeo,darkMat);mb.position.set(x,surfH-y,z);island.add(mb)
        }
      }
      if(li>0 && d>lv.r-1.5){
        for(let wy=levels[li-1].y;wy<lv.y;wy++){
          const wm=new THREE.Mesh(vGeo,darkMat)
          wm.position.set(x,wy,z);island.add(wm)
        }
      }
    }
  })

  // Red flag at summit
  for(let y=0;y<4;y++){
    const m=new THREE.Mesh(vGeo,y<3?darkMat:accentMat)
    m.position.set(0,13+y,0);m.castShadow=true;island.add(m)
  }
  for(let fx=1;fx<=3;fx++){
    const m=new THREE.Mesh(vGeo,accentMat)
    m.position.set(fx,16,0);island.add(m)
  }

  // Staircase path spiraling up
  for(let i=0;i<60;i++){
    const angle=i*0.15
    const r=10-i*0.12
    const y=i*0.22
    if(r<1) break
    const sx=Math.cos(angle)*r, sz=Math.sin(angle)*r
    const m=new THREE.Mesh(vGeo,i>45?accentMat:darkMat)
    m.position.set(Math.round(sx),Math.floor(y),Math.round(sz));m.castShadow=true;island.add(m)
  }

  // Trees — dark trunk, white crown
  const treeSpots=[{x:-6,z:-4},{x:5,z:-6},{x:-7,z:3},{x:7,z:2},{x:-3,z:7},{x:4,z:6}]
  treeSpots.forEach(ts=>{
    for(let y=0;y<2;y++){const m=new THREE.Mesh(vGeo,darkMat);m.position.set(ts.x,y+1,ts.z);m.castShadow=true;island.add(m)}
    for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++){
      if(Math.abs(dx)+Math.abs(dz)>1 && Math.random()>0.5) continue
      for(let dy=0;dy<2;dy++){
        const m=new THREE.Mesh(vGeo,whiteMat);m.position.set(ts.x+dx,3+dy,ts.z+dz);m.castShadow=true;island.add(m)
      }
    }
  })

  // Floating rocks
  const rocks=[{x:12,y:-5,z:4,s:2},{x:-10,y:-3,z:-6,s:1.5},{x:5,y:-9,z:-8,s:2.5}]
  rocks.forEach(r=>{
    for(let x=-r.s;x<=r.s;x++) for(let y=-r.s;y<=r.s;y++) for(let z=-r.s;z<=r.s;z++){
      if(x*x+y*y+z*z>r.s*r.s+Math.random()) continue
      const m=new THREE.Mesh(vGeo,darkMat);m.position.set(r.x+x,r.y+y,r.z+z);island.add(m)
    }
  })

  scene.add(island)

  // Rising particles from summit — red
  const sumParts=[]
  for(let i=0;i<25;i++){
    const m=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2),accentMat)
    scene.add(m)
    sumParts.push({mesh:m,x:(Math.random()-0.5)*4,z:(Math.random()-0.5)*4,y:14+Math.random()*6,vy:0.02+Math.random()*0.02})
  }

  addLights(scene)

  let camAngle=0,lastT3=0
  return { scene, camera, animate(t) {
    const dt=t-lastT3;lastT3=t
    const ease=t<3?0:Math.min((t-3)/5,1)
    camAngle+=dt*0.1*ease
    camera.position.x=Math.sin(camAngle)*36
    camera.position.z=Math.cos(camAngle)*36
    camera.position.y=24+Math.sin(t*0.3)*1;camera.lookAt(0,6,0)
    island.position.y=Math.sin(t*0.35)*0.4
    sumParts.forEach(sp=>{
      sp.y+=sp.vy;sp.mesh.position.set(sp.x+Math.sin(t+sp.y)*0.3,sp.y+island.position.y,sp.z+Math.cos(t*0.7+sp.y)*0.3)
      sp.mesh.rotation.x+=0.01;sp.mesh.rotation.z+=0.008
      if(sp.y>25){sp.y=14;sp.x=(Math.random()-0.5)*4;sp.z=(Math.random()-0.5)*4}
    })
  }}
}

function buildScene4_Archive() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 500)
  camera.position.set(0, 22, 38)
  camera.lookAt(0, 4, 0)

  const vGeo = new THREE.BoxGeometry(1, 1, 1)
  const island = new THREE.Group()

  // 3-color palette: dark, amber, red
  const darkMat = mat(0x222222)
  const amberMat = mat(0xD4A574)
  const accentMat = mat(RED, true)

  // Island terrain
  const R = 9
  for(let x=-R;x<=R;x++) for(let z=-R;z<=R;z++){
    const d=Math.sqrt(x*x+z*z)
    if(d>R) continue
    const surfH=Math.floor(Math.sin(x*0.3)*Math.cos(z*0.3)*1)
    const m=new THREE.Mesh(vGeo,amberMat)
    m.position.set(x,surfH,z);m.castShadow=true;island.add(m)
    const depth=Math.max(2,Math.floor((R-d)*0.8)+Math.floor(Math.sin(x*0.5)*1.5))
    for(let y=1;y<=depth;y++){
      const mb=new THREE.Mesh(vGeo,darkMat);mb.position.set(x,surfH-y,z);island.add(mb)
    }
  }

  // Central archive tower
  for(let y=0;y<10;y++){
    const thick=y<2?3:(y<6?2:1)
    for(let tx=-thick;tx<=thick;tx++) for(let tz=-thick;tz<=thick;tz++){
      if(tx*tx+tz*tz>thick*thick+0.5) continue
      const m=new THREE.Mesh(vGeo,darkMat)
      m.position.set(tx,y+1,tz);m.castShadow=true;island.add(m)
    }
  }
  // Dome top — red
  for(let dx=-2;dx<=2;dx++) for(let dz=-2;dz<=2;dz++){
    if(dx*dx+dz*dz>4) continue
    const dy=dx*dx+dz*dz<2?2:1
    const m=new THREE.Mesh(vGeo,accentMat)
    m.position.set(dx,10+dy,dz);m.castShadow=true;island.add(m)
  }

  // Bookshelves — 4 wings, amber shelves with red books
  const wings=[{dx:1,dz:0},{dx:-1,dz:0},{dx:0,dz:1},{dx:0,dz:-1}]
  wings.forEach(w=>{
    for(let i=3;i<=7;i++){
      for(let y=1;y<=4;y++){
        const m=new THREE.Mesh(vGeo,amberMat)
        m.position.set(w.dx*i,y,w.dz*i);m.castShadow=true;island.add(m)
        if(y<4){
          const bk=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.6,0.8),Math.random()>0.5?accentMat:darkMat)
          bk.position.set(w.dx*i+(w.dz!==0?(Math.random()-0.5)*0.3:0),y+0.5,w.dz*i+(w.dx!==0?(Math.random()-0.5)*0.3:0))
          island.add(bk)
        }
      }
    }
  })

  // Trees — dark trunk, amber crown
  const treeSpots=[{x:-6,z:-5},{x:6,z:-4},{x:-5,z:6},{x:7,z:3}]
  treeSpots.forEach(ts=>{
    for(let y=0;y<2;y++){const m=new THREE.Mesh(vGeo,darkMat);m.position.set(ts.x,y+1,ts.z);m.castShadow=true;island.add(m)}
    for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++) for(let dy=0;dy<2;dy++){
      if(dy===1&&(Math.abs(dx)+Math.abs(dz))>1) continue
      const m=new THREE.Mesh(vGeo,amberMat);m.position.set(ts.x+dx,3+dy,ts.z+dz);m.castShadow=true;island.add(m)
    }
  })

  // Floating rocks
  const rocks=[{x:11,y:-5,z:4,s:2},{x:-10,y:-3,z:-5,s:1.5},{x:3,y:-9,z:-8,s:2}]
  rocks.forEach(r=>{
    for(let x=-r.s;x<=r.s;x++) for(let y=-r.s;y<=r.s;y++) for(let z=-r.s;z<=r.s;z++){
      if(x*x+y*y+z*z>r.s*r.s+Math.random()) continue
      const m=new THREE.Mesh(vGeo,darkMat);m.position.set(r.x+x,r.y+y,r.z+z);island.add(m)
    }
  })

  scene.add(island)

  // Memory particles — red, spiraling up
  const memGeo=new THREE.BoxGeometry(0.25,0.25,0.25)
  const memories=[]
  for(let i=0;i<60;i++){
    const mt=new THREE.MeshStandardMaterial({color:RED,emissive:RED,emissiveIntensity:0.3,transparent:true,opacity:0.8,roughness:0.3})
    const m=new THREE.Mesh(memGeo,mt)
    scene.add(m)
    memories.push({mesh:m,angle:Math.random()*Math.PI*2,radius:1+Math.random()*3,y:2+Math.random()*8,vy:0.015+Math.random()*0.01,vAngle:0.01+Math.random()*0.01,maxY:18})
  }

  addLights(scene)

  let camAngle=0,lastT4=0
  return { scene, camera, animate(t) {
    const dt=t-lastT4;lastT4=t
    const ease=t<3?0:Math.min((t-3)/5,1)
    camAngle+=dt*0.1*ease
    camera.position.x=Math.sin(camAngle)*34
    camera.position.z=Math.cos(camAngle)*34
    camera.position.y=22+Math.sin(t*0.3)*1;camera.lookAt(0,4,0)
    island.position.y=Math.sin(t*0.4)*0.4
    memories.forEach(m=>{
      m.angle+=m.vAngle
      m.y+=m.vy
      m.radius+=0.003
      m.mesh.position.set(Math.cos(m.angle)*m.radius, m.y+island.position.y, Math.sin(m.angle)*m.radius)
      m.mesh.rotation.x+=0.008;m.mesh.rotation.z+=0.006
      const prog=(m.y-2)/(m.maxY-2)
      m.mesh.material.opacity=Math.max(0,1-prog)
      if(m.y>m.maxY){m.y=2;m.radius=1+Math.random()*2;m.angle=Math.random()*Math.PI*2;m.mesh.material.opacity=0.8}
    })
  }}
}

function buildScene9_Mindshift() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 500)
  camera.position.set(0, 22, 42)
  camera.lookAt(0, 4, 0)

  const vGeo = new THREE.BoxGeometry(1, 1, 1)
  const world = new THREE.Group()

  // 3-color palette: gray (old), red (bridge/energy), teal (new)
  const grayMat9 = mat(0x888888)
  const accentMat = mat(RED, true)
  const tealMat = mat(0x4ECDC4, true)

  // --- OLD ISLAND (left, gray) ---
  function buildIsland(group, cx, R, surfMat, underMat, withTree) {
    for(let x=-R;x<=R;x++) for(let z=-R;z<=R;z++){
      const d = Math.sqrt(x*x+z*z)
      if(d > R-0.5) continue
      const surfH = Math.floor(Math.sin(x*0.4)*Math.cos(z*0.4)*1)
      const m = new THREE.Mesh(vGeo, surfMat)
      m.position.set(cx+x, surfH, z); m.castShadow=true; group.add(m)
      const depth = Math.max(2, Math.floor((R-d)*0.8) + Math.floor(Math.sin(x*0.5)*1.5))
      for(let y=1;y<=depth;y++){
        const mb = new THREE.Mesh(vGeo, underMat)
        mb.position.set(cx+x, surfH-y, z); group.add(mb)
      }
    }
    if(withTree){
      for(let y=0;y<6;y++){
        const m = new THREE.Mesh(vGeo, grayMat9)
        m.position.set(cx, y+1, 0); m.castShadow=true; group.add(m)
      }
      for(let b of [{dx:1,dy:5,dz:0},{dx:-1,dy:4,dz:1},{dx:0,dy:6,dz:-1}]){
        for(let i=1;i<=2;i++){
          const m = new THREE.Mesh(vGeo, grayMat9)
          m.position.set(cx+b.dx*i, b.dy+i*0.5, b.dz*i); group.add(m)
        }
      }
    }
  }

  buildIsland(world, -10, 6, grayMat9, grayMat9, true)

  // --- NEW ISLAND (right, teal) ---
  buildIsland(world, 10, 7, tealMat, grayMat9, false)

  // Living tree on new island — gray trunk, teal canopy
  const tX=10, tZ=0, tH=10
  for(let y=0;y<tH;y++){
    const offX = Math.sin(y*0.35)*1.2
    const offZ = Math.cos(y*0.3)*0.8
    const thick = y<3 ? 2 : (y<5 ? 1 : 0)
    for(let tx=-thick;tx<=thick;tx++) for(let tz=-thick;tz<=thick;tz++){
      if(tx*tx+tz*tz > thick*thick+0.5) continue
      const m = new THREE.Mesh(vGeo, grayMat9)
      m.position.set(tX+offX+tx, y+1, tZ+offZ+tz); m.castShadow=true; world.add(m)
    }
    if(y>4 && y%2===0){
      const bLen=2+Math.random()*3, dx=(Math.random()-0.5), dz=(Math.random()-0.5)
      for(let b=1;b<bLen;b++){
        const m = new THREE.Mesh(vGeo, grayMat9)
        m.position.set(tX+offX+dx*b*2, y+1+b*0.4, tZ+offZ+dz*b*2); world.add(m)
      }
    }
  }
  // Canopy — teal
  const canopies = [
    {cx:tX, cy:tH+2, cz:tZ, r:4},
    {cx:tX+3, cy:tH, cz:tZ+2, r:3},
    {cx:tX-2, cy:tH+1, cz:tZ-2, r:3},
  ]
  canopies.forEach(sp => {
    for(let x=-sp.r;x<=sp.r;x++) for(let y=-sp.r;y<=sp.r;y++) for(let z=-sp.r;z<=sp.r;z++){
      if(x*x+y*y+z*z > sp.r*sp.r) continue
      if(Math.random()<0.35) continue
      const m = new THREE.Mesh(vGeo, tealMat)
      m.position.set(sp.cx+x, sp.cy+y, sp.cz+z); m.castShadow=true; world.add(m)
    }
  })

  // --- BRIDGE (red energy) ---
  for(let i=0;i<14;i++){
    const t2 = i/13
    const bx = -4 + t2*18
    const by = 1 + Math.sin(t2*Math.PI)*3
    const m = new THREE.Mesh(vGeo, accentMat)
    m.position.set(bx, by, 0); m.castShadow=true; world.add(m)
    if(i%2===0){
      const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.4,1,0.4), accentMat)
      r1.position.set(bx, by+1, -1); world.add(r1)
      const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.4,1,0.4), accentMat)
      r2.position.set(bx, by+1, 1); world.add(r2)
    }
  }

  // Floating rocks — gray
  const rocks = [{x:-14,y:-5,z:4,s:2},{x:16,y:-4,z:-3,s:1.5},{x:0,y:-8,z:5,s:2}]
  rocks.forEach(rock => {
    for(let x=-rock.s;x<=rock.s;x++) for(let y=-rock.s;y<=rock.s;y++) for(let z=-rock.s;z<=rock.s;z++){
      if(x*x+y*y+z*z > rock.s*rock.s+Math.random()) continue
      const m = new THREE.Mesh(vGeo, grayMat9)
      m.position.set(rock.x+x, rock.y+y, rock.z+z); world.add(m)
    }
  })

  scene.add(world)

  // Energy stream particles — red
  const streamGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  const streamParticles = []
  for(let i=0;i<40;i++){
    const m = new THREE.Mesh(streamGeo, new THREE.MeshStandardMaterial({
      color: RED, emissive: RED, emissiveIntensity:0.3,
      transparent:true, opacity:0.8, roughness:0.2
    }))
    scene.add(m)
    streamParticles.push({mesh:m, prog:Math.random(), speed:0.008+Math.random()*0.006})
  }

  // Falling particles — teal
  const leafGeo = new THREE.BoxGeometry(0.2,0.2,0.2)
  const leafParts = []
  for(let i=0;i<40;i++){
    const m = new THREE.Mesh(leafGeo, tealMat)
    scene.add(m)
    leafParts.push({
      mesh:m, x:10+(Math.random()-0.5)*15, y:6+Math.random()*12, z:(Math.random()-0.5)*15,
      vy:0.025+Math.random()*0.025, vx:(Math.random()-0.5)*0.02
    })
  }

  addLights(scene)
  const pLight1 = new THREE.PointLight(RED, 0.5, 25)
  pLight1.position.set(0, 5, 0); scene.add(pLight1)

  let camAngle=0, lastT9=0
  return { scene, camera, animate(t) {
    const dt=t-lastT9; lastT9=t
    const ease=t<3?0:Math.min((t-3)/5,1)
    camAngle+=dt*0.1*ease
    camera.position.x = Math.sin(camAngle) * 38
    camera.position.z = Math.cos(camAngle) * 38
    camera.position.y=22+Math.sin(t*0.3)*1; camera.lookAt(0,4,0)

    world.position.y = Math.sin(t*0.35)*0.4

    streamParticles.forEach(sp => {
      sp.prog += sp.speed
      if(sp.prog > 1) sp.prog -= 1
      const px = -10 + sp.prog * 20
      const py = 1 + Math.sin(sp.prog * Math.PI) * 4 + Math.sin(t*3+sp.prog*10)*0.3
      sp.mesh.position.set(px, py + world.position.y, 0)
      sp.mesh.rotation.x += 0.02; sp.mesh.rotation.z += 0.015
      sp.mesh.material.opacity = 0.4 + Math.sin(sp.prog*Math.PI)*0.5
    })

    leafParts.forEach(lp => {
      lp.y -= lp.vy
      lp.x += lp.vx + Math.sin(t+lp.y)*0.008
      lp.mesh.position.set(lp.x, lp.y + world.position.y, lp.z)
      lp.mesh.rotation.x += 0.008; lp.mesh.rotation.z += 0.006
      if(lp.y < -12){ lp.y=12+Math.random()*8; lp.x=10+(Math.random()-0.5)*15; lp.z=(Math.random()-0.5)*15 }
    })

    pLight1.intensity = 0.3 + Math.sin(t*2)*0.2
  }}
}

// Shared lighting setup
function addLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const sun = new THREE.DirectionalLight(0xffffff, 1.1)
  sun.position.set(10, 20, 10); sun.castShadow = true
  sun.shadow.mapSize.set(512, 512); sun.shadow.camera.far = 50
  sun.shadow.camera.left = -15; sun.shadow.camera.right = 15
  sun.shadow.camera.top = 15; sun.shadow.camera.bottom = -15
  scene.add(sun)
  scene.add(new THREE.DirectionalLight(0xE0E8FF, 0.3).translateZ(-10))
}

// ============================================================
// LEVEL VOXEL BUILDERS
// ============================================================

function buildLevel1_Awareness() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(14, 12, 18)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)

  // Lighthouse tower
  const tower = new THREE.Group()
  function addV(x,y,z,m=grayMat){const v=new THREE.Mesh(vGeo,m);v.position.set(x,y,z);v.castShadow=true;tower.add(v)}
  for(let x=-2;x<=2;x++) for(let z=-2;z<=2;z++) addV(x,0,z,blackMat)
  for(let x=-1;x<=1;x++) for(let z=-1;z<=1;z++){addV(x,1,z);addV(x,2,z)}
  addV(0,3,0);addV(1,3,0);addV(-1,3,0);addV(0,3,1);addV(0,3,-1)
  addV(0,4,0);addV(1,4,0);addV(-1,4,0);addV(0,4,1);addV(0,4,-1)
  addV(0,5,0);addV(0,6,0)
  addV(0,7,0,redMat);addV(1,7,0,redMat);addV(-1,7,0,redMat);addV(0,7,1,redMat);addV(0,7,-1,redMat);addV(0,8,0,redMat)
  scene.add(tower)

  // Light beams
  const beamGeo=new THREE.BoxGeometry(0.4,0.4,0.4)
  const beamMat=new THREE.MeshStandardMaterial({color:RED,roughness:0.3,transparent:true,opacity:0.6,emissive:RED,emissiveIntensity:0.15})
  const beams=[]
  const dirs=[[1,0.2,0],[-1,0.2,0],[0,0.2,1],[0,0.2,-1],[0.7,0.3,0.7],[-0.7,0.3,-0.7]]
  dirs.forEach(d=>{for(let i=1;i<=8;i++){const m=new THREE.Mesh(beamGeo,beamMat.clone());m.position.set(d[0]*i*1.2,7.5+d[1]*i,d[2]*i*1.2);scene.add(m);beams.push({mesh:m,baseY:7.5+d[1]*i,off:i*0.3})}})

  // Particles
  const pGeo=new THREE.BoxGeometry(0.2,0.2,0.2)
  const parts=[]
  for(let i=0;i<30;i++){const p=new THREE.Mesh(pGeo,i%3===0?redMat:mutedMat);p.position.set((Math.random()-0.5)*16,Math.random()*14,(Math.random()-0.5)*16);scene.add(p);parts.push({mesh:p,vy:0.008+Math.random()*0.012})}

  addLights(scene)
  let angle=0
  return{scene,camera,animate(t){
    angle+=0.0005;camera.position.x=Math.cos(angle)*20;camera.position.z=Math.sin(angle)*20;camera.position.y=12+Math.sin(t*0.08);camera.lookAt(0,4,0)
    beams.forEach(b=>{b.mesh.position.y=b.baseY+Math.sin(t*0.5+b.off)*0.15;b.mesh.material.opacity=0.3+Math.sin(t*0.8+b.off)*0.3})
    parts.forEach(p=>{p.mesh.position.y+=p.vy*0.2;p.mesh.rotation.x+=0.003;if(p.mesh.position.y>16){p.mesh.position.y=-1;p.mesh.position.x=(Math.random()-0.5)*16;p.mesh.position.z=(Math.random()-0.5)*16}})
  }}
}

function buildLevel2_Usage() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(16, 10, 16)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)

  const colors=[0x3B82F6,0xF59E0B,0x22C55E,0x8B5CF6,RED]
  const cMats=colors.map(c=>mat(c,true))

  // Central prism
  const prism=new THREE.Group()
  ;[[-1,0,0],[0,0,0],[1,0,0],[0,0,1],[0,0,-1],[-1,1,0],[0,1,0],[1,1,0],[0,2,0],[0,3,0]].forEach(([x,y,z],i)=>{
    const m=new THREE.Mesh(vGeo,i===9?redMat:blackMat);m.position.set(x,y,z);m.castShadow=true;prism.add(m)
  })
  scene.add(prism)

  // 5 towers
  const tData=[{x:-6,z:0,h:5},{x:-3,z:-5,h:6},{x:3,z:-5,h:4},{x:6,z:0,h:5},{x:0,z:6,h:7}]
  tData.forEach((td,ti)=>{
    for(let y=0;y<=td.h;y++){const m=new THREE.Mesh(vGeo,y===td.h?cMats[ti]:grayMat);m.position.set(td.x,y,td.z);m.castShadow=true;scene.add(m)}
  })

  // Connection dots
  const connGeo=new THREE.BoxGeometry(0.3,0.3,0.3)
  const conns=[]
  tData.forEach((td,ti)=>{const d=new THREE.Vector3(td.x,td.h*0.5,td.z).normalize();for(let j=1;j<=6;j++){const m=new THREE.Mesh(connGeo,cMats[ti]);m.position.set(d.x*j*1.2,2+d.y*j*0.8,d.z*j*1.2);scene.add(m);conns.push({mesh:m,baseY:2+d.y*j*0.8,ph:ti+j*0.4})}})

  // Particles
  const pGeo=new THREE.BoxGeometry(0.15,0.15,0.15)
  const parts=[]
  for(let i=0;i<35;i++){const p=new THREE.Mesh(pGeo,cMats[i%5]);p.position.set((Math.random()-0.5)*18,Math.random()*12,(Math.random()-0.5)*18);scene.add(p);parts.push({mesh:p,vy:0.008+Math.random()*0.015})}

  addLights(scene)
  let angle=0
  return{scene,camera,animate(t){
    angle+=0.0005;camera.position.x=Math.cos(angle)*22;camera.position.z=Math.sin(angle)*22;camera.position.y=10+Math.sin(t*0.06)*1.5;camera.lookAt(0,3,0)
    prism.position.y=Math.sin(t*0.3)*0.1
    conns.forEach(c=>{c.mesh.position.y=c.baseY+Math.sin(t*0.6+c.ph)*0.2})
    parts.forEach(p=>{p.mesh.position.y+=p.vy*0.2;p.mesh.rotation.x+=0.003;if(p.mesh.position.y>14){p.mesh.position.y=-1;p.mesh.position.x=(Math.random()-0.5)*18;p.mesh.position.z=(Math.random()-0.5)*18}})
  }}
}

function buildLevel3_Context() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(16, 14, 18)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)

  // Bookshelves in a ring
  const shelves=[]
  const sPos=[{x:-4,z:-2},{x:-4,z:0},{x:-4,z:2},{x:4,z:-2},{x:4,z:0},{x:4,z:2},{x:-2,z:-4},{x:0,z:-4},{x:2,z:-4}]
  sPos.forEach((sp,idx)=>{
    const h=3+Math.floor(Math.random()*4)
    for(let y=0;y<h;y++){const m=new THREE.Mesh(vGeo,y===h-1?(idx%3===0?redMat:mutedMat):grayMat);m.position.set(sp.x,y,sp.z);m.castShadow=true;scene.add(m);shelves.push({mesh:m,baseY:y,ph:idx*0.5+y*0.3})}
  })

  // Central core — red brain
  const core=new THREE.Group()
  ;[[0,4,0],[1,4,0],[-1,4,0],[0,4,1],[0,4,-1],[0,5,0],[1,5,0],[-1,5,0],[0,5,1],[0,5,-1],[0,6,0],[0,7,0]].forEach(([x,y,z])=>{
    const m=new THREE.Mesh(vGeo,redMat);m.position.set(x,y,z);m.castShadow=true;core.add(m)
  })
  scene.add(core)

  // Streams spiraling into core
  const stGeo=new THREE.BoxGeometry(0.25,0.25,0.25)
  const streams=[]
  for(let i=0;i<50;i++){const a=Math.random()*Math.PI*2;const d=2+Math.random()*5;const m=new THREE.Mesh(stGeo,i%4===0?redMat:mutedMat);m.position.set(Math.cos(a)*d,-2,Math.sin(a)*d);scene.add(m);streams.push({mesh:m,angle:a,dist:d,speed:0.02+Math.random()*0.03})}

  addLights(scene)
  const coreLight=new THREE.PointLight(RED,0.5,12);coreLight.position.set(0,5,0);scene.add(coreLight)
  let angle=0
  return{scene,camera,animate(t){
    angle+=0.0005;camera.position.x=Math.cos(angle)*22;camera.position.z=Math.sin(angle)*22;camera.position.y=14+Math.sin(t*0.07);camera.lookAt(0,4,0)
    core.position.y=Math.sin(t*0.3)*0.2;core.rotation.y=t*0.05;coreLight.intensity=0.4+Math.sin(t*0.8)*0.2
    streams.forEach(s=>{s.mesh.position.y+=s.speed;const sa=s.angle+t*0.1;const sh=Math.max(0.5,s.dist-s.mesh.position.y*0.3);s.mesh.position.x=Math.cos(sa)*sh;s.mesh.position.z=Math.sin(sa)*sh;s.mesh.rotation.x+=0.01;if(s.mesh.position.y>8){s.mesh.position.y=-2;s.angle=Math.random()*Math.PI*2;s.dist=2+Math.random()*5}})
    shelves.forEach(s=>{s.mesh.position.y=s.baseY+Math.sin(t*0.2+s.ph)*0.02})
  }}
}

function buildLevel4_Building() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(18, 14, 18)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)

  // Foundation
  for(let x=-3;x<=3;x++) for(let z=-2;z<=2;z++){const m=new THREE.Mesh(vGeo,blackMat);m.position.set(x,0,z);m.castShadow=true;scene.add(m)}
  // Walls
  for(let y=1;y<=6;y++){for(let x=-3;x<=3;x+=6){const m=new THREE.Mesh(vGeo,y>4?mutedMat:grayMat);m.position.set(x,y,-2);m.castShadow=true;scene.add(m);if(y<=5){const m2=new THREE.Mesh(vGeo,y>4?mutedMat:grayMat);m2.position.set(x,y,2);m2.castShadow=true;scene.add(m2)}}}
  // Red top
  const redTops=[];[-1,0,1].forEach(x=>{const m=new THREE.Mesh(vGeo,redMat);m.position.set(x,7,0);m.castShadow=true;scene.add(m);redTops.push(m)})
  // Crane
  for(let y=0;y<=12;y++){const m=new THREE.Mesh(vGeo,y>10?redMat:blackMat);m.position.set(6,y,0);m.castShadow=true;scene.add(m)}
  for(let x=-2;x<=6;x++){const m=new THREE.Mesh(vGeo,blackMat);m.position.set(x,12,0);m.castShadow=true;scene.add(m)}

  // Floating blocks
  const floaters=[]
  const fData=[{t:[0,8,0],d:0},{t:[2,6,1],d:1},{t:[-2,5,0],d:2},{t:[1,5,-1],d:3},{t:[-1,6,1],d:4}]
  fData.forEach(fd=>{const m=new THREE.Mesh(vGeo,Math.random()>0.7?redMat:grayMat);m.position.set(fd.t[0]+(Math.random()-0.5)*2,15+Math.random()*8,fd.t[2]);m.castShadow=true;scene.add(m);floaters.push({mesh:m,target:new THREE.Vector3(...fd.t),delay:fd.d,arrived:false,speed:0.015+Math.random()*0.01})})

  // Particles
  const pGeo=new THREE.BoxGeometry(0.15,0.15,0.15)
  const parts=[]
  for(let i=0;i<25;i++){const p=new THREE.Mesh(pGeo,i%4===0?redMat:mutedMat);p.position.set((Math.random()-0.5)*16,Math.random()*15,(Math.random()-0.5)*12);scene.add(p);parts.push({mesh:p,vy:0.01+Math.random()*0.015})}

  addLights(scene)
  let angle=0
  return{scene,camera,animate(t){
    angle+=0.0005;camera.position.x=Math.cos(angle)*24;camera.position.z=Math.sin(angle)*24;camera.position.y=14+Math.sin(t*0.06);camera.lookAt(0,5,0)
    floaters.forEach(f=>{if(t<f.delay)return;if(f.arrived){f.mesh.position.y=f.target.y+Math.sin(t*0.4+f.delay)*0.03;return};const dir=new THREE.Vector3().subVectors(f.target,f.mesh.position);const dist=dir.length();if(dist<0.1){f.mesh.position.copy(f.target);f.arrived=true}else{dir.normalize().multiplyScalar(Math.min(f.speed*0.3*(1+t*0.04),dist));f.mesh.position.add(dir)}})
    redTops.forEach((m,i)=>{m.position.y=7+Math.sin(t*0.5+i)*0.15})
    parts.forEach(p=>{p.mesh.position.y+=p.vy*0.2;p.mesh.rotation.x+=0.003;if(p.mesh.position.y>16){p.mesh.position.y=-1;p.mesh.position.x=(Math.random()-0.5)*16}})
  }}
}

function buildLevel5_Engineering() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(18, 12, 18)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)

  // Architect figure
  const fig=new THREE.Group()
  function addF(x,y,z,m=blackMat){const v=new THREE.Mesh(vGeo,m);v.position.set(x,y,z);v.castShadow=true;fig.add(v)}
  addF(-0.5,0,0);addF(-0.5,1,0);addF(0.5,0,0);addF(0.5,1,0)
  addF(0,2,0);addF(0,3,0);addF(0,4,0);addF(-1,4,0);addF(1,4,0)
  addF(-2,4,0,redMat);addF(2,4,0,redMat);addF(-2,3,0.5);addF(2,3,0.5)
  addF(0,5,0);addF(0,6,0,redMat)
  scene.add(fig)

  // Orbiting satellites
  const orbits=[]
  const oData=[{r:5,sp:0.3,y:3,s:1.2,mi:0},{r:7,sp:-0.2,y:5,s:0.8,mi:1},{r:6,sp:0.15,y:1,s:1.0,mi:2},{r:8,sp:-0.1,y:6,s:0.6,mi:0},{r:4,sp:0.4,y:7,s:0.7,mi:3},{r:9,sp:0.08,y:2,s:0.9,mi:1}]
  const oMats=[redMat,grayMat,mutedMat,blackMat]
  oData.forEach(od=>{const sat=new THREE.Group();const geo=new THREE.BoxGeometry(od.s,od.s,od.s);const m1=new THREE.Mesh(geo,oMats[od.mi]);m1.castShadow=true;sat.add(m1);const m2=new THREE.Mesh(new THREE.BoxGeometry(od.s*0.6,od.s*0.6,od.s*0.6),od.mi===0?blackMat:redMat);m2.position.set(od.s*0.8,0,0);m2.castShadow=true;sat.add(m2);scene.add(sat);orbits.push({group:sat,radius:od.r,speed:od.sp,y:od.y,phase:Math.random()*Math.PI*2})})

  // Connection dots
  const connGeo=new THREE.BoxGeometry(0.15,0.15,0.15)
  const connMat2=new THREE.MeshStandardMaterial({color:RED,transparent:true,opacity:0.4,emissive:RED,emissiveIntensity:0.1})
  const conns=[]
  for(let i=0;i<80;i++){const m=new THREE.Mesh(connGeo,connMat2);scene.add(m);conns.push({mesh:m,oi:i%oData.length,t:i/80})}

  // Orbit rings
  const ringGeo=new THREE.BoxGeometry(0.1,0.1,0.1)
  const ringMat=new THREE.MeshStandardMaterial({color:GRAY,transparent:true,opacity:0.15})
  oData.forEach(od=>{for(let a=0;a<Math.PI*2;a+=0.15){const m=new THREE.Mesh(ringGeo,ringMat);m.position.set(Math.cos(a)*od.r,od.y,Math.sin(a)*od.r);scene.add(m)}})

  // Particles
  const pGeo=new THREE.BoxGeometry(0.12,0.12,0.12)
  const parts=[]
  for(let i=0;i<40;i++){const p=new THREE.Mesh(pGeo,i%3===0?redMat:mutedMat);p.position.set((Math.random()-0.5)*20,Math.random()*12,(Math.random()-0.5)*20);scene.add(p);parts.push({mesh:p,vy:0.006+Math.random()*0.01})}

  addLights(scene)
  scene.add(new THREE.PointLight(RED,0.3,15).translateY(4))
  let camAngle=0
  return{scene,camera,animate(t){
    camAngle+=0.0004;camera.position.x=Math.cos(camAngle)*22;camera.position.z=Math.sin(camAngle)*22;camera.position.y=12+Math.sin(t*0.05)*2;camera.lookAt(0,4,0)
    fig.position.y=Math.sin(t*0.25)*0.1
    orbits.forEach(o=>{const a=t*o.speed+o.phase;o.group.position.set(Math.cos(a)*o.radius,o.y+Math.sin(t*0.3+o.phase)*0.3,Math.sin(a)*o.radius);o.group.rotation.y=a})
    conns.forEach(c=>{const o=orbits[c.oi];c.mesh.position.lerpVectors(new THREE.Vector3(0,4,0),o.group.position,c.t);c.mesh.position.y+=Math.sin(t*0.5+c.t*5)*0.1})
    parts.forEach(p=>{p.mesh.position.y+=p.vy*0.2;p.mesh.rotation.x+=0.002;if(p.mesh.position.y>14){p.mesh.position.y=-1;p.mesh.position.x=(Math.random()-0.5)*20;p.mesh.position.z=(Math.random()-0.5)*20}})
  }}
}

// ============================================================
// SECTION-SPECIFIC VOXEL BUILDERS
// ============================================================

// Creative Toolkit — floating spectrum of colorful cubes
function buildScene_Palette() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(0, 14, 24)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)

  const colors = [0xDC2626, 0xF97316, 0xFACC15, 0x22C55E, 0x3B82F6, 0x8B5CF6, 0xEC4899]
  const mats = colors.map(c => mat(c, true))
  const cubes = []

  // Spiral arrangement of colored cubes
  for(let i=0; i<70; i++){
    const angle = i * 0.45
    const r = 2 + i * 0.12
    const y = (i - 35) * 0.15
    const m = new THREE.Mesh(vGeo, mats[i % mats.length])
    const scale = 0.5 + Math.random() * 0.8
    m.scale.set(scale, scale, scale)
    m.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r)
    m.rotation.set(Math.random(), Math.random(), Math.random())
    m.castShadow = true
    scene.add(m)
    cubes.push({ mesh: m, angle, r, baseY: y, speed: 0.3 + Math.random() * 0.4, rotSpeed: 0.005 + Math.random() * 0.01 })
  }

  // Central white core
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2, metalness: 0.1 })
  for(let x=-1; x<=1; x++) for(let y=-1; y<=1; y++) for(let z=-1; z<=1; z++){
    if(Math.abs(x)+Math.abs(y)+Math.abs(z) > 2) continue
    const m = new THREE.Mesh(vGeo, coreMat)
    m.position.set(x, y, z); m.castShadow = true; scene.add(m)
  }

  addLights(scene)
  let camAngle = 0
  return { scene, camera, animate(t) {
    camAngle += 0.003
    camera.position.x = Math.cos(camAngle) * 24
    camera.position.z = Math.sin(camAngle) * 24
    camera.position.y = 14 + Math.sin(t * 0.08) * 2
    camera.lookAt(0, 0, 0)
    cubes.forEach(c => {
      c.mesh.position.y = c.baseY + Math.sin(t * 0.15 * c.speed + c.angle) * 1.5
      c.mesh.rotation.x += c.rotSpeed
      c.mesh.rotation.z += c.rotSpeed * 0.7
    })
  }}
}

// Agents — network of connected nodes
function buildScene_Network() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(18, 14, 18)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)
  const sGeo = new THREE.SphereGeometry(0.8, 8, 8)
  const nodeMat = mat(RED, true)
  const edgeMat = new THREE.MeshStandardMaterial({ color: MUTED, roughness: 0.5, transparent: true, opacity: 0.4 })
  const hubMat = mat(BLACK)

  // Generate node positions in 3D space
  const nodes = []
  const positions = [
    [0,5,0], [-6,8,3], [5,3,-4], [-4,1,-6], [7,7,2], [-3,6,-3],
    [4,9,5], [-7,3,4], [6,1,6], [-2,10,-1], [3,4,-7], [8,6,-3],
    [-5,2,5], [1,8,-5], [-6,5,-5], [5,10,0]
  ]
  positions.forEach((p, i) => {
    const isHub = i < 3
    const m = isHub ? new THREE.Mesh(vGeo, hubMat) : new THREE.Mesh(sGeo, nodeMat)
    if(isHub) m.scale.set(1.8, 1.8, 1.8)
    m.position.set(p[0], p[1], p[2]); m.castShadow = true; scene.add(m)
    nodes.push({ mesh: m, base: new THREE.Vector3(p[0], p[1], p[2]), phase: Math.random() * Math.PI * 2 })
  })

  // Edges between nearby nodes
  const edgeGeo = new THREE.BoxGeometry(0.15, 0.15, 1)
  const edges = []
  for(let i=0; i<nodes.length; i++) for(let j=i+1; j<nodes.length; j++){
    const d = nodes[i].base.distanceTo(nodes[j].base)
    if(d < 10) {
      const m = new THREE.Mesh(edgeGeo, edgeMat)
      scene.add(m)
      edges.push({ mesh: m, a: i, b: j })
    }
  }

  // Traveling pulses on edges
  const pulseGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  const pulseMat = mat(RED, true)
  const pulses = []
  for(let i=0; i<20; i++){
    const m = new THREE.Mesh(pulseGeo, pulseMat)
    scene.add(m)
    pulses.push({ mesh: m, edge: Math.floor(Math.random() * edges.length), prog: Math.random(), speed: 0.005 + Math.random() * 0.008 })
  }

  addLights(scene)
  let camAngle = 0.3
  return { scene, camera, animate(t) {
    camAngle += 0.0008
    camera.position.x = Math.cos(camAngle) * 22
    camera.position.z = Math.sin(camAngle) * 22
    camera.position.y = 12 + Math.sin(t * 0.06) * 3
    camera.lookAt(0, 5, 0)
    nodes.forEach(n => {
      n.mesh.position.y = n.base.y + Math.sin(t * 0.12 + n.phase) * 0.4
    })
    edges.forEach(e => {
      const a = nodes[e.a].mesh.position, b = nodes[e.b].mesh.position
      e.mesh.position.lerpVectors(a, b, 0.5)
      e.mesh.lookAt(b)
      e.mesh.scale.z = a.distanceTo(b)
    })
    pulses.forEach(p => {
      p.prog += p.speed
      if(p.prog > 1) { p.prog = 0; p.edge = Math.floor(Math.random() * edges.length) }
      const e = edges[p.edge]
      const a = nodes[e.a].mesh.position, b = nodes[e.b].mesh.position
      p.mesh.position.lerpVectors(a, b, p.prog)
    })
  }}
}

// PRD — floating blueprint grid
function buildScene_Blueprint() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(16, 16, 16)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)
  const frameMat = mat(BLACK)
  const fillMat = new THREE.MeshStandardMaterial({ color: GRAY, roughness: 0.4, transparent: true, opacity: 0.6 })
  const accentMat = mat(RED, true)

  const doc = new THREE.Group()
  // Document frame — wireframe rectangle
  const W = 10, H = 14
  for(let x = -W/2; x <= W/2; x++) {
    const m1 = new THREE.Mesh(vGeo, frameMat); m1.position.set(x, H/2, 0); m1.scale.set(1, 0.3, 0.3); doc.add(m1)
    const m2 = new THREE.Mesh(vGeo, frameMat); m2.position.set(x, -H/2, 0); m2.scale.set(1, 0.3, 0.3); doc.add(m2)
  }
  for(let y = -H/2; y <= H/2; y++) {
    const m1 = new THREE.Mesh(vGeo, frameMat); m1.position.set(-W/2, y, 0); m1.scale.set(0.3, 1, 0.3); doc.add(m1)
    const m2 = new THREE.Mesh(vGeo, frameMat); m2.position.set(W/2, y, 0); m2.scale.set(0.3, 1, 0.3); doc.add(m2)
  }

  // Content lines
  const lines = []
  for(let row = 0; row < 8; row++) {
    const y = H/2 - 1.5 - row * 1.6
    const w = 3 + Math.random() * 5
    const isAccent = row === 0 || row === 4
    const m = new THREE.Mesh(vGeo, isAccent ? accentMat : fillMat)
    m.scale.set(w, 0.5, 0.4)
    m.position.set(-W/2 + 1.5 + w/2, y, 0.2)
    doc.add(m)
    lines.push({ mesh: m, baseY: y, phase: row * 0.5 })
  }

  // Floating checkboxes
  const checks = []
  for(let i = 0; i < 4; i++) {
    const y = H/2 - 7 - i * 1.6
    const m = new THREE.Mesh(vGeo, i < 2 ? accentMat : frameMat)
    m.scale.set(0.6, 0.6, 0.6)
    m.position.set(-W/2 + 1, y, 0.3)
    doc.add(m)
    checks.push({ mesh: m, baseY: y })
  }

  doc.rotation.y = -0.2
  scene.add(doc)

  addLights(scene)
  let camAngle = 0.4
  return { scene, camera, animate(t) {
    camAngle += 0.001
    camera.position.x = Math.cos(camAngle) * 20
    camera.position.z = Math.sin(camAngle) * 20
    camera.position.y = 14 + Math.sin(t * 0.07) * 2
    camera.lookAt(0, 0, 0)
    doc.position.y = Math.sin(t * 0.1) * 0.5
    doc.rotation.y = -0.2 + Math.sin(t * 0.05) * 0.1
    lines.forEach(l => { l.mesh.position.y = l.baseY + Math.sin(t * 0.15 + l.phase) * 0.1 })
  }}
}

// Demo Day — podium with rising blocks and spotlight
function buildScene_Spotlight() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(14, 12, 18)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)

  // Podium — stacked platform
  const podMat = mat(BLACK)
  const topMat = mat(RED, true)
  for(let layer = 0; layer < 3; layer++) {
    const sz = 6 - layer * 1.5
    for(let x = -sz; x <= sz; x++) for(let z = -sz; z <= sz; z++) {
      const m = new THREE.Mesh(vGeo, layer === 2 ? topMat : podMat)
      m.position.set(x, layer, z); m.castShadow = true; scene.add(m)
    }
  }

  // Rising celebration blocks
  const celebMat = mat(GRAY)
  const celebs = []
  for(let i = 0; i < 40; i++) {
    const m = new THREE.Mesh(vGeo, i % 5 === 0 ? topMat : celebMat)
    const s = 0.3 + Math.random() * 0.6
    m.scale.set(s, s, s)
    m.castShadow = true; scene.add(m)
    celebs.push({
      mesh: m,
      x: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 12,
      speed: 0.02 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
      maxH: 6 + Math.random() * 10
    })
  }

  // Spotlight beam — column of semi-transparent cubes
  const beamMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.08, roughness: 0.1 })
  for(let y = 3; y < 18; y++) {
    const sz = 0.5 + (y - 3) * 0.2
    const m = new THREE.Mesh(vGeo, beamMat)
    m.scale.set(sz, 1, sz)
    m.position.set(0, y, 0); scene.add(m)
  }

  addLights(scene)
  const spotLight = new THREE.PointLight(0xFFFFFF, 0.8, 25)
  spotLight.position.set(0, 18, 0); scene.add(spotLight)

  let camAngle = 0.5
  return { scene, camera, animate(t) {
    camAngle += 0.0015
    camera.position.x = Math.cos(camAngle) * 20
    camera.position.z = Math.sin(camAngle) * 20
    camera.position.y = 10 + Math.sin(t * 0.08) * 3
    camera.lookAt(0, 4, 0)
    celebs.forEach(c => {
      const h = (Math.sin(t * 0.1 * c.speed * 20 + c.phase) + 1) * 0.5 * c.maxH
      c.mesh.position.set(c.x, 3 + h, c.z)
      c.mesh.rotation.y += c.speed * 0.3
    })
  }}
}

// Friction Auditing — magnifying lens scanning grid
function buildScene_Lens() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500)
  camera.position.set(0, 22, 18)
  const vGeo = new THREE.BoxGeometry(1, 1, 1)

  // Flat grid of small cubes
  const gridMat = mat(GRAY)
  const gridCubes = []
  for(let x = -8; x <= 8; x += 2) for(let z = -8; z <= 8; z += 2) {
    const m = new THREE.Mesh(vGeo, gridMat)
    m.scale.set(1.5, 0.3, 1.5)
    m.position.set(x, 0, z); m.castShadow = true; scene.add(m)
    gridCubes.push({ mesh: m, x, z, baseScale: 0.3 })
  }

  // Lens ring — circle of dark cubes
  const lensMat = mat(BLACK)
  const lensGroup = new THREE.Group()
  const lensR = 4
  for(let a = 0; a < Math.PI * 2; a += 0.2) {
    const m = new THREE.Mesh(vGeo, lensMat)
    m.scale.set(0.8, 0.8, 0.8)
    m.position.set(Math.cos(a) * lensR, 3, Math.sin(a) * lensR)
    lensGroup.add(m)
  }
  // Lens handle
  for(let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(vGeo, lensMat)
    m.scale.set(0.6, 0.6, 0.6)
    m.position.set(lensR + 1 + i * 0.8, 3 - i * 0.5, lensR + 1 + i * 0.8)
    lensGroup.add(m)
  }
  scene.add(lensGroup)

  // Highlighted cubes under lens
  const highlightMat = mat(RED, true)

  addLights(scene)
  let camAngle = 0
  return { scene, camera, animate(t) {
    camAngle += 0.001
    camera.position.x = Math.sin(camAngle) * 18
    camera.position.z = 18 * Math.cos(camAngle)
    camera.position.y = 22 + Math.sin(t * 0.06) * 2
    camera.lookAt(0, 1, 0)

    // Move lens in slow figure-8
    const lx = Math.sin(t * 0.08) * 5
    const lz = Math.sin(t * 0.06) * 5
    lensGroup.position.set(lx, 0, lz)

    // Highlight grid cubes near lens
    gridCubes.forEach(gc => {
      const dx = gc.x - lx, dz = gc.z - lz
      const dist = Math.sqrt(dx * dx + dz * dz)
      if(dist < lensR + 1) {
        gc.mesh.material = highlightMat
        gc.mesh.scale.y = 0.3 + (1 - dist / (lensR + 1)) * 2
        gc.mesh.position.y = gc.mesh.scale.y * 0.5
      } else {
        gc.mesh.material = gridMat
        gc.mesh.scale.y = 0.3
        gc.mesh.position.y = 0
      }
    })
  }}
}

// Scene registry
const BUILDERS = {
  '/voxels/slide1-builder.html': buildScene1_Builder,
  '/voxels/slide2-compass.html': buildScene2_Compass,
  '/voxels/slide3-steps.html': buildScene3_Steps,
  '/voxels/slide4-archive.html': buildScene4_Archive,
  '/voxels/slide9-mindshift.html': buildScene9_Mindshift,
  '/voxels/level1-awareness.html': buildLevel1_Awareness,
  '/voxels/level2-usage.html': buildLevel2_Usage,
  '/voxels/level3-context.html': buildLevel3_Context,
  '/voxels/level4-building.html': buildLevel4_Building,
  '/voxels/level5-engineering.html': buildLevel5_Engineering,
  '/voxels/palette.html': buildScene_Palette,
  '/voxels/network.html': buildScene_Network,
  '/voxels/blueprint.html': buildScene_Blueprint,
  '/voxels/spotlight.html': buildScene_Spotlight,
  '/voxels/lens.html': buildScene_Lens,
}

// ============================================================
// React Component
// ============================================================

export default function VoxelScene({ src, className, style }) {
  const containerRef = useRef(null)
  const cleanupRef = useRef(null)

  useEffect(() => {
    const builder = BUILDERS[src]
    if (!builder || !containerRef.current) return

    const container = containerRef.current
    let built
    try { built = builder() } catch(e) { console.error('VoxelScene build error:', e); return }
    const { scene, camera, animate } = built

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xFFFFFF, 0)
    container.appendChild(renderer.domElement)

    function resize() {
      const w = container.clientWidth, h = container.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const clock = new THREE.Clock()
    let raf
    function loop() {
      raf = requestAnimationFrame(loop)
      animate(clock.getElapsedTime())
      renderer.render(scene, camera)
    }
    loop()

    cleanupRef.current = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }

    return () => { if (cleanupRef.current) cleanupRef.current() }
  }, [src])

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', ...style }} />
}
