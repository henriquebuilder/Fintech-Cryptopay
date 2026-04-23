import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  ArrowLeft,
  ArrowRightLeft,
  Wallet,
  Settings,
  History,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/react-app/components/ui/dialog";

interface CryptoBalance {
  crypto_symbol: string;
  available_balance: string;
  pending_conversion: string;
  total_received: string;
}

interface ConversionRequest {
  id: number;
  crypto_symbol: string;
  amount_crypto: string;
  amount_usd: string;
  amount_fiat: string;
  fiat_currency: string;
  status: string;
  created_at: string;
}

interface ConversionSettings {
  auto_convert_enabled: number;
  auto_convert_percent: number;
  bank_account_holder: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  bank_account_type: string | null;
}

export default function ConversionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"balances" | "settings" | "history">("balances");
  const [balances, setBalances] = useState<CryptoBalance[]>([]);
  const [history, setHistory] = useState<ConversionRequest[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>({
    auto_convert_enabled: 0,
    auto_convert_percent: 0,
    bank_account_holder: null,
    bank_account_number: null,
    bank_name: null,
    bank_account_type: null,
  });
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [convertAmount, setConvertAmount] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);

  const establishmentId = 1; // Mock - in production, get from auth context

  useEffect(() => {
    loadBalances();
    loadSettings();
    loadHistory();
  }, []);

  const loadBalances = async () => {
    const response = await fetch(`/api/conversions/${establishmentId}/balances`);
    const data = await response.json();
    setBalances(data);
  };

  const loadSettings = async () => {
    const response = await fetch(`/api/conversions/${establishmentId}/settings`);
    const data = await response.json();
    setSettings(data);
  };

  const loadHistory = async () => {
    const response = await fetch(`/api/conversions/${establishmentId}/history`);
    const data = await response.json();
    setHistory(data);
  };

  const handleSaveSettings = async () => {
    await fetch(`/api/conversions/${establishmentId}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    alert("Configurações salvas com sucesso!");
  };

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const response = await fetch(`/api/conversions/${establishmentId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crypto_symbol: selectedCrypto,
          amount_crypto: convertAmount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Conversão solicitada! Você receberá R$ ${data.amount_brl} na sua conta bancária.`);
        setShowConvertDialog(false);
        setConvertAmount("");
        loadBalances();
        loadHistory();
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao solicitar conversão");
      }
    } catch (error) {
      console.error("Error converting:", error);
      alert("Erro ao solicitar conversão");
    } finally {
      setIsConverting(false);
    }
  };

  const cryptoIcons: Record<string, string> = {
    USDT: "💵",
    BTC: "₿",
    ETH: "Ξ",
    BNB: "🔶",
  };

  const cryptoColors: Record<string, string> = {
    USDT: "from-green-400 to-emerald-500",
    BTC: "from-orange-400 to-amber-500",
    ETH: "from-blue-400 to-indigo-500",
    BNB: "from-yellow-400 to-amber-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Conversão Cripto → Fiat</h1>
            <p className="text-sm text-slate-400">Converta suas criptomoedas para reais</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "balances" ? "default" : "ghost"}
            className={
              activeTab === "balances"
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }
            onClick={() => setActiveTab("balances")}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Saldos
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className={
              activeTab === "settings"
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "ghost"}
            className={
              activeTab === "history"
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }
            onClick={() => setActiveTab("history")}
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>

        {/* Balances Tab */}
        {activeTab === "balances" && (
          <div className="space-y-4">
            {balances.length === 0 ? (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 text-center">
                <div className="text-slate-400 mb-2">Nenhum saldo disponível</div>
                <p className="text-sm text-slate-500">
                  Você receberá saldos assim que começar a aceitar pagamentos
                </p>
              </Card>
            ) : (
              balances.map((balance) => (
                <Card
                  key={balance.crypto_symbol}
                  className="bg-white/5 backdrop-blur-xl border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                          cryptoColors[balance.crypto_symbol]
                        } flex items-center justify-center text-2xl`}
                      >
                        {cryptoIcons[balance.crypto_symbol]}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">
                          {balance.crypto_symbol}
                        </div>
                        <div className="text-sm text-slate-400">
                          {balance.crypto_symbol === "USDT"
                            ? "Tether"
                            : balance.crypto_symbol === "BTC"
                            ? "Bitcoin"
                            : balance.crypto_symbol === "ETH"
                            ? "Ethereum"
                            : "Binance Coin"}
                        </div>
                      </div>
                    </div>
                    <Dialog open={showConvertDialog && selectedCrypto === balance.crypto_symbol} onOpenChange={setShowConvertDialog}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedCrypto(balance.crypto_symbol)}
                          disabled={parseFloat(balance.available_balance) === 0}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                        >
                          <ArrowRightLeft className="h-4 w-4 mr-2" />
                          Converter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-white/10">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Converter {balance.crypto_symbol} → BRL
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label className="text-white">Valor disponível</Label>
                            <div className="text-2xl font-bold text-green-400 mt-1">
                              {parseFloat(balance.available_balance).toFixed(8)} {balance.crypto_symbol}
                            </div>
                          </div>
                          <div>
                            <Label className="text-white">Quanto deseja converter?</Label>
                            <Input
                              type="number"
                              step="0.00000001"
                              value={convertAmount}
                              onChange={(e) => setConvertAmount(e.target.value)}
                              placeholder="0.00000000"
                              className="bg-white/5 border-white/10 text-white mt-1"
                            />
                            <div className="text-xs text-slate-400 mt-1">
                              Máximo: {balance.available_balance} {balance.crypto_symbol}
                            </div>
                          </div>
                          <Button
                            onClick={handleConvert}
                            disabled={
                              isConverting ||
                              !convertAmount ||
                              parseFloat(convertAmount) <= 0 ||
                              parseFloat(convertAmount) > parseFloat(balance.available_balance)
                            }
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                          >
                            {isConverting ? "Processando..." : "Confirmar Conversão"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Disponível</div>
                      <div className="text-sm font-semibold text-white">
                        {parseFloat(balance.available_balance).toFixed(8)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Em conversão</div>
                      <div className="text-sm font-semibold text-yellow-400">
                        {parseFloat(balance.pending_conversion).toFixed(8)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Total recebido</div>
                      <div className="text-sm font-semibold text-slate-300">
                        {parseFloat(balance.total_received).toFixed(8)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Conversão Automática
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Configure quanto dos pagamentos recebidos deve ser convertido
                automaticamente para reais
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Ativar conversão automática</Label>
                  <Button
                    variant={settings.auto_convert_enabled ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        auto_convert_enabled: settings.auto_convert_enabled ? 0 : 1,
                      })
                    }
                    className={
                      settings.auto_convert_enabled
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "border-white/20 text-white hover:bg-white/10"
                    }
                  >
                    {settings.auto_convert_enabled ? "Ativado" : "Desativado"}
                  </Button>
                </div>

                {settings.auto_convert_enabled === 1 && (
                  <div>
                    <Label className="text-white">
                      Percentual para conversão automática
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.auto_convert_percent}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          auto_convert_percent: parseFloat(e.target.value),
                        })
                      }
                      className="bg-white/5 border-white/10 text-white mt-1"
                    />
                    <div className="text-xs text-slate-400 mt-1">
                      {settings.auto_convert_percent}% será convertido automaticamente, o
                      restante ficará em cripto
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Dados Bancários
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Os reais convertidos serão depositados nesta conta
              </p>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Titular da Conta</Label>
                  <Input
                    value={settings.bank_account_holder || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, bank_account_holder: e.target.value })
                    }
                    placeholder="Nome completo"
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-white">Banco</Label>
                  <Input
                    value={settings.bank_name || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, bank_name: e.target.value })
                    }
                    placeholder="Ex: Banco do Brasil, Nubank, etc"
                    className="bg-white/5 border-white/10 text-white mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Tipo de Conta</Label>
                    <select
                      value={settings.bank_account_type || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, bank_account_type: e.target.value })
                      }
                      className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                    >
                      <option value="">Selecione</option>
                      <option value="corrente">Corrente</option>
                      <option value="poupanca">Poupança</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-white">Número da Conta</Label>
                    <Input
                      value={settings.bank_account_number || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, bank_account_number: e.target.value })
                      }
                      placeholder="12345-6"
                      className="bg-white/5 border-white/10 text-white mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleSaveSettings}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Salvar Configurações
            </Button>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {history.length === 0 ? (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 text-center">
                <div className="text-slate-400 mb-2">Nenhuma conversão ainda</div>
                <p className="text-sm text-slate-500">
                  Suas conversões aparecerão aqui
                </p>
              </Card>
            ) : (
              history.map((conversion) => (
                <Card
                  key={conversion.id}
                  className="bg-white/5 backdrop-blur-xl border-white/10 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                          cryptoColors[conversion.crypto_symbol]
                        } flex items-center justify-center text-lg`}
                      >
                        {cryptoIcons[conversion.crypto_symbol]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {conversion.amount_crypto} {conversion.crypto_symbol} → R${" "}
                          {conversion.amount_fiat}
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(conversion.created_at).toLocaleDateString("pt-BR")} às{" "}
                          {new Date(conversion.created_at).toLocaleTimeString("pt-BR")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {conversion.status === "pending" || conversion.status === "auto-pending" ? (
                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                          <Clock className="h-3 w-3" />
                          Processando
                        </div>
                      ) : conversion.status === "completed" ? (
                        <div className="flex items-center gap-1 text-green-400 text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          Concluída
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-400 text-xs">
                          <X className="h-3 w-3" />
                          Falhou
                        </div>
                      )}
                      {conversion.status === "auto-pending" && (
                        <div className="text-xs text-purple-400 mt-1">Auto</div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
