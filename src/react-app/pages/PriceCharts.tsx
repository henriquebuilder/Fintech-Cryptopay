import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface PriceData {
  time: string;
  price: number;
}

export default function PriceChartsPage() {
  const navigate = useNavigate();
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [timeframe, setTimeframe] = useState("24h");
  const [chartData, setChartData] = useState<PriceData[]>([]);

  const cryptos = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      currentPrice: 52127.42,
      change24h: 3.45,
      volume24h: "28.5B",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      currentPrice: 2847.18,
      change24h: -1.23,
      volume24h: "15.2B",
    },
    {
      symbol: "USDT",
      name: "Tether",
      logo: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      currentPrice: 1.0,
      change24h: 0.02,
      volume24h: "42.1B",
    },
    {
      symbol: "BNB",
      name: "BNB",
      logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
      currentPrice: 329.47,
      change24h: 2.18,
      volume24h: "1.8B",
    },
  ];

  const selectedCryptoData = cryptos.find((c) => c.symbol === selectedCrypto);

  // Generate mock chart data
  useEffect(() => {
    const generateData = () => {
      const points = timeframe === "24h" ? 24 : timeframe === "7d" ? 7 : 30;
      const basePrice = selectedCryptoData?.currentPrice || 1000;
      const data: PriceData[] = [];

      for (let i = 0; i < points; i++) {
        const variance = (Math.random() - 0.5) * (basePrice * 0.05);
        data.push({
          time: timeframe === "24h" ? `${i}:00` : `Day ${i + 1}`,
          price: basePrice + variance + (i * basePrice * 0.001),
        });
      }

      setChartData(data);
    };

    generateData();
  }, [selectedCrypto, timeframe, selectedCryptoData]);

  const isPositive = (selectedCryptoData?.change24h || 0) > 0;

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
            <h1 className="text-xl font-bold text-white">Gráficos de Preço</h1>
            <p className="text-sm text-slate-400">Acompanhe o mercado em tempo real</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Crypto Selector */}
          <div>
            <label className="text-white mb-3 block text-sm font-medium">Criptomoeda</label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
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
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCryptoData && (
            <>
              {/* Current Price Card */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-6 shadow-lg shadow-purple-500/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedCryptoData.logo}
                      alt={selectedCryptoData.symbol}
                      className="w-12 h-12"
                    />
                    <div>
                      <h2 className="text-white font-semibold text-lg">
                        {selectedCryptoData.name}
                      </h2>
                      <p className="text-slate-400 text-sm">{selectedCryptoData.symbol}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(selectedCryptoData.change24h)}%
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-white mb-1">
                    ${selectedCryptoData.currentPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400">Volume 24h: ${selectedCryptoData.volume24h}</p>
                </div>

                {/* Timeframe Selector */}
                <div className="flex gap-2">
                  {["24h", "7d", "30d"].map((tf) => (
                    <Button
                      key={tf}
                      variant="ghost"
                      size="sm"
                      onClick={() => setTimeframe(tf)}
                      className={`flex-1 ${
                        timeframe === tf
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Chart */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-4 shadow-lg">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isPositive ? "#10b981" : "#ef4444"}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? "#10b981" : "#ef4444"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      style={{ fontSize: 10 }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      style={{ fontSize: 10 }}
                      tickLine={false}
                      tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={isPositive ? "#10b981" : "#ef4444"}
                      strokeWidth={2}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-4 shadow-lg">
                  <p className="text-xs text-slate-400 mb-1">Alta 24h</p>
                  <p className="text-lg font-semibold text-white">
                    ${(selectedCryptoData.currentPrice * 1.05).toLocaleString()}
                  </p>
                </Card>
                <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-4 shadow-lg">
                  <p className="text-xs text-slate-400 mb-1">Baixa 24h</p>
                  <p className="text-lg font-semibold text-white">
                    ${(selectedCryptoData.currentPrice * 0.95).toLocaleString()}
                  </p>
                </Card>
              </div>

              {/* All Cryptos List */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-5 shadow-lg">
                <h3 className="text-white font-medium mb-4">Todas as Moedas</h3>
                <div className="space-y-3">
                  {cryptos.map((crypto) => {
                    const isUp = crypto.change24h > 0;
                    return (
                      <div
                        key={crypto.symbol}
                        onClick={() => setSelectedCrypto(crypto.symbol)}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={crypto.logo} alt={crypto.symbol} className="w-8 h-8" />
                          <div>
                            <p className="text-white font-medium text-sm">{crypto.name}</p>
                            <p className="text-xs text-slate-500">{crypto.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium text-sm">
                            ${crypto.currentPrice.toLocaleString()}
                          </p>
                          <p
                            className={`text-xs ${
                              isUp ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {isUp ? "+" : ""}
                            {crypto.change24h}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
