import { useState, useEffect } from "react";
import { Part, Container } from "@/types/Part";
import { optimizeStacking } from "@/utils/stackingAlgorithm";
import { BoxDimensionsForm } from "@/components/BoxDimensionsForm";
import { PartForm } from "@/components/PartForm";
import { FileUploadForm } from "@/components/FileUploadForm";
import { PartsList } from "@/components/PartsList";
import { Scene3D } from "@/components/Scene3D";
import { ExportControls } from "@/components/ExportControls";
import { Package } from "lucide-react";

const Index = () => {
  const [container, setContainer] = useState<Container>({
    width: 10,
    height: 10,
    depth: 10,
  });
  const [parts, setParts] = useState<Part[]>([]);
  const [stackedParts, setStackedParts] = useState<Part[]>([]);

  useEffect(() => {
    if (parts.length > 0) {
      const optimized = optimizeStacking(parts, container);
      setStackedParts(optimized);
    } else {
      setStackedParts([]);
    }
  }, [parts, container]);

  const handleAddPart = (part: Part) => {
    setParts((prevParts) => [...prevParts, part]);
  };

  const handleAddParts = (newParts: Part[]) => {
    setParts([...parts, ...newParts]);
  };

  const handleRemovePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const handleReset = () => {
    setParts([]);
    setStackedParts([]);
    setContainer({ width: 10, height: 10, depth: 10 });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">3D Stacking Optimizer</h1>
              <p className="text-sm text-muted-foreground">
                Optimize part placement with real-time 3D visualization
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <BoxDimensionsForm container={container} onChange={setContainer} />
            <PartForm onAddPart={handleAddPart} />
            <FileUploadForm onAddParts={handleAddParts} />
            <PartsList parts={parts} onRemovePart={handleRemovePart} />
            <ExportControls
              container={container}
              stackedParts={stackedParts}
              onReset={handleReset}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="h-[800px]">
              <Scene3D container={container} stackedParts={stackedParts} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
