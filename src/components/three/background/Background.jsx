import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './index.css'

export default function Background() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Animation variables
    let time = 0;

    // Particles setup
    const particlesCount = 2500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const velocities = [];
    const originalPositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;

      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];

      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.008
      });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    function createCircleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 42;
      canvas.height = 42;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    const material = new THREE.PointsMaterial({
      color: 0x00ffcc,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: createCircleTexture()
    });

    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    // Animation loop
    function animate() {
      time += 0.001;

      const positions = particleSystem.geometry.attributes.position.array;

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;

        // Gentle floating animation
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;

        // Add wave motion
        positions[i3 + 1] += Math.sin(time + positions[i3] * 0.5) * 0.002;
        positions[i3] += Math.cos(time + positions[i3 + 1] * 0.5) * 0.002;

        // Boundary check with smooth return
        const maxDist = 10;
        if (Math.abs(positions[i3]) > maxDist) {
          positions[i3] += (originalPositions[i3] - positions[i3]) * 0.01;
          velocities[i].x *= 0.95;
        }
        if (Math.abs(positions[i3 + 1]) > maxDist) {
          positions[i3 + 1] += (originalPositions[i3 + 1] - positions[i3 + 1]) * 0.01;
          velocities[i].y *= 0.95;
        }
        if (Math.abs(positions[i3 + 2]) > 4) {
          velocities[i].z *= -0.5;
        }
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Gentle rotation
      particleSystem.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.remove(particleSystem);
      particles.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className = "three-background"
    />
  );
}