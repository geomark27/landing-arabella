import WaitlistForm from "@/components/WaitlistForm";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Arabella</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Deja de adivinar cuánto dinero{" "}
            <span className="text-blue-600">tienes realmente</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
            Si eres freelancer en Latam cobrando en dólares, sabes que tu saldo bancario 
            <span className="font-semibold"> miente</span>. 
            Arabella te muestra tu runway real considerando impuestos, cambios y deudas.
          </p>

          {/* Waitlist Form */}
          <WaitlistForm />

          <p className="text-sm text-slate-500 mt-4">
            Únete a los primeros 100 usuarios beta. Sin tarjeta requerida.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            El problema que nadie resuelve
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ProblemCard
              emoji="💸"
              title="Ilusión de liquidez"
              description="Ves $5,000 en el banco, pero $1,200 son para impuestos y $800 de la tarjeta."
            />
            <ProblemCard
              emoji="📉"
              title="Pérdida cambiaria invisible"
              description="Cambiaste a peso mexicano cuando estaba a $16. Hoy está a $18. ¿Cuánto perdiste?"
            />
            <ProblemCard
              emoji="❓"
              title="Sin visibilidad de runway"
              description="¿Cuántos meses puedes sobrevivir sin nuevos clientes? No lo sabes con certeza."
            />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-6">
              Tu dashboard financiero en 3 números
            </h2>
            <p className="text-xl text-slate-600 text-center mb-16">
              Sin gráficos complicados. Solo lo que importa.
            </p>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
              <MetricPreview
                label="Runway Real"
                value="4.2 meses"
                description="Tiempo que puedes vivir sin nuevos ingresos (ya descontando impuestos y deudas)"
              />
              <MetricPreview
                label="Impuestos acumulados"
                value="$1,240 USD"
                description="Apartado automáticamente según tu tasa configurada (30%)"
              />
              <MetricPreview
                label="Pérdida cambiaria del mes"
                value="-$87 USD"
                description="Lo que perdiste por fluctuaciones del tipo de cambio"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sé de los primeros 100
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Lanzamos en febrero 2026. Los primeros usuarios tendrán acceso vitalicio gratis.
          </p>
          <WaitlistForm variant="light" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">
            Construido por freelancers, para freelancers.
          </p>
          <p className="text-sm">
            © 2025 Arabella Financial OS. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componente de tarjeta de problema
function ProblemCard({ emoji, title, description }: { 
  emoji: string; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

// Componente de preview de métrica
function MetricPreview({ label, value, description }: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="border-l-4 border-blue-600 pl-6">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-4xl font-bold text-slate-900 mb-2">{value}</p>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}