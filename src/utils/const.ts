export const LABELS: Array<string> = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
];

// time in ms to hold sign
export enum Threshold {
  BEGINNER = 1000,
  INTERMEDIATE = 700,
  ADVANCED = 300,
}

export enum CameraState {
  IDLE,
  READY,
  NOT_FOUND,
  PERMISSION_DENIED,
}

export const DELETE: string = "⌫";
export const SPACE: string = "SPACE";

export const MODEL_URL =
  "https://asl-model.s3.us-east-2.amazonaws.com/model1/model.json";
