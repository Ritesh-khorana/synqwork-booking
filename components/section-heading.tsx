type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  theme?: "light" | "dark";
};

export function SectionHeading({ eyebrow, title, description, theme = "light" }: SectionHeadingProps) {
  const muted = theme === "dark" ? "text-white/70" : "text-[#404852]";
  return (
    <div className="max-w-2xl">
      <p className={`text-sm font-semibold uppercase tracking-[0.32em] ${muted}`}>{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance md:text-5xl">{title}</h2>
      <p className={`mt-4 text-base leading-7 md:text-lg ${muted}`}>{description}</p>
    </div>
  );
}
