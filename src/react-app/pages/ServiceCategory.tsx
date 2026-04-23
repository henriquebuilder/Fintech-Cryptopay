import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getServiceLogo, getServiceInitials, getProviderColor } from "@/react-app/utils/serviceLogo";

interface Service {
  id: number;
  category_id: number;
  provider_name: string;
  service_name: string;
  description: string;
  min_amount_brl: string;
  max_amount_brl: string;
  fixed_amounts: string;
  category_name: string;
}

export default function ServiceCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const loadServices = useCallback(async () => {
    try {
      const response = await fetch(`/api/services/category/${categoryId}`);
      const data = await response.json();
      setServices(data);
      if (data.length > 0) {
        setCategoryName(data[0].category_name);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);



  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm"
            onClick={() => navigate("/services")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-white">{categoryName}</h1>
            <p className="text-xs text-slate-500">
              Escolha o serviço e pague com cripto
            </p>
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        ) : services.length === 0 ? (
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl p-8 text-center shadow-lg">
            <p className="text-slate-500 text-sm">Nenhum serviço disponível nesta categoria</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {services.map((service) => {
              const fixedAmounts = JSON.parse(service.fixed_amounts || "[]");
              const logo = getServiceLogo(service.provider_name);
              const initials = getServiceInitials(service.service_name);
              const bgColor = getProviderColor(service.provider_name);
              
              return (
                <Card
                  key={service.id}
                  onClick={() => navigate(`/services/purchase/${service.id}`)}
                  className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 hover:border-purple-500/30 p-4 cursor-pointer transition-all backdrop-blur-sm shadow-md hover:shadow-purple-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center overflow-hidden border border-slate-600/30 shadow-inner`}>
                        {logo ? (
                          <img 
                            src={logo} 
                            alt={service.provider_name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="text-white font-semibold text-sm">{initials}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-sm mb-0.5">
                          {service.service_name}
                        </h3>
                        <p className="text-xs text-slate-500 mb-1.5">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {fixedAmounts.slice(0, 4).map((amount: string) => (
                            <span
                              key={amount}
                              className="text-[10px] bg-slate-800/60 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/50"
                            >
                              R$ {amount}
                            </span>
                          ))}
                          {fixedAmounts.length > 4 && (
                            <span className="text-[10px] bg-slate-800/60 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/50">
                              +{fixedAmounts.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600 flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
