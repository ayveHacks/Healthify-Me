import { Card } from "@/components/ui/card";
import { Database, Key, ExternalLink } from "lucide-react";

export const SetupScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-2xl p-8 rounded-3xl shadow-[var(--shadow-modal)] space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold">Setup Required</h1>
          <p className="text-muted-foreground">
            Please configure your Supabase credentials to use HealthifyMe
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Step 1: Get Your Supabase Credentials
            </h2>
            <ol className="space-y-2 text-sm text-muted-foreground ml-7 list-decimal">
              <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Supabase Dashboard <ExternalLink className="h-3 w-3" /></a></li>
              <li>Select your project or create a new one</li>
              <li>Navigate to <strong>Settings</strong> → <strong>API</strong></li>
              <li>Copy your <strong>Project URL</strong> (looks like: <code className="bg-muted px-2 py-1 rounded">https://xxxxx.supabase.co</code>)</li>
              <li>Copy your <strong>anon/public key</strong></li>
            </ol>
          </div>

          <div className="bg-secondary/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Step 2: Update src/lib/supabase.ts
            </h2>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Replace the placeholder values in <code className="bg-muted px-2 py-1 rounded text-xs">src/lib/supabase.ts</code>:
              </p>
              <div className="bg-muted/50 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                <div className="text-muted-foreground">// Before:</div>
                <div className="text-destructive">const SUPABASE_URL = 'YOUR_SUPABASE_URL';</div>
                <div className="text-destructive">const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';</div>
                <br />
                <div className="text-muted-foreground">// After:</div>
                <div className="text-primary">const SUPABASE_URL = 'https://xxxxx.supabase.co';</div>
                <div className="text-primary">const SUPABASE_ANON_KEY = 'eyJhbGc...';</div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Step 3: Create Database Tables
            </h2>
            <p className="text-sm text-muted-foreground">
              In your Supabase project, go to <strong>SQL Editor</strong> and run this SQL:
            </p>
            <div className="bg-muted/50 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
              <pre className="text-foreground">{`-- Enable Row Level Security
CREATE TABLE public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  meal_time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.water_intake (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_ml INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  calorie_goal INTEGER NOT NULL,
  water_goal_ml INTEGER NOT NULL,
  calorie_progress INTEGER DEFAULT 0,
  water_progress_ml INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own meals"
  ON public.meals FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own water intake"
  ON public.water_intake FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goals"
  ON public.goals FOR ALL
  USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE meals;
ALTER PUBLICATION supabase_realtime ADD TABLE water_intake;
ALTER PUBLICATION supabase_realtime ADD TABLE goals;`}</pre>
            </div>
          </div>

          <div className="bg-accent/10 border-2 border-accent/20 rounded-2xl p-6">
            <p className="text-sm">
              <strong>⚠️ Note:</strong> The anon/public key is safe to store in your code - it's designed to be publicly accessible.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
