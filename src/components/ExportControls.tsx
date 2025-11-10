import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Download, RotateCcw } from "lucide-react";
import { Part, Container } from "@/types/Part";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { toast } from "sonner";

interface ExportControlsProps {
  container: Container;
  stackedParts: Part[];
  onReset: () => void;
}

export const ExportControls = ({ container, stackedParts, onReset }: ExportControlsProps) => {
  const handleExportGLB = () => {
    if (stackedParts.length === 0) {
      toast.error("No parts to export. Add some parts first!");
      return;
    }

    const scene = new THREE.Scene();

    // Add container
    const containerGeometry = new THREE.BoxGeometry(
      container.width,
      container.height,
      container.depth
    );
    const containerMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.1,
      color: 0x3b82f6,
      side: THREE.DoubleSide,
    });
    const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
    containerMesh.position.set(
      container.width / 2,
      container.height / 2,
      container.depth / 2
    );
    scene.add(containerMesh);

    // Add parts
    stackedParts.forEach((part) => {
      if (part.position) {
        const geometry = new THREE.BoxGeometry(part.width, part.height, part.depth);
        const material = new THREE.MeshStandardMaterial({
          color: part.color,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          part.position.x + part.width / 2,
          part.position.y + part.height / 2,
          part.position.z + part.depth / 2
        );
        mesh.name = part.name;
        scene.add(mesh);
      }
    });

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Export
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const blob = new Blob([gltf as ArrayBuffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "stacking-optimization.glb";
        link.click();
        URL.revokeObjectURL(url);
        toast.success("GLB file exported successfully!");
      },
      (error) => {
        console.error("Export error:", error);
        toast.error("Failed to export GLB file");
      },
      { binary: true }
    );
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset everything?")) {
      onReset();
      toast.success("Reset complete");
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Actions</h2>
      <div className="space-y-3">
        <Button onClick={handleExportGLB} className="w-full" variant="default">
          <Download className="w-4 h-4 mr-2" />
          Export as GLB
        </Button>
        <Button onClick={handleReset} className="w-full" variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>
      {stackedParts.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            {stackedParts.filter((p) => p.position && p.position.y < container.height).length} of{" "}
            {stackedParts.length} parts fit in container
          </p>
        </div>
      )}
    </Card>
  );
};
