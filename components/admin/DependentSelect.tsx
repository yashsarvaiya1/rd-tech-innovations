"use client";
import { Plus, X } from "lucide-react";
import { useEffect, useState, useCallback, useRef, KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DependentSelectProps {
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  label: string;
  emptyMessage?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

export default function DependentSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
  emptyMessage = "No options available",
  disabled = false,
  required = false,
  id = "dependent-select",
}: DependentSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLButtonElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Filter out already selected options
    const available = options.filter((option) => !value.includes(option));
    setAvailableOptions(available);
    
    // Reset selected value if it's no longer available
    if (selectedValue && !available.includes(selectedValue)) {
      setSelectedValue("");
    }
  }, [options, value, selectedValue]);

  const handleAdd = useCallback(() => {
    if (selectedValue && !value.includes(selectedValue) && !disabled) {
      onChange([...value, selectedValue]);
      setSelectedValue("");
      
      // Return focus to select after adding
      setTimeout(() => {
        selectRef.current?.focus();
      }, 100);
    }
  }, [selectedValue, value, onChange, disabled]);

  const handleRemove = useCallback((optionToRemove: string) => {
    if (!disabled) {
      onChange(value.filter((item) => item !== optionToRemove));
    }
  }, [value, onChange, disabled]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && selectedValue && !disabled) {
      event.preventDefault();
      handleAdd();
    }
  };

  const handleSelectChange = useCallback((newValue: string) => {
    setSelectedValue(newValue);
    setIsOpen(false);
  }, []);

  return (
    <div className="space-y-4">
      <Label 
        htmlFor={id}
        className="text-foreground font-heading font-semibold flex items-center gap-1"
      >
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      {/* Selected Items Display */}
      {value.length > 0 && (
        <div 
          className="space-y-2"
          role="region"
          aria-label={`Selected ${label.toLowerCase()}`}
        >
          <div className="text-sm font-heading font-medium text-muted-foreground">
            Selected ({value.length}):
          </div>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg border border-border">
            {value.map((item, index) => (
              <Badge
                key={item}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
              >
                <span className="font-sans">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item)}
                  disabled={disabled}
                  className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full"
                  aria-label={`Remove ${item}`}
                  title={`Remove ${item}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add New Item Section */}
      {availableOptions.length > 0 ? (
        <div className="space-y-3">
          <div className="text-sm font-heading font-medium text-muted-foreground">
            Add new item:
          </div>
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border shadow-sm">
            <div className="flex-1">
              <Select 
                value={selectedValue} 
                onValueChange={handleSelectChange}
                disabled={disabled}
                onOpenChange={setIsOpen}
              >
                <SelectTrigger 
                  ref={selectRef}
                  className="bg-background border-border focus:border-primary font-sans"
                  id={id}
                  aria-label={`Select ${label.toLowerCase()} to add`}
                  onKeyDown={handleKeyDown}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border-border shadow-xl"
                  position="popper"
                  sideOffset={4}
                >
                  {availableOptions.map((option) => (
                    <SelectItem 
                      key={option} 
                      value={option}
                      className="bg-white hover:bg-muted/50 focus:bg-primary/10 cursor-pointer font-sans"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              ref={addButtonRef}
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAdd}
              disabled={!selectedValue || disabled}
              className="shrink-0 bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/50 font-heading"
              aria-label={`Add selected ${label.toLowerCase()}`}
              title={`Add ${selectedValue || 'selected item'}`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="text-sm text-muted-foreground p-4 border border-dashed border-border rounded-lg text-center bg-muted/20"
          role="status"
          aria-live="polite"
        >
          {options.length === 0 ? (
            <div className="space-y-2">
              <div className="text-base font-heading font-semibold">
                {emptyMessage}
              </div>
              <div className="text-xs">
                No options are currently available to select from.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-base font-heading font-semibold text-emerald-600">
                All Options Selected ✓
              </div>
              <div className="text-xs">
                You have selected all available options ({value.length} of {options.length}).
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accessibility Information */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {value.length > 0 && (
          `${value.length} ${label.toLowerCase()} selected. ${availableOptions.length} options remaining.`
        )}
      </div>
    </div>
  );
}
