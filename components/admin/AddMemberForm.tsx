"use client";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/stores/admin";

export default function AddMemberForm() {
  const { admins, addAdminEmail, removeAdmin, loading, error, clearError } =
    useAdminStore();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setIsSubmitting(true);
    clearError();
    setSuccess("");

    try {
      await addAdminEmail(email.trim());
      setEmail("");
      setSuccess(`Admin ${email} added successfully!`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (emailToRemove: string) => {
    if (admins.length <= 1) {
      // Prevent removing the last admin
      return;
    }

    try {
      clearError();
      await removeAdmin(emailToRemove);
      setSuccess(`Admin ${emailToRemove} removed successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error removing admin:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Administrators
        </h1>
        <p className="text-gray-600">
          Add or remove admin users who can access this dashboard
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Add Admin Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Add New Administrator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={isSubmitting || loading}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || loading || !email.trim()}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Admin...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Administrator
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Admins List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Administrators</span>
            <Badge variant="secondary">{admins.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading administrators...</span>
            </div>
          ) : admins.length > 0 ? (
            <div className="space-y-3">
              {admins.map((adminEmail) => (
                <div
                  key={adminEmail}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {adminEmail.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {adminEmail}
                      </p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>

                  {admins.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAdmin(adminEmail)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {admins.length === 1 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This is the last administrator. At least one admin must
                    remain.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Administrators
              </h3>
              <p className="text-gray-600">
                Add the first administrator to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
