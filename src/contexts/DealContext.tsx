
import React, { createContext, useContext, useState, useEffect } from "react";
import { Deal, DealStatus, Document, Message } from "@/types";
import { mockDeals, mockMessages } from "@/lib/mock-data";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface DealContextType {
  deals: Deal[];
  loading: boolean;
  createDeal: (title: string, description: string, initialPrice: number) => Promise<Deal>;
  updateDealStatus: (dealId: string, status: DealStatus) => Promise<void>;
  updateDealPrice: (dealId: string, newPrice: number) => Promise<void>;
  getDealById: (dealId: string) => Deal | undefined;
  getMessagesForDeal: (dealId: string) => Message[];
  sendMessage: (dealId: string, content: string) => Promise<void>;
  uploadDocument: (dealId: string, document: File) => Promise<void>;
}

const DealContext = createContext<DealContextType>({
  deals: [],
  loading: true,
  createDeal: async () => ({ id: "", title: "", description: "", initialPrice: 0, currentPrice: 0, status: "pending", createdAt: "", updatedAt: "", buyerId: "", documents: [] }),
  updateDealStatus: async () => {},
  updateDealPrice: async () => {},
  getDealById: () => undefined,
  getMessagesForDeal: () => [],
  sendMessage: async () => {},
  uploadDocument: async () => {},
});

export const useDeal = () => useContext(DealContext);

export const DealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, you would fetch deals from your API
        setDeals(mockDeals);
        setMessages(mockMessages);
      } catch (error) {
        console.error("Failed to load deals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      setDeals([]);
      setMessages([]);
      setLoading(false);
    }
  }, [user]);

  const createDeal = async (title: string, description: string, initialPrice: number): Promise<Deal> => {
    if (!user) throw new Error("You must be logged in to create a deal");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title,
      description,
      initialPrice,
      currentPrice: initialPrice,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      buyerId: user.id,
      buyer: user,
      documents: [],
    };
    
    setDeals(prevDeals => [...prevDeals, newDeal]);
    
    toast({
      title: "Deal created",
      description: "Your deal has been successfully created.",
    });
    
    return newDeal;
  };

  const updateDealStatus = async (dealId: string, status: DealStatus) => {
    if (!user) throw new Error("You must be logged in to update a deal");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === dealId 
          ? { ...deal, status, updatedAt: new Date().toISOString() } 
          : deal
      )
    );
    
    toast({
      title: "Deal updated",
      description: `Deal status updated to ${status.replace('_', ' ')}.`,
    });
  };

  const updateDealPrice = async (dealId: string, newPrice: number) => {
    if (!user) throw new Error("You must be logged in to update a deal");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === dealId 
          ? { ...deal, currentPrice: newPrice, updatedAt: new Date().toISOString() } 
          : deal
      )
    );
    
    toast({
      title: "Price updated",
      description: `Deal price updated to $${newPrice.toLocaleString()}.`,
    });
  };

  const getDealById = (dealId: string) => {
    return deals.find(deal => deal.id === dealId);
  };

  const getMessagesForDeal = (dealId: string) => {
    return messages.filter(message => message.dealId === dealId);
  };

  const sendMessage = async (dealId: string, content: string) => {
    if (!user) throw new Error("You must be logged in to send a message");
    if (!content.trim()) throw new Error("Message cannot be empty");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sentAt: new Date().toISOString(),
      senderId: user.id,
      dealId,
      read: false,
      sender: user,
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const uploadDocument = async (dealId: string, file: File) => {
    if (!user) throw new Error("You must be logged in to upload a document");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      url: "#", // In a real app, this would be the URL from your storage service
      type: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.id,
      dealId,
    };
    
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === dealId 
          ? { ...deal, documents: [...deal.documents, newDocument] } 
          : deal
      )
    );
    
    toast({
      title: "Document uploaded",
      description: `${file.name} has been successfully uploaded.`,
    });
  };

  return (
    <DealContext.Provider
      value={{
        deals,
        loading,
        createDeal,
        updateDealStatus,
        updateDealPrice,
        getDealById,
        getMessagesForDeal,
        sendMessage,
        uploadDocument,
      }}
    >
      {children}
    </DealContext.Provider>
  );
};
