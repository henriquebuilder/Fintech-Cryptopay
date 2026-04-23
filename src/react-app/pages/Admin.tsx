import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import {
  Store,
  Plus,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  Eye,
  BarChart3,
  CreditCard,
  QrCode,
  Smartphone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/react-app/components/ui/dialog";
import { Label } from "@/react-app/components/ui/label";
import BottomNav from "@/react-app/components/BottomNav";

interface Transaction {
  id: number;
  establishment_id: number;
  crypto_symbol: string;
  amount_crypto: string;
  amount_usd: string;
  status: string;
  tx_hash: string;
  created_at: string;
}

interface Establishment {
  id: number;
  name: string;
  description: string;
  owner_email: string;
  is_active: number;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "establishments" | "transactions">("overview");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    owner_email: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, estRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/establishments"),
      ]);
      const txData = await txRes.json();
      const estData = await estRes.json();
      setTransactions(txData);
      setEstablishments(estData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreateEstablishment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/establishments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setDialogOpen(false);
        setFormData({ name: "", description: "", owner_email: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating establishment:", error);
    }
  };

  const stats = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce(
      (sum, tx) => sum + parseFloat(tx.amount_usd || "0"),
      0
    ),
    confirmedTransactions: transactions.filter((tx) => tx.status === "confirmed").length,
    activeEstablishments: establishments.filter((e) => e.is_active).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pb-24">
      <div className="px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Admin</h1>
              <p className="text-sm text-slate-400">Painel Administrativo</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/pix-virtual")}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              size="sm"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              PIX Virtual
            </Button>
            <Button
              onClick={() => navigate("/conversions")}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              size="sm"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Conversões
            </Button>
            <Button
              onClick={() => navigate("/analytics?id=1")}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              onClick={() => navigate("/plans")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Planos
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-lg backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("establishments")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "establishments"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Estabelecimentos
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "transactions"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Transações
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 border-0 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-purple-100 text-xs">Volume Total</div>
                </div>
                <div className="text-2xl font-bold text-white">
                  ${stats.totalVolume.toFixed(2)}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-600 to-emerald-600 border-0 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-green-100 text-xs">Transações</div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.totalTransactions}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 border-0 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-blue-100 text-xs">Confirmadas</div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.confirmedTransactions}
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600 to-amber-600 border-0 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-orange-100 text-xs">Estabelecimentos</div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.activeEstablishments}
                </div>
              </Card>
            </div>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Transações Recentes
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-mono text-xs">
                        {tx.crypto_symbol}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          ${tx.amount_usd}
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {tx.status}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Establishments Tab */}
        {activeTab === "establishments" && (
          <div className="space-y-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Estabelecimento
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Criar Estabelecimento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateEstablishment} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email do Proprietário</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.owner_email}
                      onChange={(e) =>
                        setFormData({ ...formData, owner_email: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Criar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {establishments.map((est) => (
              <Card
                key={est.id}
                className="bg-white/5 backdrop-blur-xl border-white/10 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <Store className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{est.name}</div>
                      <div className="text-sm text-slate-400">
                        {est.description || "Sem descrição"}
                      </div>
                      {est.owner_email && (
                        <div className="text-xs text-slate-500 mt-1">
                          {est.owner_email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      est.is_active
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {est.is_active ? "Ativo" : "Inativo"}
                  </div>
                </div>
                <Button
                  onClick={() => navigate(`/qr-generator?id=${est.id}`)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  size="sm"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Gerar QR Code
                </Button>
              </Card>
            ))}

            {establishments.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                Nenhum estabelecimento cadastrado
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <Card
                key={tx.id}
                className="bg-white/5 backdrop-blur-xl border-white/10 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-mono">
                      {tx.crypto_symbol}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        ${tx.amount_usd}
                      </div>
                      <div className="text-sm text-slate-400">
                        {tx.amount_crypto} {tx.crypto_symbol}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {tx.status}
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="h-3 w-3" />
                    {new Date(tx.created_at).toLocaleString()}
                  </div>
                  {tx.tx_hash && (
                    <div className="flex items-start gap-2 text-slate-400">
                      <Eye className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <div className="font-mono break-all">{tx.tx_hash}</div>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                Nenhuma transação registrada
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
