import { useState, useEffect } from "react";
import { LoginPage } from "@/components/LoginPage";
import { SetupScreen } from "@/components/SetupScreen";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { AddMealModal } from "@/components/AddMealModal";
import { WaterTrackerModal } from "@/components/WaterTrackerModal";
import { GoalsModal } from "@/components/GoalsModal";
import { CalorieCalculatorModal } from "@/components/CalorieCalculatorModal";
import { FoodRecommenderModal } from "@/components/FoodRecommenderModal";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealPrefillData, setMealPrefillData] = useState<{ foodName: string; calories: number } | undefined>();
  const [refreshDashboard, setRefreshDashboard] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddMealFromCalculator = (foodName: string, calories: number) => {
    setMealPrefillData({ foodName, calories });
    setShowAddMeal(true);
    setActiveView("dashboard");
  };

  // Show setup screen if Supabase is not configured
  if (!isSupabaseConfigured) {
    return <SetupScreen />;
  }

  if (!user || !session) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 overflow-auto p-8 bg-background">
        <Dashboard 
          onAddMeal={() => setShowAddMeal(true)} 
          userId={user.id}
          onRefreshReady={(refreshFn) => setRefreshDashboard(() => refreshFn)}
        />
      </main>

      <AddMealModal
        open={showAddMeal}
        onClose={() => {
          setShowAddMeal(false);
          setMealPrefillData(undefined);
        }}
        userId={user.id}
        prefillData={mealPrefillData}
        onMealAdded={() => refreshDashboard?.()}
      />

      <WaterTrackerModal
        open={activeView === "water"}
        onClose={() => setActiveView("dashboard")}
        userId={user.id}
        onWaterAdded={() => {
          console.log("Water added - refreshing dashboard");
          refreshDashboard?.();
        }}
      />

      <GoalsModal
        open={activeView === "goals"}
        onClose={() => setActiveView("dashboard")}
        userId={user.id}
        onGoalUpdated={() => refreshDashboard?.()}
      />

      <CalorieCalculatorModal
        open={activeView === "calculator"}
        onClose={() => setActiveView("dashboard")}
        onAddToMeals={handleAddMealFromCalculator}
      />

      <FoodRecommenderModal
        open={activeView === "recommender"}
        onClose={() => setActiveView("dashboard")}
      />
    </div>
  );
};

export default Index;
