import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { ArrowLeft, Check, Zap, TrendingUp } from "lucide-react";

interface Plan {
  id: number;
  name: string;
  display_name: string;
  fee_percent: number;
  max_monthly_transactions: number | null;
  has_analytics: number;
  has_priority_support: number;
  monthly_price_usd: number;
}

export default function PlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState("free");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleUpgrade = async (planName: string) => {
    try {
      const response = await fetch("/api/plans/upgrade/1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName }),
      });

      if (response.ok) {
        setCurrentPlan(planName);
        alert("Plano atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
      alert("Erro ao atualizar plano");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pb-24">
      <div className="px-6 pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Planos</h1>
            <p className="text-sm text-slate-400">
              Escolha o plano ideal para seu negócio
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`bg-white/5 backdrop-blur-xl border-white/10 p-6 ${
                plan.name === "premium"
                  ? "border-purple-500/50 relative overflow-hidden"
                  : ""
              }`}
            >
              {plan.name === "premium" && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {plan.display_name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      ${plan.monthly_price_usd}
                    </span>
                    <span className="text-slate-400 text-sm">/mês</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  {plan.name === "free" ? (
                    <Zap className="h-6 w-6 text-white" />
                  ) : (
                    <TrendingUp className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="inline-block bg-purple-500/20 text-purple-300 text-sm font-semibold px-3 py-1 rounded-full">
                  Taxa: {plan.fee_percent}% por transação
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    {plan.max_monthly_transactions
                      ? `Até ${plan.max_monthly_transactions} transações/mês`
                      : "Transações ilimitadas"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    Pagamentos em múltiplas criptomoedas
                  </span>
                </div>
                {plan.has_analytics ? (
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">
                      Analytics e relatórios avançados
                    </span>
                  </div>
                ) : null}
                {plan.has_priority_support ? (
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">Suporte prioritário</span>
                  </div>
                ) : null}
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Dashboard de gestão</span>
                </div>
              </div>

              {currentPlan === plan.name ? (
                <Button
                  disabled
                  className="w-full bg-white/10 text-slate-400 cursor-not-allowed"
                >
                  Plano Atual
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  {plan.name === "free" ? "Downgrade" : "Fazer Upgrade"}
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-blue-500/10 backdrop-blur-xl border-blue-500/20 p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Por que cobrar taxas?
          </h3>
          <div className="space-y-2 text-sm text-blue-200">
            <p>
              • Taxas transparentes e competitivas (0.5-1% vs 2-3% tradicionais)
            </p>
            <p>• Mantém a plataforma funcionando e em evolução constante</p>
            <p>• Sem custos ocultos - você sabe exatamente quanto vai pagar</p>
            <p>
              • Plano gratuito disponível para pequenos comerciantes começarem
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
