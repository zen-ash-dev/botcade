'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Scene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070712, 0.0025);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070712, 0);

    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.2, 0.7, 180, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0x7C3AED,
        emissive: 0x7C3AED,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: false,
        transparent: true,
        opacity: 0.6,
      })
    );
    torusKnot.position.y = 0.5;
    scene.add(torusKnot);

    const wireKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.4, 0.75, 24, 12),
      new THREE.MeshBasicMaterial({
        color: 0xF43F5E,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      })
    );
    wireKnot.position.y = 0.5;
    scene.add(wireKnot);

    const icosahedron = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.8, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.1,
        metalness: 0.3,
        roughness: 0.6,
        transparent: true,
        opacity: 0.3,
        wireframe: false,
      })
    );
    icosahedron.position.set(-3.5, -0.8, -4);
    scene.add(icosahedron);

    const particleCount = 3000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const palette = [
      new THREE.Color(0x7C3AED),
      new THREE.Color(0xF43F5E),
      new THREE.Color(0x00ffcc),
      new THREE.Color(0xA78BFA),
      new THREE.Color(0x00bfff),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.08 + 0.02;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    const ringParticles = new THREE.BufferGeometry();
    const ringCount = 800;
    const ringPos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const radius = 4.5 + Math.random() * 0.5;
      ringPos[i * 3] = Math.cos(angle) * radius;
      ringPos[i * 3 + 1] = Math.sin(angle) * radius * 0.3;
      ringPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    ringParticles.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));

    const ringMaterial = new THREE.PointsMaterial({
      color: 0x7C3AED,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const ringSystem = new THREE.Points(ringParticles, ringMaterial);
    scene.add(ringSystem);

    const mouse = mouseRef.current;
    let scroll = scrollRef.current;

    const handleMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scroll = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current = scroll;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    let time = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      const s = scrollRef.current;

      torusKnot.rotation.x += 0.003 * (1 + s * 2);
      torusKnot.rotation.y += 0.005 * (1 + s * 2);
      torusKnot.position.x += (mouse.x * 0.3 - torusKnot.position.x) * 0.02;
      torusKnot.position.y += (mouse.y * 0.3 + 0.5 - torusKnot.position.y) * 0.02;

      const hue = 0.75 + s * 0.25;
      const color = new THREE.Color().setHSL(hue % 1, 0.8, 0.5);
      (torusKnot.material as THREE.MeshPhysicalMaterial).color.copy(color);
      (torusKnot.material as THREE.MeshPhysicalMaterial).emissive.copy(color);

      wireKnot.rotation.x = torusKnot.rotation.x;
      wireKnot.rotation.y = torusKnot.rotation.y;
      (wireKnot.material as THREE.MeshBasicMaterial).color.setHSL((hue + 0.3) % 1, 0.9, 0.5);

      icosahedron.rotation.x += 0.002;
      icosahedron.rotation.y += 0.004;
      icosahedron.position.x = -3.5 + mouse.x * 0.5;
      icosahedron.position.y = -0.8 + mouse.y * 0.3;
      (icosahedron.material as THREE.MeshPhysicalMaterial).color.setHSL((hue + 0.5) % 1, 0.8, 0.5);

      ringSystem.rotation.x += 0.002;
      ringSystem.rotation.y += 0.003;
      ringSystem.rotation.z = Math.sin(time * 0.3) * 0.1;

      particleSystem.rotation.y = time * 0.02;

      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.01;
      camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.01;
      camera.position.z = 12 - s * 3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
