import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Text } from "@react-three/drei";
import { Part, Container } from "@/types/Part";
import * as THREE from "three";

interface Scene3DProps {
  container: Container;
  stackedParts: Part[];
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

const ContainerBox = ({ container }: { container: Container }) => {
  return (
    <Box
      args={[container.width, container.height, container.depth]}
      position={[container.width / 2, container.height / 2, container.depth / 2]}
    >
      <meshStandardMaterial transparent opacity={0.1} color="#3b82f6" side={THREE.DoubleSide} />
    </Box>
  );
};

const ContainerEdges = ({ container }: { container: Container }) => {
  const { width, height, depth } = container;
  
  return (
    <lineSegments>
      <edgesGeometry
        attach="geometry"
        args={[new THREE.BoxGeometry(width, height, depth)]}
      />
      <lineBasicMaterial attach="material" color="#3b82f6" linewidth={2} />
      <group position={[width / 2, height / 2, depth / 2]} />
    </lineSegments>
  );
};

const PartBox = ({ part }: { part: Part }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  if (!part.position) return null;

  const position: [number, number, number] = [
    part.position.x + part.width / 2,
    part.position.y + part.height / 2,
    part.position.z + part.depth / 2,
  ];

  return (
    <group>
      <Box ref={meshRef} args={[part.width, part.height, part.depth]} position={position}>
        <meshStandardMaterial color={part.color} />
      </Box>
      <Text
        position={position}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {part.name}
      </Text>
    </group>
  );
};

const Scene = ({ container, stackedParts }: Omit<Scene3DProps, "canvasRef">) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <ContainerBox container={container} />
      <ContainerEdges container={container} />
      
      {stackedParts.map((part) => (
        <PartBox key={part.id} part={part} />
      ))}

      <OrbitControls makeDefault />
      <gridHelper args={[Math.max(container.width, container.depth) * 2, 20]} />
    </>
  );
};

export const Scene3D = ({ container, stackedParts, canvasRef }: Scene3DProps) => {
  const maxDimension = Math.max(container.width, container.height, container.depth);
  const cameraDistance = maxDimension * 2.5;

  return (
    <div className="w-full h-full bg-background rounded-lg border border-border overflow-hidden shadow-[var(--shadow-medium)]">
      <Canvas
        camera={{
          position: [cameraDistance, cameraDistance, cameraDistance],
          fov: 50,
        }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Scene container={container} stackedParts={stackedParts} />
      </Canvas>
    </div>
  );
};
