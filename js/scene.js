// =========================================================
//  SAAD — 3D Chrome Emblem (Three.js, no build step)
//  Extrudes the real logo SVG into a metallic, reflective
//  3D object that reacts to pointer + scroll.
// =========================================================
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { LOGO_SVG } from '../logo-shape.js';

export async function initScene(canvas, opts = {}) {
    const reduceMotion = !!opts.reduceMotion;
    const onReady = opts.onReady || (() => {});

    const isMobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;

    const renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.75 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    // ---- Environment (studio reflections for the chrome) ----
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // ---- Lights ----
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(5, 7, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfd2ff, 1.4); rim.position.set(-7, -2, -6); scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 40, 60); fill.position.set(-4, 5, 7); scene.add(fill);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    // ---- Build the emblem from the logo SVG ----
    const root = new THREE.Group();
    scene.add(root);

    const material = new THREE.MeshStandardMaterial({
        color: 0xf2f2f5, metalness: 1.0, roughness: 0.21,
        envMapIntensity: 1.6, side: THREE.DoubleSide
    });

    const logo = new THREE.Group();
    const svg = new SVGLoader().parse(LOGO_SVG);
    svg.paths.forEach((path) => {
        SVGLoader.createShapes(path).forEach((shape) => {
            const geo = new THREE.ExtrudeGeometry(shape, {
                depth: 64, bevelEnabled: true,
                bevelThickness: 16, bevelSize: 10, bevelSegments: 5, curveSegments: 20
            });
            logo.add(new THREE.Mesh(geo, material));
        });
    });

    // Center the geometry around the origin, then normalize scale.
    const box = new THREE.Box3().setFromObject(logo);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    logo.children.forEach((m) => m.geometry.translate(-center.x, -center.y, -center.z));
    const targetSize = isMobile ? 1.7 : 2.2;
    const s = targetSize / Math.max(size.x, size.y);
    logo.scale.set(s, -s, s); // flip Y: SVG space is y-down
    root.add(logo);

    // ---- Faint starfield for depth ----
    const starGeo = new THREE.BufferGeometry();
    const starCount = isMobile ? 260 : 520;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        const r = 9 + Math.random() * 14;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(p) * Math.cos(t);
        positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
        positions[i * 3 + 2] = r * Math.cos(p) - 6;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
        color: 0xffffff, size: 0.03, transparent: true, opacity: 0.5, sizeAttenuation: true
    }));
    scene.add(stars);

    // ---- Interaction state ----
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let spin = 0;
    let fade = 0;
    let running = true;
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const baseY = isMobile ? 1.05 : 0.9;

    function onPointerMove(e) {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    if (!isMobile) window.addEventListener('pointermove', onPointerMove, { passive: true });

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) loop(); });

    // Release the WebGL context on navigation so reloads don't leak GPU contexts.
    function freeContext() { running = false; try { renderer.forceContextLoss(); } catch (e) { } try { renderer.dispose(); } catch (e) { } }
    window.addEventListener('pagehide', freeContext);

    // ---- Render loop ----
    const clock = new THREE.Clock();
    let firstFrame = true;

    function loop() {
        if (!running) return;
        requestAnimationFrame(loop);

        // Self-heal sizing (guards against load-time race where the
        // viewport reports a transient 1px width before settling).
        if (window.innerWidth !== lastW || window.innerHeight !== lastH) {
            lastW = window.innerWidth; lastH = window.innerHeight;
            onResize();
        }

        const t = clock.getElapsedTime();
        const sY = window.scrollY;
        const scrollRot = sY * 0.0024;                          // scroll drives extra rotation

        if (!reduceMotion) {
            spin += 0.0042;
            target.x = pointer.y * 0.32;
            target.y = pointer.x * 0.55;
        }
        // Smooth toward pointer + scroll-driven rotation (logo keeps spinning as you scroll)
        root.rotation.x += (target.x - root.rotation.x) * 0.06;
        root.rotation.y += (spin + target.y + (reduceMotion ? 0 : scrollRot) - root.rotation.y) * 0.06;
        root.rotation.z = reduceMotion ? 0 : Math.sin(sY * 0.0004) * 0.14;

        // Settle into a calm backdrop once you leave the hero: drift down, shrink, and dim
        // (keeps spinning, but stops competing with the section content).
        const dimT = Math.min(sY / (window.innerHeight * 0.7), 1);
        root.position.y = baseY + (reduceMotion ? 0 : Math.sin(t * 0.9) * 0.08) - dimT * 0.5;
        root.scale.setScalar(1 - dimT * 0.28);

        if (!reduceMotion) stars.rotation.y = t * 0.02;

        if (fade < 1) fade = Math.min(1, fade + 0.035);
        canvas.style.opacity = (fade * (1 - dimT * 0.8)).toFixed(3);

        renderer.render(scene, camera);

        if (firstFrame) {
            firstFrame = false;
            onReady();
        }
    }
    loop();

    return {
        pause() { running = false; },
        resume() { if (!running) { running = true; loop(); } },
        dispose() {
            running = false;
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            material.dispose();
            logo.children.forEach((m) => m.geometry.dispose());
            starGeo.dispose();
            pmrem.dispose();
        }
    };
}
