import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import {
  ArrowLeft,
  Smartphone,
  Gift,
  Car,
  Tv,
  Receipt,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import BottomNav from "@/react-app/components/BottomNav";

interface ServiceCategory {
  id: number;
  name: string;
  display_name: string;
  icon_name: string;
  description: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Gift,
  Car,
  Tv,
  Receipt,
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/services/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Sparkles;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">Serviços</h1>
              <p className="text-xs text-slate-500">Pague com cripto, receba na hora</p>
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-5 mb-6 shadow-lg shadow-purple-500/10">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">
              Conversão Instantânea
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Use suas criptos para pagar qualquer serviço.
              Conversão automática cripto → PIX
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <Sparkles className="h-3 w-3" />
              <span>Taxa de processamento: 2%</span>
            </div>
          </div>
        </Card>

        {/* Categories Grid */}
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 px-1">
            Categorias
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
            </div>
          ) : (
            categories.map((category) => {
              const Icon = getCategoryIcon(category.icon_name);
              return (
                <Card
                  key={category.id}
                  onClick={() => navigate(`/services/category/${category.id}`)}
                  className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 hover:border-purple-500/30 p-4 cursor-pointer transition-all backdrop-blur-sm shadow-md hover:shadow-purple-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center border border-slate-600/30 shadow-inner">
                        <Icon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm mb-0.5">
                          {category.display_name}
                        </h3>
                        <p className="text-xs text-slate-500">{category.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-purple-500/20 backdrop-blur-xl p-5 mt-6 shadow-lg shadow-purple-500/10">
          <h3 className="text-white font-medium text-sm mb-3">Como funciona?</h3>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <span className="text-slate-600 font-medium">1.</span>
              <span>Escolha o serviço que deseja</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-600 font-medium">2.</span>
              <span>Pague com suas criptomoedas</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-600 font-medium">3.</span>
              <span>Sistema converte automaticamente para PIX</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-600 font-medium">4.</span>
              <span>Receba o voucher/código na hora</span>
            </div>
          </div>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
