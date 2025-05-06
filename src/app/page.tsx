import Button from "@/components/Button";

export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '24px'
    }}>
      <Button>Entrar</Button>
      <Button variant="outline">Mais detalhes</Button>
      <Button variant="ghost" size="sm">
        Ajuda
      </Button>
    </main>
  );
}
