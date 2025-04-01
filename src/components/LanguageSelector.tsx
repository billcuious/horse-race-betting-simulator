
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Flag } from "lucide-react";

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant={language === "en" ? "default" : "outline"}
        className="flex items-center gap-2"
        onClick={() => setLanguage("en")}
        size="sm"
      >
        <span className="relative top-[1px] mr-1">🇦🇺</span>
        {t("language.english")}
      </Button>
      <Button
        variant={language === "es" ? "default" : "outline"}
        className="flex items-center gap-2"
        onClick={() => setLanguage("es")}
        size="sm"
      >
        <span className="relative top-[1px] mr-1">🇲🇽</span>
        {t("language.spanish")}
      </Button>
    </div>
  );
};

export default LanguageSelector;
