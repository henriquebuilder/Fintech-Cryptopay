import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { ArrowLeft, Store, QrCode, TrendingUp, CreditCard, Clock, CheckCircle, Copy, DollarSign, Percent } from "lucide-react";
import { DEMO_MODE, generateTxHash } from "@/react-app/utils/demoMode";
import BottomNav from "@/react-app/components/BottomNav";

interface DemoSale {
  id: string;
  customer: string;
  amount: string;
  crypto: string;
  pixAmount: string;
  status: "pending" | "completed";
  time: string;
  txHash: string;
}

export default function CommercePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"receive" | "sales" | "settings">("receive");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [showQR, setShowQR] = useState(false);

  // Demo data
  const demoSales: DemoSale[] = [
    {
      id: "1",
      customer: "Cliente Anônimo",
      amount: "25.00",
      crypto: "USDT",
      pixAmount: "125.00",
      status: "completed",
      time: "Há 5 min",
      txHash: generateTxHash(),
    },
    {
      id: "2",
      customer: "Cliente Anônimo",
      amount: "0.0015",
      crypto: "BTC",
      pixAmount: "503.25",
      status: "completed",
      time: "Há 15 min",
      txHash: generateTxHash(),
    },
    {
      id: "3",
      customer: "Cliente Anônimo",
      amount: "0.05",
      crypto: "ETH",
      pixAmount: "875.00",
      status: "completed",
      time: "Há 1 hora",
      txHash: generateTxHash(),
    },
    {
      id: "4",
      customer: "Cliente Anônimo",
      amount: "50.00",
      crypto: "USDT",
      pixAmount: "250.00",
      status: "pending",
      time: "Agora",
      txHash: generateTxHash(),
    },
  ];

  const totalSales = demoSales.reduce((acc, sale) => acc + parseFloat(sale.pixAmount), 0);
  const completedSales = demoSales.filter(s => s.status === "completed").length;

  const handleGenerateQR = () => {
    if (!receiveAmount) return;
    setShowQR(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-slate-400 hover:bg-slate-800/50 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">Área Comercial</h1>
            <p className="text-xs text-slate-500">Receba pagamentos em crypto</p>
          </div>
          {DEMO_MODE && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-medium rounded-full">
              DEMO
            </span>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-orange-500/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-slate-500">Vendas Hoje</span>
            </div>
            <p className="text-xl font-bold text-white">R$ {totalSales.toFixed(2)}</p>
          </Card>
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-green-500/20 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-xs text-slate-500">Confirmadas</span>
            </div>
            <p className="text-xl font-bold text-white">{completedSales}/{demoSales.length}</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "receive", label: "Receber", icon: QrCode },
            { id: "sales", label: "Vendas", icon: TrendingUp },
            { id: "settings", label: "Config", icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white"
                  : "bg-slate-800/50 text-slate-400 hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Receive Tab */}
        {activeTab === "receive" && (
          <div className="space-y-4">
            {!showQR ? (
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-orange-500/20 p-6 backdrop-blur-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                    <Store className="h-8 w-8 text-orange-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Gerar Cobrança</h2>
                  <p className="text-xs text-slate-500 mt-1">Crie um QR Code para receber pagamentos</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">Valor em Reais (R$)</label>
                    <Input
                      value={receiveAmount}
                      onChange={(e) => setReceiveAmount(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 text-center text-2xl h-14"
                    />
                  </div>
                  <Button
                    onClick={handleGenerateQR}
                    disabled={!receiveAmount}
                    className="w-full h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold disabled:opacity-50"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Gerar QR Code
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-orange-500/20 p-6 backdrop-blur-xl">
                <div className="text-center">
                  <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 p-4">
                    <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0id2hpdGUiLz48ZyBmaWxsPSJibGFjayI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIi8+PHJlY3QgeD0iNzAiIHk9IjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIvPjxyZWN0IHg9IjAiIHk9IjcwIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiLz48cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjwvZz48L3N2Zz4=')] bg-contain bg-center bg-no-repeat"></div>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">R$ {receiveAmount}</p>
                  <p className="text-sm text-slate-500 mb-4">≈ {(parseFloat(receiveAmount) / 5).toFixed(2)} USDT</p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowQR(false)}
                      variant="ghost"
                      className="flex-1 text-slate-400 hover:text-white"
                    >
                      Nova Cobrança
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(`cryptopay://pay?amount=${receiveAmount}`)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Link
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Pending Payment Simulation */}
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-yellow-500/20 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Pagamento Pendente</p>
                  <p className="text-xs text-slate-500">50.00 USDT • Aguardando confirmação</p>
                </div>
                <span className="text-xs text-yellow-400 font-medium">Agora</span>
              </div>
            </Card>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === "sales" && (
          <div className="space-y-3">
            {demoSales.map((sale) => (
              <Card key={sale.id} className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      sale.status === "completed" 
                        ? "bg-green-500/20" 
                        : "bg-yellow-500/20"
                    }`}>
                      {sale.status === "completed" 
                        ? <CheckCircle className="h-5 w-5 text-green-400" />
                        : <Clock className="h-5 w-5 text-yellow-400 animate-pulse" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{sale.customer}</p>
                      <p className="text-xs text-slate-500">{sale.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{sale.amount} {sale.crypto}</p>
                    <p className="text-xs text-green-400">R$ {sale.pixAmount}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {sale.txHash.slice(0, 16)}...
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    sale.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {sale.status === "completed" ? "Confirmado" : "Pendente"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 p-4 backdrop-blur-xl">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <Percent className="h-4 w-4 text-orange-400" />
                Conversão Automática
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                  <span className="text-sm text-slate-300">Converter para PIX</span>
                  <div className="w-12 h-6 bg-green-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                  <span className="text-sm text-slate-300">Percentual conversão</span>
                  <span className="text-sm text-orange-400 font-medium">100%</span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 p-4 backdrop-blur-xl">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-orange-400" />
                Chave PIX Cadastrada
              </h3>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <p className="text-sm text-slate-300 font-mono">empresa@cryptopay.com</p>
                <p className="text-xs text-slate-500 mt-1">E-mail • Verificado</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-orange-500/20 p-4 backdrop-blur-xl">
              <h3 className="text-sm font-medium text-white mb-2">Seu Plano</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-orange-400">Premium</span>
                  <p className="text-xs text-slate-500">Taxa: 0.5% por transação</p>
                </div>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white">
                  Gerenciar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
