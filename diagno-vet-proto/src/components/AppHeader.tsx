import { LanguageSwitcher } from "./LanguageSwitcher";

type AppHeaderProps = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  logoLink?: string;
};

export function AppHeader({
  title,
  onBack,
  right,
  logoLink,
}: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* LEFT ZONE */}
        <div className="flex items-center gap-4">
          
          {/* LOGO */}
          {logoLink ? (
            <a href={logoLink}>
              <img
                src="/logo.png"
                alt="DiagnoVetAI"
                className="h-8 w-auto cursor-pointer hover:opacity-80 transition"
              />
            </a>
          ) : (
            <img
              src="/logo.png"
              alt="DiagnoVetAI"
              className="h-8 w-auto"
            />
          )}

          {/* BACK */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              ← <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* TITLE */}
          {title && (
            <h1 className="text-sm sm:text-base font-medium text-gray-900 ml-2">
              {title}
            </h1>
          )}
        </div>

        {/* RIGHT ZONE */}
        <div className="flex items-center gap-4">
          {right}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
