"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { ProductView } from "@/lib/constants";
import type { DragRotateHandle } from "./DragRotate";
import ProductPoster from "./ProductPoster";
import ProductScene from "./ProductScene";

export interface ProductViewerProps {
  view: ProductView;
  className?: string;
  interactive?: boolean;
  priority?: boolean;
  label?: string;
  debugCamera?: Partial<{
    azim: number;
    elev: number;
    dist: number;
    fov: number;
    targetY: number;
  }>;
}

const DEFAULT_LABELS: Record<ProductView, string> = {
  hero: "Deep Work candle, three-quarter view",
  statement: "Deep Work candle with lid",
  intention: "Close-up of the candle jar and base",
  offer: "Deep Work candle gift box",
};

const CAMERA = {
  fov: 28,
  near: 0.1,
  far: 60,
  position: [0, 0, 8] as [number, number, number],
};
const GL = {
  alpha: true,
  antialias: true,
  powerPreference: "high-performance" as const,
  toneMapping: THREE.ACESFilmicToneMapping,
};
const CANVAS_STYLE = { touchAction: "pan-y" as const };
const DPR: [number, number] = [1, 1.75];

let webglSupport: boolean | undefined;
function hasWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null;
    webglSupport = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

class CanvasBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("[ProductViewer] WebGL failed; showing poster.", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ProductViewer({
  view,
  className,
  interactive,
  priority = false,
  label,
  debugCamera,
}: ProductViewerProps) {
  const isInteractive = interactive ?? view === "hero";
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragRotateHandle | null>(null);
  const [supported] = useState(() => hasWebGL());
  const [mounted, setMounted] = useState(priority);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const on = entries[entries.length - 1].isIntersecting;
        setMounted(on);
        if (!on) {
          setReady(false);
          setFailed(false);
        }
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFail = useCallback(() => setFailed(true), []);

  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    gl.setClearColor(0x000000, 0);
    gl.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      setFailed(true);
    });
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      dragRef.current?.nudge(-10);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      dragRef.current?.nudge(10);
    }
  };

  const showCanvas = mounted && supported && !failed;

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={label ?? DEFAULT_LABELS[view]}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={onKeyDown}
      style={{ touchAction: "pan-y" }}
      className={`relative h-full w-full ${
        isInteractive
          ? "select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          : ""
      } ${className ?? ""}`}
    >
      {showCanvas && (
        <div className="absolute inset-0">
          <CanvasBoundary onError={handleFail}>
            <Canvas
              frameloop="demand"
              dpr={DPR}
              camera={CAMERA}
              gl={GL}
              style={CANVAS_STYLE}
              onCreated={handleCreated}
            >
              <ProductScene
                view={view}
                interactive={isInteractive}
                dragRef={dragRef}
                onReady={handleReady}
                debugCamera={debugCamera}
              />
            </Canvas>
          </CanvasBoundary>
        </div>
      )}

      <ProductPoster
        view={view}
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${
          showCanvas && ready ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
