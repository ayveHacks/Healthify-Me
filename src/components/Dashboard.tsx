import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase, Meal } from "@/lib/supabase";
import { Plus, Utensils, Droplets } from "lucide-react";
import { format } from "date-fns";

type DashboardProps = {
  onAddMeal: () => void;
  userId: string;
  onRefreshReady?: (refreshFn: () => void) => void;
};

export const Dashboard = ({ onAddMeal, userId, onRefreshReady }: DashboardProps) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalWater, setTotalWater] = useState(0);

  const refreshDashboardData = async () => {
    console.log("Dashboard refresh triggered");
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Fetch meals
    const { data: mealsData, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .order('meal_time', { ascending: true });

    if (!mealsError && mealsData) {
      setMeals(mealsData);
      setTotalCalories(mealsData.reduce((sum, meal) => sum + meal.calories, 0));
      console.log("Meals refreshed:", mealsData.length);
    }

    // Fetch water
    const { data: waterData, error: waterError } = await supabase
      .from('water_intake')
      .select('amount_ml')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (!waterError && waterData) {
      const newTotal = waterData.reduce((sum, intake) => sum + intake.amount_ml, 0);
      setTotalWater(newTotal);
      console.log("Water refreshed, new total:", newTotal);
    }
  };

  useEffect(() => {
    refreshDashboardData();

    // Expose refresh function to parent
    if (onRefreshReady) {
      onRefreshReady(refreshDashboardData);
    }

    const mealsSubscription = supabase
      .channel('meals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' }, () => {
        refreshDashboardData();
      })
      .subscribe();

    const waterSubscription = supabase
      .channel('water-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'water_intake' }, () => {
        refreshDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(mealsSubscription);
      supabase.removeChannel(waterSubscription);
    };
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Button
          onClick={onAddMeal}
          className="rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Meal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-secondary/20 border-2 border-primary/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Total Calories Today</h3>
          </div>
          <p className="text-4xl font-bold text-primary">{totalCalories} kcal</p>
        </Card>

        <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] bg-gradient-to-br from-card to-accent/10 border-2 border-accent/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-accent/10 rounded-xl">
              <Droplets className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Total Water Today</h3>
          </div>
          <p className="text-4xl font-bold text-accent">{totalWater} ml</p>
        </Card>
      </div>

      <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)]">
        <h2 className="text-2xl font-bold mb-4 text-card-foreground">Today's Meals</h2>
        {meals.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No meals logged today. Start by adding your first meal!</p>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
              >
                <div>
                  <p className="font-semibold text-card-foreground">{meal.food_name}</p>
                  <p className="text-sm text-muted-foreground">{meal.meal_time}</p>
                </div>
                <p className="font-bold text-primary">{meal.calories} kcal</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
