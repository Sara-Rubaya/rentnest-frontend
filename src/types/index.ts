export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type PaymentProvider = "STRIPE" | "SSLCOMMERZ";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

// A "landlord summary" is what the API embeds on a Property — never the full User.
export interface UserSummary {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  tenant?: { id: string; name: string };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: string;
  landlordId: string;
  landlord?: UserSummary;
  categoryId?: string | null;
  category?: Category | null;
  reviews?: Review[];
}

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  method?: string | null;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  rentalRequestId: string;
  rentalRequest?: RentalRequest;
  userId: string;
}

export interface RentalRequest {
  id: string;
  status: RentalStatus;
  moveInDate?: string | null;
  message?: string | null;
  createdAt: string;
  tenantId: string;
  tenant?: UserSummary;
  propertyId: string;
  property?: Property;
  payment?: Payment | null;
  review?: Review | null;
}
