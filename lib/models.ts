export const MODELS = {
  plant: "/models/plant.glb",
  avocadoDemo: "/models/avocado_demo.glb",
} as const;

export type ModelKey = keyof typeof MODELS;
