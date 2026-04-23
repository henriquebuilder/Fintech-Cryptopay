import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { 
  Sparkles, 
  Wallet, 
  ShoppingBag, 
  ArrowLeftRight,
  CheckCircle,
  ChevronRight,
  X
} from "lucide-react";
import { DEMO_BALANCES, getTotalBalance } from "@/react-app/utils/demoMode";

const slides = [
  {
    icon: Sparkles,
    title: "Bem-vindo ao Modo Demo!",
    description: "Explore todas as funcionalidades do CryptoPay com saldo fictício. Teste compras, conversões e transações sem riscos.",
    gradient: "from-purple-600 to-indigo-600",
  },
  {
    icon: Wallet,
    title: "Saldo de $24,054",
    description: "Você começa com saldo demo distribuído em 4 criptomoedas: USDT, Bitcoin, Ethereum e BNB. Use-o livremente para testar o app!",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    icon: ShoppingBag,
    title: "Compre Serviços",
    description: "Recargas de celular, gift cards, streaming e muito mais. Pague com cripto e receba vouchers instantaneamente (simulados).",
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    icon: ArrowLeftRight,
    title: "Transações Simuladas",
    description: "Todas as transações são fictícias. Você pode enviar, receber, comprar e converter sem gastar dinheiro real.",
    gradient: "from-purple-600 to-pink-600",
  },
];

export default function DemoOnboardingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalBalance = getTotalBalance();

  const isLastSlide = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      localStorage.setItem("demo_onboarding_complete", "true");
      navigate("/");
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("demo_onboarding_complete", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Skip Button */}
        <div className="p-6 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            Pular
            <X className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          {/* Icon */}
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/30 border border-white/10`}>
            <Icon className="h-12 w-12 text-white drop-shadow-lg" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
            {slide.description}
          </p>

          {/* Demo Badge */}
          {currentSlide === 0 && (
            <div className="mb-8">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-full">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300 font-medium">100% Seguro - Modo Demonstração</span>
                </div>
              </div>
            </div>
          )}

          {/* Balance Preview */}
          {currentSlide === 1 && (
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-6 mb-8 w-full max-w-sm shadow-lg shadow-purple-500/10">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Saldo Total Demo</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-4">
                  ${totalBalance}
                </p>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {Object.entries(DEMO_BALANCES).map(([symbol, data]) => (
                    <div key={symbol} className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                      <p className="text-[10px] text-slate-500 mb-0.5">{symbol}</p>
                      <p className="text-xs text-white font-medium">${data.usdValue}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Features List */}
          {currentSlide === 2 && (
            <div className="space-y-3 mb-8 w-full max-w-sm">
              {[
                "Recarga de celular",
                "Gift cards (Steam, Netflix, etc)",
                "Streaming (Spotify, Disney+)",
                "Games (Fortnite, Free Fire)",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm text-slate-300">{feature}</p>
                </div>
              ))}
            </div>
          )}

          {/* Transaction Types */}
          {currentSlide === 3 && (
            <div className="space-y-2 mb-8 w-full max-w-sm">
              {[
                { label: "Receber", desc: "Simule depósitos via PIX" },
                { label: "Enviar", desc: "Transfira entre carteiras" },
                { label: "Comprar", desc: "Adquira serviços com cripto" },
                { label: "Converter", desc: "Troque cripto por fiat" },
              ].map((item, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center border border-slate-600/30">
                      <ArrowLeftRight className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="px-6 pb-8 space-y-4">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? "w-8 bg-gradient-to-r from-purple-600 to-indigo-600"
                    : "w-2 bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium h-12 shadow-lg shadow-purple-500/30"
          >
            {isLastSlide ? (
              <>
                Começar a Explorar
                <Sparkles className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
