import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Bitcoin,
  Sparkles,
} from "lucide-react";
import { useAccount, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { 
  DEMO_MODE, 
  generateVoucherCode, 
  generateTxHash, 
  simulatePayment
} from "@/react-app/utils/demoMode";

interface Service {
  id: number;
  service_name: string;
  provider_name: string;
  description: string;
  fixed_amounts: string;
  min_amount_brl: string;
  max_amount_brl: string;
  processing_fee_percent: number;
}

interface Purchase {
  purchaseId: number;
  status: string;
  amountBRL: string;
  processingFee: string;
  totalBRL: string;
  totalCrypto: string;
  estimatedTime: string;
  voucher_code?: string;
  voucher_pin?: string;
  service_name?: string;
  provider_name?: string;
}

export default function ServicePurchasePage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [txHash, setTxHash] = useState("");

  const loadService = useCallback(async () => {
    try {
      const response = await fetch(`/api/services/${serviceId}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error("Error loading service:", error);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  const checkPurchaseStatus = useCallback(async (purchaseId: number) => {
    try {
      const response = await fetch(`/api/services/purchase/${purchaseId}`);
      const data = await response.json();
      if (data.status === "completed") {
        setPurchase(data);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  }, []);

  useEffect(() => {
    loadService();
  }, [loadService]);

  useEffect(() => {
    if (purchase && purchase.status === "processing") {
      const interval = setInterval(() => {
        checkPurchaseStatus(purchase.purchaseId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [purchase, checkPurchaseStatus]);

  const handlePurchase = async () => {
    const amount = customAmount || selectedAmount;
    if (!amount || !service) return;

    // Demo mode - simulate purchase
    if (DEMO_MODE) {
      setProcessing(true);
      
      try {
        const amountBRL = parseFloat(amount);
        const fee = amountBRL * (service.processing_fee_percent / 100);
        const totalBRL = amountBRL + fee;
        const exchangeRate = 5.0;
        const cryptoAmount = totalBRL / exchangeRate;

        // Generate fake transaction hash
        const hash = generateTxHash();
        setTxHash(hash);

        // Set processing status
        setPurchase({
          purchaseId: Math.floor(Math.random() * 10000),
          status: "processing",
          amountBRL: amount,
          processingFee: fee.toFixed(2),
          totalBRL: totalBRL.toFixed(2),
          totalCrypto: cryptoAmount.toFixed(6),
          estimatedTime: "Tempo estimado: 2-3 minutos",
          service_name: service.service_name,
          provider_name: service.provider_name,
        });

        // Simulate payment processing
        await simulatePayment(3000);

        // Generate voucher and complete
        const voucher = generateVoucherCode(service.service_name);
        setPurchase({
          purchaseId: Math.floor(Math.random() * 10000),
          status: "completed",
          amountBRL: amount,
          processingFee: fee.toFixed(2),
          totalBRL: totalBRL.toFixed(2),
          totalCrypto: cryptoAmount.toFixed(6),
          estimatedTime: "",
          voucher_code: voucher,
          voucher_pin: Math.random() < 0.5 ? Math.floor(1000 + Math.random() * 9000).toString() : undefined,
          service_name: service.service_name,
          provider_name: service.provider_name,
        });
      } catch (error) {
        console.error("Error processing purchase:", error);
        alert("Erro ao processar compra. Tente novamente.");
      } finally {
        setProcessing(false);
      }
      return;
    }

    // Production mode - real blockchain transaction
    if (!address || !walletClient || !service) return;

    setProcessing(true);

    try {
      const amountBRL = parseFloat(amount);
      const fee = amountBRL * (service.processing_fee_percent / 100);
      const totalBRL = amountBRL + fee;
      const exchangeRate = 5.0;
      const cryptoAmount = totalBRL / exchangeRate;

      const hash = await walletClient.sendTransaction({
        to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
        value: parseEther(cryptoAmount.toString()),
      });

      setTxHash(hash);

      const response = await fetch("/api/services/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          amountBRL: amount,
          cryptoSymbol: "ETH",
          amountCrypto: cryptoAmount.toFixed(6),
          txHash: hash,
          phoneNumber: phoneNumber || undefined,
        }),
      });

      const data = await response.json();
      setPurchase(data);
    } catch (error) {
      console.error("Error processing purchase:", error);
      alert("Erro ao processar compra. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Serviço não encontrado</p>
      </div>
    );
  }

  const fixedAmounts = JSON.parse(service.fixed_amounts || "[]");

  // If purchase is completed, show voucher
  if (purchase?.status === "completed") {
    return (
      <div className="min-h-screen bg-slate-950 pb-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="px-6 pt-8 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800/50 backdrop-blur-sm"
              onClick={() => navigate("/services")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">Compra Concluída</h1>
          </div>

          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mx-auto mb-4 border border-green-500/30 shadow-lg shadow-green-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-400 drop-shadow-lg" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sucesso!</h2>
            <p className="text-slate-400">Seu voucher está pronto</p>
            {DEMO_MODE && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                <Sparkles className="h-3 w-3" />
                Voucher simulado - Modo Demo
              </div>
            )}
          </div>

          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-6 mb-4 shadow-lg shadow-purple-500/10">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-400 mb-2">{purchase.provider_name}</p>
              <h3 className="text-xl font-bold text-white mb-4">
                {purchase.service_name}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6">
                <p className="text-xs text-purple-200 mb-2">Código do Voucher</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-mono font-bold text-white">
                    {purchase.voucher_code}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => copyToClipboard(purchase.voucher_code || "")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {purchase.voucher_pin && (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6">
                  <p className="text-xs text-purple-200 mb-2">PIN</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-mono font-bold text-white">
                      {purchase.voucher_pin}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                      onClick={() => copyToClipboard(purchase.voucher_pin || "")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Valor</span>
                  <span className="text-white">R$ {purchase.amountBRL}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Taxa</span>
                  <span className="text-white">R$ {purchase.processingFee}</span>
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-white">Total Pago</span>
                  <span className="text-purple-400">{purchase.totalCrypto} ETH</span>
                </div>
              </div>

              {txHash && (
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-2">Transaction Hash</p>
                  <p className="text-xs font-mono text-slate-500 break-all">{txHash}</p>
                </div>
              )}
            </div>
          </Card>

          <Button
            onClick={() => navigate("/services")}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Voltar aos Serviços
          </Button>
        </div>
      </div>
    );
  }

  // If purchase is processing, show status
  if (purchase?.status === "processing") {
    return (
      <div className="min-h-screen bg-slate-950 pb-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="px-6 pt-8 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800/50 backdrop-blur-sm"
              onClick={() => navigate("/services")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">Processando</h1>
          </div>

          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center mx-auto mb-4 border border-purple-500/30 shadow-lg shadow-purple-500/20">
              <Clock className="h-10 w-10 text-purple-400 animate-pulse drop-shadow-lg" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Aguarde...</h2>
            <p className="text-slate-400">Estamos processando sua compra</p>
            <p className="text-sm text-slate-500 mt-2">{purchase.estimatedTime}</p>
          </div>

          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/10">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Pagamento confirmado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin"></div>
                <span>Convertendo cripto para PIX</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-slate-500" />
                <span>Gerando voucher</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
            <h1 className="text-xl font-bold text-white mb-1">
              {service.service_name}
            </h1>
            <p className="text-sm text-slate-400">{service.provider_name}</p>
          </div>
        </div>

        {!address && !DEMO_MODE ? (
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-yellow-500/20 backdrop-blur-xl p-8 text-center shadow-lg shadow-yellow-500/10">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Carteira não conectada</h3>
            <p className="text-sm text-slate-400 mb-4">
              Conecte sua carteira para fazer compras
            </p>
            <Button
              onClick={() => navigate("/pay-web3")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              Conectar Carteira
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <Label className="text-white mb-3 block text-sm font-medium">Valores Disponíveis</Label>
              <div className="grid grid-cols-3 gap-2">
                {fixedAmounts.map((amount: string) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    className={
                      selectedAmount === amount
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-0 shadow-lg shadow-purple-500/30"
                        : "border-slate-700/50 bg-slate-900/50 text-white hover:bg-slate-800/50 hover:border-purple-500/30"
                    }
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                  >
                    R$ {amount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="custom" className="text-white mb-2 block text-sm font-medium">
                Ou insira um valor
              </Label>
              <Input
                id="custom"
                type="number"
                placeholder="R$ 0,00"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount("");
                }}
                className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-purple-500/50"
              />
              <p className="text-xs text-slate-400 mt-2">
                Min: R$ {service.min_amount_brl} - Max: R$ {service.max_amount_brl}
              </p>
            </div>

            {service.service_name.includes("Recarga") && (
              <div className="mb-6">
                <Label htmlFor="phone" className="text-white mb-2 block text-sm font-medium">
                  Número de Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-purple-500/50"
                />
              </div>
            )}

            {(selectedAmount || customAmount) && (
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-5 mb-6 shadow-lg shadow-purple-500/10">
                <h3 className="text-white font-semibold mb-4">Resumo da Compra</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valor</span>
                    <span className="text-white">
                      R$ {customAmount || selectedAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxa ({service.processing_fee_percent}%)</span>
                    <span className="text-white">
                      R${" "}
                      {(
                        parseFloat(customAmount || selectedAmount) *
                        (service.processing_fee_percent / 100)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-purple-400">
                      {(
                        parseFloat(customAmount || selectedAmount) *
                        (1 + service.processing_fee_percent / 100) /
                        5.0
                      ).toFixed(6)}{" "}
                      ETH
                    </span>
                  </div>
                </div>
              </Card>
            )}

            <Button
              onClick={handlePurchase}
              disabled={processing || (!selectedAmount && !customAmount)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Processando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Bitcoin className="h-5 w-5" />
                  Pagar com Cripto
                </span>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
