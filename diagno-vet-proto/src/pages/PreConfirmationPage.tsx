import { AppHeader } from "../components/AppHeader";

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

  const isValid =
    clinicName.trim() && address.trim() && phone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onContinue();
  };

  return (
    <>
      <AppHeader
  title="Account setup"
  onBack={onBack}
/>


      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border p-10 grid md:grid-cols-2 gap-10">

          <div>
            <p className="text-sm text-blue-600 font-medium mb-2">
              Account setup · Step 1 of 2
            </p>
            <h1 className="text-3xl font-bold mb-3">
              Veterinary Information
            </h1>
            <p className="text-gray-600">
              We just need a few details about your clinic.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              value={clinicName}
              onChange={(e) =>
                onChange({ ...data, clinicName: e.target.value })
              }
              placeholder="Clinic name *"
              className="w-full px-3 py-2 border rounded-md"
            />

            <input
              value={address}
              onChange={(e) =>
                onChange({ ...data, address: e.target.value })
              }
              placeholder="Address *"
              className="w-full px-3 py-2 border rounded-md"
            />

            <input
              value={phone}
              onChange={(e) =>
                onChange({ ...data, phone: e.target.value })
              }
              placeholder="Phone *"
              className="w-full px-3 py-2 border rounded-md"
            />

            <button
  type="submit"
  disabled={!isValid}
  className="w-full bg-blue-600 text-white h-11 rounded-md disabled:bg-blue-300"
>
  Continue →
</button>

          </form>
        </div>
      </div>
    </>
  );
}
