import { Hero } from "@/components/landing/hero";
import { ModuleGrid } from "@/components/landing/module-grid";
import { ArchitectureDiagram } from "@/components/landing/architecture-diagram";
import { CTASection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CTASection />
      <ArchitectureDiagram />
      <ModuleGrid />
    </main>
  );
}
