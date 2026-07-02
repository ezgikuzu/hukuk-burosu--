export type UserRole = "lawyer" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  nationalId?: string; // T.C. Kimlik / Vergi No
  lawyerId?: string;   // For clients, which lawyer is assigned
}

export interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  color: string; // Theme color for calendar etc.
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  nationalId: string;
  password?: string; // Credentials to login as client
  lawyerId: string; // Assigned lawyer ID
}

export interface Case {
  id: string;
  fileNo: string; // Esas No
  court: string; // Mahkeme
  opposingParty: string; // Karşı Taraf
  subject: string; // Konu
  status: "active" | "closed" | "pending"; // Aktif, Kapalı, Karar Aşamasında
  lawyerId: string; // Assigned lawyer ID
  clientId: string; // Associated client ID
  description: string;
  createdAt: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  title: string;
  dateTime: string;
  location: string;
  notes: string;
  lawyerId: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  category: "pleading" | "contract" | "decision" | "other"; // Dilekçe, Sözleşme, Karar, Diğer
  fileType: string;
  size: string;
  uploadedBy: string; // Lawyer name or Client name
  uploadedAt: string;
  clientId?: string; // Optional client binding
  content?: string; // For text-based templates/notes inside the app
}

export interface Payment {
  id: string;
  clientId: string;
  caseId: string;
  amount: number;
  type: "payment" | "invoice"; // Ödeme (Alınan), Fatura (Talep Edilen)
  date: string;
  description: string;
  status: "paid" | "pending";
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  timestamp: string;
}
