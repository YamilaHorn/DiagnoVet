import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function AppHeader({ title, left, right }: Props) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {left}
        <span className="text-lg font-bold text-blue-700">
          {title || "DiagnoVetAI"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {right}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
