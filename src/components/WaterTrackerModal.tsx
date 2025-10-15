import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Droplets } from "lucide-react";
import { format } from "date-fns";

type WaterTrackerModalProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  onWaterAdded?: () => void;
};

export const WaterTrackerModal = ({ open, onClose, userId, onWaterAdded }: WaterTrackerModalProps) => {
  const [amount, setAmount] = useState(250);
  const [totalWater, setTotalWater] = useState(0);

  const fetchTodaysWater = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('water_intake')
      .select('amount_ml')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    if (!error && data) {
      setTotalWater(data.reduce((sum, intake) => sum + intake.amount_ml, 0));
    }
  };

  useEffect(() => {
    if (open) {
      fetchTodaysWater();
    }
  }, [open, userId]);

  const handleAddWater = async (ml: number) => {
    const { error } = await supabase.from('water_intake').insert({
      user_id: userId,
      amount_ml: ml,
    });

    if (error) {
      console.error("Water intake error:", error);
      toast.error("Failed to add water intake");
    } else {
      console.log("Water added successfully, triggering refresh");
      toast.success(`Added ${ml}ml of water!`);
      
      // Update local modal display
      await fetchTodaysWater();
      
      // Trigger dashboard refresh
      if (onWaterAdded) {
        console.log("Calling onWaterAdded callback");
        onWaterAdded();
      } else {
        console.warn("onWaterAdded callback not provided");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl shadow-[var(--shadow-modal)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Droplets className="h-6 w-6 text-accent" />
            Water Tracker
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Water Today</p>
            <p className="text-4xl font-bold text-accent">{totalWater} ml</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Custom Amount (ml)</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="rounded-xl"
                />
                <Button
                  onClick={() => handleAddWater(amount)}
                  className="rounded-xl bg-accent hover:bg-accent/90"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Add</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleAddWater(250)}
                  variant="outline"
                  className="rounded-xl hover:bg-accent/10"
                >
                  +250ml
                </Button>
                <Button
                  onClick={() => handleAddWater(500)}
                  variant="outline"
                  className="rounded-xl hover:bg-accent/10"
                >
                  +500ml
                </Button>
                <Button
                  onClick={() => handleAddWater(750)}
                  variant="outline"
                  className="rounded-xl hover:bg-accent/10"
                >
                  +750ml
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Based on general health guidelines, an adult should drink around 2000-3000 ml of water per day.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
