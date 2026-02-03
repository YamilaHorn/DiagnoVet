import { AppHeader } from "../components/AppHeader";

type Props = {
  data: {
    phone: string;
    title: string;
    fullName: string;
    license: string;
  };
  onChange: (data: Props["data"]) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function PostConfirmationPage({
  data,
  onChange,
  onContinue,
  onBack,
}: Props) {
  const { phone, title, fullName, license } = data;

  const isValid =
    phone.trim() && title.trim() && fullName.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onContinue();
  };

  return (
    <>
      <AppHeader
        left={
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        }
      />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-10 grid grid-cols-1 md:grid-cols-2 gap-10">

          <div className="flex flex-col justify-center">
            <p className="text-sm text-blue-600 font-medium mb-2">
              Account setup · Step 2 of 2
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Almost done…
            </h1>

            <p className="text-gray-600 mb-6 max-w-md">
              We just need a couple more details to personalize your experience
              and prepare your professional profile.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 max-w-md">
              <p className="font-medium mb-1">
                Why do we need this information?
              </p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Personalize your professional profile</li>
                <li>Show your credentials to clients</li>
                <li>Generate reports with your information</li>
              </ul>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number *
              </label>
              <input
                value={phone}
                onChange={(e) =>
                  onChange({ ...data, phone: e.target.value })
                }
                placeholder="+54 9 11 1234 5678"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional title *
              </label>
              <select
                value={title}
                onChange={(e) =>
                  onChange({ ...data, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a title</option>
                <option value="Veterinarian">Veterinarian</option>
                <option value="Veterinary Technician">
                  Veterinary Technician
                </option>
                <option value="Clinic Manager">Clinic Manager</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name *
              </label>
              <input
                value={fullName}
                onChange={(e) =>
                  onChange({ ...data, fullName: e.target.value })
                }
                placeholder="e.g. Fernanda Barbero"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional license{" "}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                value={license}
                onChange={(e) =>
                  onChange({ ...data, license: e.target.value })
                }
                placeholder="e.g. MP 12345"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <p className="text-xs text-gray-500">
              This information will appear on reports and shared diagnostics.
            </p>

            <button
              type="submit"
              disabled={!isValid}
              className="mt-2 h-11 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              Continue →
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
