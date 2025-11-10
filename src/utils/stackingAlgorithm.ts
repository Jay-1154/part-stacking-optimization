import { Part, Container } from "@/types/Part";

interface StackedPart extends Part {
  position: { x: number; y: number; z: number };
}

export function optimizeStacking(
  parts: Part[],
  container: Container
): StackedPart[] {
  // Sort parts by volume (largest first) for better packing
  const sortedParts = [...parts].sort((a, b) => {
    const volumeA = a.width * a.height * a.depth;
    const volumeB = b.width * b.height * b.depth;
    return volumeB - volumeA;
  });

  const stackedParts: StackedPart[] = [];
  const occupiedSpaces: { x: number; y: number; z: number; w: number; h: number; d: number }[] = [];

  for (const part of sortedParts) {
    let placed = false;

    // Try to find a position for the part
    for (let y = 0; y <= container.height - part.height && !placed; y += 0.5) {
      for (let z = 0; z <= container.depth - part.depth && !placed; z += 0.5) {
        for (let x = 0; x <= container.width - part.width && !placed; x += 0.5) {
          const position = { x, y, z };

          // Check if this position fits in the container
          if (
            x + part.width <= container.width &&
            y + part.height <= container.height &&
            z + part.depth <= container.depth
          ) {
            // Check if this position overlaps with any existing part
            const overlaps = occupiedSpaces.some((space) => {
              return !(
                position.x + part.width <= space.x ||
                position.x >= space.x + space.w ||
                position.y + part.height <= space.y ||
                position.y >= space.y + space.h ||
                position.z + part.depth <= space.z ||
                position.z >= space.z + space.d
              );
            });

            if (!overlaps) {
              stackedParts.push({ ...part, position });
              occupiedSpaces.push({
                x: position.x,
                y: position.y,
                z: position.z,
                w: part.width,
                h: part.height,
                d: part.depth,
              });
              placed = true;
            }
          }
        }
      }
    }

    // If part couldn't be placed, place it at origin (will be outside container)
    if (!placed) {
      stackedParts.push({
        ...part,
        position: { x: 0, y: container.height + 2, z: 0 },
      });
    }
  }

  return stackedParts;
}
