import { useNavigate, useLocation } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Download, ShoppingBag, QrCode, Store, Settings } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", label: "Carteira", icon: Download },
    { path: "/services", label: "Serviços", icon: ShoppingBag },
    { path: "/pay", label: "Pagar", icon: QrCode },
    { path: "/commerce", label: "Comercio", icon: Store },
    { path: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 shadow-2xl shadow-black/50 z-50">
      <div className="grid grid-cols-5 gap-0 px-2 py-1.5">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`flex-col h-auto py-2.5 hover:bg-slate-800/50 ${
              isActive(item.path) 
                ? "text-white" 
                : "text-slate-500 hover:text-white"
            }`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-4.5 w-4.5 mb-1" />
            <span className="text-[10px]">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
