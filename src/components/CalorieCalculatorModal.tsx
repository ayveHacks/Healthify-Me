import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

type CalorieCalculatorModalProps = {
  open: boolean;
  onClose: () => void;
  onAddToMeals: (foodName: string, calories: number) => void;
};

const FOOD_CALORIES: Record<string, number> = {
  egg: 78,
  toast: 69,
  avocado: 234,
  banana: 105,
  apple: 95,
  chicken: 165,
  rice: 206,
  pasta: 158,
  salmon: 208,
  broccoli: 55,
  potato: 163,
  yogurt: 100,
  milk: 103,
  cheese: 113,
  oats: 389,
};

export const CalorieCalculatorModal = ({ open, onClose, onAddToMeals }: CalorieCalculatorModalProps) => {
  const [foodName, setFoodName] = useState("");
  const [result, setResult] = useState<{ name: string; calories: number } | null>(null);

  const handleCalculate = () => {
    const food = foodName.toLowerCase().trim();
    const calories = FOOD_CALORIES[food];

    if (calories !== undefined) {
      setResult({ name: foodName, calories });
    } else {
      setResult({ name: foodName, calories: -1 });
    }
  };

  const handleAddToMeals = () => {
    if (result && result.calories > 0) {
      onAddToMeals(result.name, result.calories);
      onClose();
      setFoodName("");
      setResult(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl shadow-[var(--shadow-modal)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Calorie Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., egg, banana, chicken"
              className="rounded-xl"
              onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
            />
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent"
          >
            Calculate Calories
          </Button>

          {result && (
            <div className="p-6 bg-secondary/50 rounded-2xl text-center space-y-4">
              {result.calories > 0 ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Calories in {result.name}</p>
                    <p className="text-3xl font-bold text-primary">{result.calories} kcal</p>
                  </div>
                  <Button
                    onClick={handleAddToMeals}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Add to Today's Meals
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">Food not found in our database</p>
              )}
            </div>
          )}

          <div className="p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Available foods:</strong> egg, toast, avocado, banana, apple, chicken, rice, pasta, salmon, broccoli, potato, yogurt, milk, cheese, oats
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
