import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { LanguageSelector } from "./LanguageSelector";
import { Copy, ArrowRightLeft, Type, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { translateText } from "@/utils/translationService";

interface TextTranslatorProps {
  isActive: boolean;
}

export const TextTranslator = ({ isActive }: TextTranslatorProps) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('hi');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslation = async () => {
    if (!sourceText.trim()) {
      toast.error('कृपया translate करने के लिए कुछ text enter करें!');
      return;
    }

    setIsTranslating(true);
    
    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
      toast.success('Translation successful! 🎉');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. कृपया फिर से try करें।');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Text copied to clipboard! 📋');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis not supported in your browser');
    }
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Language Selector Row */}
      <div className="flex items-center gap-4">
        <LanguageSelector
          value={sourceLang}
          onValueChange={setSourceLang}
          placeholder="Source Language"
          className="flex-1"
        />
        
        <Button
          variant="outline"
          size="icon"
          onClick={swapLanguages}
          className="hover:rotate-180 transition-transform duration-300"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
        
        <LanguageSelector
          value={targetLang}
          onValueChange={setTargetLang}
          placeholder="Target Language"
          className="flex-1"
        />
      </div>

      {/* Translation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <Card className="p-6 bg-gradient-surface border-ai-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              <span className="font-semibold">Input Text</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => speakText(sourceText, sourceLang)}
              disabled={!sourceText}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          <Textarea
            placeholder="यहाँ अपना text enter करें..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="min-h-32 bg-ai-surface border-ai-border resize-none focus:border-primary/50"
          />
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">
              {sourceText.length} characters
            </span>
            <Button
              onClick={handleTranslation}
              disabled={isTranslating || !sourceText.trim()}
              className="bg-gradient-primary hover:scale-105"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </Button>
          </div>
        </Card>

        {/* Translated Text */}
        <Card className="p-6 bg-gradient-surface border-ai-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-ai-secondary" />
              <span className="font-semibold">Translated Text</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakText(translatedText, targetLang)}
                disabled={!translatedText}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(translatedText)}
                disabled={!translatedText}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Textarea
            placeholder="Translation will appear here..."
            value={translatedText}
            readOnly
            className="min-h-32 bg-ai-surface border-ai-border resize-none text-ai-secondary"
          />
          
          <div className="mt-4 text-right">
            <span className="text-sm text-muted-foreground">
              {translatedText.length} characters
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};