
import { Deal, Message, Notification, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Buyer",
    email: "john@example.com",
    role: "buyer",
    avatarUrl: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "user-2",
    name: "Sarah Seller",
    email: "sarah@example.com",
    role: "seller",
    avatarUrl: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "user-3",
    name: "Michael Buyer",
    email: "michael@example.com",
    role: "buyer",
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "user-4",
    name: "Emma Seller",
    email: "emma@example.com",
    role: "seller",
    avatarUrl: "https://i.pravatar.cc/150?img=4"
  }
];

export const mockDeals: Deal[] = [
  {
    id: "deal-1",
    title: "Software Licensing Agreement",
    description: "Annual enterprise license for CRM software with support and maintenance.",
    initialPrice: 50000,
    currentPrice: 47500,
    status: "in_progress",
    createdAt: "2023-11-15T10:30:00Z",
    updatedAt: "2023-11-20T14:20:00Z",
    buyerId: "user-1",
    sellerId: "user-2",
    buyer: mockUsers[0],
    seller: mockUsers[1],
    documents: [
      {
        id: "doc-1",
        name: "License Agreement.pdf",
        url: "#",
        type: "application/pdf",
        uploadedAt: "2023-11-16T09:15:00Z",
        uploadedBy: "user-2",
        dealId: "deal-1"
      },
      {
        id: "doc-2",
        name: "Terms and Conditions.pdf",
        url: "#",
        type: "application/pdf",
        uploadedAt: "2023-11-17T11:30:00Z",
        uploadedBy: "user-2",
        dealId: "deal-1"
      }
    ]
  },
  {
    id: "deal-2",
    title: "Hardware Purchase Agreement",
    description: "Procurement of 50 laptop computers with 3-year warranty.",
    initialPrice: 75000,
    currentPrice: 72000,
    status: "pending",
    createdAt: "2023-11-18T09:45:00Z",
    updatedAt: "2023-11-18T09:45:00Z",
    buyerId: "user-3",
    buyer: mockUsers[2],
    documents: []
  },
  {
    id: "deal-3",
    title: "Consulting Services Contract",
    description: "Six-month IT infrastructure assessment and recommendations.",
    initialPrice: 30000,
    currentPrice: 30000,
    status: "completed",
    createdAt: "2023-10-20T13:15:00Z",
    updatedAt: "2023-11-10T17:30:00Z",
    buyerId: "user-1",
    sellerId: "user-4",
    buyer: mockUsers[0],
    seller: mockUsers[3],
    documents: [
      {
        id: "doc-3",
        name: "Final Report.pdf",
        url: "#",
        type: "application/pdf",
        uploadedAt: "2023-11-08T14:45:00Z",
        uploadedBy: "user-4",
        dealId: "deal-3"
      }
    ]
  },
  {
    id: "deal-4",
    title: "Office Space Lease",
    description: "5-year lease for 5,000 sq ft office space in downtown.",
    initialPrice: 12000,
    currentPrice: 11500,
    status: "cancelled",
    createdAt: "2023-11-01T10:00:00Z",
    updatedAt: "2023-11-05T16:30:00Z",
    buyerId: "user-3",
    sellerId: "user-4",
    buyer: mockUsers[2],
    seller: mockUsers[3],
    documents: []
  }
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    content: "Hi Sarah, I'm interested in negotiating the price for the software licensing. Can we discuss?",
    sentAt: "2023-11-16T13:30:00Z",
    senderId: "user-1",
    dealId: "deal-1",
    read: true,
    sender: mockUsers[0]
  },
  {
    id: "msg-2",
    content: "Hello John, absolutely. What price point are you thinking?",
    sentAt: "2023-11-16T13:35:00Z",
    senderId: "user-2",
    dealId: "deal-1",
    read: true,
    sender: mockUsers[1]
  },
  {
    id: "msg-3",
    content: "I was thinking $47,500 for the first year, with an option to renew.",
    sentAt: "2023-11-16T13:38:00Z",
    senderId: "user-1",
    dealId: "deal-1",
    read: true,
    sender: mockUsers[0]
  },
  {
    id: "msg-4",
    content: "That works for us. I'll update the contract and send it over shortly.",
    sentAt: "2023-11-16T13:42:00Z",
    senderId: "user-2",
    dealId: "deal-1",
    read: true,
    sender: mockUsers[1]
  },
  {
    id: "msg-5",
    content: "Great! Looking forward to receiving it.",
    sentAt: "2023-11-16T13:45:00Z",
    senderId: "user-1",
    dealId: "deal-1",
    read: false,
    sender: mockUsers[0]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "New Message",
    message: "You have a new message in 'Software Licensing Agreement'",
    createdAt: "2023-11-16T13:45:00Z",
    read: false,
    type: "message",
    dealId: "deal-1"
  },
  {
    id: "notif-2",
    title: "Deal Status Updated",
    message: "Software Licensing Agreement is now In Progress",
    createdAt: "2023-11-20T14:20:00Z",
    read: false,
    type: "status",
    dealId: "deal-1"
  },
  {
    id: "notif-3",
    title: "New Document Uploaded",
    message: "New document uploaded to Software Licensing Agreement",
    createdAt: "2023-11-17T11:30:00Z",
    read: true,
    type: "document",
    dealId: "deal-1"
  },
  {
    id: "notif-4",
    title: "New Deal Created",
    message: "Hardware Purchase Agreement has been created",
    createdAt: "2023-11-18T09:45:00Z",
    read: true,
    type: "deal",
    dealId: "deal-2"
  }
];

// For demo purposes - simulate a logged-in user
export const currentUser: User = mockUsers[0];
