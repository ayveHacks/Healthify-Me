import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Apple } from "lucide-react";

type FoodRecommenderModalProps = {
  open: boolean;
  onClose: () => void;
};

const SYMPTOM_RECOMMENDATIONS: Record<string, string> = {
  "low energy": "Oats, Bananas, Nuts, Sweet Potato, Spinach",
  "headache": "Water, Watermelon, Almonds, Bananas, Seeds",
  "fatigue": "Leafy Greens, Salmon, Quinoa, Eggs, Berries",
  "stress": "Dark Chocolate, Green Tea, Avocado, Blueberries, Walnuts",
  "poor sleep": "Almonds, Turkey, Chamomile Tea, Kiwi, Tart Cherry Juice",
  "weak immunity": "Citrus Fruits, Ginger, Garlic, Turmeric, Yogurt",
  "digestion issues": "Yogurt, Ginger, Papaya, Peppermint Tea, Whole Grains",
  "muscle pain": "Tart Cherries, Turmeric, Salmon, Nuts, Leafy Greens",
};

export const FoodRecommenderModal = ({ open, onClose }: FoodRecommenderModalProps) => {
  const [symptom, setSymptom] = useState("");
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleGetRecommendations = () => {
    const key = symptom.toLowerCase().trim();
    const result = SYMPTOM_RECOMMENDATIONS[key];

    if (result) {
      setRecommendation(result);
    } else {
      setRecommendation("No recommendations found for this symptom. Try: low energy, headache, fatigue, stress, poor sleep, weak immunity, digestion issues, or muscle pain.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl shadow-[var(--shadow-modal)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Apple className="h-6 w-6 text-primary" />
            Food Recommender
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="symptom">Enter a symptom or deficiency</Label>
            <Input
              id="symptom"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="e.g., low energy, headache, fatigue"
              className="rounded-xl"
              onKeyPress={(e) => e.key === 'Enter' && handleGetRecommendations()}
            />
          </div>

          <Button
            onClick={handleGetRecommendations}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent"
          >
            Get Recommendations
          </Button>

          {recommendation && (
            <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl">
              <p className="text-sm text-muted-foreground mb-2">Recommended Foods</p>
              <p className="text-lg font-semibold text-foreground">{recommendation}</p>
            </div>
          )}

          <div className="p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Available symptoms:</strong> low energy, headache, fatigue, stress, poor sleep, weak immunity, digestion issues, muscle pain
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
