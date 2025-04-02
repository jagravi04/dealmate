
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MoreHorizontal,
  Pencil,
  Upload,
  User,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import Navbar from "@/components/Navbar";
import ChatPanel from "@/components/ChatPanel";
import DocumentList from "@/components/DocumentList";
import { useDeal } from "@/contexts/DealContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Deal, DealStatus } from "@/types";

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDealById, getMessagesForDeal, updateDealStatus, updateDealPrice, uploadDocument } = useDeal();
  const { user } = useAuth();
  
  const [deal, setDeal] = useState<Deal | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPrice, setNewPrice] = useState("");
  const [isPriceEditing, setIsPriceEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      const dealData = getDealById(id);
      if (dealData) {
        setDeal(dealData);
        setMessages(getMessagesForDeal(id));
      }
      setLoading(false);
    }
  }, [id, getDealById, getMessagesForDeal]);

  useEffect(() => {
    if (deal) {
      setNewPrice(deal.currentPrice.toString());
    }
  }, [deal]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Deal Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The deal you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "in_progress":
        return "deal-status-in-progress";
      case "completed":
        return "deal-status-completed";
      case "cancelled":
        return "deal-status-cancelled";
      case "pending":
      default:
        return "deal-status-pending";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleStatusChange = async (status: DealStatus) => {
    try {
      await updateDealStatus(deal.id, status);
      // Update the local deal state
      setDeal({ ...deal, status });
    } catch (error) {
      console.error("Error updating deal status:", error);
    }
  };

  const handlePriceUpdate = async () => {
    if (!newPrice.trim()) return;
    
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) return;
    
    try {
      await updateDealPrice(deal.id, price);
      // Update the local deal state
      setDeal({ ...deal, currentPrice: price });
      setIsPriceEditing(false);
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setUploadLoading(true);
    try {
      await uploadDocument(deal.id, selectedFile);
      setSelectedFile(null);
      
      // Refresh deal data
      const updatedDeal = getDealById(deal.id);
      if (updatedDeal) {
        setDeal(updatedDeal);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  const isBuyer = user?.id === deal.buyerId;
  const isSeller = user?.id === deal.sellerId;
  const canNegotiatePrice = (isBuyer || isSeller) && deal.status !== "completed" && deal.status !== "cancelled";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 flex-1">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">{deal.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Deal Information</CardTitle>
                    <CardDescription>
                      Created on {format(new Date(deal.createdAt), "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Badge
                    className={getStatusBadgeVariant(deal.status)}
                    variant="outline"
                  >
                    {deal.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </h3>
                    <p>{deal.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Initial Price
                      </h3>
                      <p className="text-lg font-medium">{formatPrice(deal.initialPrice)}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Current Price
                      </h3>
                      {isPriceEditing && canNegotiatePrice ? (
                        <div className="flex">
                          <Input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-32 mr-2"
                            min="0"
                          />
                          <Button size="sm" onClick={handlePriceUpdate}>
                            Update
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setIsPriceEditing(false);
                              setNewPrice(deal.currentPrice.toString());
                            }}
                            className="ml-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <p className="text-lg font-medium">{formatPrice(deal.currentPrice)}</p>
                          {canNegotiatePrice && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsPriceEditing(true)}
                              className="ml-2 h-8"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1.5" />
                      <span className="text-sm text-muted-foreground">
                        Last updated {format(new Date(deal.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-1.5" />
                      <span className="text-sm text-muted-foreground">
                        Created {format(new Date(deal.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deal Content Tabs */}
            <Card>
              <Tabs defaultValue="documents">
                <CardHeader className="pb-0">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="parties">Parties</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-6">
                  <TabsContent value="documents" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Deal Documents</h3>

                      {(isBuyer || isSeller) && (
                        <div className="flex items-center space-x-2">
                          <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("file-upload")?.click()}
                            size="sm"
                          >
                            Select File
                          </Button>
                          {selectedFile && (
                            <Button 
                              size="sm"
                              onClick={handleFileUpload}
                              disabled={uploadLoading}
                            >
                              {uploadLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {selectedFile && !uploadLoading && (
                      <div className="bg-accent/40 p-2 rounded-md text-sm">
                        Selected: {selectedFile.name}
                      </div>
                    )}

                    <DocumentList documents={deal.documents} />
                  </TabsContent>

                  <TabsContent value="parties">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">Buyer</h3>
                        <div className="flex items-center p-3 border rounded-md">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={deal.buyer.avatarUrl} alt={deal.buyer.name} />
                            <AvatarFallback>{getInitials(deal.buyer.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{deal.buyer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {deal.buyer.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Seller</h3>
                        {deal.seller ? (
                          <div className="flex items-center p-3 border rounded-md">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={deal.seller.avatarUrl} alt={deal.seller.name} />
                              <AvatarFallback>{getInitials(deal.seller.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{deal.seller.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {deal.seller.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 border border-dashed rounded-md flex items-center justify-center">
                            <div className="text-center">
                              <div className="flex justify-center mb-2">
                                <div className="p-2 bg-muted rounded-full">
                                  <UserPlus className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </div>
                              <p className="text-muted-foreground mb-2">No seller assigned</p>
                              <Button variant="outline" size="sm">
                                Invite Seller
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Deal Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Deal Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(isBuyer || isSeller) && deal.status !== "completed" && deal.status !== "cancelled" && (
                    <>
                      {deal.status === "pending" && (
                        <Button
                          className="w-full"
                          onClick={() => handleStatusChange("in_progress")}
                        >
                          Start Negotiation
                        </Button>
                      )}
                      
                      {deal.status === "in_progress" && (
                        <Button
                          className="w-full"
                          onClick={() => handleStatusChange("completed")}
                        >
                          Complete Deal
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusChange("cancelled")}
                      >
                        Cancel Deal
                      </Button>
                      
                      <Separator className="my-3" />
                    </>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <MoreHorizontal className="mr-2 h-4 w-4" />
                        More Options
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Print Deal Details</DropdownMenuItem>
                      <DropdownMenuItem>Export Deal Data</DropdownMenuItem>
                      <DropdownMenuItem>Share Deal</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Chat Panel */}
            <Card className="h-[500px] flex flex-col">
              <ChatPanel dealId={deal.id} messages={messages} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;
