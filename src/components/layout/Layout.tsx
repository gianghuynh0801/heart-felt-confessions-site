
import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-6">{children}</main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>HeartFelt Confessions &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
