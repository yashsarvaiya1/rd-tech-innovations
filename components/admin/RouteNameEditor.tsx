"use client";
import { 
  Edit, 
  ExternalLink, 
  Globe, 
  Zap, 
  Eye, 
  Link2, 
  Settings,
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAvailableRoutes } from "@/hooks/useAvailableRoutes";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RouteNameEditorProps {
  value: string[];
  onChange: (routes: string[]) => void;
  disabled?: boolean;
}

export default function RouteNameEditor({
  value,
  onChange,
  disabled = false,
}: RouteNameEditorProps) {
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string }>({});

  // Use the dynamic hook
  const availableRoutes = useAvailableRoutes();

  useEffect(() => {
    // Initialize with existing values or defaults
    if (value && value.length === availableRoutes.length) {
      setRouteNames(value);
    } else {
      const defaultNames = availableRoutes.map((route) => route.displayName);
      setRouteNames(defaultNames);
      onChange(defaultNames);
    }
    setHasChanges(false);
  }, [value, availableRoutes]);

  const validateName = (name: string, index: number): string | null => {
    if (!name.trim()) {
      return "Display name cannot be empty";
    }
    if (name.trim().length < 2) {
      return "Display name must be at least 2 characters";
    }
    if (name.trim().length > 50) {
      return "Display name must be less than 50 characters";
    }
    // Check for duplicates
    const duplicateIndex = routeNames.findIndex((n, i) => 
      i !== index && n.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicateIndex !== -1) {
      return "Display name must be unique";
    }
    return null;
  };

  const handleNameChange = (index: number, newName: string) => {
    if (disabled) return;

    const updatedNames = [...routeNames];
    updatedNames[index] = newName;
    setRouteNames(updatedNames);
    setHasChanges(true);

    // Validate
    const errors = { ...validationErrors };
    const error = validateName(newName, index);
    if (error) {
      errors[index] = error;
    } else {
      delete errors[index];
    }
    setValidationErrors(errors);

    // Only call onChange if no validation errors
    if (Object.keys(errors).length === 0) {
      onChange(updatedNames);
    }
  };

  const resetToDefaults = () => {
    const defaultNames = availableRoutes.map((route) => route.displayName);
    setRouteNames(defaultNames);
    onChange(defaultNames);
    setHasChanges(false);
    setValidationErrors({});
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-background to-muted/20 p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-lg font-heading font-bold text-foreground flex items-center space-x-2">
                Website Navigation Routes
                <Badge variant="outline" className="text-xs font-heading bg-primary/10 text-primary border-primary/30">
                  <Zap className="h-3 w-3 mr-1" />
                  Auto-detected
                </Badge>
              </Label>
              <p className="text-muted-foreground font-sans mt-1">
                Routes are automatically detected from your app structure. Admin and Auth pages are excluded.
              </p>
            </div>
          </div>

          {hasChanges && (
            <Button
              variant="outline"
              onClick={resetToDefaults}
              disabled={disabled}
              className="font-heading"
            >
              Reset to Defaults
            </Button>
          )}
        </div>
      </div>

      {/* Validation Alert */}
      {hasValidationErrors && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-sans">
            Please fix the validation errors below before saving.
          </AlertDescription>
        </Alert>
      )}

      {/* Status Alert */}
      {hasChanges && !hasValidationErrors && (
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800 font-sans">
            Changes detected! Your navigation routes will be updated.
          </AlertDescription>
        </Alert>
      )}

      {/* Route Cards */}
      <div className="space-y-4">
        {availableRoutes.map((route, index) => {
          const hasError = validationErrors[index];
          
          return (
            <Card key={route.path} className={`bg-card border-border shadow-sm ${hasError ? 'border-destructive/50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link2 className="h-4 w-4 text-primary" />
                    <span>Route Configuration</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-xs font-heading bg-muted text-muted-foreground"
                  >
                    {route.path === "/" ? "Home" : route.path.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Display Name Input */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-heading font-semibold text-foreground">
                        Display Name
                      </Label>
                      <Badge variant="outline" className="text-xs font-heading bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Edit className="h-3 w-3 mr-1" />
                        Editable
                      </Badge>
                    </div>
                    <Input
                      value={routeNames[index] || route.displayName}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder={route.displayName}
                      disabled={disabled}
                      className={`bg-background border-border font-sans ${hasError ? 'border-destructive focus:border-destructive' : ''}`}
                    />
                    {hasError && (
                      <p className="text-xs text-destructive font-sans flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{hasError}</span>
                      </p>
                    )}
                  </div>

                  {/* Public URL Display */}
                  <div className="space-y-2">
                    <Label className="text-sm font-heading font-semibold text-muted-foreground">
                      Public URL
                    </Label>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border text-sm text-muted-foreground font-mono flex items-center justify-between">
                      <span>
                        {route.path === "/"
                          ? "yoursite.com/"
                          : `yoursite.com${route.path}`}
                      </span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* User Experience Preview */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-sm font-heading font-semibold text-primary">Visitor Experience</span>
                  </div>
                  <div className="text-sm text-foreground font-sans">
                    Visitors will see <strong>"{routeNames[index] || route.displayName}"</strong> in navigation
                    <span className="mx-2">→</span>
                    Clicking navigates to <strong>
                      {route.path === "/" ? "Home page" : `${route.path.slice(1)} page`}
                    </strong>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Settings className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-heading font-semibold text-foreground">Dynamic Route Detection</h4>
            <p className="text-sm text-muted-foreground font-sans">
              Routes are automatically detected from your Next.js app structure. Only public-facing pages are included in navigation. 
              Admin (<code className="text-xs bg-muted px-1 rounded">/admin</code>) and Authentication 
              (<code className="text-xs bg-muted px-1 rounded">/auth</code>) routes are automatically excluded.
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground font-sans">
              <span className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                <span>{availableRoutes.length} routes detected</span>
              </span>
              <span className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-amber-600" />
                <span>Auto-updated on build</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
