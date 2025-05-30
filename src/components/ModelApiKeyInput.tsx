
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key, Zap } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ModelApiKeyInputProps {
  openAIKey: string;
  groqKey: string;
  selectedModel: 'openai' | 'groq';
  onOpenAIKeyChange: (key: string) => void;
  onGroqKeyChange: (key: string) => void;
  onModelChange: (model: 'openai' | 'groq') => void;
  onSave?: () => void;
}

export const ModelApiKeyInput = ({ 
  openAIKey, 
  groqKey, 
  selectedModel,
  onOpenAIKeyChange, 
  onGroqKeyChange,
  onModelChange,
  onSave 
}: ModelApiKeyInputProps) => {
  const [showKey, setShowKey] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSave) {
      onSave();
    }
  };

  const currentKey = selectedModel === 'openai' ? openAIKey : groqKey;
  const onChangeHandler = selectedModel === 'openai' ? onOpenAIKeyChange : onGroqKeyChange;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label>AI Model Provider</Label>
        <ToggleGroup 
          type="single" 
          value={selectedModel} 
          onValueChange={(value) => {
            if (value) onModelChange(value as 'openai' | 'groq');
          }}
          className="justify-start"
        >
          <ToggleGroupItem value="openai" aria-label="OpenAI">
            OpenAI
          </ToggleGroupItem>
          <ToggleGroupItem value="groq" aria-label="Groq">
            <Zap className="h-4 w-4 mr-1" />
            Groq
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-key" className="flex items-center gap-1">
          <Key className="h-3.5 w-3.5" />
          <span>{selectedModel === 'openai' ? 'OpenAI' : 'Groq'} API Key</span>
        </Label>
        <div className="flex space-x-2">
          <Input
            id="api-key"
            value={currentKey}
            onChange={(e) => onChangeHandler(e.target.value)}
            type={showKey ? "text" : "password"}
            placeholder={selectedModel === 'openai' ? "sk-..." : "gsk_..."}
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
    </div>
  );
};
