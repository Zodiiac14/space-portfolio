import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

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

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starCount = 4000
    const positions = new Float32Array(starCount * 3)
    for (let i=0; i<starCount; i++){
      const r = THREE.MathUtils.randFloat(80, 800)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2))
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i*3+2] = r * Math.cos(phi)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.8, sizeAttenuation: true, transparent: true, opacity: 0.9 })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    const keyLight = new THREE.PointLight(0x88aaff, 3, 0, 1.2)
    keyLight.position.set(50, 40, 30)
    scene.add(keyLight)

    // Planets group
    const planets = new THREE.Group()
    scene.add(planets)

    function makePlanet(radius, color, distance, speed, tilt=0.2){
      const g = new THREE.SphereGeometry(radius, 48, 48)
      const m = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.1,
        roughness: 0.6
      })
      const mesh = new THREE.Mesh(g, m)
      const pivot = new THREE.Object3D()
      mesh.position.x = distance
      mesh.rotation.x = tilt
      pivot.userData = { speed }
      pivot.add(mesh)
      planets.add(pivot)
      return mesh
    }

    const p1 = makePlanet(3.2, 0x3b82f6, 14, 0.003)
    const p2 = makePlanet(2.1, 0x22d3ee, 22, 0.0016, 0.35)
    const p3 = makePlanet(4.4, 0x94a3b8, 32, 0.0011, -0.15)
    const p4rings = makePlanet(2.6, 0xffd166, 26, 0.0022, 0.1)

    // Simple ring for planet 4
    const ringGeo = new THREE.RingGeometry(4.0, 6.2, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfff4cc, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.2
    ring.position.x = 26
    const ringPivot = new THREE.Object3D()
    ringPivot.add(ring)
    ringPivot.userData = { speed: 0.0022 }
    planets.add(ringPivot)

    // Subtle camera parallax
    const target = new THREE.Vector2()
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      target.x = x * 0.6
      target.y = -y * 0.3
    })

    // Resize
    function onResize(){
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // Demo 2D canvas signal (overlay element)
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

    // Animation loop
    let raf
    const clock = new THREE.Clock()
    function animate(){
      raf = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      planets.children.forEach(p => { p.rotation.y += (p.userData.speed || 0.001) })
      stars.rotation.y += 0.0001
      camera.position.x += (target.x*10 - camera.position.x) * 0.02
      camera.position.y += (target.y*5 - camera.position.y) * 0.02
      camera.lookAt(0,0,0)
      renderer.render(scene, camera)
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
