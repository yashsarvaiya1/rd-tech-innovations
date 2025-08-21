'use client'
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAvailableRoutes } from "@/hooks/useAvailableRoutes";
import { Globe, Edit, ExternalLink, Zap } from "lucide-react";

interface RouteNameEditorProps {
  value: string[];
  onChange: (routes: string[]) => void;
}

export default function RouteNameEditor({ value, onChange }: RouteNameEditorProps) {
  const [routeNames, setRouteNames] = useState<string[]>([]);
  
  // Use the dynamic hook
  const availableRoutes = useAvailableRoutes();

  useEffect(() => {
    // Initialize with existing values or defaults
    if (value && value.length === availableRoutes.length) {
      setRouteNames(value);
    } else {
      const defaultNames = availableRoutes.map(route => route.displayName);
      setRouteNames(defaultNames);
      onChange(defaultNames);
    }
  }, [value, availableRoutes, onChange]);

  const handleNameChange = (index: number, newName: string) => {
    const updatedNames = [...routeNames];
    updatedNames[index] = newName;
    setRouteNames(updatedNames);
    onChange(updatedNames);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span>Website Navigation Routes</span>
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Auto-detected
          </Badge>
        </Label>
        <p className="text-sm text-gray-600 mt-1">
          Routes are automatically detected from your app structure. Admin and Auth pages are excluded from public navigation.
        </p>
      </div>
      
      <div className="space-y-3">
        {availableRoutes.map((route, index) => (
          <Card key={route.path}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Label className="text-sm font-medium">Display Name</Label>
                    <Badge variant="secondary" className="text-xs">
                      <Edit className="h-3 w-3 mr-1" />
                      Editable
                    </Badge>
                  </div>
                  <Input
                    value={routeNames[index] || route.displayName}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={route.displayName}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-600">Public URL</Label>
                  <div className="p-2 bg-gray-100 rounded border text-sm text-gray-700 font-mono mt-2 flex items-center justify-between">
                    <span>{route.path === '/' ? 'yoursite.com/' : `yoursite.com${route.path}`}</span>
                    <ExternalLink className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                <strong>Visitor Experience:</strong> Sees "{routeNames[index] || route.displayName}" in navigation → 
                <strong> Navigates to:</strong> {route.path === '/' ? 'Home page' : `${route.path.slice(1)} page`}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded flex items-start space-x-2">
        <div className="bg-green-100 p-1 rounded">
          <Globe className="h-3 w-3 text-green-600" />
        </div>
        <div>
          <strong>Dynamic Detection:</strong> Routes are automatically detected from your Next.js app structure. 
          Only public-facing pages are shown. Admin (/admin) and Authentication (/auth) routes are excluded automatically.
        </div>
      </div>
    </div>
  );
}
