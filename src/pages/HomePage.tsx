
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Heart className="mx-auto h-24 w-24 text-love animate-heartbeat" fill="#FF69B4" />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-primary">
                HeartFelt Confessions
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Express your feelings through beautiful heart-shaped drawings and messages
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button asChild size="lg">
                  <Link to="/draw">Create a Heart</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/login">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" fill="#FF69B4" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Draw Your Heart</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom heart designs with our intuitive drawing tools
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-8 w-8 text-primary rotate-45">❤️</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Express Yourself</h3>
                <p className="text-sm text-muted-foreground">
                  Add personal messages to your heart creations
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-8 w-8 text-primary">💌</div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Share Your Feelings</h3>
                <p className="text-sm text-muted-foreground">
                  Save and share your heartfelt confessions with others
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Share Your Heart?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Join HeartFelt today and start creating beautiful heart confessions
              </p>
            </div>
            <Button asChild size="lg">
              <Link to={isAuthenticated ? "/draw" : "/login"}>
                {isAuthenticated ? "Create a Heart" : "Get Started for Free"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
