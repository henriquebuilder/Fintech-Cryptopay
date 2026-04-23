import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  CheckCircle2,
  ArrowRight,
  Store,
  Zap,
  Shield,
  TrendingUp,
  Plus,
  X,
} from "lucide-react";

type OnboardingStep = "welcome" | "business" | "wallets" | "plan" | "complete";

interface BusinessData {
  name: string;
  description: string;
  owner_email: string;
}

interface WalletData {
  crypto_symbol: string;
  address: string;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    description: "",
    owner_email: "",
  });
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free");
  const [newWallet, setNewWallet] = useState<WalletData>({
    crypto_symbol: "USDT",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("wallets");
  };

  const handleAddWallet = () => {
    if (!newWallet.address) return;
    setWallets([...wallets, newWallet]);
    setNewWallet({ crypto_symbol: "USDT", address: "" });
  };

  const handleRemoveWallet = (index: number) => {
    setWallets(wallets.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Create establishment
      const estResponse = await fetch("/api/establishments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessData),
      });
      const establishment = await estResponse.json();

      // Add wallets
      for (const wallet of wallets) {
        await fetch(`/api/establishments/${establishment.id}/wallets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wallet),
        });
      }

      // Update plan if premium
      if (selectedPlan === "premium") {
        await fetch(`/api/plans/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            establishmentId: establishment.id,
            planId: "premium",
          }),
        });
      }

      setStep("complete");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      {/* Welcome Step */}
      {step === "welcome" && (
        <div className="max-w-2xl mx-auto pt-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Store className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Bem-vindo ao CryptoPay
            </h1>
            <p className="text-lg text-slate-300">
              A forma mais simples de aceitar pagamentos em criptomoedas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Pagamentos Rápidos</h3>
              <p className="text-sm text-slate-400">
                Receba pagamentos direto na sua carteira em segundos
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">100% Seguro</h3>
              <p className="text-sm text-slate-400">
                Sem custódia, você controla suas chaves e fundos
              </p>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Taxas Baixas</h3>
              <p className="text-sm text-slate-400">
                Apenas 0.5-1% por transação, sem taxas escondidas
              </p>
            </Card>
          </div>

          <Button
            onClick={() => setStep("business")}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg py-6"
          >
            Começar Agora
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Business Info Step */}
      {step === "business" && (
        <div className="max-w-lg mx-auto pt-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
              <span className="text-purple-400 font-medium">Passo 1 de 3</span>
              <span>•</span>
              <span>Informações do Negócio</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Conte-nos sobre seu negócio
            </h2>
            <p className="text-slate-400">
              Essas informações aparecerão nos seus QR codes de pagamento
            </p>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <form onSubmit={handleBusinessSubmit} className="space-y-4">
              <div>
                <Label className="text-white">Nome do Estabelecimento</Label>
                <Input
                  value={businessData.name}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, name: e.target.value })
                  }
                  placeholder="Minha Loja"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Descrição</Label>
                <Input
                  value={businessData.description}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, description: e.target.value })
                  }
                  placeholder="Cafeteria especializada em café artesanal"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Email de Contato</Label>
                <Input
                  type="email"
                  value={businessData.owner_email}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, owner_email: e.target.value })
                  }
                  placeholder="contato@minhaloja.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Wallets Step */}
      {step === "wallets" && (
        <div className="max-w-lg mx-auto pt-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
              <span className="text-purple-400 font-medium">Passo 2 de 3</span>
              <span>•</span>
              <span>Carteiras de Recebimento</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Adicione suas carteiras
            </h2>
            <p className="text-slate-400">
              Adicione pelo menos uma carteira para começar a receber pagamentos
            </p>
          </div>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-4">
            <div className="space-y-4">
              <div>
                <Label className="text-white">Criptomoeda</Label>
                <select
                  value={newWallet.crypto_symbol}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, crypto_symbol: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                >
                  <option value="USDT">USDT (Tether)</option>
                  <option value="BTC">BTC (Bitcoin)</option>
                  <option value="ETH">ETH (Ethereum)</option>
                  <option value="BNB">BNB (Binance Coin)</option>
                </select>
              </div>

              <div>
                <Label className="text-white">Endereço da Carteira</Label>
                <Input
                  value={newWallet.address}
                  onChange={(e) =>
                    setNewWallet({ ...newWallet, address: e.target.value })
                  }
                  placeholder="0x..."
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <Button
                type="button"
                onClick={handleAddWallet}
                disabled={!newWallet.address}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Carteira
              </Button>
            </div>
          </Card>

          {wallets.length > 0 && (
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-4">
              <h3 className="text-white font-semibold mb-3">
                Carteiras Adicionadas ({wallets.length})
              </h3>
              <div className="space-y-2">
                {wallets.map((wallet, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-medium">
                        {wallet.crypto_symbol}
                      </div>
                      <div className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                        {wallet.address}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveWallet(index)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep("business")}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Voltar
            </Button>
            <Button
              onClick={() => setStep("plan")}
              disabled={wallets.length === 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Plan Step */}
      {step === "plan" && (
        <div className="max-w-4xl mx-auto pt-12">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-4">
              <span className="text-purple-400 font-medium">Passo 3 de 3</span>
              <span>•</span>
              <span>Escolha seu Plano</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Selecione o plano ideal
            </h2>
            <p className="text-slate-400">
              Você pode mudar de plano a qualquer momento
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Free Plan */}
            <Card
              onClick={() => setSelectedPlan("free")}
              className={`bg-white/5 backdrop-blur-xl border-2 p-6 cursor-pointer transition-all ${
                selectedPlan === "free"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Grátis</h3>
                  <p className="text-slate-400 text-sm">Para começar</p>
                </div>
                {selectedPlan === "free" && (
                  <CheckCircle2 className="h-6 w-6 text-purple-400" />
                )}
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-1">$0</div>
                <div className="text-sm text-slate-400">por mês</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>100 transações/mês</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Taxa de 1% por transação</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Múltiplas criptomoedas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Geração de QR codes</span>
                </div>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card
              onClick={() => setSelectedPlan("premium")}
              className={`bg-white/5 backdrop-blur-xl border-2 p-6 cursor-pointer transition-all relative overflow-hidden ${
                selectedPlan === "premium"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-bl-lg">
                Popular
              </div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Premium</h3>
                  <p className="text-slate-400 text-sm">Para crescer</p>
                </div>
                {selectedPlan === "premium" && (
                  <CheckCircle2 className="h-6 w-6 text-purple-400" />
                )}
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-1">$29.99</div>
                <div className="text-sm text-slate-400">por mês</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="font-semibold">Transações ilimitadas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="font-semibold">Taxa de 0.5% por transação</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Dashboard de analytics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Relatórios detalhados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>Suporte prioritário</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep("wallets")}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Voltar
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {isSubmitting ? "Configurando..." : "Finalizar Configuração"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <div className="max-w-lg mx-auto pt-12">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border-green-500/20 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              Tudo Pronto!
            </h2>
            <p className="text-green-300 mb-8">
              Sua conta foi configurada com sucesso. Você já pode começar a aceitar
              pagamentos em criptomoedas.
            </p>

            <div className="space-y-3 mb-8 text-left bg-white/5 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <div className="text-white font-medium">Gere um QR Code</div>
                  <div className="text-sm text-slate-400">
                    Acesse o Admin e crie QR codes para seus produtos
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <div className="text-white font-medium">Mostre ao Cliente</div>
                  <div className="text-sm text-slate-400">
                    Clientes escaneia o QR e paga direto da carteira deles
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <div className="text-white font-medium">Receba Instantaneamente</div>
                  <div className="text-sm text-slate-400">
                    O pagamento cai direto na sua carteira, sem intermediários
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate("/admin")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg py-6"
            >
              Ir para o Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
