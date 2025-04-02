
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { useDeal } from "@/contexts/DealContext";
import { useToast } from "@/components/ui/use-toast";

const CreateDeal = () => {
  const { createDeal } = useDeal();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
  });

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      price: "",
    };
    
    let isValid = true;
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    
    if (!price.trim()) {
      newErrors.price = "Price is required";
      isValid = false;
    } else {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        newErrors.price = "Price must be a positive number";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const deal = await createDeal(
        title,
        description,
        parseFloat(price)
      );
      
      navigate(`/deals/${deal.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating deal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container max-w-3xl mx-auto p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Deal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Deal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Office Equipment Purchase"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the deal..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Initial Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="10000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Deal"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateDeal;
