import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { ArrowLeft, Copy, CheckCircle2, Sparkles, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import { DEMO_MODE } from "@/react-app/utils/demoMode";
import QRCode from "qrcode";

export default function ReceiveCryptoPage() {
  const navigate = useNavigate();
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const cryptos = [
    {
      symbol: "USDT",
      name: "Tether",
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
      network: "Ethereum (ERC-20)",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      network: "Bitcoin Network",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
      network: "Ethereum Network",
    },
    {
      symbol: "BNB",
      name: "BNB",
      logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
      address: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
      network: "BNB Chain",
    },
  ];

  const selectedCryptoData = cryptos.find((c) => c.symbol === selectedCrypto);

  const generateQRCode = async (text: string) => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: 250,
        margin: 2,
        color: {
          dark: "#FFFFFF",
          light: "#0F172A",
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error("QR code generation error:", err);
    }
  };

  const handleCryptoChange = (value: string) => {
    setSelectedCrypto(value);
    const crypto = cryptos.find((c) => c.symbol === value);
    if (crypto) {
      generateQRCode(crypto.address);
    }
  };

  const handleCopy = async () => {
    if (selectedCryptoData?.address) {
      await navigator.clipboard.writeText(selectedCryptoData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate QR code on mount
  useState(() => {
    if (selectedCryptoData) {
      generateQRCode(selectedCryptoData.address);
    }
  });

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
            <h1 className="text-xl font-bold text-white">Receber Cripto</h1>
            <p className="text-sm text-slate-400">Compartilhe seu endereço</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-white mb-3 block text-sm font-medium">
              Selecione a Criptomoeda
            </label>
            <Select value={selectedCrypto} onValueChange={handleCryptoChange}>
              <SelectTrigger className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {cryptos.map((crypto) => (
                  <SelectItem
                    key={crypto.symbol}
                    value={crypto.symbol}
                    className="text-white hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <img src={crypto.logo} alt={crypto.symbol} className="w-5 h-5" />
                      <span>{crypto.name}</span>
                      <span className="text-xs text-slate-500">({crypto.symbol})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCryptoData && (
            <>
              {/* QR Code */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-8 text-center shadow-lg shadow-purple-500/10">
                <div className="w-64 h-64 mx-auto mb-4 bg-white rounded-2xl p-4 flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                  ) : (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">Escaneie para enviar {selectedCrypto}</p>
                <p className="text-[10px] text-slate-500">{selectedCryptoData.network}</p>
              </Card>

              {/* Demo Mode Badge */}
              {DEMO_MODE && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                    <Sparkles className="h-3 w-3" />
                    Endereço fictício - Modo Demo
                  </div>
                </div>
              )}

              {/* Address */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-5 shadow-lg">
                <div className="flex items-start gap-3">
                  <img
                    src={selectedCryptoData.logo}
                    alt={selectedCryptoData.symbol}
                    className="w-10 h-10 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-medium text-white">{selectedCryptoData.name}</p>
                      <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                        {selectedCryptoData.network}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-300 break-all mb-3">
                      {selectedCryptoData.address}
                    </p>
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      {copied ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Copiado!
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Copy className="h-4 w-4" />
                          Copiar Endereço
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Warning */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-yellow-500/20 backdrop-blur-xl p-4 shadow-lg shadow-yellow-500/10">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-500 text-sm">⚠️</span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium mb-1">Atenção</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Envie apenas {selectedCrypto} para este endereço na rede{" "}
                      {selectedCryptoData.network}. Enviar outras criptomoedas ou usar outra rede pode
                      resultar em perda permanente dos fundos.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Save QR Button */}
              <Button
                onClick={() => {
                  if (qrCodeUrl) {
                    const link = document.createElement("a");
                    link.download = `${selectedCrypto}-address-qr.png`;
                    link.href = qrCodeUrl;
                    link.click();
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Salvar QR Code
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
