export const getServiceLogo = (provider: string): string | null => {
  const logoMap: Record<string, string | null> = {
    // Gaming
    "Steam": null,
    "Sony": null,
    "Microsoft": null,
    "Garena": null,
    "Epic Games": null,
    "Roblox": null,
    "Moonton": null,
    "Riot Games": null,
    
    // Streaming
    "Netflix": null,
    "Spotify": null,
    "Disney": null,
    "Warner Bros": null,
    "Amazon": null,
    "Paramount": null,
    "Google": null,
    
    // Delivery
    "iFood": null,
    "Rappi": null,
    "Uber": null,
    
    // Mobile carriers
    "Vivo": null,
    "Tim": null,
    "Claro": null,
    "Oi": null,
    
    // Others
    "Apple": null,
    "99": null,
    "Sem Parar": null,
    "Sistema": null,
  };
  
  return logoMap[provider] || null;
};

export const getServiceInitials = (name: string): string => {
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const getProviderColor = (provider: string): string => {
  const colorMap: Record<string, string> = {
    "Vivo": "bg-purple-600",
    "Tim": "bg-blue-600",
    "Claro": "bg-red-600",
    "Oi": "bg-yellow-600",
    "Steam": "bg-slate-700",
    "Sony": "bg-blue-700",
    "Microsoft": "bg-green-600",
    "Netflix": "bg-red-600",
    "Spotify": "bg-green-500",
    "iFood": "bg-red-500",
    "Rappi": "bg-orange-500",
    "Disney": "bg-blue-600",
    "Warner Bros": "bg-purple-700",
    "Amazon": "bg-cyan-600",
    "Uber": "bg-black",
    "99": "bg-yellow-500",
    "Garena": "bg-orange-600",
    "Epic Games": "bg-slate-800",
    "Roblox": "bg-red-600",
  };
  
  return colorMap[provider] || "bg-slate-700";
};
