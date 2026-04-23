import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, ShoppingBag, ArrowLeftRight, ExternalLink } from "lucide-react";
import { DEMO_MODE, DEMO_TRANSACTIONS } from "@/react-app/utils/demoMode";

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  
  const transactions = DEMO_MODE ? DEMO_TRANSACTIONS : [];

  const getIcon = (type: string) => {
    switch (type) {
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-green-400" />;
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-400" />;
      case "purchase":
        return <ShoppingBag className="h-5 w-5 text-purple-400" />;
      case "conversion":
        return <ArrowLeftRight className="h-5 w-5 text-blue-400" />;
      default:
        return <ArrowUpRight className="h-5 w-5 text-slate-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "receive":
        return "Recebido";
      case "send":
        return "Enviado";
      case "purchase":
        return "Compra";
      case "conversion":
        return "Conversão";
      default:
        return type;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
      return "Agora mesmo";
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else if (days === 1) {
      return "Ontem";
    } else if (days < 7) {
      return `${days}d atrás`;
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800/50 backdrop-blur-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">Histórico</h1>
          </div>

          {!DEMO_MODE && (
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-8 text-center">
              <p className="text-slate-400">Nenhuma transação ainda</p>
            </Card>
          )}

          {DEMO_MODE && (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <Card
                  key={tx.id}
                  className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 hover:border-purple-500/30 transition-all cursor-pointer backdrop-blur-sm shadow-md hover:shadow-purple-500/10"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center border border-slate-600/30 shadow-inner">
                          {getIcon(tx.type)}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm mb-0.5">
                            {getTypeLabel(tx.type)}
                          </div>
                          <div className="text-xs text-slate-400">{tx.description}</div>
                          <div className="text-xs text-slate-500 mt-1">{formatDate(tx.timestamp)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold text-sm ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                          {tx.amount} {tx.crypto}
                        </div>
                        <div className="text-xs text-slate-400">{tx.usdValue}</div>
                      </div>
                    </div>

                    {tx.txHash && (
                      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                        <div className="text-xs text-slate-500 font-mono truncate mr-2">
                          {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 8)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-6 px-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
