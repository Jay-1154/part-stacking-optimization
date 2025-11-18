import { useState } from "react";
import { Part } from "@/types/Part";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadFormProps {
  onAddParts: (parts: Part[]) => void;
}

const randomColor = () => {
  const colors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const FileUploadForm = ({ onAddParts }: FileUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const parseFileContent = (content: string): Part[] => {
    const parts: Part[] = [];
    const lines = content.split('\n').filter(line => line.trim());
    
    // Look for patterns like: name, width, height, depth or width x height x depth
    for (const line of lines) {
      // Pattern 1: "Name, 10, 20, 30" or "Name,10,20,30"
      const pattern1 = line.match(/^([^,]+),\s*(\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*)$/);
      if (pattern1) {
        const [, name, width, height, depth] = pattern1;
        parts.push({
          id: crypto.randomUUID(),
          name: name.trim(),
          width: parseFloat(width),
          height: parseFloat(height),
          depth: parseFloat(depth),
          color: randomColor(),
        });
        continue;
      }
      
      // Pattern 2: "Name: 10 x 20 x 30" or "Name 10x20x30"
      const pattern2 = line.match(/^([^:]+)[:|\s]+(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*x\s*(\d+\.?\d*)/i);
      if (pattern2) {
        const [, name, width, height, depth] = pattern2;
        parts.push({
          id: crypto.randomUUID(),
          name: name.trim(),
          width: parseFloat(width),
          height: parseFloat(height),
          depth: parseFloat(depth),
          color: randomColor(),
        });
        continue;
      }
      
      // Pattern 3: Tab-separated values
      const tabSeparated = line.split('\t').filter(cell => cell.trim());
      if (tabSeparated.length >= 4) {
        const [name, width, height, depth] = tabSeparated;
        const w = parseFloat(width);
        const h = parseFloat(height);
        const d = parseFloat(depth);
        if (!isNaN(w) && !isNaN(h) && !isNaN(d)) {
          parts.push({
            id: crypto.randomUUID(),
            name: name.trim(),
            width: w,
            height: h,
            depth: d,
            color: randomColor(),
          });
        }
      }
    }
    
    return parts;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/csv',
      'text/plain'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|xlsx?|docx?|csv|txt)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Excel, Word, CSV, or text file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // For text/CSV files, read directly
      if (file.type === 'text/csv' || file.type === 'text/plain' || file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        const text = await file.text();
        const parts = parseFileContent(text);
        
        if (parts.length > 0) {
          onAddParts(parts);
          toast({
            title: "Success!",
            description: `Added ${parts.length} part${parts.length > 1 ? 's' : ''} from file.`,
          });
        } else {
          toast({
            title: "No parts found",
            description: "Could not extract part data. Expected format: Name, Width, Height, Depth",
            variant: "destructive",
          });
        }
      } else {
        // For PDF, Excel, Word - would need document parsing
        toast({
          title: "Processing...",
          description: "Binary file parsing requires backend integration. Please use CSV or TXT format for now.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Import Parts</h2>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload a file with part dimensions. Supported formats: CSV, TXT
        </p>
        <p className="text-xs text-muted-foreground">
          Expected format: Name, Width, Height, Depth (one per line)
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="w-full relative"
            disabled={isUploading}
          >
            <input
              type="file"
              accept=".csv,.txt,.pdf,.xlsx,.xls,.docx,.doc"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            {isUploading ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="w-4 h-4" />
          <FileSpreadsheet className="w-4 h-4" />
          <span>CSV, TXT, PDF, Excel, Word</span>
        </div>
      </div>
    </Card>
  );
};
