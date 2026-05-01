import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/app/components/ui/card';
import { Upload } from 'lucide-react';

export function FileUpload() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files uploaded:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-lg">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports: PNG, JPG, JPEG, GIF, SVG
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
