import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">LOGA Alumni Portal</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="hero-gradient py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Welcome to the{" "}
                <span className="text-primary">LOGA Alumni Network</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Connect with fellow alumnae, access exclusive opportunities, and stay updated with your alma mater.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Join the Network
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl shadow-sm card-hover-effect border border-border/50">
                <h3 className="text-xl font-semibold mb-2 text-primary">Network</h3>
                <p className="text-muted-foreground">
                  Connect with accomplished LOGA alumnae across various professional fields.
                </p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm card-hover-effect border border-border/50">
                <h3 className="text-xl font-semibold mb-2 text-primary">Grow</h3>
                <p className="text-muted-foreground">
                  Access career opportunities and professional development resources.
                </p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm card-hover-effect border border-border/50">
                <h3 className="text-xl font-semibold mb-2 text-primary">Engage</h3>
                <p className="text-muted-foreground">
                  Participate in exclusive events and give back to your alma mater.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} LOGA Alumni Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
