import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { LogIn, User } from "lucide-react";

export const LoginPage = () => {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        toast.error("Login failed: " + error.message);
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  const handleDemoLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@healthifyme.com',
        password: 'demo123456',
      });

      if (error) {
        toast.error("Demo login failed. Creating demo account...");
        // Try to sign up the demo user if it doesn't exist
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'demo@healthifyme.com',
          password: 'demo123456',
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        
        if (signUpError) {
          toast.error("Could not create demo account: " + signUpError.message);
        } else {
          toast.success("Demo account created! Logging in...");
        }
      }
    } catch (error) {
      toast.error("An error occurred during demo login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-md p-8 bg-card rounded-3xl shadow-[var(--shadow-modal)] space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">🌿</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            HealthifyMe
          </h1>
          <p className="text-muted-foreground">
            Track your wellness journey
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In with Google
          </Button>

          <Button
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full h-14 text-lg rounded-2xl"
            size="lg"
          >
            <User className="mr-2 h-5 w-5" />
            Demo Login
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Start tracking your meals, water intake, and health goals
        </p>
      </div>
    </div>
  );
};
