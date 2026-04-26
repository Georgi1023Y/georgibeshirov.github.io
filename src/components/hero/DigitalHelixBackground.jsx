import { Suspense, useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useTheme } from "next-themes";

function fibonacciSphere(i, n, r) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
  const theta = Math.sqrt(Math.PI * n) * phi;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return [x, y, z];
}

/**
 * Particles on a shell so the center stays visually open for the hero copy.
 */
function buildShellPositions(count, radius) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const j = i * 3;
    const [x, y, z] = fibonacciSphere(i, count, radius);
    arr[j] = x;
    arr[j + 1] = y;
    arr[j + 2] = z;
  }
  return arr;
}

function RepellingParticleSphere({ pointerRef, count, colorIndigo, colorEmerald }) {
  const pointsRef = useRef(null);
  const base = useMemo(() => buildShellPositions(count, 1.38), [count]);
  const positions = useMemo(() => {
    const p = new Float32Array(base.length);
    p.set(base);
    return p;
  }, [base]);
  const innerCount = Math.max(32, Math.floor(count * 0.45));
  const innerPositions = useMemo(
    () => buildShellPositions(innerCount, 1.02),
    [innerCount]
  );
  const smooth = useRef({ x: 0, y: 0 });
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    const p = pointerRef.current;
    smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, p.x, 0.06);
    smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, p.y, 0.06);

    const inflX = smooth.current.x * 0.62;
    const inflY = smooth.current.y * 0.48;
    const repel = 0.18;

    for (let i = 0; i < count; i++) {
      const o = i * 3;
      const bx = base[o];
      const by = base[o + 1];
      const bz = base[o + 2];
      let x = positions[o];
      let y = positions[o + 1];
      let z = positions[o + 2];
      const dx = x - inflX;
      const dy = y - inflY;
      const dz = z - 0.28;
      const d = Math.hypot(dx, dy, dz) + 1e-5;
      if (d < 0.9) {
        const s = (repel * (0.9 - d)) / d;
        x += dx * s;
        y += dy * s;
        z += dz * s;
      }
      const k = 0.11;
      x = THREE.MathUtils.lerp(x, bx, k);
      y = THREE.MathUtils.lerp(y, by, k);
      z = THREE.MathUtils.lerp(z, bz, k);
      const pulse = 1 + Math.sin(t.current * 0.6 + o * 0.001) * 0.012;
      positions[o] = x * pulse;
      positions[o + 1] = y * pulse;
      positions[o + 2] = z * pulse;
    }
    const attr = pointsRef.current?.geometry?.getAttribute("position");
    if (attr) {
      attr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0.12, 0]}>
      <points ref={pointsRef} rotation={[0.15, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={colorIndigo}
          sizeAttenuation
          depthWrite={false}
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points rotation={[0.15, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={innerCount}
            array={innerPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color={colorEmerald}
          sizeAttenuation
          depthWrite={false}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function InnerWireOrbits({ isLight, colorIndigo, colorEmerald }) {
  const g1 = useRef(null);
  const g2 = useRef(null);
  const g3 = useRef(null);

  const { icoEdge, tA, tB } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(0.52, 1);
    return {
      icoEdge: new THREE.EdgesGeometry(ico, 1),
      tA: new THREE.EdgesGeometry(new THREE.TorusGeometry(0.86, 0.012, 8, 72), 1),
      tB: new THREE.EdgesGeometry(new THREE.TorusGeometry(0.78, 0.01, 8, 64), 1),
    };
  }, []);

  useEffect(() => {
    return () => {
      icoEdge.dispose();
      tA.dispose();
      tB.dispose();
    };
  }, [icoEdge, tA, tB]);

  useFrame((_, d) => {
    if (g1.current) g1.current.rotation.y += d * 0.1;
    if (g2.current) g2.current.rotation.x -= d * 0.12;
    if (g3.current) g3.current.rotation.z += d * 0.08;
  });

  return (
    <group position={[0, 0.1, 0]}>
      <group ref={g1}>
        <lineSegments geometry={icoEdge}>
          <lineBasicMaterial
            color={isLight ? "#4f46e5" : colorIndigo}
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </lineSegments>
      </group>
      <group ref={g2}>
        <lineSegments rotation={[Math.PI / 2.4, 0, 0.4]} geometry={tA}>
          <lineBasicMaterial
            color={isLight ? "#059669" : colorEmerald}
            transparent
            opacity={0.36}
            depthWrite={false}
          />
        </lineSegments>
      </group>
      <group ref={g3}>
        <lineSegments rotation={[0, Math.PI / 3, 0]} geometry={tB}>
          <lineBasicMaterial
            color={isLight ? "#6366f1" : colorIndigo}
            transparent
            opacity={0.24}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </group>
  );
}

function SceneRig({ pointerRef, count, useBloom, lowPower }) {
  const root = useRef(null);
  const spin = useRef(null);
  const smooth = useRef({ x: 0, y: 0 });
  const { theme, systemTheme } = useTheme();
  const resolved = theme === "system" ? systemTheme : theme;
  const isLight = resolved === "light";
  const colorIndigo = isLight ? "#6366f1" : "#a5b4fc";
  const colorEmerald = isLight ? "#10b981" : "#6ee7b7";

  useFrame((_, d) => {
    const p = pointerRef.current;
    if (root.current) {
      smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, p.x, 0.05);
      smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, p.y, 0.05);
      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        smooth.current.x * 0.36,
        0.08
      );
      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        -smooth.current.y * 0.22,
        0.08
      );
    }
    if (spin.current) {
      spin.current.rotation.y += d * 0.042;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight
        position={[2.2, 1.4, 2.2]}
        intensity={0.45}
        color={colorIndigo}
      />
      <pointLight
        position={[-2, -0.6, 1.8]}
        intensity={0.4}
        color={colorEmerald}
      />
      <group ref={root} position={[0, 0.2, 0]}>
        <group ref={spin}>
          <RepellingParticleSphere
            pointerRef={pointerRef}
            count={count}
            colorIndigo={colorIndigo}
            colorEmerald={colorEmerald}
          />
          <InnerWireOrbits
            isLight={isLight}
            colorIndigo={colorIndigo}
            colorEmerald={colorEmerald}
          />
        </group>
      </group>
      {!lowPower && useBloom && <PostBloom />}
    </>
  );
}

function PostBloom() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={4}>
      <Bloom
        intensity={0.45}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.55}
        levels={6}
      />
    </EffectComposer>
  );
}

/**
 * R3F sets `touch-action: none` on the canvas; align with vertical page scroll.
 */
function AllowDocumentScroll() {
  const { gl } = useThree();
  useLayoutEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    return () => {
      el.style.touchAction = "";
    };
  }, [gl]);
  return null;
}

/**
 * Abstract particle shell + wireframe, subtle repel, optional Bloom. Events come from the hero `section` (pointerRef); the canvas is not a scroll target.
 */
function DigitalHelixBackground({ pointerRef, lowPower }) {
  const count = lowPower ? 900 : 1800;
  const useBloom = !lowPower;

  return (
    <div className="pointer-events-none h-full w-full" aria-hidden>
      <Canvas
        className="!h-full !w-full"
        dpr={lowPower ? [1, 1] : [1, 1.25]}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: lowPower ? "low-power" : "default",
          stencil: false,
        }}
        camera={{ position: [0, 0.1, 5.1], fov: 40, near: 0.1, far: 32 }}
        style={{
          display: "block",
          background: "transparent",
          pointerEvents: "none",
          userSelect: "none",
        }}
        frameloop="always"
        onCreated={({ gl, scene }) => {
          gl.domElement.style.pointerEvents = "none";
          gl.domElement.style.touchAction = "pan-y";
          if (scene) scene.background = null;
        }}
      >
        <AllowDocumentScroll />
        <Suspense fallback={null}>
          <SceneRig
            pointerRef={pointerRef}
            count={count}
            useBloom={useBloom}
            lowPower={lowPower}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default DigitalHelixBackground;
