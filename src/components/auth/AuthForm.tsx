import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/draw");
      } else {
        await signup(email, password, name);
        toast({
          title: "Welcome!",
          description: "Your account has been created.",
        });
        navigate("/draw");
      }
    } catch (error) {
      // Error handling is done in the auth service
    }
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Heart className="h-10 w-10 text-love-dark animate-heartbeat" fill="#FF69B4" />
        </div>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-center text-muted-foreground mt-2">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Button
            variant="link"
            className="pl-1 pr-0 h-auto"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
