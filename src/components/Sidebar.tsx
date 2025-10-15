import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Droplets, 
  Target, 
  Calculator, 
  Apple, 
  LogOut 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type SidebarProps = {
  activeView: string;
  onViewChange: (view: string) => void;
};

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Logged out successfully");
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'water', label: 'Water Tracker', icon: Droplets },
    { id: 'goals', label: 'Daily Goals', icon: Target },
    { id: 'calculator', label: 'Calorie Calculator', icon: Calculator },
    { id: 'recommender', label: 'Food Recommender', icon: Apple },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
          <h2 className="text-xl font-bold text-sidebar-foreground">HealthifyMe</h2>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "default" : "ghost"}
            className="w-full justify-start rounded-xl transition-all duration-200"
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full justify-start rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};
