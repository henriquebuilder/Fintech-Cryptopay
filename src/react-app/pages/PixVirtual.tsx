import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  ArrowLeft,
  QrCode,
  Key,
  History,
  Plus,
  Copy,
  CheckCircle2,
  Clock,
  DollarSign,
  Smartphone,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";

interface PixKey {
  id: number;
  key_type: string;
  key_value: string;
  is_active: number;
  created_at: string;
}

interface PixTransaction {
  id: number;
  amount_brl: string;
  payer_name: string;
  tx_id: string;
  status: string;
  crypto_symbol: string;
  crypto_amount: string;
  created_at: string;
  key_value: string;
}

export default function PixVirtualPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"generate" | "keys" | "history">("generate");
  const [pixKeys, setPixKeys] = useState<PixKey[]>([]);
  const [transactions, setTransactions] = useState<PixTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [generatedTxId, setGeneratedTxId] = useState("");
  const [copied, setCopied] = useState(false);

  // Form states
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [newKeyType, setNewKeyType] = useState("email");
  const [newKeyValue, setNewKeyValue] = useState("");

  const establishmentId = "1"; // In production, get from auth context

  useEffect(() => {
    loadPixKeys();
    loadTransactions();
  }, []);

  const loadPixKeys = async () => {
    try {
      const response = await fetch(`/api/pix/keys/${establishmentId}`);
      const data = await response.json();
      setPixKeys(data);
    } catch (error) {
      console.error("Error loading PIX keys:", error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch(`/api/pix/transactions/${establishmentId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const generateQRCode = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Digite um valor válido");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/pix/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          establishmentId,
          amount,
          description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Erro ao gerar QR Code");
        return;
      }

      const data = await response.json();
      setQrCodeData(data.qrCode);
      setGeneratedTxId(data.txId);
    } catch (error) {
      console.error("Error generating QR:", error);
      alert("Erro ao gerar QR Code");
    } finally {
      setLoading(false);
    }
  };

  const createPixKey = async () => {
    if (!newKeyValue) {
      alert("Digite a chave PIX");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/pix/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          establishmentId,
          keyType: newKeyType,
          keyValue: newKeyValue,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Erro ao criar chave PIX");
        return;
      }

      setNewKeyValue("");
      loadPixKeys();
      alert("Chave PIX criada com sucesso!");
    } catch (error) {
      console.error("Error creating key:", error);
      alert("Erro ao criar chave PIX");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">PIX Virtual</h1>
              <p className="text-sm text-slate-400">Receba pagamentos em PIX e converta automaticamente</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-lg backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "generate"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <QrCode className="h-4 w-4 inline mr-2" />
            Gerar QR Code
          </button>
          <button
            onClick={() => setActiveTab("keys")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "keys"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Key className="h-4 w-4 inline mr-2" />
            Minhas Chaves
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "history"
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <History className="h-4 w-4 inline mr-2" />
            Histórico
          </button>
        </div>

        {/* Generate QR Code Tab */}
        {activeTab === "generate" && (
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Gerar QR Code PIX</h3>

              {pixKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Smartphone className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">Você precisa criar uma chave PIX primeiro</p>
                  <Button onClick={() => setActiveTab("keys")} className="bg-purple-600 hover:bg-purple-700">
                    Criar Chave PIX
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label className="text-white">Valor (R$)</Label>
                      <Input
                        type="number"
                        placeholder="100.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Descrição (opcional)</Label>
                      <Input
                        placeholder="Pagamento de produto"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={generateQRCode}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? "Gerando..." : "Gerar QR Code PIX"}
                  </Button>

                  {qrCodeData && (
                    <div className="mt-6 p-6 bg-white rounded-lg">
                      <div className="text-center mb-4">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData)}`}
                          alt="QR Code PIX"
                          className="mx-auto"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            value={qrCodeData}
                            readOnly
                            className="text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => copyToClipboard(qrCodeData)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>

                        <div className="text-sm text-slate-600">
                          <p><strong>ID da Transação:</strong> {generatedTxId}</p>
                          <p><strong>Valor:</strong> R$ {parseFloat(amount).toFixed(2)}</p>
                          <p className="text-xs mt-2 text-slate-500">
                            O pagamento será convertido automaticamente para cripto quando confirmado
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {/* Keys Tab */}
        {activeTab === "keys" && (
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Adicionar Chave PIX</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-white">Tipo de Chave</Label>
                  <Select value={newKeyType} onValueChange={setNewKeyType}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="cnpj">CNPJ</SelectItem>
                      <SelectItem value="random">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Chave PIX</Label>
                  <Input
                    placeholder={
                      newKeyType === "email"
                        ? "exemplo@email.com"
                        : newKeyType === "phone"
                        ? "+5511999999999"
                        : newKeyType === "cpf"
                        ? "000.000.000-00"
                        : newKeyType === "cnpj"
                        ? "00.000.000/0000-00"
                        : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    }
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={createPixKey}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Chave PIX
              </Button>
            </Card>

            {/* Keys List */}
            <div className="space-y-3">
              {pixKeys.map((key) => (
                <Card
                  key={key.id}
                  className="bg-white/5 border-white/10 backdrop-blur-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">
                        {key.key_type.toUpperCase()}
                      </p>
                      <p className="text-white font-medium">{key.key_value}</p>
                    </div>
                    {key.is_active === 1 && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Ativa
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {pixKeys.length === 0 && (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Nenhuma chave PIX cadastrada</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <Card
                key={tx.id}
                className="bg-white/5 border-white/10 backdrop-blur-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold text-lg">
                      R$ {parseFloat(tx.amount_brl).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-400">{tx.payer_name || "Cliente"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {tx.status === "confirmed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-400" />
                    )}
                    <span className="text-sm text-slate-400 capitalize">{tx.status}</span>
                  </div>
                </div>

                {tx.crypto_amount && (
                  <div className="flex items-center gap-2 p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <DollarSign className="h-4 w-4 text-purple-400" />
                    <div>
                      <p className="text-sm text-white">
                        Convertido: {parseFloat(tx.crypto_amount).toFixed(6)} {tx.crypto_symbol}
                      </p>
                      <p className="text-xs text-purple-300">Auto-conversão ativada</p>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-slate-400">ID: {tx.tx_id}</p>
                  <p className="text-xs text-slate-400">
                    Chave: {tx.key_value}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(tx.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              </Card>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Nenhuma transação PIX ainda</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
