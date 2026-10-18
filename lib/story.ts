import { SECTION_IDS } from "@/lib/constants";

export const STORY_STEPS = ["hero", "reveal", "intention", "notes", "offer"] as const;
export type StoryStep = (typeof STORY_STEPS)[number];

/** Id da secção âncora de cada passo (mesma ordem de STORY_STEPS). */
export const STORY_SECTION_IDS = [
  SECTION_IDS.top, SECTION_IDS.product, SECTION_IDS.about, SECTION_IDS.notes, SECTION_IDS.offer,
] as const;

/** Altura mínima (svh) de cada secção em modo "on". */
export const STORY_SECTION_VH: Record<StoryStep, number> = {
  hero: 150, reveal: 165, intention: 165, notes: 175, offer: 150,
};

/** Onde o ponto-alvo da câmera aparece na tela (x da esquerda, y do topo; 0..1) em cada passo. */
export const STORY_FOCUS = [
  [0.70, 0.52], // 0 hero
  [0.70, 0.52], // 1 reveal
  [0.30, 0.54], // 2 intention
  [0.50, 0.50], // 3 notes
  [0.68, 0.52], // 4 offer
] as const satisfies readonly (readonly [number, number])[];

export interface StoryState {
  phase: number;   // 0..4 contínuo (inteiro = passo em repouso; fração = transição suavizada)
  active: boolean; // true quando a zona da história está (quase) visível
}
// Objeto MUTÁVEL e singleton. NÃO é React state. ESCRITA: só o A (hook useStoryScroll). LEITURA: B.
export const storyState: StoryState = { phase: 0, active: false };
export function resetStoryState(): void { storyState.phase = 0; storyState.active = false; }

/** Flags mutáveis. ESCRITA: só o StoryProvider. */
export const storyFlags = { reducedMotion: false };

/** Largura (fração da distância entre pins) do degrau seco com reduced-motion. */
const REDUCED_STEP_WIDTH = 0.08;

const smoothstep = (t: number): number => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/**
 * Easing da fração de transição entre dois passos (t: 0..1).
 * Normal: smoothstep sobre toda a distância. Reduced-motion: degrau seco de
 * 8% da distância, centrado a meio.
 */
export function storyEase(t: number): number {
  if (!storyFlags.reducedMotion) return smoothstep(t);
  const half = REDUCED_STEP_WIDTH / 2;
  return smoothstep((t - (0.5 - half)) / REDUCED_STEP_WIDTH);
}

export type StoryMode = "on" | "off";
let mode: StoryMode = "off";
const listeners = new Set<() => void>();
export const getStoryMode = (): StoryMode => mode;
export const getServerStoryMode = (): StoryMode => "off";
export function setStoryMode(next: StoryMode): void {
  if (next === mode) return;
  mode = next;
  listeners.forEach((l) => l());
}
export function subscribeStoryMode(l: () => void): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export const STORY_FAIL_EVENT = "story:fail";
/** O B chama isto se o WebGL/canvas falhar de forma irrecuperável: o site cai para o modo "off". */
export function failStory(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(STORY_FAIL_EVENT));
}
