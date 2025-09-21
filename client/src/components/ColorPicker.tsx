import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Palette, Sparkles } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

// Predefined color gradients
const colorGradients = [
  { name: "Blue Ocean", value: "from-blue-500 to-blue-600", preview: "bg-gradient-to-r from-blue-500 to-blue-600" },
  { name: "Purple Magic", value: "from-purple-500 to-purple-600", preview: "bg-gradient-to-r from-purple-500 to-purple-600" },
  { name: "Green Forest", value: "from-green-500 to-green-600", preview: "bg-gradient-to-r from-green-500 to-green-600" },
  { name: "Red Fire", value: "from-red-500 to-red-600", preview: "bg-gradient-to-r from-red-500 to-red-600" },
  { name: "Orange Sunset", value: "from-orange-500 to-orange-600", preview: "bg-gradient-to-r from-orange-500 to-orange-600" },
  { name: "Pink Rose", value: "from-pink-500 to-pink-600", preview: "bg-gradient-to-r from-pink-500 to-pink-600" },
  { name: "Indigo Night", value: "from-indigo-500 to-indigo-600", preview: "bg-gradient-to-r from-indigo-500 to-indigo-600" },
  { name: "Teal Water", value: "from-teal-500 to-teal-600", preview: "bg-gradient-to-r from-teal-500 to-teal-600" },
  { name: "Yellow Sun", value: "from-yellow-500 to-yellow-600", preview: "bg-gradient-to-r from-yellow-500 to-yellow-600" },
  { name: "Slate Modern", value: "from-slate-500 to-slate-600", preview: "bg-gradient-to-r from-slate-500 to-slate-600" },
  { name: "Cyan Digital", value: "from-cyan-500 to-cyan-600", preview: "bg-gradient-to-r from-cyan-500 to-cyan-600" },
  { name: "Emerald Fresh", value: "from-emerald-500 to-emerald-600", preview: "bg-gradient-to-r from-emerald-500 to-emerald-600" },
];

// Special multi-color gradients
const specialGradients = [
  { name: "Rainbow", value: "from-violet-500 via-purple-500 to-pink-500", preview: "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" },
  { name: "Sunset", value: "from-orange-500 via-red-500 to-pink-500", preview: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" },
  { name: "Ocean", value: "from-blue-500 via-teal-500 to-green-500", preview: "bg-gradient-to-r from-blue-500 via-teal-500 to-green-500" },
  { name: "Aurora", value: "from-green-500 via-blue-500 to-purple-500", preview: "bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" },
  { name: "Fire", value: "from-red-500 via-orange-500 to-yellow-500", preview: "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" },
  { name: "Nebula", value: "from-purple-500 via-pink-500 to-red-500", preview: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" },
];

// Solid colors
const solidColors = [
  { name: "Blue", value: "bg-blue-500", preview: "bg-blue-500" },
  { name: "Purple", value: "bg-purple-500", preview: "bg-purple-500" },
  { name: "Green", value: "bg-green-500", preview: "bg-green-500" },
  { name: "Red", value: "bg-red-500", preview: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500", preview: "bg-orange-500" },
  { name: "Pink", value: "bg-pink-500", preview: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500", preview: "bg-indigo-500" },
  { name: "Teal", value: "bg-teal-500", preview: "bg-teal-500" },
  { name: "Yellow", value: "bg-yellow-500", preview: "bg-yellow-500" },
  { name: "Slate", value: "bg-slate-500", preview: "bg-slate-500" },
  { name: "Cyan", value: "bg-cyan-500", preview: "bg-cyan-500" },
  { name: "Emerald", value: "bg-emerald-500", preview: "bg-emerald-500" },
];

export function ColorPicker({ value, onValueChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  // Get preview class for current value
  const getPreviewClass = () => {
    if (value.startsWith("bg-gradient-to-r")) {
      return value;
    }
    if (value.startsWith("from-")) {
      return `bg-gradient-to-r ${value}`;
    }
    if (value.startsWith("bg-")) {
      return value;
    }
    // Default fallback
    return `bg-gradient-to-r ${value}`;
  };

  const handleColorSelect = (colorValue: string) => {
    onValueChange(colorValue);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>Color/Gradient</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-12"
            data-testid="button-color-picker"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${getPreviewClass()}`} />
              <span className="flex-1 text-left">{value || "Select a color"}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="gradients" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="gradients" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Gradients
                  </TabsTrigger>
                  <TabsTrigger value="special" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Special
                  </TabsTrigger>
                  <TabsTrigger value="solid">Solid</TabsTrigger>
                </TabsList>

                <TabsContent value="gradients" className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {colorGradients.map((gradient) => (
                      <button
                        key={gradient.name}
                        type="button"
                        onClick={() => handleColorSelect(gradient.value)}
                        className={`group relative h-16 rounded-lg ${gradient.preview} border-2 transition-all hover:scale-105 ${
                          value === gradient.value
                            ? "border-foreground ring-2 ring-ring"
                            : "border-border hover:border-foreground/50"
                        }`}
                        title={gradient.name}
                        data-testid={`button-gradient-${gradient.name.toLowerCase().replace(' ', '-')}`}
                      >
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{gradient.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="special" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {specialGradients.map((gradient) => (
                      <button
                        key={gradient.name}
                        type="button"
                        onClick={() => handleColorSelect(gradient.value)}
                        className={`group relative h-16 rounded-lg ${gradient.preview} border-2 transition-all hover:scale-105 ${
                          value === gradient.value
                            ? "border-foreground ring-2 ring-ring"
                            : "border-border hover:border-foreground/50"
                        }`}
                        title={gradient.name}
                        data-testid={`button-special-${gradient.name.toLowerCase()}`}
                      >
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{gradient.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="solid" className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {solidColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorSelect(color.value)}
                        className={`group relative h-12 rounded-lg ${color.preview} border-2 transition-all hover:scale-105 ${
                          value === color.value
                            ? "border-foreground ring-2 ring-ring"
                            : "border-border hover:border-foreground/50"
                        }`}
                        title={color.name}
                        data-testid={`button-solid-${color.name.toLowerCase()}`}
                      >
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{color.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                {/* Custom input */}
                <div className="border-t pt-4 mt-4">
                  <Label htmlFor="custom-color" className="text-sm text-muted-foreground">
                    Or enter custom CSS classes:
                  </Label>
                  <Input
                    id="custom-color"
                    placeholder="e.g., from-blue-400 to-purple-600"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    className="mt-2"
                    data-testid="input-custom-color"
                  />
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}