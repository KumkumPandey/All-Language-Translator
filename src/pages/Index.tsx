import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextTranslator } from "@/components/TextTranslator";
import { VoiceTranslator } from "@/components/VoiceTranslator";
import { ImageTranslator } from "@/components/ImageTranslator";
import { Languages, Type, Mic, Image as ImageIcon, Globe, Sparkles, Zap, Shield } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-20"></div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            {/* Hero Header */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Globe className="h-20 w-20 text-primary animate-float" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-8 w-8 text-ai-secondary animate-glow-pulse" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
                AI Translator
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
                Universal language translator powered by AI
                <br />
                <span className="text-ai-secondary font-semibold">Text • Voice • Image</span> - सभी भाषाओं में instant translation
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="p-6 bg-gradient-surface border-ai-border hover:shadow-ai transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-3">
                  <Type className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold">Text Translation</h3>
                  <p className="text-muted-foreground">Type in any language and get instant translations</p>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-surface border-ai-border hover:shadow-ai transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-3">
                  <Mic className="h-12 w-12 text-ai-accent mx-auto" />
                  <h3 className="text-xl font-semibold">Voice Translation</h3>
                  <p className="text-muted-foreground">Speak naturally and hear translations instantly</p>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-surface border-ai-border hover:shadow-ai transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-3">
                  <ImageIcon className="h-12 w-12 text-ai-warning mx-auto" />
                  <h3 className="text-xl font-semibold">Image Translation</h3>
                  <p className="text-muted-foreground">Extract and translate text from any image</p>
                </div>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-ai-secondary">100+</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ai-accent">AI</div>
                <div className="text-sm text-muted-foreground">Powered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ai-warning">Real-time</div>
                <div className="text-sm text-muted-foreground">Translation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Translator Section */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-6xl mx-auto p-8 bg-gradient-surface border-ai-border shadow-ai">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-ai-surface border border-ai-border">
              <TabsTrigger 
                value="text" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
              >
                <Type className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger 
                value="voice"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
              >
                <Mic className="h-4 w-4" />
                Voice
              </TabsTrigger>
              <TabsTrigger 
                value="image"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
              >
                <ImageIcon className="h-4 w-4" />
                Image
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="text">
                <TextTranslator isActive={activeTab === 'text'} />
              </TabsContent>
              
              <TabsContent value="voice">
                <VoiceTranslator isActive={activeTab === 'voice'} />
              </TabsContent>
              
              <TabsContent value="image">
                <ImageTranslator isActive={activeTab === 'image'} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our <span className="bg-gradient-primary bg-clip-text text-transparent">AI Translator</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI technology meets intuitive design for the perfect translation experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-surface border-ai-border hover:shadow-ai transition-all duration-300 group">
            <div className="space-y-3">
              <Zap className="h-10 w-10 text-ai-secondary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Get translations in milliseconds with our optimized AI engine</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-surface border-ai-border hover:shadow-ai transition-all duration-300 group">
            <div className="space-y-3">
              <Languages className="h-10 w-10 text-ai-accent group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">100+ Languages</h3>
              <p className="text-sm text-muted-foreground">Support for all major world languages and dialects</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-surface border-ai-border hover:shadow-ai transition-all duration-300 group">
            <div className="space-y-3">
              <Shield className="h-10 w-10 text-ai-warning group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Privacy First</h3>
              <p className="text-sm text-muted-foreground">Your data is processed securely and never stored</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-surface border-ai-border hover:shadow-ai transition-all duration-300 group">
            <div className="space-y-3">
              <Sparkles className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">AI Powered</h3>
              <p className="text-sm text-muted-foreground">Advanced machine learning for accurate translations</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-ai-border bg-ai-surface/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Built with ❤️ for easy translation for you
            </p>
            <p className="text-sm text-muted-foreground">
              Universal AI Translator - Breaking language barriers worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
