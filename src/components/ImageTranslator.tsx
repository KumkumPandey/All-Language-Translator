import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSelector } from "./LanguageSelector";
import { Upload, Camera, Image as ImageIcon, Eye, Volume2, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { translateText } from "@/utils/translationService";

interface ImageTranslatorProps {
  isActive: boolean;
}

export const ImageTranslator = ({ isActive }: ImageTranslatorProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setExtractedText('');
        setTranslatedText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const extractTextFromImage = async () => {
    if (!selectedImage) {
      toast.error('कृपया पहले एक image select करें!');
      return;
    }

    setIsProcessing(true);
    
    try {
      // For demo purposes, we'll simulate OCR processing
      // In a real app, you would use OCR services like Tesseract.js or Google Vision API
      
      // Simulating OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo extracted text (in real implementation, this would come from OCR)
      const demoTexts = [
        'Hello, this is sample text extracted from the image.',
        'नमस्ते, यह image से extract किया गया sample text है।',
        'Bonjour, ceci est un exemple de texte extrait de l\'image.',
        'Hola, este es un texto de muestra extraído de la imagen.',
        '这是从图像中提取的示例文本。'
      ];
      
      const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)];
      setExtractedText(randomText);
      toast.success('Text extracted successfully! 🎉');
      
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Failed to extract text from image');
    } finally {
      setIsProcessing(false);
    }
  };

  const translateExtractedText = async () => {
    if (!extractedText.trim()) {
      toast.error('कोई text extract नहीं हुआ है। पहले image से text extract करें!');
      return;
    }

    setIsTranslating(true);
    
    try {
      const result = await translateText(extractedText, 'auto', targetLang);
      setTranslatedText(result);
      toast.success('Image text translation successful! 🎉');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. कृपया फिर से try करें।');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Text copied to clipboard! 📋');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis not supported in your browser');
    }
  };

  const clearAll = () => {
    setSelectedImage(null);
    setExtractedText('');
    setTranslatedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Target Language Selector */}
      <div className="max-w-md">
        <LanguageSelector
          value={targetLang}
          onValueChange={setTargetLang}
          placeholder="Select target language"
        />
      </div>

      {/* Image Upload Section */}
      <Card className="p-8 bg-gradient-surface border-ai-border">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <ImageIcon className="h-16 w-16 text-ai-warning animate-float" />
            </div>
            <h3 className="text-xl font-semibold">Upload or Capture Image</h3>
            <p className="text-muted-foreground">
              Select an image containing text to extract and translate
            </p>
          </div>

          {/* Upload Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="image"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Image
            </Button>
            
            <Button
              variant="image"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Camera className="h-5 w-5" />
              Take Photo
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="space-y-4">
              <div className="max-w-md mx-auto">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-auto rounded-lg border border-ai-border shadow-ai"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={extractTextFromImage}
                  disabled={isProcessing}
                  className="bg-gradient-primary hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting Text...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Extract Text
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={clearAll}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Results Section */}
      {(extractedText || translatedText) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Extracted Text */}
          <Card className="p-6 bg-gradient-surface border-ai-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5 text-ai-warning" />
                Extracted Text
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => speakText(extractedText)}
                  disabled={!extractedText}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(extractedText)}
                  disabled={!extractedText}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="min-h-32 p-4 bg-ai-surface rounded-lg border border-ai-border">
              <p className="text-foreground">
                {extractedText || 'Extracted text will appear here...'}
              </p>
            </div>
            
            {extractedText && (
              <div className="mt-4 text-center">
                <Button
                  onClick={translateExtractedText}
                  disabled={isTranslating}
                  className="bg-gradient-primary hover:scale-105"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    'Translate Text'
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* Translated Text */}
          <Card className="p-6 bg-gradient-surface border-ai-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-ai-secondary" />
                Translation
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => speakText(translatedText)}
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
            
            <div className="min-h-32 p-4 bg-ai-surface rounded-lg border border-ai-border">
              <p className="text-ai-secondary">
                {translatedText || 'Translation will appear here...'}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Instructions */}
      <Card className="p-6 bg-ai-surface/30 border-ai-border">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-ai-warning" />
          Tips for Better Results
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use high-quality images with clear, readable text</li>
          <li>• Ensure good lighting and minimal shadows</li>
          <li>• Avoid blurry or tilted images</li>
          <li>• Text should be horizontally aligned for best results</li>
          <li>• Supported formats: JPG, PNG, WebP (max 5MB)</li>
        </ul>
      </Card>
    </div>
  );
};