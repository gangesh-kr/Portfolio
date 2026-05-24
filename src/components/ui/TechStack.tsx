import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const TECH_ITEMS = [
  { name: "React" },
  { name: "Node.js" },
  { name: "TypeScript" },
  { name: "JavaScript" },
  { name: "Three.js" },
  { name: "WebGL" },
  { name: "Express" },
  { name: "MongoDB" },
  { name: "SQL / MySQL" },
  { name: "Redis" },
  { name: "Docker" },
  { name: "Python" },
  { name: "AWS Cloud" },
  { name: "AI / LLM" },
  { name: "NestJS" },
];

const textureLoader = new THREE.TextureLoader();
const placeholderTexture = textureLoader.load("/images/placeholder.webp");
placeholderTexture.colorSpace = THREE.SRGBColorSpace;

const getTexture = (name: string) => {
  let path = "/images/placeholder.webp";
  if (name === "React") path = "/images/react2.webp";
  else if (name === "Node.js") path = "/images/node2.webp";
  else if (name === "TypeScript") path = "/images/typescript.webp";
  else if (name === "JavaScript") path = "/images/javascript.webp";
  else if (name === "Express") path = "/images/express.webp";
  else if (name === "MongoDB") path = "/images/mongo.webp";
  else if (name === "SQL / MySQL") path = "/images/mysql.webp";
  else if (name === "Next.js" || name === "NextJS") path = "/images/next1.webp";

  if (path === "/images/placeholder.webp") return placeholderTexture;

  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map(() => {
  const tech = TECH_ITEMS[Math.floor(Math.random() * TECH_ITEMS.length)];
  return {
    scale: [0.7, 1.0, 0.8, 1.0, 1.0][Math.floor(Math.random() * 5)],
    tech,
  };
});

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );
    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

export function TechStack() {
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // Only run physics when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Pause Lenis while dragging the 3D canvas so drag works,
  // resume immediately on release so page scroll stays buttery smooth
  useEffect(() => {
    const lenis = (window as any).__lenis;
    const wrapper = canvasWrapperRef.current;
    if (!lenis || !wrapper) return;

    const onDown = () => { setIsDragging(true); lenis.stop(); };
    const onUp   = () => { setIsDragging(false); lenis.start(); };

    wrapper.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      wrapper.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      lenis.start(); // safety: always re-enable on unmount
    };
  }, []);

  const materials = useMemo(() => {
    return TECH_ITEMS.map((item) => {
      const texture = getTexture(item.name);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 1.0,
        clearcoat: 0.1,
      });
    });
  }, []);

  return (
    <section
      ref={containerRef}
      id="techstack"
      style={{ touchAction: "pan-y" }}
      className="relative bg-[#0C0C0C] text-[#D7E2EA] w-full overflow-hidden border-t border-zinc-900/50"
    >
      {/* Heading */}
      <div className="relative z-20 flex flex-col items-center pt-16 pb-6 pointer-events-none select-none">
        <span className="text-[#D7E2EA]/40 uppercase tracking-widest text-xs font-semibold mb-3">
          Built with
        </span>
        <h2
          className="hero-heading font-black uppercase tracking-tight text-center leading-none"
          style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
        >
          My Techstack
        </h2>
      </div>

      {/* 3D Canvas
          eventSource + eventPrefix: moves R3F's listener to <html> so the
          <canvas> element itself never swallows wheel/scroll events.
          This is the official R3F fix — no manual forwarding needed. */}
      <div
        ref={canvasWrapperRef}
        className="w-full"
        style={{ height: "70vh", cursor: isDragging ? "grabbing" : "grab" }}
      >
        <Canvas
          shadows
          gl={{ alpha: true, stencil: false, depth: false, antialias: true }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          eventSource={document.documentElement}
          eventPrefix="client"
          onCreated={(state) => {
            state.gl.toneMappingExposure = 1.5;
            state.gl.domElement.style.touchAction = "none";
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={1} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight position={[0, 5, -4]} intensity={2} />

          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />
            {spheres.map((props, i) => {
              const matIndex = TECH_ITEMS.findIndex(
                (item) => item.name === props.tech.name
              );
              return (
                <SphereGeo
                  key={i}
                  scale={props.scale}
                  material={materials[matIndex >= 0 ? matIndex : 0]}
                  isActive={isActive}
                />
              );
            })}
          </Physics>

          <Environment preset="studio" environmentIntensity={0.5} />

          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        </Canvas>
      </div>
    </section>
  );
}

export default TechStack;
