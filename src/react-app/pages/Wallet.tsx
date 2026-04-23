import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Send, ArrowUpDown, Sparkles, History, Settings, Download } from "lucide-react";
import { DEMO_MODE, DEMO_BALANCES, getTotalBalance } from "@/react-app/utils/demoMode";
import BottomNav from "@/react-app/components/BottomNav";

const getCryptos = () => {
  if (DEMO_MODE) {
    return [
      {
        symbol: "USDT",
        name: "Tether",
        balance: DEMO_BALANCES.USDT.balance,
        usdValue: DEMO_BALANCES.USDT.usdValue,
        logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        balance: DEMO_BALANCES.BTC.balance,
        usdValue: DEMO_BALANCES.BTC.usdValue,
        logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        balance: DEMO_BALANCES.ETH.balance,
        usdValue: DEMO_BALANCES.ETH.usdValue,
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      },
      {
        symbol: "BNB",
        name: "BNB",
        balance: DEMO_BALANCES.BNB.balance,
        usdValue: DEMO_BALANCES.BNB.usdValue,
        logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
      },
    ];
  }
  
  return [
    {
      symbol: "USDT",
      name: "Tether",
      balance: "0.00",
      usdValue: "0.00",
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: "0.00000000",
      usdValue: "0.00",
      logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "0.00000000",
      usdValue: "0.00",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    {
      symbol: "BNB",
      name: "BNB",
      balance: "0.00000000",
      usdValue: "0.00",
      logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    },
  ];
};

export default function WalletPage() {
  const navigate = useNavigate();
  const totalBalance = DEMO_MODE ? getTotalBalance() : "0.00";
  const cryptos = getCryptos();

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingComplete = localStorage.getItem("demo_onboarding_complete");
    if (DEMO_MODE && !onboardingComplete) {
      navigate("/demo-onboarding");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 pt-6 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-white">CryptoPay</h1>
                {DEMO_MODE && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-medium rounded-full flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    DEMO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Carteira Digital</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm"
                onClick={() => navigate("/transactions")}
              >
                <History className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Total Balance Card */}
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 p-6 mb-6 backdrop-blur-xl shadow-lg shadow-purple-500/10">
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Saldo Total</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-1">
              ${totalBalance}
            </div>
            <div className="text-sm text-slate-500 mb-6">≈ R$ {(parseFloat(totalBalance.replace(/,/g, '')) * 5.0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => navigate("/receive")}
                className="bg-gradient-to-br from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white border border-slate-600/50 h-9 shadow-md"
                size="sm"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Receber</span>
              </Button>
              <Button
                onClick={() => navigate("/send")}
                className="bg-gradient-to-br from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white border border-slate-600/50 h-9 shadow-md"
                size="sm"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Enviar</span>
              </Button>
              <Button
                onClick={() => navigate("/price-charts")}
                className="bg-gradient-to-br from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white border border-slate-600/50 h-9 shadow-md"
                size="sm"
              >
                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Gráficos</span>
              </Button>
            </div>
          </Card>

          {/* Crypto Assets */}
          <div className="space-y-2 pb-20">
            <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 px-1">Criptomoedas</h2>
            {cryptos.map((crypto) => (
              <Card
                key={crypto.symbol}
                className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 hover:border-purple-500/30 transition-all cursor-pointer backdrop-blur-sm shadow-md hover:shadow-purple-500/10"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center p-2 border border-slate-600/30 shadow-inner">
                      <img 
                        src={crypto.logo} 
                        alt={crypto.name}
                        className="w-full h-full object-contain drop-shadow-sm"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">
                        {crypto.symbol}
                      </div>
                      <div className="text-xs text-slate-500">{crypto.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white text-sm">
                      {crypto.balance}
                    </div>
                    <div className="text-xs text-purple-400">
                      ${crypto.usdValue}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
