
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ResumeUploaderProps {
  onUpload: (content: string, fileName: string) => void;
}

export const ResumeUploader = ({ onUpload }: ResumeUploaderProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (file: File) => {
    if (!file.name.endsWith('.tex')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a LaTeX (.tex) file",
        variant: "destructive",
      });
      return;
    }

    try {
      const content = await file.text();
      setFileName(file.name);
      onUpload(content, file.name);
    } catch (error) {
      toast({
        title: "Error Reading File",
        description: "Could not read the LaTeX file",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileChange(file);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3">Upload LaTeX Resume</h2>
      
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className="flex flex-col items-center justify-center py-10 px-6 cursor-pointer">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".tex"
            onChange={handleFileInputChange}
          />
          
          {fileName ? (
            <div className="flex items-center">
              <FileText className="h-10 w-10 text-primary mb-2" />
              <div className="ml-2">
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-xs text-gray-500">LaTeX Resume</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium mb-1">Drag and drop your LaTeX resume</p>
              <p className="text-xs text-gray-500 mb-4">Or click to browse files</p>
              <Button variant="outline" size="sm" className="mt-2">
                Select LaTeX File
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-3">
        <div className="flex items-center text-xs text-amber-600">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>Only .tex files are supported</span>
        </div>
      </div>
    </div>
  );
};
