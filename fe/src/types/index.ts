export enum CarType {
  SEDAN = "SEDAN",
  SUV = "SUV",
  HATCHBACK = "HATCHBACK",
  COUPE = "COUPE",
  MPV = "MPV",
  PICKUP = "PICKUP",
  VAN = "VAN",
  SPORTS = "SPORTS",
  LUXURY = "LUXURY",
  CROSSOVER = "CROSSOVER",
}

export enum TransmissionType {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC",
}
// dua ve lai viet hao nhe
export enum FuelType {
  PETROL = "PETROL",
  GASOLINE = "GASOLINE",
  DIESEL = "DIESEL",
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
}

export enum CarStatus {
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  MAINTENANCE = "MAINTENANCE",
  UNAVAILABLE = "UNAVAILABLE",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum PaymentType {
  DEPOSIT = "DEPOSIT",
  FINAL_PAYMENT = "FINAL_PAYMENT",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  OWNER = "OWNER",
}
export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  carType: CarType;
  seats: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  pricePerDay: number;
  description: string;
  videoUrl?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  features: string[];
  status: CarStatus;
  isAvailable: boolean;
  averageRating: number;
  approved?: boolean;
  rejectionReason?: string;
  totalTrips: number;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  fullName: string;
  phoneNumber: string;
  address?: string;
  drivingLicense?: string;
  drivingLicenseImage?: string;
  profilePicture?: string;
  role: UserRole;
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  bookingCode: string;
  orderCode?: string;
  userId: number;
  userFullName: string;
  userEmail: string;
  userPhoneNumber: string;
  carId: number;
  carName: string;
  carBrand: string;
  carModel: string;
  carLicensePlate?: string;
  carPricePerDay?: number;
  carOwnerId?: number;
  carOwnerName?: string;
  carOwnerPhone?: string;
  carOwnerBankName?: string;
  carOwnerBankAccountNumber?: string;
  carOwnerBankAccountName?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  deposit: number;
  pickupLocation: string;
  dropoffLocation?: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  transactionId: string;
  orderCode: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentType: PaymentType;
  description?: string;
  createdAt: Date;
  paidAt?: Date;
}

export interface Review {
  id: number;
  userId: number;
  userFullName: string;
  carId: number;
  carName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  fullName: string;
  phoneNumber: string;
  address?: string;
  cardNumber?: string;
  drivingLicense?: string;
  role: UserRole;
}

export interface BookingRequest {
  carId: number;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  notes?: string;
}

export interface CarSearchParams {
  carType?: CarType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  minSeats?: number;
}
