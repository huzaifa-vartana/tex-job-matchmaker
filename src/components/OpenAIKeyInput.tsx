
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";

interface OpenAIKeyInputProps {
  apiKey: string;
  onChange: (key: string) => void;
  onSave?: () => void;
}

export const OpenAIKeyInput = ({ apiKey, onChange, onSave }: OpenAIKeyInputProps) => {
  const [showKey, setShowKey] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSave) {
      onSave();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="openai-key" className="flex items-center gap-1">
        <Key className="h-3.5 w-3.5" />
        <span>OpenAI API Key</span>
      </Label>
      <div className="flex space-x-2">
        <Input
          id="openai-key"
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          type={showKey ? "text" : "password"}
          placeholder="sk-..."
          className="flex-1"
          onKeyDown={handleKeyDown}
        />
        <Button 
          variant="outline" 
          size="sm" 
          type="button"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? "Hide" : "Show"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally and never sent to our servers
      </p>
    </div>
  );
};
