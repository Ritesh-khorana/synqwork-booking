import { cn } from "@/lib/utils";

const steps = [
  "Select date",
  "Choose slot",
  "Pick room",
  "Your details",
  "Confirmation",
];

export function BookingStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-6">
      {steps.map((step, index) => {
        const active = index <= currentStep;
        return (
          <div
            key={step}
            className={cn(
              "rounded-3xl border px-4 py-4 text-sm transition",
              active ? "border-black bg-black text-white" : "border-black/10 bg-white text-[#404852]",
            )}
          >
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">Step {index + 1}</p>
            <p className="mt-1 font-medium">{step}</p>
          </div>
        );
      })}
    </div>
  );
}
