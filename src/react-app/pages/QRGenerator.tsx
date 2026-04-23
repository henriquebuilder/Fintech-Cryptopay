import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import QRCode from "qrcode";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Wallet,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/react-app/components/ui/dialog";

interface Wallet {
  id: number;
  crypto_symbol: string;
  address: string;
}

interface Establishment {
  id: number;
  name: string;
  description: string;
}

export default function QRGeneratorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const establishmentId = searchParams.get("id") || "1";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [walletForm, setWalletForm] = useState({
    crypto_symbol: "USDT",
    address: "",
  });

  const fetchEstablishmentData = useCallback(async () => {
    try {
      const response = await fetch(`/api/establishments/${establishmentId}/wallets`);
      const data = await response.json();
      setEstablishment(data.establishment);
      setWallets(data.wallets);
      if (data.wallets.length > 0) {
        setSelectedWallet(data.wallets[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [establishmentId]);

  useEffect(() => {
    fetchEstablishmentData();
  }, [fetchEstablishmentData]);

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/establishments/${establishmentId}/wallets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(walletForm),
      });
      if (response.ok) {
        setDialogOpen(false);
        setWalletForm({ crypto_symbol: "USDT", address: "" });
        fetchEstablishmentData();
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
    }
  };

  const generateQR = async () => {
    if (!selectedWallet || !amount || !canvasRef.current) return;

    const paymentData = {
      establishmentId,
      establishmentName: establishment?.name,
      amount,
      crypto: selectedWallet.crypto_symbol,
      walletAddress: selectedWallet.address,
    };

    const qrData = JSON.stringify(paymentData);

    try {
      await QRCode.toCanvas(canvasRef.current, qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrGenerated(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `qr-${establishment?.name}-${amount}-${selectedWallet?.crypto_symbol}.png`;
    link.href = url;
    link.click();
  };

  const copyPaymentLink = () => {
    if (!selectedWallet) return;

    const paymentData = {
      establishmentId,
      establishmentName: establishment?.name,
      amount,
      crypto: selectedWallet.crypto_symbol,
      walletAddress: selectedWallet.address,
    };

    const paymentLink = `${window.location.origin}/pay?data=${encodeURIComponent(
      JSON.stringify(paymentData)
    )}`;

    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <h1 className="text-2xl font-bold text-white mb-1">QR Code</h1>
            <p className="text-sm text-slate-400">{establishment?.name}</p>
          </div>
        </div>

        {/* Wallet Selection */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-white font-semibold">Carteiras</Label>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Adicionar Carteira
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddWallet} className="space-y-4">
                  <div>
                    <Label className="text-white">Criptomoeda</Label>
                    <select
                      value={walletForm.crypto_symbol}
                      onChange={(e) =>
                        setWalletForm({ ...walletForm, crypto_symbol: e.target.value })
                      }
                      className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                    >
                      <option value="USDT">USDT</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="BNB">BNB</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white">Endereço da Carteira</Label>
                    <Input
                      value={walletForm.address}
                      onChange={(e) =>
                        setWalletForm({ ...walletForm, address: e.target.value })
                      }
                      placeholder="0x..."
                      className="bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    Adicionar Carteira
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {wallets.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Nenhuma carteira cadastrada. Adicione uma carteira para gerar QR codes.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWallet(wallet)}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedWallet?.id === wallet.id
                      ? "border-purple-500 bg-purple-500/20"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-4 w-4 text-purple-400" />
                    <span className="text-white font-semibold">
                      {wallet.crypto_symbol}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate">
                    {wallet.address.slice(0, 12)}...
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Amount Input */}
        {selectedWallet && (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-6">
            <Label className="text-white font-semibold mb-2 block">
              Valor do Pagamento
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white text-2xl"
              />
              <Button
                onClick={generateQR}
                disabled={!amount || parseFloat(amount) <= 0}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white whitespace-nowrap"
              >
                Gerar QR
              </Button>
            </div>
          </Card>
        )}

        {/* QR Code Display */}
        {qrGenerated && (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="text-center">
              <div className="inline-block bg-white p-4 rounded-lg mb-4">
                <canvas ref={canvasRef} />
              </div>

              <div className="space-y-2">
                <div className="text-white font-semibold text-lg">
                  {amount} {selectedWallet?.crypto_symbol}
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  {establishment?.name}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={downloadQR}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar QR
                  </Button>
                  <Button
                    onClick={copyPaymentLink}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-blue-500/10 backdrop-blur-xl border-blue-500/20 p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Como funciona
          </h3>
          <div className="space-y-2 text-sm text-blue-200">
            <p>1. Adicione suas carteiras para cada criptomoeda que aceita</p>
            <p>2. Digite o valor que deseja receber</p>
            <p>3. Gere o QR code e mostre ao cliente</p>
            <p>4. O cliente escaneia e confirma o pagamento direto na carteira dele</p>
            <p>5. Você recebe o pagamento diretamente, sem intermediários</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
