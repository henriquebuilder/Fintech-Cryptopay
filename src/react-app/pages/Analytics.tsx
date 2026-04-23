import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
} from "lucide-react";

interface AnalyticsData {
  establishment: {
    name: string;
  };
  stats: {
    total_revenue: string;
    total_transactions: number;
    net_revenue: string;
    avg_transaction: string;
  };
  dailyRevenue: Array<{
    date: string;
    transactions: number;
    revenue: string;
    net_revenue: string;
  }>;
  cryptoBreakdown: Array<{
    crypto_symbol: string;
    transactions: number;
    total_usd: string;
  }>;
  recentTransactions: Array<{
    id: number;
    tx_hash: string | null;
    created_at: string;
    amount_crypto: string;
    crypto_symbol: string;
    merchant_net_usd: string;
  }>;
}

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const establishmentId = searchParams.get("id") || "1";
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/establishment/${establishmentId}`);
        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(errorData.error || "Failed to fetch analytics");
        }
        const result = (await response.json()) as AnalyticsData;
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar analytics");
      }
    };

    fetchAnalytics();
  }, [establishmentId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
        <Card className="bg-red-500/10 backdrop-blur-xl border-red-500/20 p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Acesso Negado</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <Button
              onClick={() => navigate("/admin")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Voltar para Admin
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
            <p className="text-sm text-slate-400">{data.establishment.name}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-xs text-slate-400">Receita Total</div>
            </div>
            <div className="text-2xl font-bold text-white">
              ${parseFloat(data.stats.total_revenue || "0").toFixed(2)}
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-xs text-slate-400">Transações</div>
            </div>
            <div className="text-2xl font-bold text-white">
              {data.stats.total_transactions || 0}
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-xs text-slate-400">Receita Líquida</div>
            </div>
            <div className="text-2xl font-bold text-white">
              ${parseFloat(data.stats.net_revenue || "0").toFixed(2)}
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-400" />
              </div>
              <div className="text-xs text-slate-400">Ticket Médio</div>
            </div>
            <div className="text-2xl font-bold text-white">
              ${parseFloat(data.stats.avg_transaction || "0").toFixed(2)}
            </div>
          </Card>
        </div>

        {/* Crypto Breakdown */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Receita por Criptomoeda
          </h3>
          <div className="space-y-3">
            {data.cryptoBreakdown.map((item) => (
              <div key={item.crypto_symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {item.crypto_symbol}
                  </div>
                  <div>
                    <div className="text-white font-medium">{item.crypto_symbol}</div>
                    <div className="text-xs text-slate-400">
                      {item.transactions} transações
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    ${parseFloat(item.total_usd || "0").toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Revenue */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Receita Diária (30 dias)
          </h3>
          <div className="space-y-2">
            {data.dailyRevenue.slice(0, 10).map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between py-2 border-b border-white/5"
              >
                <div>
                  <div className="text-white text-sm">{day.date}</div>
                  <div className="text-xs text-slate-400">
                    {day.transactions} transações
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    ${parseFloat(day.revenue || "0").toFixed(2)}
                  </div>
                  <div className="text-xs text-green-400">
                    Líquido: ${parseFloat(day.net_revenue || "0").toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Transações Recentes
          </h3>
          <div className="space-y-2">
            {data.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-white/5"
              >
                <div>
                  <div className="text-white text-sm font-mono">
                    {tx.tx_hash?.slice(0, 10)}...
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {tx.amount_crypto} {tx.crypto_symbol}
                  </div>
                  <div className="text-xs text-green-400">
                    +${tx.merchant_net_usd}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
