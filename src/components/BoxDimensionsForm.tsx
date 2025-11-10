import { Container } from "@/types/Part";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface BoxDimensionsFormProps {
  container: Container;
  onChange: (container: Container) => void;
}

export const BoxDimensionsForm = ({ container, onChange }: BoxDimensionsFormProps) => {
  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Container Dimensions</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="container-width" className="text-sm font-medium">
            Width (X)
          </Label>
          <Input
            id="container-width"
            type="number"
            min="1"
            step="0.1"
            value={container.width}
            onChange={(e) =>
              onChange({ ...container, width: parseFloat(e.target.value) || 0 })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="container-height" className="text-sm font-medium">
            Height (Y)
          </Label>
          <Input
            id="container-height"
            type="number"
            min="1"
            step="0.1"
            value={container.height}
            onChange={(e) =>
              onChange({ ...container, height: parseFloat(e.target.value) || 0 })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="container-depth" className="text-sm font-medium">
            Depth (Z)
          </Label>
          <Input
            id="container-depth"
            type="number"
            min="1"
            step="0.1"
            value={container.depth}
            onChange={(e) =>
              onChange({ ...container, depth: parseFloat(e.target.value) || 0 })
            }
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
};
