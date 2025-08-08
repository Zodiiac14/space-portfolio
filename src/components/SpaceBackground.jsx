import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

function loadTex(url){
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader()
    loader.load(url, tex => resolve(tex), undefined, () => resolve(null))
  })
}


export default function SpaceBackground(){
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x00010a, 0.0009)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 10, 38)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    // Bloom
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 0.4, 0.85)
    bloom.threshold = 0.2; bloom.strength = 1.1; bloom.radius = 0.6
    composer.addPass(bloom)

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starCount = 5000
    const positions = new Float32Array(starCount * 3)
    for (let i=0; i<starCount; i++){
      const r = THREE.MathUtils.randFloat(100, 900)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2))
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i*3+2] = r * Math.cos(phi)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starMat = new THREE.PointsMaterial({ color: 0x9bb3ff, size: 0.8, sizeAttenuation: true, transparent: true, opacity: 0.95 })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)
    const keyLight = new THREE.PointLight(0x88aaff, 3, 0, 1.2)
    keyLight.position.set(50, 40, 30)
    scene.add(keyLight)

    // Planets
    const planets = new THREE.Group()
    scene.add(planets)

    async function makePlanet({radius, color, distance, speed, tilt=0.2, textureName=null, emissive=0x000000}){
      const g = new THREE.SphereGeometry(radius, 64, 64)
      let matOpts = { color, metalness: 0.1, roughness: 0.6, emissive, emissiveIntensity: 0.2 }
      if (textureName){
        const tex = await loadTex(`/textures/${textureName}`)
        if (tex){ matOpts.map = tex; matOpts.roughness = 0.9; }
      }
      const m = new THREE.MeshStandardMaterial(matOpts)
      const mesh = new THREE.Mesh(g, m)
      const pivot = new THREE.Object3D()
      mesh.position.x = distance
      mesh.rotation.x = tilt
      pivot.userData = { speed }
      pivot.add(mesh)
      planets.add(pivot)
      return mesh
    }

    ;(async () => {
      // Fire (Mars-like)
      await makePlanet({ radius: 3.2, color: 0xef4444, distance: 14, speed: 0.003, tilt: 0.18, textureName: 'mars.jpg', emissive: 0x7f1d1d })
      // Water (Neptune-like)
      await makePlanet({ radius: 2.6, color: 0x22d3ee, distance: 22, speed: 0.0016, tilt: 0.35, textureName: 'neptune.jpg', emissive: 0x0e7490 })
      // Air (Moon-like)
      await makePlanet({ radius: 2.2, color: 0xeeeeee, distance: 28, speed: 0.0021, tilt: 0.1, textureName: 'moon.jpg', emissive: 0x666666 })
      // Earth
      await makePlanet({ radius: 3.6, color: 0x3b82f6, distance: 34, speed: 0.0011, tilt: -0.15, textureName: 'earth.jpg', emissive: 0x1d4ed8 })

      // DATA sphere
      const dataPivot = new THREE.Object3D()
      const dataGeo = new THREE.SphereGeometry(3.0, 42, 42)
      const dataMat = new THREE.MeshStandardMaterial({
        color: 0xa78bfa, roughness: 0.3, metalness: 0.3, emissive: 0x6d28d9, emissiveIntensity: 0.6
      })
      const dataMesh = new THREE.Mesh(dataGeo, dataMat)
      dataMesh.position.x = 18
      dataMesh.rotation.x = 0.28
      dataPivot.userData = { speed: 0.0026 }
      dataPivot.add(dataMesh)
      planets.add(dataPivot)

      const wire = new THREE.Mesh(
        new THREE.SphereGeometry(3.02, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xd8b4fe, wireframe: true, transparent: true, opacity: 0.2 })
      )
      wire.position.copy(dataMesh.position)
      dataPivot.add(wire)
    })()

    // Air orbit ring
    const ringGeo = new THREE.RingGeometry(26.0, 26.2, 128)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.15 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.1
    scene.add(ring)

    // Parallax
    const target = new THREE.Vector2()
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      target.x = x * 0.6
      target.y = -y * 0.3
    })

    function onResize(){
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // 2D DSP demo
    const signalCanvas = document.getElementById('demo-canvas')
    const sctx = signalCanvas?.getContext('2d')
    let t = 0
    function drawSignal(){
      if(!sctx) return
      const w = signalCanvas.width, h = signalCanvas.height
      sctx.clearRect(0,0,w,h)
      sctx.strokeStyle = '#8ab4ff'; sctx.lineWidth = 2
      sctx.beginPath()
      for(let x=0; x<w; x++){
        const phase = (x/w) * Math.PI * 4 + t * 0.04
        const y = h/2 + Math.sin(phase) * (h*0.28) + (Math.random()-0.5)*6
        if(x===0) sctx.moveTo(x,y); else sctx.lineTo(x,y)
      }
      sctx.stroke()
      t++
    }

    let raf
    const clock = new THREE.Clock()
    function animate(){
      raf = requestAnimationFrame(animate)
      scene.traverse(obj => {
        if (obj.userData && obj.userData.speed) obj.rotation.y += obj.userData.speed
      })
      stars.rotation.y += 0.0001
      camera.position.x += (target.x*10 - camera.position.x) * 0.02
      camera.position.y += (target.y*5 - camera.position.y) * 0.02
      camera.lookAt(0,0,0)
      composer.render()
      drawSignal()
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
      starGeo.dispose()
    }
  }, [])

  return <div ref={mountRef} style={{position:'fixed', inset:0, zIndex: -1}} />
}
