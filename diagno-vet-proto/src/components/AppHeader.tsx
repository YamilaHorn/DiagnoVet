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
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-4 shrink-0">
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

            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition whitespace-nowrap"
              >
                ← <span className="hidden sm:inline">Back</span>
              </button>
            )}
          </div>

          {/* CENTER */}
          {title && (
            <div className="flex-1 text-center">
              <h1 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                {title}
              </h1>
            </div>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-4 shrink-0 whitespace-nowrap">
            {right}
            <LanguageSwitcher />
          </div>

        </div>
      </div>
    </header>
  );
}
