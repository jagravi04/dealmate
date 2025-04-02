
export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type DealStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Deal {
  id: string;
  title: string;
  description: string;
  initialPrice: number;
  currentPrice: number;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
  buyerId: string;
  sellerId?: string;
  buyer: User;
  seller?: User;
  documents: Document[];
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  dealId: string;
}

export interface Message {
  id: string;
  content: string;
  sentAt: string;
  senderId: string;
  dealId: string;
  read: boolean;
  sender: User;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'deal' | 'message' | 'document' | 'status';
  dealId?: string;
}
