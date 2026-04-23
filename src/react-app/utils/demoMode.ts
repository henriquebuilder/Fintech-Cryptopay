// Demo Mode Configuration
export const DEMO_MODE = true;

// Demo wallet balances
export const DEMO_BALANCES = {
  USDT: {
    balance: "1,250.00",
    usdValue: "1,250.00",
  },
  BTC: {
    balance: "0.05234891",
    usdValue: "5,127.42",
  },
  ETH: {
    balance: "2.48391024",
    usdValue: "9,847.23",
  },
  BNB: {
    balance: "12.73849201",
    usdValue: "7,829.41",
  },
};

// Calculate total balance
export const getTotalBalance = (): string => {
  const total = Object.values(DEMO_BALANCES).reduce(
    (sum, crypto) => sum + parseFloat(crypto.usdValue.replace(/,/g, "")),
    0
  );
  return total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Demo transaction history
export interface DemoTransaction {
  id: string;
  type: "receive" | "send" | "purchase" | "conversion";
  crypto: string;
  amount: string;
  usdValue: string;
  description: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  txHash?: string;
}

export const DEMO_TRANSACTIONS: DemoTransaction[] = [
  {
    id: "tx-001",
    type: "receive",
    crypto: "USDT",
    amount: "+500.00",
    usdValue: "$500.00",
    description: "Depósito via PIX",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "completed",
    txHash: "0x742d35cc6634c0532925a3b844bc9e7fe3c9870b",
  },
  {
    id: "tx-002",
    type: "purchase",
    crypto: "USDT",
    amount: "-50.00",
    usdValue: "$50.00",
    description: "Recarga Vivo - R$ 50",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "completed",
    txHash: "0x9a8d2e5f3c1b7a4e6d8f2a5c3e7b9d1f4a6c8e2b",
  },
  {
    id: "tx-003",
    type: "purchase",
    crypto: "BTC",
    amount: "-0.00098234",
    usdValue: "$96.23",
    description: "Steam Gift Card - R$ 100",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "completed",
    txHash: "0x3f7a9c2e5b8d1f4a7c9e2b5d8f1a4c7e9b2d5f8a",
  },
  {
    id: "tx-004",
    type: "send",
    crypto: "ETH",
    amount: "-0.25000000",
    usdValue: "$989.50",
    description: "Envio para 0x742d...9870b",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "completed",
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
  {
    id: "tx-005",
    type: "conversion",
    crypto: "BNB",
    amount: "-2.50000000",
    usdValue: "$1,537.50",
    description: "Conversão para PIX",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "completed",
    txHash: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
  },
];

// Generate fake voucher codes
export const generateVoucherCode = (serviceType: string): string => {
  const prefix = serviceType.substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${random}`;
};

// Generate fake transaction hash
export const generateTxHash = (): string => {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Simulate payment processing delay
export const simulatePayment = async (durationMs: number = 2000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
};
