import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as Icons from "lucide-react";
import { Search, ChevronDown } from "lucide-react";

interface IconPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

// Popular icons for quick selection
const popularIcons = [
  "Link", "Globe", "Database", "Lock", "Shield", "User", "Users", "Mail",
  "Phone", "Calendar", "Clock", "Settings", "Search", "Plus", "Edit",
  "Trash2", "Check", "X", "Heart", "Star", "Home", "File", "Folder",
  "Image", "Video", "Music", "Download", "Upload", "Camera", "Play",
  "Pause", "Book", "Bookmark", "Tag", "Bell", "Message", "Send",
  "Code", "Terminal", "Laptop", "Smartphone", "Wifi", "Battery", "Zap"
];

export function IconPicker({ value, onValueChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get the current icon component
  const getCurrentIcon = () => {
    return (Icons as any)[value] || Icons.Link;
  };

  const CurrentIcon = getCurrentIcon();

  // Filter icons based on search term
  const filteredIcons = popularIcons.filter(icon =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onValueChange(iconName);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-2">
      <Label>Icon</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-12"
            data-testid="button-icon-picker"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CurrentIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="flex-1 text-left">{value || "Select an icon"}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-icon-search"
                  />
                </div>

                {/* Icon Grid */}
                <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                  {filteredIcons.map((iconName) => {
                    const IconComponent = (Icons as any)[iconName];
                    if (!IconComponent) return null;

                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleIconSelect(iconName)}
                        className={`p-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors ${
                          value === iconName
                            ? "bg-primary text-primary-foreground"
                            : "bg-background"
                        }`}
                        title={iconName}
                        data-testid={`button-icon-${iconName.toLowerCase()}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>

                {filteredIcons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No icons found for "{searchTerm}"
                  </div>
                )}

                {/* Custom icon name input */}
                <div className="border-t pt-4">
                  <Label htmlFor="custom-icon" className="text-sm text-muted-foreground">
                    Or enter icon name manually:
                  </Label>
                  <Input
                    id="custom-icon"
                    placeholder="e.g., ArrowRight"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    className="mt-2"
                    data-testid="input-custom-icon"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}