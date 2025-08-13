
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  storagePath: string; // e.g., "profile-images" or "event-thumbnails"
  currentImageUrl?: string;
  label: string;
}

export function ImageUpload({ onUpload, storagePath, currentImageUrl, label }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ variant: "destructive", title: "No file selected", description: "Please select an image to upload." });
      return;
    }
    setIsUploading(true);
    try {
      const uniqueFileName = `${Date.now()}-${selectedFile.name}`;
      const fullPath = `${storagePath}/${uniqueFileName}`;
      const downloadURL = await uploadImage(selectedFile, fullPath);
      onUpload(downloadURL);
      toast({ title: "Success", description: "Image uploaded successfully!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
        <CardContent className="p-6">
             <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {previewUrl ? (
                         <Image src={previewUrl} alt="Preview" width={200} height={200} className="mx-auto h-24 w-24 rounded-full object-cover" />
                    ): (
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                   
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="image-upload-input" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                            <span>Upload a file</span>
                            <Input id="image-upload-input" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            {selectedFile && (
                <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>
                    <Button onClick={handleUpload} disabled={isUploading} className="mt-2 w-full">
                        {isUploading ? <Loader2 className="animate-spin" /> : "Upload Image"}
                    </Button>
                </div>
            )}
        </CardContent>
    </Card>
  );
}

