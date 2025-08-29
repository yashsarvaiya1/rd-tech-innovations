"use client";
import {
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type StorageFile, StorageService } from "@/services/storageService";

export default function AssetsManager() {
  const [assets, setAssets] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const assetsList = await StorageService.listAllAssets();
      setAssets(assetsList);
    } catch {
      setError("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const handleDelete = async (asset: StorageFile) => {
    if (
      !confirm(
        `Are you sure you want to delete "${asset.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeleting(asset.fullPath);
      setError("");

      await StorageService.deleteAssetByPath(asset.fullPath);

      // Remove from local state
      setAssets((prev) => prev.filter((a) => a.fullPath !== asset.fullPath));

      setSuccess(`"${asset.name}" deleted successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to delete asset");
    } finally {
      setDeleting(null);
    }
  };

  const handleViewImage = (url: string) => {
    window.open(url, "_blank");
  };

  const isImage = (fileName: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => fileName.toLowerCase().includes(ext));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Assets Management
          </h1>
          <p className="text-gray-600">Manage uploaded files and images</p>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="outline">{assets.length} files</Badge>
          <Button variant="outline" onClick={loadAssets} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading assets...</span>
            </div>
          ) : assets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <Card key={asset.fullPath} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {isImage(asset.name) ? (
                      <Image
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (
                            e.target as HTMLImageElement
                          ).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3
                          className="font-medium text-sm truncate"
                          title={asset.name}
                        >
                          {asset.name}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewImage(asset.url)}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                          <a href={asset.url} download={asset.name}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </a>
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(asset)}
                          disabled={deleting === asset.fullPath}
                        >
                          {deleting === asset.fullPath ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500 break-all">
                        {asset.fullPath}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Assets Found
              </h3>
              <p className="text-gray-600">
                Upload some images to see them here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
