import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { ArrowLeft, QrCode, Camera, CheckCircle, Loader2, Wallet, Copy } from "lucide-react";
import { DEMO_MODE, DEMO_BALANCES, generateTxHash, simulatePayment } from "@/react-app/utils/demoMode";
import BottomNav from "@/react-app/components/BottomNav";

type PaymentStep = "scan" | "confirm" | "processing" | "success";

interface PaymentData {
  merchantName: string;
  merchantAddress: string;
  amount: string;
  crypto: string;
}

export default function PayPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<PaymentStep>("scan");
  const [manualAddress, setManualAddress] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [txHash, setTxHash] = useState("");

  const cryptos = [
    { symbol: "USDT", name: "Tether", balance: DEMO_BALANCES.USDT.balance, logo: "https://cryptologos.cc/logos/tether-usdt-logo.png" },
    { symbol: "BTC", name: "Bitcoin", balance: DEMO_BALANCES.BTC.balance, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    { symbol: "ETH", name: "Ethereum", balance: DEMO_BALANCES.ETH.balance, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { symbol: "BNB", name: "BNB", balance: DEMO_BALANCES.BNB.balance, logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  ];

  const handleSimulateScan = () => {
    // Simulate scanning a merchant QR code
    const demoMerchants = [
      { name: "Cafeteria Digital", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD" },
      { name: "TechStore", address: "0x8Ba1f109551bD432803012645Ac136ddd64DBA" },
      { name: "Restaurante Crypto", address: "0x1234567890abcdef1234567890abcdef12345678" },
    ];
    const merchant = demoMerchants[Math.floor(Math.random() * demoMerchants.length)];
    const amount = (Math.random() * 50 + 10).toFixed(2);
    
    setPaymentData({
      merchantName: merchant.name,
      merchantAddress: merchant.address,
      amount,
      crypto: selectedCrypto,
    });
    setStep("confirm");
  };

  const handleManualPayment = () => {
    if (!manualAddress || !manualAmount) return;
    
    setPaymentData({
      merchantName: "Pagamento Manual",
      merchantAddress: manualAddress,
      amount: manualAmount,
      crypto: selectedCrypto,
    });
    setStep("confirm");
  };

  const handleConfirmPayment = async () => {
    setStep("processing");
    
    if (DEMO_MODE) {
      await simulatePayment(2000);
      setTxHash(generateTxHash());
      setStep("success");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => step === "scan" ? navigate("/") : setStep("scan")}
            className="text-slate-400 hover:bg-slate-800/50 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-white">Pagar</h1>
            <p className="text-xs text-slate-500">
              {step === "scan" && "Escaneie QR ou insira dados"}
              {step === "confirm" && "Confirme o pagamento"}
              {step === "processing" && "Processando..."}
              {step === "success" && "Pagamento realizado!"}
            </p>
          </div>
        </div>

        {/* Scan Step */}
        {step === "scan" && (
          <div className="space-y-6">
            {/* QR Scanner Simulation */}
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-green-500/20 p-6 backdrop-blur-xl">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-slate-800/50 rounded-2xl border-2 border-dashed border-green-500/30 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-green-500/50 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Scanner QR</p>
                  </div>
                </div>
                <Button
                  onClick={handleSimulateScan}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Simular Scan QR
                </Button>
              </div>
            </Card>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="text-xs text-slate-500">ou insira manualmente</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Select Crypto */}
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Criptomoeda</label>
              <div className="grid grid-cols-4 gap-2">
                {cryptos.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedCrypto === crypto.symbol
                        ? "bg-green-600/20 border-green-500/50"
                        : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <img src={crypto.logo} alt={crypto.symbol} className="w-8 h-8 mx-auto mb-1" />
                    <p className="text-[10px] text-center text-white font-medium">{crypto.symbol}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Input */}
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 p-4 backdrop-blur-xl">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Endereço do destinatário</label>
                  <Input
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="0x..."
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">Valor ({selectedCrypto})</label>
                  <Input
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>
                <Button
                  onClick={handleManualPayment}
                  disabled={!manualAddress || !manualAmount}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 disabled:opacity-50"
                >
                  Continuar
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Confirm Step */}
        {step === "confirm" && paymentData && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-green-500/20 p-6 backdrop-blur-xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <Wallet className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">{paymentData.merchantName}</h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {paymentData.merchantAddress.slice(0, 10)}...{paymentData.merchantAddress.slice(-8)}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">Valor a pagar</p>
                  <p className="text-3xl font-bold text-white">
                    {paymentData.amount} <span className="text-green-400">{paymentData.crypto}</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    ≈ ${(parseFloat(paymentData.amount) * (paymentData.crypto === "USDT" ? 1 : paymentData.crypto === "BTC" ? 67000 : paymentData.crypto === "ETH" ? 3500 : 600)).toFixed(2)} USD
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleConfirmPayment}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold"
                >
                  Confirmar Pagamento
                </Button>
                <Button
                  onClick={() => setStep("scan")}
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Processing Step */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
              <Loader2 className="h-10 w-10 text-green-400 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Processando Pagamento</h2>
            <p className="text-sm text-slate-500">Aguarde enquanto confirmamos a transação...</p>
          </div>
        )}

        {/* Success Step */}
        {step === "success" && paymentData && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-green-500/30 p-6 backdrop-blur-xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">Pagamento Realizado!</h2>
                <p className="text-sm text-slate-500">Transação confirmada na blockchain</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Destinatário</span>
                  <span className="text-sm text-white">{paymentData.merchantName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Valor</span>
                  <span className="text-sm text-white">{paymentData.amount} {paymentData.crypto}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">TX Hash</span>
                  <button 
                    onClick={() => copyToClipboard(txHash)}
                    className="text-sm text-green-400 font-mono flex items-center gap-1 hover:text-green-300"
                  >
                    {txHash.slice(0, 8)}...{txHash.slice(-6)}
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </Card>

            <Button
              onClick={() => navigate("/")}
              className="w-full h-12 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white"
            >
              Voltar para Carteira
            </Button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
