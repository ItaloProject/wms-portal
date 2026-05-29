import * as THREE from 'three';
import { createWMSLogo3D } from './WMSLogo3D.js';

export class WMSScene {
  constructor(container) {
    this.container = container;
    this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    this.scrollProgress = 0;
    this.time = 0;
    this.visible = false;
    this.logoReady = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;

    this._camTarget = new THREE.Vector3(this.isMobile ? 0.4 : 0.15, -0.02, 0);

    this._init();
    this._bindEvents();
    if (!this.reducedMotion) this._animate();
  }

  _init() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1 : 1.15));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    this.camera.position.set(0, 0, 7);

    this.centerGroup = new THREE.Group();
    this.centerGroup.position.set(this.isMobile ? 0.2 : 0.35, -0.02, 0);
    this.scene.add(this.centerGroup);

    this.logoGroup = createWMSLogo3D({
      renderer: this.renderer,
      onReady: () => {
        this.logoReady = true;
      },
    });
    this.logoGroup.scale.setScalar(this.isMobile ? 1.05 : 1.02);
    this.centerGroup.add(this.logoGroup);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambient);
  }

  _bindEvents() {
    let moveScheduled = false;
    window.addEventListener('mousemove', (e) => {
      if (!this.visible) return;
      this.mouse.targetX = e.clientX / window.innerWidth;
      this.mouse.targetY = 1 - e.clientY / window.innerHeight;
      if (!moveScheduled) {
        moveScheduled = true;
        requestAnimationFrame(() => { moveScheduled = false; });
      }
    }, { passive: true });

    window.addEventListener('resize', () => this._onResize(), { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') this.visible = false;
    });

    const hero = document.getElementById('hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting && document.visibilityState === 'visible';
      }, { threshold: 0.08, rootMargin: '80px 0px' }).observe(hero);
    }
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  setScrollProgress(progress) {
    this.scrollProgress = progress;
  }

  _updateLogoMotion() {
    if (!this.logoGroup || !this.logoReady) return;

    const mx = (this.mouse.x - 0.5) * 0.12;
    const my = (this.mouse.y - 0.5) * 0.1;
    const floatX = Math.sin(this.time * 0.22) * 0.025;

    const targetRotY = mx + Math.sin(this.time * 0.18) * 0.03;
    const targetRotX = my + floatX;

    this.logoGroup.rotation.y += (targetRotY - this.logoGroup.rotation.y) * 0.04;
    this.logoGroup.rotation.x += (targetRotX - this.logoGroup.rotation.x) * 0.04;
  }

  _animate() {
    this.rafId = requestAnimationFrame(() => this._animate());

    if (!this.visible) return;

    this.time += 0.016;
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    if (this.logoReady) {
      const scale = 1 - this.scrollProgress * 0.25;
      this.centerGroup.scale.setScalar(Math.max(scale, 0.55));
      this.centerGroup.position.y = -this.scrollProgress * 1.5 + Math.sin(this.time * 0.4) * 0.02;
      this._updateLogoMotion();
    }

    this.camera.position.x += ((this.mouse.x - 0.5) * 0.35 - this.camera.position.x) * 0.015;
    this.camera.position.y += ((this.mouse.y - 0.5) * 0.25 - this.camera.position.y) * 0.015;
    this.camera.lookAt(this._camTarget);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}

export function initWebGL() {
  const container = document.getElementById('webgl-root');
  if (!container) return null;
  return new WMSScene(container);
}
