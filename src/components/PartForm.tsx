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
  if (total === 1) return baseColor;
  
  // Convert hex to RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  // Convert RGB to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const l = (max + min) / 2;
  
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    if (max === rNorm) h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
    else if (max === gNorm) h = ((bNorm - rNorm) / d + 2) / 6;
    else h = ((rNorm - gNorm) / d + 4) / 6;
  }
  
  // Adjust lightness: from dark (0.3) to light (0.8)
  const newL = 0.3 + (index / (total - 1)) * 0.5;
  
  // Convert HSL back to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };
  
  const rgb = hslToRgb(h, s, newL);
  return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
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
