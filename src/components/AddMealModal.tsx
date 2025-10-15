import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type AddMealModalProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  prefillData?: { foodName: string; calories: number };
  onMealAdded?: () => void;
};

export const AddMealModal = ({ open, onClose, userId, prefillData, onMealAdded }: AddMealModalProps) => {
  const [foodName, setFoodName] = useState(prefillData?.foodName || "");
  const [calories, setCalories] = useState(prefillData?.calories || 0);
  const [mealTime, setMealTime] = useState(new Date().toTimeString().slice(0, 5));

  const handleSave = async () => {
    if (!foodName || calories <= 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    // Combine current date with selected time to create full timestamp
    const today = new Date();
    const [hours, minutes] = mealTime.split(':');
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const mealTimestamp = today.toISOString();

    const { error } = await supabase.from('meals').insert({
      user_id: userId,
      food_name: foodName,
      calories: calories,
      meal_time: mealTimestamp,
    });

    if (error) {
      toast.error("Failed to add meal");
    } else {
      toast.success("Meal added successfully!");
      setFoodName("");
      setCalories(0);
      setMealTime(new Date().toTimeString().slice(0, 5));
      if (onMealAdded) {
        onMealAdded();
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl shadow-[var(--shadow-modal)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Grilled Chicken Salad"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              value={calories || ""}
              onChange={(e) => setCalories(Number(e.target.value))}
              placeholder="e.g., 350"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
        >
          Save Meal
        </Button>
      </DialogContent>
    </Dialog>
  );
};
