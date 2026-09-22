import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.3));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // 3. Object Group
    const group = new THREE.Group();
    group.rotation.x = 0.12;
    scene.add(group);

    // 4. Particle Points
    const particleCount = width < 700 ? 180 : 380;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.65 + Math.random() * 0.34;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const isYellow = Math.random() > 0.78;
      colors[i * 3] = isYellow ? 1 : 0.12;
      colors[i * 3 + 1] = isYellow ? 0.72 : 0.94;
      colors[i * 3 + 2] = isYellow ? 0.08 : 0.82;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: width < 700 ? 0.026 : 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    // 5. Wireframe Torus Rings & Icosahedron Core
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.012, 8, 110),
      new THREE.MeshBasicMaterial({ color: 0x20f0d0, transparent: true, opacity: 0.14, wireframe: true })
    );
    ring1.rotation.x = Math.PI / 2.7;
    group.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.009, 8, 110),
      new THREE.MeshBasicMaterial({ color: 0xffc928, transparent: true, opacity: 0.12, wireframe: true })
    );
    ring2.rotation.y = Math.PI / 2.1;
    group.add(ring2);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.88, 2),
      new THREE.MeshBasicMaterial({ color: 0x20f0d0, wireframe: true, transparent: true, opacity: 0.11 })
    );
    group.add(core);

    // 6. Lights
    const light1 = new THREE.PointLight(0x20f0d0, 4, 10);
    light1.position.set(2, 2, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffc928, 2.4, 8);
    light2.position.set(-2, -1, 2);
    scene.add(light2);

    // 7. Interactive Mouse Tracking
    let mx = 0, my = 0, tx = 0, ty = 0;
    const handlePointerMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 8. Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.3));
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 9. Animation Loop with Visibility and Intersection Check
    let heroVisible = true;
    let tabVisible = !document.hidden;
    let rafId = 0;

    const clock = new THREE.Clock();
    const tick = () => {
      if (!heroVisible || !tabVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      tx += (mx * 0.28 - tx) * 0.025;
      ty += (my * 0.18 - ty) * 0.025;

      group.rotation.y = t * 0.10 + tx;
      group.rotation.x = 0.12 + ty;
      points.rotation.z = t * 0.035;
      ring1.rotation.z = t * 0.18;
      ring2.rotation.x = t * 0.12;
      core.rotation.x = t * 0.16;
      core.rotation.y = -t * 0.12;

      renderer.render(scene, camera);
    };

    tick();

    const handleVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible && heroVisible && !rafId) tick();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible && tabVisible && !rafId) tick();
    }, { threshold: 0 });
    observer.observe(mount);

    // 10. Clean up
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();

      pGeo.dispose();
      pMat.dispose();
      ring1.geometry.dispose();
      ring1.material.dispose();
      ring2.geometry.dispose();
      ring2.material.dispose();
      core.geometry.dispose();
      core.material.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="three-root" ref={mountRef} aria-hidden="true" />;
}
