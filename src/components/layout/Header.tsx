import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };
  
  // Get username from user data
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="text-xl font-bold">HeartFelt</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4">
          {isAuthenticated && (
            <>
              <Link to="/draw">
                <Button
                  variant={location.pathname === "/draw" ? "default" : "ghost"}
                >
                  Draw
                </Button>
              </Link>
              <Link to="/gallery">
                <Button
                  variant={location.pathname === "/gallery" ? "default" : "ghost"}
                >
                  Gallery
                </Button>
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/draw" className="cursor-pointer">
                    Draw
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/gallery" className="cursor-pointer">
                    Gallery
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
