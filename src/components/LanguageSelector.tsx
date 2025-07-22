import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export const languages = [
  { code: 'hi', name: 'Hindi - हिंदी' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish - Español' },
  { code: 'fr', name: 'French - Français' },
  { code: 'de', name: 'German - Deutsch' },
  { code: 'it', name: 'Italian - Italiano' },
  { code: 'pt', name: 'Portuguese - Português' },
  { code: 'ru', name: 'Russian - Русский' },
  { code: 'ja', name: 'Japanese - 日本語' },
  { code: 'ko', name: 'Korean - 한국어' },
  { code: 'zh', name: 'Chinese - 中文' },
  { code: 'ar', name: 'Arabic - العربية' },
  { code: 'bn', name: 'Bengali - বাংলা' },
  { code: 'ta', name: 'Tamil - தமிழ்' },
  { code: 'te', name: 'Telugu - తెలుగు' },
  { code: 'mr', name: 'Marathi - मराठी' },
  { code: 'gu', name: 'Gujarati - ગુજરાતી' },
  { code: 'ur', name: 'Urdu - اردو' },
  { code: 'pa', name: 'Punjabi - ਪੰਜਾਬੀ' },
  { code: 'kn', name: 'Kannada - ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam - മലയാളം' },
  { code: 'or', name: 'Odia - ଓଡିଆ' },
  { code: 'as', name: 'Assamese - অসমীয়া' },
  { code: 'ne', name: 'Nepali - नेपाली' },
  { code: 'si', name: 'Sinhala - සිංහල' },
  { code: 'th', name: 'Thai - ไทย' },
  { code: 'vi', name: 'Vietnamese - Tiếng Việt' },
  { code: 'id', name: 'Indonesian - Bahasa Indonesia' },
  { code: 'ms', name: 'Malay - Bahasa Melayu' },
  { code: 'tr', name: 'Turkish - Türkçe' },
  { code: 'pl', name: 'Polish - Polski' },
  { code: 'nl', name: 'Dutch - Nederlands' },
  { code: 'sv', name: 'Swedish - Svenska' },
  { code: 'da', name: 'Danish - Dansk' },
  { code: 'no', name: 'Norwegian - Norsk' },
  { code: 'fi', name: 'Finnish - Suomi' },
  { code: 'el', name: 'Greek - Ελληνικά' },
  { code: 'he', name: 'Hebrew - עברית' },
  { code: 'fa', name: 'Persian - فارسی' },
  { code: 'sw', name: 'Swahili - Kiswahili' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'zu', name: 'Zulu - isiZulu' },
  { code: 'xh', name: 'Xhosa - isiXhosa' },
  { code: 'hu', name: 'Hungarian - Magyar' },
  { code: 'cs', name: 'Czech - Čeština' },
  { code: 'sk', name: 'Slovak - Slovenčina' },
  { code: 'ro', name: 'Romanian - Română' },
  { code: 'bg', name: 'Bulgarian - Български' },
  { code: 'hr', name: 'Croatian - Hrvatski' },
  { code: 'sr', name: 'Serbian - Српски' },
  { code: 'sl', name: 'Slovenian - Slovenščina' },
  { code: 'et', name: 'Estonian - Eesti' },
  { code: 'lv', name: 'Latvian - Latviešu' },
  { code: 'lt', name: 'Lithuanian - Lietuvių' },
  { code: 'uk', name: 'Ukrainian - Українська' },
  { code: 'be', name: 'Belarusian - Беларуская' },
  { code: 'ka', name: 'Georgian - ქართული' },
  { code: 'am', name: 'Amharic - አማርኛ' },
  { code: 'is', name: 'Icelandic - Íslenska' },
  { code: 'mt', name: 'Maltese - Malti' },
  { code: 'cy', name: 'Welsh - Cymraeg' },
  { code: 'ga', name: 'Irish - Gaeilge' },
  { code: 'eu', name: 'Basque - Euskera' },
  { code: 'ca', name: 'Catalan - Català' },
  { code: 'gl', name: 'Galician - Galego' },
];

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export const LanguageSelector = ({ value, onValueChange, placeholder, className }: LanguageSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`bg-ai-surface border-ai-border hover:border-primary/50 transition-all duration-300 ${className}`}>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-ai-surface border-ai-border max-h-60">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="hover:bg-ai-primary/10 focus:bg-ai-primary/10"
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};