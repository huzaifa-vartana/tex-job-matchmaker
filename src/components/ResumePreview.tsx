import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ResumePreviewProps {
  originalContent: string;
  tailoredContent: string;
  fileName: string;
}

export const ResumePreview = ({ originalContent, tailoredContent, fileName }: ResumePreviewProps) => {
  const [activeTab, setActiveTab] = useState<string>('tailored');

  const downloadResume = (content: string, type: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    
    // Add a suffix to the filename to indicate it's tailored
    const nameParts = fileName.split('.');
    const extension = nameParts.pop();
    const baseName = nameParts.join('.');
    
    element.download = `${baseName}-${type}.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Function to highlight differences between original and tailored content
  const highlightDifferences = (original: string, tailored: string): JSX.Element => {
    // For a simple demo, we'll just split by lines and compare
    const originalLines = original.split('\n');
    const tailoredLines = tailored.split('\n');
    
    const maxLength = Math.max(originalLines.length, tailoredLines.length);
    const result: JSX.Element[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const originalLine = originalLines[i] || '';
      const tailoredLine = tailoredLines[i] || '';
      
      if (originalLine !== tailoredLine) {
        // This is a changed line
        result.push(
          <div key={`line-${i}`} className="bg-green-50 border-l-2 border-green-500 pl-2 py-1">
            <code className="text-sm">{tailoredLine}</code>
          </div>
        );
      } else {
        // Unchanged line
        result.push(
          <div key={`line-${i}`} className="py-1">
            <code className="text-sm text-gray-800">{tailoredLine}</code>
          </div>
        );
      }
    }
    
    return <div className="font-mono overflow-x-auto">{result}</div>;
  };

  return (
    <Card className="resume-container border-t-4 border-t-resume-light shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Resume Preview</CardTitle>
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="mr-2">
              LaTeX
            </Badge>
            <span className="text-sm text-gray-500">{fileName}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => downloadResume(tailoredContent, 'tailored')}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Download</span>
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <Tabs defaultValue="tailored" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tailored">Tailored Resume</TabsTrigger>
            <TabsTrigger value="original">Original Resume</TabsTrigger>
            <TabsTrigger value="diff">Changes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tailored" className="py-4">
            <div className="latex-preview border rounded-md p-4 overflow-x-auto bg-white">
              <pre className="whitespace-pre-wrap text-sm">{tailoredContent}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="original" className="py-4">
            <div className="latex-preview border rounded-md p-4 overflow-x-auto bg-white">
              <pre className="whitespace-pre-wrap text-sm">{originalContent}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="diff" className="py-4">
            <div className="bg-gray-50 border rounded-md p-4 overflow-x-auto">
              <div className="mb-3">
                <span className="text-sm font-medium">Showing changes:</span>
                <div className="flex items-center mt-1">
                  <div className="h-3 w-3 bg-green-50 border border-green-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Highlighted lines were modified or added</span>
                </div>
              </div>
              {highlightDifferences(originalContent, tailoredContent)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
