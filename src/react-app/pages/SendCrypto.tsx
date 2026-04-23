import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  ArrowLeft,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import { DEMO_MODE, DEMO_BALANCES, generateTxHash, simulatePayment } from "@/react-app/utils/demoMode";

export default function SendCryptoPage() {
  const navigate = useNavigate();
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const cryptos = [
    { symbol: "USDT", balance: DEMO_BALANCES.USDT.balance, logo: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
    { symbol: "BTC", balance: DEMO_BALANCES.BTC.balance, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    { symbol: "ETH", balance: DEMO_BALANCES.ETH.balance, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { symbol: "BNB", balance: DEMO_BALANCES.BNB.balance, logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  ];

  const selectedCryptoData = cryptos.find(c => c.symbol === selectedCrypto);

  const handleSend = async () => {
    if (!address || !amount) return;

    setProcessing(true);

    if (DEMO_MODE) {
      await simulatePayment(2000);
      const hash = generateTxHash();
      setTxHash(hash);
      setSuccess(true);
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden pb-24">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="px-6 pt-8 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800/50 backdrop-blur-sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">Envio Concluído</h1>
          </div>

          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mx-auto mb-4 border border-green-500/30 shadow-lg shadow-green-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-400 drop-shadow-lg" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enviado com Sucesso!</h2>
            <p className="text-slate-400">Sua transação foi processada</p>
            {DEMO_MODE && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                <Sparkles className="h-3 w-3" />
                Transação simulada - Modo Demo
              </div>
            )}
          </div>

          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-6 mb-4 shadow-lg shadow-purple-500/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <img src={selectedCryptoData?.logo} alt={selectedCrypto} className="w-10 h-10" />
                  <div>
                    <p className="text-sm text-slate-400">Criptomoeda</p>
                    <p className="text-white font-medium">{selectedCrypto}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Valor</p>
                  <p className="text-white font-semibold">{amount}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Endereço Destino</p>
                <p className="text-xs font-mono text-slate-300 break-all bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  {address}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Transaction Hash</p>
                <p className="text-xs font-mono text-slate-500 break-all">{txHash}</p>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Voltar para Carteira
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="px-6 pt-8 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-800/50 backdrop-blur-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Enviar Cripto</h1>
            <p className="text-sm text-slate-400">Transfira para outra carteira</p>
          </div>
        </div>

        {!DEMO_MODE && (
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-yellow-500/20 backdrop-blur-xl p-6 mb-6 text-center shadow-lg shadow-yellow-500/10">
            <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <p className="text-slate-300 text-sm mb-2">Modo produção não configurado</p>
            <p className="text-xs text-slate-500">Conecte sua carteira para enviar cripto real</p>
          </Card>
        )}

        <div className="space-y-5">
          <div>
            <Label className="text-white mb-3 block text-sm font-medium">Criptomoeda</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white hover:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <img src={crypto.logo} alt={crypto.symbol} className="w-5 h-5" />
                      <span>{crypto.symbol}</span>
                      <span className="text-xs text-slate-500 ml-2">({crypto.balance})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address" className="text-white mb-2 block text-sm font-medium">
              Endereço de Destino
            </Label>
            <Input
              id="address"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-purple-500/50 font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-white mb-2 block text-sm font-medium">
              Quantidade
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-purple-500/50"
            />
            <p className="text-xs text-slate-500 mt-2">
              Disponível: {selectedCryptoData?.balance} {selectedCrypto}
            </p>
          </div>

          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-5 shadow-lg shadow-purple-500/10">
            <h3 className="text-white font-medium text-sm mb-3">Resumo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Valor</span>
                <span className="text-white">{amount || "0"} {selectedCrypto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Taxa de rede</span>
                <span className="text-white">~0.0001 {selectedCrypto}</span>
              </div>
              <div className="h-px bg-slate-700/50 my-2"></div>
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total</span>
                <span className="text-purple-400">
                  {amount ? (parseFloat(amount) + 0.0001).toFixed(4) : "0"} {selectedCrypto}
                </span>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleSend}
            disabled={processing || !address || !amount}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg shadow-purple-500/30"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar {selectedCrypto}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
