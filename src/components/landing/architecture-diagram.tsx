import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ArchitectureDiagram() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">Architecture</h2>
        <p className="text-muted-foreground text-center mb-10">
          Agent hierarchy, event bus, and BDI cognitive model
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Agent Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agent Hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 font-mono text-sm">
                <div className="p-3 rounded-lg bg-muted border-l-4 border-muted-foreground/30">
                  <div className="font-semibold">Agent</div>
                  <div className="text-xs text-muted-foreground">perceive() / decide() / act() / send() / broadcast()</div>
                </div>
                <div className="ml-4 p-3 rounded-lg bg-muted border-l-4 border-blue-500/50">
                  <div className="font-semibold text-blue-400">BDIAgent</div>
                  <div className="text-xs text-muted-foreground">beliefs / desires / intentions / bdi.snapshot()</div>
                </div>
                <div className="ml-8 p-3 rounded-lg bg-muted border-l-4 border-green-500/50">
                  <div className="font-semibold text-green-400">LLMAgent</div>
                  <div className="text-xs text-muted-foreground">template(beliefs) / reasoner / provider</div>
                </div>
                <div className="ml-12 p-3 rounded-lg bg-muted border-l-4 border-purple-500/50">
                  <div className="font-semibold text-purple-400">ConversationalLLMAgent</div>
                  <div className="text-xs text-muted-foreground">conversation history / multi-turn / sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Bus + Scheduler */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event Bus & Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="font-semibold font-mono text-sm mb-2">EventBus (singleton)</div>
                <div className="flex flex-wrap gap-1.5">
                  {["publish", "subscribe", "use(mw)", "request", "getStatistics"].map((m) => (
                    <Badge key={m} variant="secondary" className="text-xs font-mono">{m}</Badge>
                  ))}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Session-scoped channels: <code className="text-primary">session:{'<id>'}:channel</code>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <div className="font-semibold font-mono text-sm mb-2">Schedulers</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Tick</Badge>
                    <span className="text-muted-foreground">Fixed interval PDA cycles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Event</Badge>
                    <span className="text-muted-foreground">Trigger-driven execution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Hybrid</Badge>
                    <span className="text-muted-foreground">Both tick + event triggers</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <div className="font-semibold font-mono text-sm mb-2">BDI Cognitive Model</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                    <div className="font-semibold text-blue-400">Beliefs</div>
                    <div className="text-muted-foreground">Key-value map</div>
                  </div>
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                    <div className="font-semibold text-amber-400">Desires</div>
                    <div className="text-muted-foreground">Goal set</div>
                  </div>
                  <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                    <div className="font-semibold text-green-400">Intentions</div>
                    <div className="text-muted-foreground">Plan set</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
