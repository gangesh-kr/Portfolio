import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { useStore, PROJECTS } from '../store/useStore';
import gsap from 'gsap';

export class WebGL {
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public composer: EffectComposer;
    public time: number = 0;

    private container: HTMLElement;
    private rafId: number = 0;

    // Interaction
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private skillObjects: THREE.Sprite[] = [];
    private hoveredObject: THREE.Object3D | null = null;

    // Scroll State
    public scrollY: number = 0;
    public targetScrollY: number = 0;
    private archiveGroup: THREE.Group = new THREE.Group();

    constructor(container: HTMLElement) {
        this.container = container;

        // Init Interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Renderer - Alpha enabled for potential overlays
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Scene
        this.scene = new THREE.Scene();
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x121212, 0.02);

        // Camera
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 5);

        // Composer
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom (Neon Glow)
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // intensity
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);

        // Gamma
        const gammaPass = new ShaderPass(GammaCorrectionShader);
        this.composer.addPass(gammaPass);

        this.createHeroObject();
        this.createRocket();
        // this.createSkillsHelix();
        this.createLights();
        this.createMilkyWay();

        // Listeners
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));

        // Start Loop
        this.render();
    }

    onScroll() {
        // Deprecated: controlled by Lenis in App.tsx
    }

    setScroll(y: number) {
        this.scrollY = y;
        this.targetScrollY = y;
    }

    onMouseMove(event: MouseEvent) {
        // Normalize mouse coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onClick() {
        if (this.hoveredObject) {
            // Check if it's an archive item
            const id = this.hoveredObject.userData.id;
            if (id !== undefined) {
                useStore.getState().setActiveProject(PROJECTS[id]);
            }
        }
    }

    createHeroObject() {
        // ... previous implementation ...
        // Abstract Crystal Shape
        const geometry = new THREE.IcosahedronGeometry(1.5, 0);
        const material = new THREE.MeshPhysicalMaterial({
            roughness: 0,
            metalness: 0.1,
            transmission: 1, // Glass
            thickness: 0.5,
            ior: 2.33,
            clearcoat: 1.0,
            attenuationColor: new THREE.Color('#D4AF37'), // Gold tint
            attenuationDistance: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = "hero";
        mesh.position.set(3.5, 0, 0); // Shift to right
        this.scene.add(mesh);

        // Inner Glow Core
        const coreGeo = new THREE.IcosahedronGeometry(0.8, 0);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xD4AF37,
            wireframe: true
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        mesh.add(core);

        // Floating particles
        const partGeo = new THREE.BufferGeometry();
        const count = 50;
        const pos = new Float32Array(count * 3);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 10;
            if (i < count) speeds[i] = Math.random() * 0.02 + 0.005;
        }

        partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        partGeo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

        const partMat = new THREE.PointsMaterial({
            color: 0xFFD700,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(partGeo, partMat);
        particles.name = "particles";
        this.scene.add(particles);
    }

    createRocket() {
        const rocket = new THREE.Group();
        rocket.name = "rocket";
        rocket.scale.set(0.06, 0.06, 0.06); // Smaller for cursor

        // Main Body - Cylinder
        const bodyGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 16);
        bodyGeo.rotateZ(-Math.PI / 2); // Point forward (along X)
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0xE8E8E8,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x333333,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        rocket.add(body);

        // Nose Cone
        const noseGeo = new THREE.ConeGeometry(0.3, 0.6, 16);
        noseGeo.rotateZ(-Math.PI / 2);
        const noseMat = new THREE.MeshStandardMaterial({
            color: 0xD4AF37, // Gold tip
            metalness: 1,
            roughness: 0.2,
            emissive: 0xAA8800,
            emissiveIntensity: 0.4
        });
        const nose = new THREE.Mesh(noseGeo, noseMat);
        nose.position.x = 0.9;
        rocket.add(nose);

        // Cockpit Window
        const windowGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const windowMat = new THREE.MeshStandardMaterial({
            color: 0x00FFFF,
            metalness: 0.3,
            roughness: 0,
            emissive: 0x00AAAA,
            emissiveIntensity: 0.8
        });
        const cockpit = new THREE.Mesh(windowGeo, windowMat);
        cockpit.position.set(0.3, 0.25, 0);
        rocket.add(cockpit);

        // Fins (4 fins)
        const finGeo = new THREE.BoxGeometry(0.5, 0.05, 0.4);
        const finMat = new THREE.MeshStandardMaterial({
            color: 0xD4AF37,
            metalness: 0.8,
            roughness: 0.3,
            emissive: 0x886600,
            emissiveIntensity: 0.2
        });

        for (let i = 0; i < 4; i++) {
            const fin = new THREE.Mesh(finGeo, finMat);
            const angle = (i / 4) * Math.PI * 2;
            fin.position.set(-0.4, Math.sin(angle) * 0.35, Math.cos(angle) * 0.35);
            fin.rotation.x = angle;
            rocket.add(fin);
        }

        // Engine Exhaust Flame
        const flameGeo = new THREE.ConeGeometry(0.25, 0.8, 8);
        flameGeo.rotateZ(Math.PI / 2); // Point backward
        const flameMat = new THREE.MeshBasicMaterial({
            color: 0xFF6600,
            transparent: true,
            opacity: 0.3
        });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.name = "flame";
        flame.position.x = -1;
        rocket.add(flame);

        // Engine Glow Light - Minimal intensity
        const engineLight = new THREE.PointLight(0xFF6600, 0.1, 1);
        engineLight.position.set(-0.8, 0, 0);
        rocket.add(engineLight);

        // Particle Trail System
        const trailGeo = new THREE.BufferGeometry();
        const trailCount = 50;
        const trailPositions = new Float32Array(trailCount * 3);
        const trailOpacities = new Float32Array(trailCount);

        for (let i = 0; i < trailCount; i++) {
            trailPositions[i * 3] = -1 - (i * 0.1);
            trailPositions[i * 3 + 1] = 0;
            trailPositions[i * 3 + 2] = 0;
            trailOpacities[i] = 1 - (i / trailCount);
        }

        trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

        const trailMat = new THREE.PointsMaterial({
            color: 0xFF8800,
            size: 0.15,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const trail = new THREE.Points(trailGeo, trailMat);
        trail.name = "rocketTrail";
        rocket.add(trail);

        this.scene.add(rocket);
    }

    createSkillsHelix() {
        // Curve Path
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10, -5, 0),
            new THREE.Vector3(-5, 0, 5),
            new THREE.Vector3(0, 5, 0),
            new THREE.Vector3(5, 0, 5),
            new THREE.Vector3(10, -5, 0)
        ]);

        // Tube for visual guide (optional/subtle)
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        this.scene.add(tube);

        // Skills / Project Concepts
        const skills = [
            "MERN STACK", "THREE.JS", "REACT FIBER", "GSAP ANIMATION",
            "NODE.JS", "MONGODB", "TYPESCRIPT", "TAILWIND CSS"
        ];

        this.skillObjects = [];

        skills.forEach((skill, i) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'rgba(0,0,0,0)'; // Transparent
                ctx.fillRect(0, 0, 512, 128);

                ctx.font = 'bold 60px Arial';
                ctx.fillStyle = '#00ffff';
                ctx.textAlign = 'center';
                ctx.fillText(skill, 256, 80);

                // Glow effect border
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 4;
                ctx.strokeRect(10, 10, 492, 108);
            }

            const tex = new THREE.CanvasTexture(canvas);
            const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.8 });
            const sprite = new THREE.Sprite(mat);

            sprite.scale.set(4, 1, 1);

            // Store initial progress for animation
            sprite.userData = {
                progress: i / skills.length,
                curve: curve
            };

            this.scene.add(sprite);
            this.skillObjects.push(sprite);
        });
    }

    createLights() {
        // Brighter Ambient
        const ambient = new THREE.AmbientLight(0xffffff, 0.3); // Reduced slightly
        this.scene.add(ambient);

        // Gold Rim Light
        const spot1 = new THREE.SpotLight(0xD4AF37, 10);
        spot1.position.set(5, 10, 5);
        spot1.lookAt(0, 0, 0);
        this.scene.add(spot1);

        // Blue Fill
        const spot2 = new THREE.SpotLight(0x00ffff, 5);
        spot2.position.set(-5, -5, 5);
        spot2.lookAt(0, 0, 0);
        this.scene.add(spot2);
    }

    createMilkyWay() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorInside = new THREE.Color(0xffd700); // Gold center
        const colorOutside = new THREE.Color(0x121212); // Darker edge

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 20 + 5; // Ring
            const spinAngle = radius * 5;
            const branchAngle = (i % 3) * ((Math.PI * 2) / 3);

            const x = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5);
            const y = (Math.random() - 0.5) * 2; // Flat galaxy
            const z = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            // Color mix
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / 20);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        const galaxy = new THREE.Points(geometry, material);
        galaxy.name = 'milkyway';
        this.scene.add(galaxy);
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.composer.setSize(width, height);
    }

    render() {
        this.time += 0.005;

        // Update Scroll (Handled by setScroll via Lenis)

        // Move Camera based on Scroll
        // 1px scroll = 0.01 units
        this.camera.position.y = -(this.scrollY * 0.01);

        // Multi-layer Parallax System
        const mouseParallaxX = this.mouse.x * 0.15;
        const mouseParallaxY = this.mouse.y * 0.15;

        // Hero Crystal - Medium parallax (0.7x)
        const hero = this.scene.getObjectByName('hero');
        if (hero) {
            hero.rotation.y = Math.sin(this.time * 0.5) * 0.2;
            hero.rotation.x = Math.cos(this.time * 0.3) * 0.1;
            hero.position.y = Math.sin(this.time) * 0.2 + mouseParallaxY * 0.7;
            hero.position.x = 3.5 + mouseParallaxX * 0.7;
        }

        // Particles - Fast parallax (1.3x)
        const particles = this.scene.getObjectByName('particles');
        if (particles) {
            particles.position.x = mouseParallaxX * 1.3;
            particles.position.y = mouseParallaxY * 1.3;
            particles.rotation.y = this.time * 0.1;
        }



        // Raycasting
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        // Reset previous hover
        if (this.hoveredObject && (!intersects.length || intersects[0].object !== this.hoveredObject)) {
            // @ts-ignore
            if (this.hoveredObject.userData.isWorkstation) {
                const screen = this.hoveredObject.userData.screen;
                if (screen) {
                    gsap.to(screen.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "power2.out" });
                    gsap.to(screen.material, { opacity: 0.8, duration: 0.5 });
                }
                document.body.style.cursor = 'default';
            }
            this.hoveredObject = null;
        }

        // Handle new hover
        if (intersects.length > 0) {
            const hit = intersects[0].object;
            if (hit.userData.isWorkstation) {
                if (this.hoveredObject !== hit) {
                    this.hoveredObject = hit;
                    const screen = hit.userData.screen;
                    if (screen) {
                        // GSAP Punch Effect
                        gsap.to(screen.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.4, ease: "back.out(1.7)" });
                        gsap.to(screen.material, { opacity: 1, duration: 0.2 });
                    }
                    document.body.style.cursor = 'pointer';
                }
            }
        }

        // Animate Galaxy - Slow parallax (0.3x)
        const galaxy = this.scene.getObjectByName('milkyway');
        if (galaxy) {
            galaxy.rotation.y = this.time * 0.05; // Slow spin
            galaxy.rotation.z = this.scrollY * 0.0005; // Scroll connection
            // Mouse parallax - slowest layer
            galaxy.position.x = mouseParallaxX * 0.3;
            galaxy.position.y = mouseParallaxY * 0.3;
        }

        // Update Rocket - Smooth cursor following
        const rocket = this.scene.getObjectByName('rocket');
        if (rocket) {
            // Calculate target position based on mouse
            const targetX = this.mouse.x * (this.camera.aspect * 3);
            const targetY = this.mouse.y * 3;

            // Store previous position for velocity
            const prevX = rocket.position.x;
            const prevY = rocket.position.y;

            // Smooth lerp to target (lower = smoother)
            rocket.position.x += (targetX - rocket.position.x) * 0.08;
            rocket.position.y += (targetY - rocket.position.y) * 0.08;
            rocket.position.z = 2.5;

            // Calculate velocity
            const velX = rocket.position.x - prevX;
            const velY = rocket.position.y - prevY;
            const speed = Math.sqrt(velX * velX + velY * velY);

            // Rotate based on velocity direction
            if (speed > 0.001) {
                const targetAngle = Math.atan2(velY, velX);
                rocket.rotation.z = targetAngle;
            }

            // Animate flame based on speed
            const flame = rocket.getObjectByName('flame');
            if (flame) {
                const flameScale = 0.8 + speed * 10 + Math.sin(this.time * 20) * 0.1;
                flame.scale.x = flameScale;
                flame.scale.y = 1 + Math.sin(this.time * 30) * 0.2;
            }
        }

        this.composer.render();
        this.rafId = requestAnimationFrame(this.render.bind(this));
    }

    dispose() {
        cancelAnimationFrame(this.rafId);
        window.removeEventListener('resize', this.resize.bind(this));
        window.removeEventListener('scroll', this.onScroll.bind(this));
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('click', this.onClick.bind(this));
        this.renderer.dispose();
    }
}
