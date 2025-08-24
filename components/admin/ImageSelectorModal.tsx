'use client'
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StorageService, StorageFile } from "@/services/storageService";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Search,
  Eye
} from "lucide-react";

interface ImageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function ImageSelectorModal({ isOpen, onClose, onSelect }: ImageSelectorModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<StorageFile[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<StorageFile[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    } else {
      // Reset state when modal closes
      setError("");
      setSuccess("");
      setSearchTerm("");
      setSelectedImage("");
    }
  }, [isOpen]);

  useEffect(() => {
    // Filter assets based on search term
    if (searchTerm.trim()) {
      const filtered = assets.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets);
    }
  }, [assets, searchTerm]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");
      
      const assetsList = await StorageService.listAllAssets();
      setAssets(assetsList);
      setFilteredAssets(assetsList);
    } catch (error: any) {
      setError(error.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // Validate and upload
      const result = await StorageService.uploadImageWithPreview(file);
      
      // Refresh the gallery
      await loadAssets();
      
      setSuccess("Image uploaded successfully!");
      setTimeout(() => {
        onSelect(result.url);
        onClose();
      }, 1000);
      
    } catch (error: any) {
      setError(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePreviewImage = (url: string) => {
    window.open(url, '_blank');
  };

  const isImage = (fileName: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().includes(ext));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Select or Upload Image</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="gallery" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery" className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Select From Gallery</span>
              <Badge variant="outline" className="ml-1">
                {filteredAssets.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload New</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Image Gallery */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading images...</span>
                </div>
              ) : filteredAssets.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.fullPath}
                      className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage === asset.url 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedImage(asset.url)}
                    >
                      <div className="aspect-square bg-gray-100">
                        {isImage(asset.name) ? (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewImage(asset.url);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* File name */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {asset.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No images found' : 'No images available'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? `No images match "${searchTerm}"` 
                      : 'Upload some images to get started'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Selection Actions */}
            {selectedImage && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Image selected
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setSelectedImage("")}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleImageSelect(selectedImage)}>
                    Use This Image
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload New Image
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose an image file from your device
                </p>
                <p className="text-xs text-gray-500">
                  Supports: JPEG, PNG, WebP, GIF (max 5MB)
                </p>
              </div>

              <Button 
                onClick={handleUploadClick} 
                disabled={uploading}
                className="min-w-[120px]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
