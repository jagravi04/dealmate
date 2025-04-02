
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, FileCheck, Lock, MessageSquare, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import DealCard from "@/components/DealCard";
import { useAuth } from "@/contexts/AuthContext";
import { useDeal } from "@/contexts/DealContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const { deals, loading } = useDeal();
  const navigate = useNavigate();
  const [activeDeals, setActiveDeals] = useState<typeof deals>([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Filter active deals (not cancelled or completed)
      const filteredDeals = deals.filter(
        (deal) => deal.status !== "cancelled" && deal.status !== "completed"
      );
      setActiveDeals(filteredDeals);
    }
  }, [isAuthenticated, deals]);

  // If user is authenticated, show their deals
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container max-w-7xl mx-auto p-4 sm:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome, {user?.name}
              </h1>
              <p className="text-muted-foreground">
                Manage and track your business deals securely.
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Active Deals</h2>
                <Button onClick={() => navigate("/create-deal")} variant="outline" size="sm">
                  Create new deal
                </Button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-[220px] rounded-md border border-border bg-card p-4 animate-pulse"
                    />
                  ))}
                </div>
              ) : activeDeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No active deals</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any active deals. Create a new deal to get started.
                  </p>
                  <Button onClick={() => navigate("/create-deal")}>
                    Create New Deal
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If user is not authenticated, show landing page
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10" />
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Secure Business Transactions Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Negotiate deals, securely share documents, and close transactions with confidence using our powerful virtual deal room.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg" onClick={() => navigate("/register")}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-muted-foreground">
              Role-based access control for buyers and sellers with secure authentication.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Deals</h3>
            <p className="text-muted-foreground">
              Create and negotiate deals with confidence through our encrypted platform.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-muted-foreground">
              Instant messaging between buyers and sellers with typing indicators and read receipts.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Document Management</h3>
            <p className="text-muted-foreground">
              Secure upload and storage of deal-related documents with granular access control.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Track deals and transactions with advanced analytics and reporting tools.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-muted-foreground">
              Integrated payment processing for secure financial transactions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to streamline your deal process?</h2>
          <Button size="lg" className="text-lg" onClick={() => navigate("/register")}>
            Get Started Today
          </Button>
        </div>
      </section>

      <footer className="bg-card py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg font-bold mb-4 md:mb-0">dealmate</div>
            <div className="text-sm text-muted-foreground">
              © 2023 dealmate. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
