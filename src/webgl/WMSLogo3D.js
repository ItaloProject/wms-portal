import * as THREE from 'three';

const LOGO_URL = '/logo-wms.png?v=6';

export function createWMSLogo3D({ renderer, onReady } = {}) {
  const logo = new THREE.Group();

  new THREE.TextureLoader().load(
    LOGO_URL,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      if (renderer) {
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      }

      const aspect = texture.image.width / texture.image.height;
      const height = 2.35;
      const width = height * aspect;
      const geometry = new THREE.PlaneGeometry(width, height);

      const front = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.08,
          opacity: 0.88,
          depthWrite: false,
        }),
      );
      logo.add(front);

      onReady?.(logo);
    },
    undefined,
    (err) => {
      console.warn('WMS logo texture:', err);
      onReady?.(logo);
    },
  );

  return logo;
}
