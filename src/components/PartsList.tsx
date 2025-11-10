import { Part } from "@/types/Part";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Trash2 } from "lucide-react";

interface PartsListProps {
  parts: Part[];
  onRemovePart: (id: string) => void;
}

export const PartsList = ({ parts, onRemovePart }: PartsListProps) => {
  if (parts.length === 0) {
    return (
      <Card className="p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Parts List</h2>
        <p className="text-sm text-muted-foreground">No parts added yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Parts List ({parts.length})</h2>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {parts.map((part) => (
          <div
            key={part.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-6 h-6 rounded border-2 border-border flex-shrink-0"
                style={{ backgroundColor: part.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{part.name}</p>
                <p className="text-xs text-muted-foreground">
                  {part.width} × {part.height} × {part.depth}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemovePart(part.id)}
              className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
