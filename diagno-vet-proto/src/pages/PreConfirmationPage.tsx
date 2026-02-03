import { AppHeader } from "../components/AppHeader";
import PhoneInput from "react-phone-number-input";

type Props = {
  data: {
    clinicName: string;
    address: string;
    phone: string;
  };
  onChange: (data: Props["data"]) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function PreConfirmationPage({
  data,
  onChange,
  onContinue,
  onBack,
}: Props) {
  const { clinicName, address, phone } = data;

  const isValid = clinicName.trim() && address.trim() && phone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onContinue();
  };

  const inputClass =
    "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <>
      <AppHeader title="Account setup" onBack={onBack} />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-blue-600 font-medium mb-2">
              Account setup · Step 1 of 2
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Veterinary Information
            </h1>

            <p className="text-gray-600 mb-6 max-w-md">
              We just need a few details about your clinic.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 max-w-md">
              <p className="font-medium mb-1">Why do we need this information?</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Identify your clinic in the system</li>
                <li>Facilitate communication with clients</li>
                <li>Comply with legal requirements</li>
              </ul>
            </div>
          </div>

          {/* RIGHT */}
          <form onSubmit={handleSubmit} className="flex flex-col justify-center space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Legal name of the veterinary clinic *
              </label>
              <input
                value={clinicName}
                onChange={(e) => onChange({ ...data, clinicName: e.target.value })}
                placeholder="E.g: Veterinary Clinic San Juan"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                value={address}
                onChange={(e) => onChange({ ...data, address: e.target.value })}
                placeholder="E.g: Main Ave 123, City"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number *
              </label>
              <PhoneInput
                defaultCountry="CA"
                value={phone}
                onChange={(value) =>
                  onChange({ ...data, phone: value || "" })
                }
                placeholder="E.g: 555 123 4567"
              />
            </div>

            <p className="text-xs text-gray-500">
              You can edit this information later from your settings.
            </p>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-blue-600 text-white h-11 rounded-md font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              Continue →
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
