type Variant = "solid" | "outline" | "ghost";

export default function Button({
  children,
  variant = "solid",
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  const base = "inline-flex items-center justify-center px-4 py-2 font-semibold transition rounded";
  const styles: Record<Variant, string> = {
    solid:   "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost:   "text-blue-600 hover:bg-blue-50",
  };
  return <button className={`${base} ${styles[variant]}`}>{children}</button>;
}