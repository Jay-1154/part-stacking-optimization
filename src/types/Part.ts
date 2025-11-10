export interface Part {
  id: string;
  name: string;
  width: number;
  height: number;
  depth: number;
  color: string;
  position?: { x: number; y: number; z: number };
}

export interface Container {
  width: number;
  height: number;
  depth: number;
}
