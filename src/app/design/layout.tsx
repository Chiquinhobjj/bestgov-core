import "./globals.css";

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return <div className="p-8">{children}</div>;
}