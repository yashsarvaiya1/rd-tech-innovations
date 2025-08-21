'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface DependentSelectProps {
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  label: string;
  emptyMessage?: string;
}

export default function DependentSelect({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  label,
  emptyMessage = "No options available" 
}: DependentSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);

  useEffect(() => {
    // Filter out already selected options
    const available = options.filter(option => !value.includes(option));
    setAvailableOptions(available);
  }, [options, value]);

  const handleAdd = () => {
    if (selectedValue && !value.includes(selectedValue)) {
      onChange([...value, selectedValue]);
      setSelectedValue("");
    }
  };

  const handleRemove = (optionToRemove: string) => {
    onChange(value.filter(item => item !== optionToRemove));
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Selected Items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
              <span>{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(item)}
                className="h-auto p-1 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add New Item */}
      {availableOptions.length > 0 ? (
        <div className="flex items-center space-x-2">
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {availableOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={!selectedValue}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="text-sm text-gray-500 p-3 border border-dashed rounded-lg text-center">
          {options.length === 0 ? emptyMessage : "All options selected"}
        </div>
      )}
    </div>
  );
}
