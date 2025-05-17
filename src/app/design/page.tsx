import Button from "./components/Button";

export default function DesignHome() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Design System Playground</h1>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Botões</h2>
        <div className="flex gap-4">
          <Button>Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>
    </div>
  );
}