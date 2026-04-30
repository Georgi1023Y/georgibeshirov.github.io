import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { DynamicDrawUsage, MathUtils } from "three";

/** Fixed topology: never change count or buffer lengths after mount (avoids R3F buffer size mismatch). */
const PARTICLE_COUNT = 480;
const EDGE_MAX_DIST = 0.38;

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

/** Canvas pixel width → uniform scale on points + lineSegments (mobile / tablet / desktop). */
function meshScaleForWidth(pxWidth) {
  if (pxWidth < 640) return 0.95;
  if (pxWidth < 768) return 1;
  if (pxWidth < 1024) return 1;
  return 1.1;
}

function meshYOffsetForWidth(pxWidth) {
  if (pxWidth < 640) return -0.14;
  if (pxWidth < 768) return -0.1;
  if (pxWidth < 1024) return 0.02;
  return 0.08;
}

/** Matches mesh scale so framing stays balanced (wider FOV / z when cluster reads sparse). */
function ResponsiveHeroCamera() {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);

  useLayoutEffect(() => {
    if (!camera?.isPerspectiveCamera) return;
    if (width < 768) {
      camera.fov = 46;
      camera.position.z = 5.05;
      camera.position.y = 0.12;
    } else if (width < 1024) {
      camera.fov = 43;
      camera.position.z = 4.72;
      camera.position.y = 0.1;
    } else {
      camera.fov = 39;
      camera.position.z = 5.08;
      camera.position.y = 0.09;
    }
    camera.updateProjectionMatrix();
  }, [camera, width]);

  return null;
}

/**
 * Stops R3F from using touchAction:none on the canvas (which can fight scroll on some browsers).
 */
function CanvasScrollSafe() {
  const { gl } = useThree();
  useLayoutEffect(() => {
    const el = gl.domElement;
    el.style.pointerEvents = "none";
    el.style.touchAction = "pan-y";
    return () => {
      el.style.pointerEvents = "";
      el.style.touchAction = "";
    };
  }, [gl]);
  return null;
}

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
  const smooth = useRef({ x: 0, y: 0 });
  const t = useRef(0);
  const frameHalted = useRef(false);
  const loggedFrameError = useRef(false);
  const viewportWidth = useThree((s) => s.size.width);
  const meshScale = useMemo(() => meshScaleForWidth(viewportWidth), [viewportWidth]);
  const meshY = useMemo(() => meshYOffsetForWidth(viewportWidth), [viewportWidth]);

  const particleCount = PARTICLE_COUNT;
  const particleSize = useMemo(() => {
    const base = lowPower ? 0.022 : 0.018;
    if (viewportWidth < 768) return base * 1.06;
    if (viewportWidth < 1024) return base;
    return base * 0.88;
  }, [lowPower, viewportWidth]);

  const { basePositions, edgePairs, lineVertexCount } = useMemo(() => {
    const count = PARTICLE_COUNT;
    const r = 1.35;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const [x, y, z] = fibonacciSphere(i, count, r);
      const j = i * 3;
      positions[j] = x;
      positions[j + 1] = y;
      positions[j + 2] = z;
    }
    const pairs = buildNetworkEdgePairs(positions, count, EDGE_MAX_DIST);
    return {
      basePositions: positions,
      edgePairs: pairs,
      lineVertexCount: pairs.length,
    };
  }, []);

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
    try {
      if (frameHalted.current) {
        return;
      }
      t.current += delta;
      const p = pointerRef.current;
      smooth.current.x = MathUtils.lerp(smooth.current.x, p.x, 0.06);
      smooth.current.y = MathUtils.lerp(smooth.current.y, p.y, 0.06);

      if (root.current) {
        root.current.rotation.y = MathUtils.lerp(
          root.current.rotation.y,
          smooth.current.x * 0.28,
          0.04
        );
        root.current.rotation.x = MathUtils.lerp(
          root.current.rotation.x,
          -smooth.current.y * 0.2,
          0.04
        );
      }

      const breathe = 1 + Math.sin(t.current * 0.45) * 0.02;
      for (let i = 0; i < particleCount; i++) {
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
      if (pAttr) {
        pAttr.needsUpdate = true;
      }

      if (lineRef.current && lineVertexCount > 0) {
        const posAttr = lineRef.current.geometry.getAttribute("position");
        if (posAttr && posAttr.array?.length === linePositions.length) {
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
    } catch (err) {
      frameHalted.current = true;
      if (!loggedFrameError.current) {
        loggedFrameError.current = true;
        console.error("[NeuralParticleMesh] useFrame halted after error (prevents rAF flood):", err);
      }
    }
  });

  const pointsKey = `particles-${particleCount}`;
  const lineVertexCountForAttr = linePositions.length / 3;
  const linesKey = `line-segments-${particleCount}`;

  return (
    <group ref={root} position={[0, meshY, 0]} scale={meshScale}>
      <points key={pointsKey} ref={pointsRef} rotation={[0.1, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={pointsAnimated}
            itemSize={3}
            usage={DynamicDrawUsage}
          />
        </bufferGeometry>
        <pointsMaterial
          size={particleSize}
          color={palette.particle}
          sizeAttenuation
          transparent
          opacity={palette.particleOpacity}
          depthWrite={false}
        />
      </points>
      {lineVertexCount > 0 && (
        <lineSegments key={linesKey} ref={lineRef} rotation={[0.1, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={lineVertexCountForAttr}
              array={linePositions}
              itemSize={3}
              usage={DynamicDrawUsage}
            />
          </bufferGeometry>
          <lineBasicMaterial
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

export default function NeuralParticleMesh({ pointerRef, lowPower, isDark }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full min-h-0 touch-pan-y overflow-hidden"
      aria-hidden
    >
      <Canvas
        tabIndex={-1}
        className="!h-full !w-full touch-pan-y pointer-events-none outline-none"
        dpr={lowPower ? [1, 1] : [1, 1.25]}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: lowPower ? "low-power" : "default",
          stencil: false,
        }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          minHeight: 0,
          background: "transparent",
          pointerEvents: "none",
          touchAction: "pan-y",
          userSelect: "none",
        }}
        frameloop="always"
        onCreated={({ gl, scene }) => {
          const el = gl.domElement;
          el.tabIndex = -1;
          el.setAttribute("aria-hidden", "true");
          el.style.pointerEvents = "none";
          el.style.touchAction = "pan-y";
          if (document.activeElement === el) {
            el.blur();
          }
          if (scene) scene.background = null;
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.1, 4.4]} fov={42} near={0.1} far={24} />
        <ResponsiveHeroCamera />
        <CanvasScrollSafe />
        <ambientLight intensity={isDark ? 0.75 : 1.05} />
        <Suspense fallback={null}>
          <NeuralScene pointerRef={pointerRef} lowPower={lowPower} isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  );
}
