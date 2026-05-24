import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { useStore, PROJECTS } from '../store/useStore';
import gsap from 'gsap';
import { getLerpedCameraState } from './ScrollStory';

export class WebGL {
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public composer: EffectComposer;
    public time: number = 0;

    private container: HTMLElement;
    private rafId: number = 0;
    private bloomPass: UnrealBloomPass;

    // Interaction
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private hoveredObject: THREE.Object3D | null = null;

    // Scroll / Story State
    public scrollY: number = 0;
    public totalScrollHeight: number = 0;
    private scrollProgress: number = 0;

    // Skill constellation nodes
    private skillNodes: THREE.Mesh[] = [];
    private skillLabels: THREE.Sprite[] = [];
    private skillOrbitGroup: THREE.Group = new THREE.Group();

    // Warp streaks
    private warpStreaks: THREE.Line[] = [];
    private warpGroup: THREE.Group = new THREE.Group();

    // Timeline beam for experience
    private timelineGroup: THREE.Group = new THREE.Group();

    constructor(container: HTMLElement) {
        this.container = container;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.container.appendChild(this.renderer.domElement);

        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x080808, 0.02);

        // Camera
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
        this.camera.position.set(0, 0, 5);

        // Post-processing
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        );
        this.composer.addPass(this.bloomPass);

        const gammaPass = new ShaderPass(GammaCorrectionShader);
        this.composer.addPass(gammaPass);

        // Build scene elements
        this.createHeroObject();
        this.createRocket();
        this.createMilkyWay();
        this.createWarpStreaks();
        this.createSkillConstellation();
        this.createTimelineBeam();
        this.createContactNebula();
        this.createLights();

        // Event listeners
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));

        this.render();
    }

    setScroll(y: number) {
        this.scrollY = y;
        // Compute document scroll progress 0-1
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;
    }

    onMouseMove(event: MouseEvent) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onClick() {
        if (this.hoveredObject) {
            const id = this.hoveredObject.userData.id;
            if (id !== undefined) {
                useStore.getState().setActiveProject(PROJECTS[id]);
            }
        }
    }

    // ─── Scene Builders ──────────────────────────────────────────────────────

    createHeroObject() {
        const geometry = new THREE.IcosahedronGeometry(1.5, 0);
        const material = new THREE.MeshPhysicalMaterial({
            roughness: 0,
            metalness: 0.1,
            transmission: 1,
            thickness: 0.5,
            ior: 2.33,
            clearcoat: 1.0,
            attenuationColor: new THREE.Color('#D4AF37'),
            attenuationDistance: 0.5,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'hero';
        mesh.position.set(3.5, 0, 0);
        this.scene.add(mesh);

        const coreGeo = new THREE.IcosahedronGeometry(0.8, 0);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            wireframe: true,
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        mesh.add(core);

        // Ambient particles
        const partGeo = new THREE.BufferGeometry();
        const count = 80;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 12;
        partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const partMat = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.04,
            transparent: true,
            opacity: 0.6,
        });
        const particles = new THREE.Points(partGeo, partMat);
        particles.name = 'particles';
        this.scene.add(particles);
    }

    createRocket() {
        const rocket = new THREE.Group();
        rocket.name = 'rocket';
        rocket.scale.set(0.06, 0.06, 0.06);

        const bodyGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 16);
        bodyGeo.rotateZ(-Math.PI / 2);
        const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({
            color: 0xe8e8e8, metalness: 0.9, roughness: 0.1,
            emissive: 0x333333, emissiveIntensity: 0.3,
        }));
        rocket.add(body);

        const noseGeo = new THREE.ConeGeometry(0.3, 0.6, 16);
        noseGeo.rotateZ(-Math.PI / 2);
        const nose = new THREE.Mesh(noseGeo, new THREE.MeshStandardMaterial({
            color: 0xd4af37, metalness: 1, roughness: 0.2,
            emissive: 0xaa8800, emissiveIntensity: 0.4,
        }));
        nose.position.x = 0.9;
        rocket.add(nose);

        const cockpit = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshStandardMaterial({
                color: 0x00ffff, metalness: 0.3, roughness: 0,
                emissive: 0x00aaaa, emissiveIntensity: 0.8,
            })
        );
        cockpit.position.set(0.3, 0.25, 0);
        rocket.add(cockpit);

        const finGeo = new THREE.BoxGeometry(0.5, 0.05, 0.4);
        const finMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37, metalness: 0.8, roughness: 0.3,
            emissive: 0x886600, emissiveIntensity: 0.2,
        });
        for (let i = 0; i < 4; i++) {
            const fin = new THREE.Mesh(finGeo, finMat);
            const angle = (i / 4) * Math.PI * 2;
            fin.position.set(-0.4, Math.sin(angle) * 0.35, Math.cos(angle) * 0.35);
            fin.rotation.x = angle;
            rocket.add(fin);
        }

        const flameGeo = new THREE.ConeGeometry(0.25, 0.8, 8);
        flameGeo.rotateZ(Math.PI / 2);
        const flame = new THREE.Mesh(flameGeo, new THREE.MeshBasicMaterial({
            color: 0xff6600, transparent: true, opacity: 0.3,
        }));
        flame.name = 'flame';
        flame.position.x = -1;
        rocket.add(flame);

        const engineLight = new THREE.PointLight(0xff6600, 0.1, 1);
        engineLight.position.set(-0.8, 0, 0);
        rocket.add(engineLight);

        this.scene.add(rocket);
    }

    createMilkyWay() {
        const particleCount = 3000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorInside = new THREE.Color(0xffd700);
        const colorOutside = new THREE.Color(0x0a0a2e);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 25 + 5;
            const spinAngle = radius * 5;
            const branchAngle = (i % 3) * ((Math.PI * 2) / 3);

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 1.5;
            positions[i3 + 1] = (Math.random() - 0.5) * 3;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 1.5;

            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / 25);
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const galaxy = new THREE.Points(geometry, new THREE.PointsMaterial({
            size: 0.12,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
        }));
        galaxy.name = 'milkyway';
        this.scene.add(galaxy);
    }

    createWarpStreaks() {
        this.warpGroup.name = 'warpGroup';
        const count = 120;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.5 + Math.random() * 3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const length = 0.5 + Math.random() * 3.5;

            const points = [
                new THREE.Vector3(x, y, -length),
                new THREE.Vector3(x, y, 0.5),
            ];
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            const mat = new THREE.LineBasicMaterial({
                color: new THREE.Color().setHSL(0.1 + Math.random() * 0.05, 0.8, 0.6 + Math.random() * 0.3),
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
            });
            const line = new THREE.Line(geo, mat);
            this.warpGroup.add(line);
            this.warpStreaks.push(line);
        }

        this.scene.add(this.warpGroup);
    }

    createSkillConstellation() {
        this.skillOrbitGroup.name = 'skillConstellation';
        this.skillOrbitGroup.position.y = -5;

        const SKILLS = [
            { name: 'React.js', color: 0x61dafb },
            { name: 'TypeScript', color: 0x3178c6 },
            { name: 'Three.js', color: 0x049ef4 },
            { name: 'Node.js', color: 0x43853d },
            { name: 'WebGL', color: 0xff6b35 },
            { name: 'MongoDB', color: 0x47a248 },
            { name: 'GSAP', color: 0x88ce02 },
            { name: 'Docker', color: 0x0db7ed },
            { name: 'GraphQL', color: 0xe10098 },
            { name: 'Redis', color: 0xdc382d },
            { name: 'MySQL', color: 0x4479a1 },
            { name: 'GCP', color: 0x4285f4 },
        ];

        const goldenAngle = Math.PI * (3 - Math.sqrt(5));

        SKILLS.forEach((skill, i) => {
            const radius = 2.2 + (i % 3) * 0.8;
            const theta = i * goldenAngle;
            const phi = Math.acos(1 - (2 * (i + 0.5)) / SKILLS.length);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = (i / SKILLS.length - 0.5) * 4;
            const z = radius * Math.sin(phi) * Math.sin(theta);

            // Glowing node
            const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
            const nodeMat = new THREE.MeshBasicMaterial({
                color: skill.color,
                transparent: true,
                opacity: 0,
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.set(x, y, z);
            node.userData = { skillIndex: i, basePos: new THREE.Vector3(x, y, z) };
            this.skillOrbitGroup.add(node);
            this.skillNodes.push(node);

            // Halo glow
            const haloGeo = new THREE.SphereGeometry(0.14, 8, 8);
            const haloMat = new THREE.MeshBasicMaterial({
                color: skill.color,
                transparent: true,
                opacity: 0,
                wireframe: true,
            });
            const halo = new THREE.Mesh(haloGeo, haloMat);
            node.add(halo);

            // Label sprite
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 56;
            const ctx = canvas.getContext('2d')!;
            ctx.clearRect(0, 0, 256, 56);
            ctx.font = 'bold 22px "Space Mono", monospace';
            ctx.fillStyle = `#${skill.color.toString(16).padStart(6, '0')}`;
            ctx.textAlign = 'center';
            ctx.fillText(skill.name, 128, 36);

            const tex = new THREE.CanvasTexture(canvas);
            const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0 });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(1.2, 0.28, 1);
            sprite.position.set(x * 1.3, y, z * 1.3);
            this.skillOrbitGroup.add(sprite);
            this.skillLabels.push(sprite);

            // Connection lines to nearby nodes
            if (i > 0 && i % 3 === 0) {
                const prevNode = this.skillNodes[i - 1];
                const linePts = [node.position.clone(), prevNode.position.clone()];
                const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
                const lineMat = new THREE.LineBasicMaterial({
                    color: 0x334455,
                    transparent: true,
                    opacity: 0,
                });
                const connLine = new THREE.Line(lineGeo, lineMat);
                connLine.userData.isConstellationLine = true;
                this.skillOrbitGroup.add(connLine);
            }
        });

        this.scene.add(this.skillOrbitGroup);
    }

    createTimelineBeam() {
        this.timelineGroup.name = 'timelineBeam';
        this.timelineGroup.position.y = -10;

        // Central spine
        const spinePoints = [
            new THREE.Vector3(0, -6, 0),
            new THREE.Vector3(0, 6, 0),
        ];
        const spineGeo = new THREE.BufferGeometry().setFromPoints(spinePoints);
        const spineMat = new THREE.LineBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0,
        });
        const spine = new THREE.Line(spineGeo, spineMat);
        spine.name = 'timelineSpine';
        this.timelineGroup.add(spine);

        // Timeline nodes
        const experiences = [
            { y: 4.5, color: 0xd4af37, label: 'AMC Bridge' },
            { y: 1.5, color: 0x00ffcc, label: 'Kiswok' },
            { y: -1.5, color: 0xff6b35, label: 'ElevonData' },
            { y: -4.5, color: 0xa855f7, label: 'LOTS' },
        ];

        experiences.forEach((exp, i) => {
            const nodeGeo = new THREE.OctahedronGeometry(0.2, 0);
            const nodeMat = new THREE.MeshStandardMaterial({
                color: exp.color,
                emissive: exp.color,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0,
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.set(0, exp.y, 0);
            node.name = `timelineNode_${i}`;
            this.timelineGroup.add(node);

            // Ring accent
            const ringGeo = new THREE.TorusGeometry(0.35, 0.02, 8, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: exp.color,
                transparent: true,
                opacity: 0,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(0, exp.y, 0);
            ring.rotation.x = Math.PI / 2;
            this.timelineGroup.add(ring);

            // Horizontal branch
            const branchSide = i % 2 === 0 ? 1 : -1;
            const branchPts = [
                new THREE.Vector3(0, exp.y, 0),
                new THREE.Vector3(branchSide * 3, exp.y, 0),
            ];
            const branchGeo = new THREE.BufferGeometry().setFromPoints(branchPts);
            const branchMat = new THREE.LineBasicMaterial({
                color: exp.color,
                transparent: true,
                opacity: 0,
            });
            const branch = new THREE.Line(branchGeo, branchMat);
            this.timelineGroup.add(branch);
        });

        this.scene.add(this.timelineGroup);
    }

    createContactNebula() {
        // Floating communication rings at bottom of story
        const nebulaGroup = new THREE.Group();
        nebulaGroup.name = 'contactNebula';
        nebulaGroup.position.y = -15;

        for (let i = 0; i < 5; i++) {
            const radius = 1.5 + i * 0.8;
            const ringGeo = new THREE.TorusGeometry(radius, 0.015, 6, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.12 + i * 0.02, 0.9, 0.5),
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = (Math.PI / 2) + i * 0.15;
            ring.rotation.y = i * 0.3;
            nebulaGroup.add(ring);
        }

        // Pulse sphere at center
        const pulseGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0,
            wireframe: true,
        });
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        pulse.name = 'contactPulse';
        nebulaGroup.add(pulse);

        this.scene.add(nebulaGroup);
    }

    createLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambient);

        const spot1 = new THREE.SpotLight(0xd4af37, 10);
        spot1.position.set(5, 10, 5);
        spot1.lookAt(0, 0, 0);
        this.scene.add(spot1);

        const spot2 = new THREE.SpotLight(0x00ffff, 5);
        spot2.position.set(-5, -5, 5);
        spot2.lookAt(0, 0, 0);
        this.scene.add(spot2);
    }

    // ─── Render Loop ─────────────────────────────────────────────────────────

    render() {
        this.time += 0.005;
        const p = this.scrollProgress;

        // ── Camera Story System ──────────────────────────────────────────────
        const { camera: targetCam, scene: targetScene } = getLerpedCameraState(p);
        const mouseParallaxX = this.mouse.x * 0.12;
        const mouseParallaxY = this.mouse.y * 0.12;

        this.camera.position.lerp(
            new THREE.Vector3(
                targetCam.position.x + mouseParallaxX * 0.5,
                targetCam.position.y + mouseParallaxY * 0.5,
                targetCam.position.z
            ),
            0.04
        );

        const currentLookAt = new THREE.Vector3();
        currentLookAt.lerp(
            new THREE.Vector3(
                targetCam.lookAt.x + mouseParallaxX * 0.3,
                targetCam.lookAt.y,
                targetCam.lookAt.z
            ),
            0.04
        );

        const lookAtWorld = targetCam.lookAt.clone().add(new THREE.Vector3(mouseParallaxX * 0.3, mouseParallaxY * 0.3, 0));
        this.camera.lookAt(lookAtWorld);
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetCam.fov ?? 35, 0.04);
        this.camera.updateProjectionMatrix();

        // ── Fog & Bloom ──────────────────────────────────────────────────────
        (this.scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp(
            (this.scene.fog as THREE.FogExp2).density,
            targetScene.fogDensity ?? 0.02,
            0.03
        );
        this.bloomPass.strength = THREE.MathUtils.lerp(
            this.bloomPass.strength,
            targetScene.bloomIntensity ?? 1.5,
            0.03
        );

        // ── Hero Crystal ─────────────────────────────────────────────────────
        const hero = this.scene.getObjectByName('hero');
        if (hero) {
            hero.rotation.y = Math.sin(this.time * 0.5) * 0.2;
            hero.rotation.x = Math.cos(this.time * 0.3) * 0.1;
            const heroOpacity = targetScene.heroOpacity ?? 0;
            (hero as THREE.Mesh).traverse((child) => {
                if ((child as THREE.Mesh).material) {
                    const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
                    if (mat.opacity !== undefined) {
                        mat.opacity = THREE.MathUtils.lerp(mat.opacity, heroOpacity, 0.05);
                        mat.transparent = true;
                    }
                }
            });
            hero.position.y = Math.sin(this.time) * 0.2 + mouseParallaxY * 0.7;
            hero.position.x = 3.5 + mouseParallaxX * 0.7;
        }

        // ── Galaxy ───────────────────────────────────────────────────────────
        const galaxy = this.scene.getObjectByName('milkyway');
        if (galaxy) {
            galaxy.rotation.y = this.time * 0.05;
            galaxy.position.x = mouseParallaxX * 0.3;
            galaxy.position.y = mouseParallaxY * 0.3;
            const targetOpacity = targetScene.galaxyOpacity ?? 1;
            const mat = (galaxy as THREE.Points).material as THREE.PointsMaterial;
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, Math.min(targetOpacity, 1.0), 0.03);
        }

        // ── Warp Streaks (active 0.15-0.30) ──────────────────────────────────
        const warpActive = p >= 0.12 && p <= 0.35;
        const warpStrength = warpActive
            ? Math.sin(((p - 0.12) / 0.23) * Math.PI)
            : 0;

        this.warpGroup.position.z = this.camera.position.z - 4;
        this.warpGroup.position.y = this.camera.position.y;

        this.warpStreaks.forEach((streak, i) => {
            const mat = streak.material as THREE.LineBasicMaterial;
            const targetOpacity = warpStrength * (0.3 + (i % 3) * 0.15);
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);

            // Animate streak z offset for speed feel
            const positions = streak.geometry.attributes.position.array as Float32Array;
            const speed = 0.02 + (i % 5) * 0.01;
            positions[2] -= speed;
            positions[5] -= speed;
            if (positions[5] < -8) {
                positions[2] = 0;
                positions[5] = 0.5;
            }
            streak.geometry.attributes.position.needsUpdate = true;
        });

        // ── Skill Constellation (active 0.30-0.55) ─────────────────────────
        const skillActive = p >= 0.28 && p <= 0.58;
        const skillStrength = skillActive
            ? Math.sin(((p - 0.28) / 0.30) * Math.PI)
            : 0;

        this.skillOrbitGroup.rotation.y = this.time * 0.08;
        this.skillOrbitGroup.rotation.x = Math.sin(this.time * 0.05) * 0.1;

        this.skillNodes.forEach((node, i) => {
            const mat = node.material as THREE.MeshBasicMaterial;
            const targetOpacity = skillStrength * (0.5 + Math.sin(this.time * 2 + i) * 0.25);
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.04);

            // Pulse halo
            const halo = node.children[0] as THREE.Mesh;
            if (halo) {
                const haloMat = halo.material as THREE.MeshBasicMaterial;
                haloMat.opacity = THREE.MathUtils.lerp(
                    haloMat.opacity,
                    skillStrength * 0.2 * Math.abs(Math.sin(this.time * 3 + i * 0.7)),
                    0.04
                );
                const scale = 1 + Math.sin(this.time * 2 + i * 0.5) * 0.15;
                halo.scale.setScalar(scale);
            }
        });

        this.skillLabels.forEach((label, i) => {
            const mat = label.material as THREE.SpriteMaterial;
            const targetOpacity = skillStrength * 0.85;
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.03);
        });

        // Fade constellation connection lines
        this.skillOrbitGroup.children.forEach((child) => {
            if ((child as any).userData?.isConstellationLine || child instanceof THREE.Line) {
                const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
                if (mat.opacity !== undefined) {
                    mat.opacity = THREE.MathUtils.lerp(mat.opacity, skillStrength * 0.3, 0.03);
                }
            }
        });

        // ── Timeline Beam (active 0.55-0.78) ────────────────────────────────
        const timelineActive = p >= 0.52 && p <= 0.82;
        const timelineStrength = timelineActive
            ? Math.sin(((p - 0.52) / 0.30) * Math.PI)
            : 0;

        const spine = this.timelineGroup.getObjectByName('timelineSpine') as THREE.Line;
        if (spine) {
            (spine.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(
                (spine.material as THREE.LineBasicMaterial).opacity,
                timelineStrength * 0.7,
                0.04
            );
        }
        this.timelineGroup.rotation.y = this.time * 0.06 + mouseParallaxX * 0.5;

        // Timeline nodes pulsing
        for (let i = 0; i < 4; i++) {
            const tNode = this.timelineGroup.getObjectByName(`timelineNode_${i}`) as THREE.Mesh;
            if (tNode) {
                const mat = tNode.material as THREE.MeshStandardMaterial;
                mat.opacity = THREE.MathUtils.lerp(mat.opacity, timelineStrength * 0.9, 0.04);
                tNode.rotation.y = this.time * 1.2 + i * 0.8;
                tNode.rotation.z = this.time * 0.8;
                const scalePulse = 1 + Math.sin(this.time * 2 + i * 1.5) * 0.12;
                tNode.scale.setScalar(scalePulse);
            }
        }

        // Animate timeline children (rings + branches)
        this.timelineGroup.children.forEach((child) => {
            if (child instanceof THREE.Line) {
                const mat = child.material as THREE.LineBasicMaterial;
                if (mat.opacity !== undefined) {
                    mat.opacity = THREE.MathUtils.lerp(mat.opacity, timelineStrength * 0.5, 0.04);
                }
            } else if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
                const mat = child.material as THREE.MeshBasicMaterial;
                mat.opacity = THREE.MathUtils.lerp(mat.opacity, timelineStrength * 0.4, 0.04);
                child.rotation.z = this.time * 0.5;
            }
        });

        // ── Contact Nebula (active 0.78-1.0) ────────────────────────────────
        const contactActive = p >= 0.75;
        const contactStrength = contactActive
            ? Math.min((p - 0.75) / 0.1, 1)
            : 0;

        const nebula = this.scene.getObjectByName('contactNebula');
        if (nebula) {
            nebula.rotation.y = this.time * 0.15;
            nebula.rotation.z = this.time * 0.05;
            nebula.children.forEach((child, i) => {
                if ((child as THREE.Mesh).material) {
                    const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
                    const targetOp = contactStrength * (0.3 + i * 0.06);
                    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, 0.04);
                    if (child instanceof THREE.Mesh && !(child.name === 'contactPulse')) {
                        child.rotation.y = this.time * (0.3 + i * 0.1);
                    }
                }
            });
            const pulse = nebula.getObjectByName('contactPulse') as THREE.Mesh;
            if (pulse) {
                const pulseScale = 1 + Math.sin(this.time * 2) * 0.2;
                pulse.scale.setScalar(pulseScale);
                const pMat = pulse.material as THREE.MeshBasicMaterial;
                pMat.opacity = contactStrength * 0.6;
            }
        }

        // ── Rocket ──────────────────────────────────────────────────────────
        const rocket = this.scene.getObjectByName('rocket');
        if (rocket) {
            const rocketVisible = p < 0.45;
            const targetX = this.mouse.x * (this.camera.aspect * 3);
            const targetY = this.mouse.y * 3;

            const prevX = rocket.position.x;
            const prevY = rocket.position.y;

            rocket.position.x += (targetX - rocket.position.x) * 0.08;
            rocket.position.y += (targetY - rocket.position.y) * 0.08;
            rocket.position.z = 2.5;

            const velX = rocket.position.x - prevX;
            const velY = rocket.position.y - prevY;
            const speed = Math.sqrt(velX * velX + velY * velY);

            if (speed > 0.001) {
                rocket.rotation.z = Math.atan2(velY, velX);
            }

            // Fade out as we scroll deeper
            rocket.traverse((child) => {
                if ((child as THREE.Mesh).material) {
                    const mat = (child as THREE.Mesh).material as any;
                    if (mat.opacity !== undefined && mat.transparent) {
                        const currentOpacity = mat.opacity;
                        const newOpacity = rocketVisible ? currentOpacity : Math.max(0, currentOpacity - 0.02);
                        mat.opacity = newOpacity;
                    }
                }
            });

            const flame = rocket.getObjectByName('flame');
            if (flame) {
                const flameScale = 0.8 + speed * 10 + Math.sin(this.time * 20) * 0.1;
                flame.scale.x = flameScale;
            }
        }

        // ── Particles subtle drift ───────────────────────────────────────────
        const particles = this.scene.getObjectByName('particles');
        if (particles) {
            particles.rotation.y = this.time * 0.1;
            particles.position.x = mouseParallaxX * 1.3;
            particles.position.y = mouseParallaxY * 1.3;
        }

        this.composer.render();
        this.rafId = requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.composer.setSize(width, height);
    }

    dispose() {
        cancelAnimationFrame(this.rafId);
        window.removeEventListener('resize', this.resize.bind(this));
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('click', this.onClick.bind(this));
        this.renderer.dispose();
    }
}