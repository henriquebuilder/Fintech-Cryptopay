import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

const WalletPage = lazy(() => import("@/react-app/pages/Wallet"));
const AdminPage = lazy(() => import("@/react-app/pages/Admin"));
const AnalyticsPage = lazy(() => import("@/react-app/pages/Analytics"));
const PlansPage = lazy(() => import("@/react-app/pages/Plans"));
const QRGeneratorPage = lazy(() => import("@/react-app/pages/QRGenerator"));
const OnboardingPage = lazy(() => import("@/react-app/pages/Onboarding"));
const ConversionsPage = lazy(() => import("@/react-app/pages/Conversions"));
const PixVirtualPage = lazy(() => import("@/react-app/pages/PixVirtual"));
const ServicesPage = lazy(() => import("@/react-app/pages/Services"));
const ServiceCategoryPage = lazy(() => import("@/react-app/pages/ServiceCategory"));
const ServicePurchasePage = lazy(() => import("@/react-app/pages/ServicePurchase"));
const TransactionHistoryPage = lazy(() => import("@/react-app/pages/TransactionHistory"));
const DemoOnboardingPage = lazy(() => import("@/react-app/pages/DemoOnboarding"));
const SendCryptoPage = lazy(() => import("@/react-app/pages/SendCrypto"));
const ReceiveCryptoPage = lazy(() => import("@/react-app/pages/ReceiveCrypto"));
const PriceChartsPage = lazy(() => import("@/react-app/pages/PriceCharts"));
const PayPage = lazy(() => import("@/react-app/pages/Pay"));
const CommercePage = lazy(() => import("@/react-app/pages/Commerce"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
        <Routes>
          <Route path="/" element={<WalletPage />} />
          <Route path="/pay" element={<PayPage />} />
          <Route path="/commerce" element={<CommercePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/qr-generator" element={<QRGeneratorPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/conversions" element={<ConversionsPage />} />
          <Route path="/pix-virtual" element={<PixVirtualPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/category/:categoryId" element={<ServiceCategoryPage />} />
          <Route path="/services/purchase/:serviceId" element={<ServicePurchasePage />} />
          <Route path="/transactions" element={<TransactionHistoryPage />} />
          <Route path="/demo-onboarding" element={<DemoOnboardingPage />} />
          <Route path="/send" element={<SendCryptoPage />} />
          <Route path="/receive" element={<ReceiveCryptoPage />} />
          <Route path="/price-charts" element={<PriceChartsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
