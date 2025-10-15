import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase, Goal } from "@/lib/supabase";
import { toast } from "sonner";
import { Target, RefreshCw } from "lucide-react";
import { format } from "date-fns";

type GoalsModalProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  onGoalUpdated?: () => void;
};

export const GoalsModal = ({ open, onClose, userId, onGoalUpdated }: GoalsModalProps) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [waterGoal, setWaterGoal] = useState(2500);

  const fetchTodaysGoal = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (!error && data) {
      setGoal(data);
      setCalorieGoal(data.calorie_goal);
      setWaterGoal(data.water_goal_ml);
    } else {
      setGoal(null);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTodaysGoal();
    }
  }, [open, userId]);

  const handleSetGoals = async () => {
    const goalDate = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('goals').insert({
      user_id: userId,
      goal_date: goalDate,
      date: goalDate,
      calorie_goal: calorieGoal,
      water_goal_ml: waterGoal,
      calorie_progress: 0,
      water_progress_ml: 0,
    });

    if (error) {
      toast.error("Failed to set goals");
    } else {
      toast.success("Goals set successfully!");
      fetchTodaysGoal();
      if (onGoalUpdated) {
        onGoalUpdated();
      }
    }
  };

  const handleSyncProgress = async () => {
    if (!goal) return;

    const today = format(new Date(), 'yyyy-MM-dd');

    const { data: mealsData } = await supabase
      .from('meals')
      .select('calories')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    const { data: waterData } = await supabase
      .from('water_intake')
      .select('amount_ml')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    const totalCalories = mealsData?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
    const totalWater = waterData?.reduce((sum, intake) => sum + intake.amount_ml, 0) || 0;

    const { error } = await supabase
      .from('goals')
      .update({
        calorie_progress: totalCalories,
        water_progress_ml: totalWater,
      })
      .eq('id', goal.id);

    if (error) {
      toast.error("Failed to sync progress");
    } else {
      toast.success("Progress synced!");
      fetchTodaysGoal();
      if (onGoalUpdated) {
        onGoalUpdated();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl shadow-[var(--shadow-modal)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Daily Goals
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!goal ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">Set your daily goals to track your progress!</p>
              <div className="space-y-2">
                <Label htmlFor="calorieGoal">Daily Calorie Goal (kcal)</Label>
                <Input
                  id="calorieGoal"
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(Number(e.target.value))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterGoal">Daily Water Goal (ml)</Label>
                <Input
                  id="waterGoal"
                  type="number"
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(Number(e.target.value))}
                  className="rounded-xl"
                />
              </div>
              <Button
                onClick={handleSetGoals}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-accent"
              >
                Set Goals
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Calorie Goal</Label>
                  <span className="text-sm font-semibold">
                    {goal.calorie_progress} / {goal.calorie_goal} kcal
                  </span>
                </div>
                <Progress
                  value={(goal.calorie_progress / goal.calorie_goal) * 100}
                  className="h-3"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Water Goal</Label>
                  <span className="text-sm font-semibold">
                    {goal.water_progress_ml} / {goal.water_goal_ml} ml
                  </span>
                </div>
                <Progress
                  value={(goal.water_progress_ml / goal.water_goal_ml) * 100}
                  className="h-3"
                />
              </div>

              <Button
                onClick={handleSyncProgress}
                variant="outline"
                className="w-full rounded-xl"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Progress
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
