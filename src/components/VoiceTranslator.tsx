import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSelector } from "./LanguageSelector";
import { Mic, MicOff, Volume2, Play, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { translateText } from "@/utils/translationService";

interface VoiceTranslatorProps {
  isActive: boolean;
}

export const VoiceTranslator = ({ isActive }: VoiceTranslatorProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('hi-IN');
  const [targetLang, setTargetLang] = useState('en');
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in your browser');
    }
  }, []);

  const startRecording = () => {
    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sourceLang;

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        toast.success('Recording started! 🎤');
        animateAudioLevel();
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setRecognizedText(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Recognition error: ' + event.error);
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        cancelAnimationFrame(animationRef.current!);
        setAudioLevel(0);
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error('Failed to start voice recognition');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    cancelAnimationFrame(animationRef.current!);
    setAudioLevel(0);
  };

  const animateAudioLevel = () => {
    setAudioLevel(Math.random() * 100);
    animationRef.current = requestAnimationFrame(animateAudioLevel);
  };

  const translateVoice = async () => {
    if (!recognizedText.trim()) {
      toast.error('कोई voice text नहीं मिला। कृपया पहले record करें!');
      return;
    }

    setIsTranslating(true);
    
    try {
      const result = await translateText(recognizedText, sourceLang.split('-')[0], targetLang);
      setTranslatedText(result);
      toast.success('Voice translation successful! 🎉');
      
      // Auto-speak the translation
      speakTranslation(result);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. कृपया फिर से try करें।');
    } finally {
      setIsTranslating(false);
    }
  };

  const speakTranslation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const clearAll = () => {
    setRecognizedText('');
    setTranslatedText('');
    stopRecording();
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Language Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LanguageSelector
          value={sourceLang}
          onValueChange={setSourceLang}
          placeholder="Source Language"
        />
        <LanguageSelector
          value={targetLang}
          onValueChange={setTargetLang}
          placeholder="Target Language"
        />
      </div>

      {/* Voice Recording Section */}
      <Card className="p-8 bg-gradient-surface border-ai-border text-center">
        <div className="space-y-6">
          {/* Microphone Button */}
          <div className="relative inline-block">
            <Button
              variant={isRecording ? "destructive" : "voice"}
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full text-xl ${
                isRecording ? 'animate-glow-pulse' : 'hover:animate-float'
              }`}
            >
              {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
            
            {/* Audio Level Indicator */}
            {isRecording && (
              <div className="absolute -inset-4 rounded-full border-2 border-ai-accent animate-ping opacity-30"></div>
            )}
          </div>

          {/* Recording Status */}
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isRecording ? '🎤 Recording...' : '🎙️ Click to start recording'}
            </p>
            {isRecording && (
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-ai-accent rounded-full animate-pulse"
                      style={{
                        height: `${Math.max(4, audioLevel / 5)}px`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={translateVoice}
              disabled={!recognizedText || isTranslating}
              className="bg-gradient-primary hover:scale-105"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                'Translate Voice'
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearAll}
              disabled={!recognizedText && !translatedText}
            >
              Clear All
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {(recognizedText || translatedText) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recognized Text */}
          <Card className="p-6 bg-gradient-surface border-ai-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Mic className="h-5 w-5 text-ai-accent" />
                Recognized Speech
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakTranslation(recognizedText)}
                disabled={!recognizedText}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-h-24 p-4 bg-ai-surface rounded-lg border border-ai-border">
              <p className="text-foreground">{recognizedText || 'No speech detected yet...'}</p>
            </div>
          </Card>

          {/* Translated Text */}
          <Card className="p-6 bg-gradient-surface border-ai-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-ai-secondary" />
                Translation
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakTranslation(translatedText)}
                disabled={!translatedText}
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-h-24 p-4 bg-ai-surface rounded-lg border border-ai-border">
              <p className="text-ai-secondary">{translatedText || 'Translation will appear here...'}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};