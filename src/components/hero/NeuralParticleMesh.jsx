import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function fibonacciSphere(i, n, r) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
  const theta = Math.sqrt(Math.PI * n) * phi;
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
}

function buildNetworkEdgePairs(positions, count, maxDistance) {
  const maxD2 = maxDistance * maxDistance;
  const seen = new Set();
  const pairs = [];
  for (let i = 0; i < count; i++) {
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];
    const az = positions[i * 3 + 2];
    for (let j = i + 1; j < count; j++) {
      const bx = positions[j * 3];
      const by = positions[j * 3 + 1];
      const bz = positions[j * 3 + 2];
      const dx = ax - bx;
      const dy = ay - by;
      const dz = az - bz;
      if (dx * dx + dy * dy + dz * dz < maxD2) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        pairs.push(i, j);
      }
    }
  }
  return pairs;
}

/**
 * Stops R3F from using touchAction:none on the canvas (which can fight scroll on some browsers).
 * Canvas wrapper already has pointer-events: none; no ScrollControls.
 */
function CanvasScrollSafe() {
  const { gl } = useThree();
  useLayoutEffect(() => {
    const el = gl.domElement;
    el.style.pointerEvents = "none";
    el.style.touchAction = "auto";
    return () => {
      el.style.touchAction = "";
    };
  }, [gl]);
  return null;
}

/** Light: neutral slate. Dark: indigo particles + emerald edge lines to match workflow UI. */
const COLORS = {
  light: { particle: "#475569", line: "#94a3b8", lineOpacity: 0.4, particleOpacity: 0.88 },
  dark: {
    particle: "#818cf8",
    line: "#34d399",
    lineOpacity: 0.38,
    particleOpacity: 0.88,
  },
};

function NeuralScene({ pointerRef, lowPower, isDark }) {
  const root = useRef(null);
  const lineRef = useRef(null);
  const pointsRef = useRef(null);
  const pointMatRef = useRef(null);
  const lineMatRef = useRef(null);
  const smooth = useRef({ x: 0, y: 0 });
  const t = useRef(0);

  const { pointCount, edgeMaxDist, particleSize } = lowPower
    ? { pointCount: 360, edgeMaxDist: 0.42, particleSize: 0.022 }
    : { pointCount: 520, edgeMaxDist: 0.38, particleSize: 0.018 };

  const { basePositions, edgePairs, lineVertexCount } = useMemo(() => {
    const r = 1.35;
    const positions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const [x, y, z] = fibonacciSphere(i, pointCount, r);
      const j = i * 3;
      positions[j] = x;
      positions[j + 1] = y;
      positions[j + 2] = z;
    }
    const pairs = buildNetworkEdgePairs(positions, pointCount, edgeMaxDist);
    return {
      basePositions: positions,
      edgePairs: pairs,
      lineVertexCount: pairs.length,
    };
  }, [pointCount, edgeMaxDist]);

  const pointsAnimated = useMemo(
    () => new Float32Array(basePositions),
    [basePositions]
  );

  const linePositions = useMemo(() => {
    const n = edgePairs.length;
    if (n === 0) return new Float32Array(0);
    const arr = new Float32Array(n * 3);
    let w = 0;
    for (let e = 0; e < n; e += 2) {
      const a = edgePairs[e];
      const b = edgePairs[e + 1];
      arr[w++] = basePositions[a * 3];
      arr[w++] = basePositions[a * 3 + 1];
      arr[w++] = basePositions[a * 3 + 2];
      arr[w++] = basePositions[b * 3];
      arr[w++] = basePositions[b * 3 + 1];
      arr[w++] = basePositions[b * 3 + 2];
    }
    return arr;
  }, [basePositions, edgePairs]);

  const palette = isDark ? COLORS.dark : COLORS.light;

  useFrame((_, delta) => {
    t.current += delta;
    const p = pointerRef.current;
    smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, p.x, 0.06);
    smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, p.y, 0.06);

    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        smooth.current.x * 0.28,
        0.04
      );
      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        -smooth.current.y * 0.2,
        0.04
      );
    }

    const pal = isDark ? COLORS.dark : COLORS.light;
    if (pointMatRef.current) {
      pointMatRef.current.color.set(pal.particle);
      pointMatRef.current.opacity = pal.particleOpacity;
    }
    if (lineMatRef.current) {
      lineMatRef.current.color.set(pal.line);
      lineMatRef.current.opacity = pal.lineOpacity;
    }

    const breathe = 1 + Math.sin(t.current * 0.45) * 0.02;
    for (let i = 0; i < pointCount; i++) {
      const o = i * 3;
      const bx = basePositions[o] * breathe;
      const by = basePositions[o + 1] * breathe;
      const bz = basePositions[o + 2] * breathe;
      const infl = smooth.current.x * 0.12 + smooth.current.y * 0.08;
      pointsAnimated[o] = bx + infl * 0.04;
      pointsAnimated[o + 1] = by - infl * 0.03;
      pointsAnimated[o + 2] = bz;
    }

    const pAttr = pointsRef.current?.geometry?.getAttribute("position");
    if (pAttr) pAttr.needsUpdate = true;

    if (lineRef.current && lineVertexCount > 0) {
      const posAttr = lineRef.current.geometry.getAttribute("position");
      if (posAttr) {
        const out = posAttr.array;
        for (let e = 0, o = 0; e < edgePairs.length; e += 2) {
          const ia = edgePairs[e];
          const ib = edgePairs[e + 1];
          out[o++] = pointsAnimated[ia * 3];
          out[o++] = pointsAnimated[ia * 3 + 1];
          out[o++] = pointsAnimated[ia * 3 + 2];
          out[o++] = pointsAnimated[ib * 3];
          out[o++] = pointsAnimated[ib * 3 + 1];
          out[o++] = pointsAnimated[ib * 3 + 2];
        }
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={root} position={[0, 0.08, 0]}>
      <points ref={pointsRef} rotation={[0.1, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointCount}
            array={pointsAnimated}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={pointMatRef}
          size={particleSize}
          color={palette.particle}
          sizeAttenuation
          transparent
          opacity={palette.particleOpacity}
          depthWrite={false}
        />
      </points>
      {lineVertexCount > 0 && (
        <lineSegments ref={lineRef} rotation={[0.1, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={lineVertexCount}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            ref={lineMatRef}
            color={palette.line}
            transparent
            opacity={palette.lineOpacity}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}

/**
 * Fills a full-viewport parent (e.g. Hero’s fixed z-[-1] wrapper). pointer-events: none; no scroll hooks.
 */
export default function NeuralParticleMesh({ pointerRef, lowPower, isDark }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full min-h-0 overflow-hidden"
      aria-hidden
    >
      <Canvas
        className="!h-full !w-full"
        dpr={lowPower ? [1, 1] : [1, 1.25]}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: lowPower ? "low-power" : "default",
          stencil: false,
        }}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          background: "transparent",
          pointerEvents: "none",
          userSelect: "none",
        }}
        frameloop="always"
        onCreated={({ gl, scene }) => {
          const el = gl.domElement;
          el.style.pointerEvents = "none";
          el.style.touchAction = "auto";
          if (scene) scene.background = null;
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.1, 4.4]} fov={42} near={0.1} far={24} />
        <CanvasScrollSafe />
        <ambientLight intensity={isDark ? 0.75 : 1.05} />
        <Suspense fallback={null}>
          <NeuralScene pointerRef={pointerRef} lowPower={lowPower} isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  );
}
