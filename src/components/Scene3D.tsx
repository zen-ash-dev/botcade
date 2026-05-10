'use client'

import { useEffect } from 'react'
import * as THREE from 'three'

export default function Scene3D() {
  useEffect(() => {
    const html = document.documentElement
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null

    html.classList.add('scene-enabled', 'mounted')

    if (!canvas || canvas.dataset.initialized) return
    canvas.dataset.initialized = 'true'

    let modelLoaded = false
    let completed = false

    const progressEl = document.getElementById('scene-progress')

    const complete = () => {
      if (completed) return
      completed = true
      if (progressEl) progressEl.textContent = '100%'
      const bar = document.getElementById('scene-progress-bar')
      if (bar) bar.style.width = '100%'
      html.classList.add('scene-ready')
      html.classList.remove('scroll-disabled')
    }

    const setProgress = (pct: number) => {
      const val = Math.min(Math.round(pct), 100)
      if (progressEl) progressEl.textContent = val + '%'
      const bar = document.getElementById('scene-progress-bar')
      if (bar) bar.style.width = val + '%'
    }

    const safetyTimer = setTimeout(complete, 6000)

    try {
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf6f6f6)

      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(0, 0, 6)

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.0

      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      pmremGenerator.compileEquirectangularShader()

      const envScene = new THREE.Scene()
      const envGeo = new THREE.SphereGeometry(100, 64, 64)
      const envMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          topColor: { value: new THREE.Color('#f0f0f0') },
          bottomColor: { value: new THREE.Color('#e1fc06') },
          offset: { value: 20 },
          exponent: { value: 0.4 },
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
          }
        `,
      })
      envScene.add(new THREE.Mesh(envGeo, envMat))
      const envMap = pmremGenerator.fromScene(envScene).texture
      pmremGenerator.dispose()

      const mainGroup = new THREE.Group()
      scene.add(mainGroup)

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.05,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        clearcoat: 1,
        clearcoatRoughness: 0.5,
        ior: 2.4,
        transmission: 0.95,
        thickness: 1.5,
        envMap,
        envMapIntensity: 1,
        sheen: 0,
        sheenRoughness: 0.3,
        sheenColor: new THREE.Color(0xe1fc06),
        specularIntensity: 1,
        specularColor: 0xffffff,
        attenuationDistance: Infinity,
        attenuationColor: 0xffffff,
      })

      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe1fc06,
        transparent: true,
        opacity: 0.25,
      })
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.025, 32, 64), ringMat)
      ring.rotation.x = Math.PI / 2
      mainGroup.add(ring)

      const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.08,
      })
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.012, 16, 64), ring2Mat)
      ring2.rotation.x = Math.PI / 2
      ring2.rotation.z = 0.3
      mainGroup.add(ring2)

      scene.add(new THREE.AmbientLight(0xffffff, 0.6))

      const dirLight = new THREE.DirectionalLight(0xffffff, 25)
      dirLight.position.set(3, -1, 2)
      scene.add(dirLight)

      const fillLight = new THREE.DirectionalLight(0xe1fc06, 4)
      fillLight.position.set(-4, -1, -1)
      scene.add(fillLight)

      const topLight = new THREE.DirectionalLight(0xffffff, 10)
      topLight.position.set(0, 5, 2)
      scene.add(topLight)

      const particleCount = 600
      const particlePositions = new Float32Array(particleCount * 3)
      const particleSpeeds = new Float32Array(particleCount)
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = 2 + Math.random() * 10
        particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
        particlePositions[i * 3 + 2] = r * Math.cos(phi) - 4
        particleSpeeds[i] = 0.2 + Math.random() * 0.8
      }
      const particleGeo = new THREE.BufferGeometry()
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
      const particleMat = new THREE.PointsMaterial({
        color: new THREE.Color(0xe1fc06),
        size: 0.035,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      })
      const particles = new THREE.Points(particleGeo, particleMat)
      scene.add(particles)

      const starFieldCount = 200
      const starPositions = new Float32Array(starFieldCount * 3)
      for (let i = 0; i < starFieldCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 40
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
      }
      const starGeo = new THREE.BufferGeometry()
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
      const starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.015,
        transparent: true,
        opacity: 0.3,
        sizeAttenuation: true,
      })
      const stars = new THREE.Points(starGeo, starMat)
      scene.add(stars)

      const mouse = { x: 0, y: 0 }
      const targetPos = { x: 0, y: 0 }
      let scrollPos = 0
      let modelMesh: THREE.Mesh | null = null

      const loadModel = () => {
        import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader: Loader }) => {
          const loader = new Loader()
          loader.load(
            '/models/star.glb',
            (gltf) => {
              const child = gltf.scene.children[0] as THREE.Mesh
              if (child) {
                child.material = glassMat
                child.scale.setScalar(1.2)
                child.position.y = 0.4
                mainGroup.add(child)
                modelMesh = child
                modelLoaded = true
                setProgress(90)
                if (!completed) {
                  setTimeout(complete, 500)
                }
              }
            },
            (xhr) => {
              if (xhr.total > 0) {
                setProgress(10 + (xhr.loaded / xhr.total) * 60)
              } else {
                setProgress(30)
              }
            },
            () => {
              console.warn('GLTF load error, completing without model')
              if (!completed) complete()
            }
          )
        }).catch(() => {
          if (!completed) complete()
        })
      }
      loadModel()

      const startTimer = setTimeout(() => {
        if (!completed) {
          setProgress(70)
          if (!modelLoaded) {
            const interval = setInterval(() => {
              if (modelLoaded || completed) {
                clearInterval(interval)
                return
              }
              const el = document.getElementById('scene-progress')
              if (el) {
                const current = parseInt(el.textContent || '70', 10)
                if (current < 85) {
                  el.textContent = String(current + 1)
                }
              }
            }, 200)

            const fallbackTimer = setTimeout(() => {
              clearInterval(interval)
              complete()
            }, 3000)

            if (completed) clearTimeout(fallbackTimer)
          }
        }
      }, 1500)

      const handleMouse = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      }

      const handleScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (maxScroll > 0) {
          const st = window.scrollY / maxScroll
          scrollPos += (st - scrollPos) * 0.05
        }
      }

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      const handleSwitchMode = (e: Event) => {
        const dark = (e as CustomEvent).detail.mode === 'dark'
        scene.background = new THREE.Color(dark ? 0x000000 : 0xf6f6f6)
        glassMat.envMapIntensity = dark ? 0.4 : 1
        particles.material.color = new THREE.Color(dark ? 0x444444 : 0xe1fc06)
      }

      window.addEventListener('mousemove', handleMouse)
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize)
      window.addEventListener('switchMode', handleSwitchMode as EventListener)

      const clock = new THREE.Clock()

      let composer: any = null
      import('three/examples/jsm/postprocessing/EffectComposer.js').then(({ EffectComposer: EC }) => {
        import('three/examples/jsm/postprocessing/RenderPass.js').then(({ RenderPass: RP }) => {
          import('three/examples/jsm/postprocessing/UnrealBloomPass.js').then(({ UnrealBloomPass: UBP }) => {
            const c = new EC(renderer)
            c.addPass(new RP(scene, camera))
            const bloom = new UBP(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.3, 0.15, 0.05)
            c.addPass(bloom)
            composer = c
          })
        })
      })

      const animate = () => {
        requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        const s = scrollPos

        if (modelMesh) {
          modelMesh.rotation.x = Math.sin(t * 0.06) * 0.04 + s * 0.15
          modelMesh.rotation.y = t * 0.12 + s * 0.3
          modelMesh.position.y = 0.4 + Math.sin(t * 0.3) * 0.15 - s * 1.2

          targetPos.x += (mouse.x * 0.3 - targetPos.x) * 0.015
          targetPos.y += (-mouse.y * 0.3 - targetPos.y) * 0.015
          modelMesh.position.x += (targetPos.x * 0.3 - modelMesh.position.x) * 0.05
        }

        mainGroup.rotation.x = s * 0.08
        mainGroup.rotation.y = s * 0.15

        ring.rotation.z = t * 0.25
        ring2.rotation.z = -t * 0.18
        ringMat.opacity = 0.15 + Math.sin(t * 0.4) * 0.1
        ring2Mat.opacity = 0.05 + Math.sin(t * 0.3 + 1) * 0.04

        glassMat.transmission = 0.85 + Math.sin(t * 0.3) * 0.1

        particles.rotation.y = t * 0.006
        particles.rotation.x = Math.sin(t * 0.002) * 0.015

        stars.rotation.y = t * 0.003

        camera.position.x += (mouse.x * 0.15 - camera.position.x) * 0.004
        camera.position.y += (-mouse.y * 0.15 - camera.position.y) * 0.004
        camera.lookAt(0, 0, 0)

        if (composer) {
          composer.render()
        } else {
          renderer.render(scene, camera)
        }
      }

      animate()

      return () => {
        clearTimeout(safetyTimer)
        clearTimeout(startTimer)
        window.removeEventListener('mousemove', handleMouse)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('switchMode', handleSwitchMode as EventListener)
        renderer.dispose()
        envMap.dispose()
      }
    } catch (e) {
      console.warn('Scene3D init failed:', e)
      html.classList.add('scene-ready')
      html.classList.remove('scroll-disabled')
    }
  }, [])

  return null
}
