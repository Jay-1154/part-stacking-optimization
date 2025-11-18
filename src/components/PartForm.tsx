import { useState } from "react";
import { Part } from "@/types/Part";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plus } from "lucide-react";

interface PartFormProps {
  onAddPart: (part: Part) => void;
}

const randomColor = () => {
  const colors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateShade = (baseColor: string, index: number, total: number) => {
  // Convert hex to RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  // Adjust brightness based on index (-15% to +15%)
  const factor = total > 1 ? 0.85 + (index / (total - 1)) * 0.3 : 1;
  
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

export const PartForm = ({ onAddPart }: PartFormProps) => {
  const [name, setName] = useState("");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(2);
  const [depth, setDepth] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(randomColor());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && width > 0 && height > 0 && depth > 0 && quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        onAddPart({
          id: crypto.randomUUID(),
          name: quantity > 1 ? `${name} #${i + 1}` : name,
          width,
          height,
          depth,
          color: generateShade(color, i, quantity),
        });
      }
      setName("");
      setWidth(2);
      setHeight(2);
      setDepth(2);
      setQuantity(1);
      setColor(randomColor());
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Add Part</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="part-name" className="text-sm font-medium">
            Part Name
          </Label>
          <Input
            id="part-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Box A"
            className="mt-1"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="part-width" className="text-sm font-medium">
              Width
            </Label>
            <Input
              id="part-width"
              type="number"
              min="0.1"
              step="0.1"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="part-height" className="text-sm font-medium">
              Height
            </Label>
            <Input
              id="part-height"
              type="number"
              min="0.1"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="part-depth" className="text-sm font-medium">
              Depth
            </Label>
            <Input
              id="part-depth"
              type="number"
              min="0.1"
              step="0.1"
              value={depth}
              onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
              className="mt-1"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="part-quantity" className="text-sm font-medium">
            Quantity
          </Label>
          <Input
            id="part-quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="part-color" className="text-sm font-medium">
            Color
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="part-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Part
        </Button>
      </form>
    </Card>
  );
};
