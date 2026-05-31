const BASE = "http://localhost:8080";

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  telephone: string;
}

export interface ParkingSpot {
  spotId: string;
  location: string;
  occupied: boolean;
}

export interface Reservation {
  reservationId: string;
  reservationDate: string;
  reservationTime: string;
  status: string;
  customer: Customer;
  parkingSpot: ParkingSpot;
}

export interface Payment {
  paymentId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  reservation: Reservation;
}

export interface Receipt {
  receiptId: string;
  receiptNumber: string;
  issueDate: string;
  totalAmount: number;
  payment: Payment;
}

export interface Vehicle {
  vehicleId: string;
  model: string;
  type: string;
  plateNumber: string;
  customer: Customer;
}

export interface Entry {
  entryId: string;
  entryTime: string;
  vehicle: Vehicle;
  reservation: Reservation;
}

export interface Exit {
  exitId: string;
  exitTime: string;
  durationMinutes: number;
  entry: Entry;
}

export interface ReservationCheckout {
  reservationId: string;
  paymentId: string;
  receiptId: string;
  receiptNumber: string;
}

export interface AnalyticsSummary {
  occupancyRate: number;
  totalRevenue: number;
  peakHour: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!response.ok) {
    let errMsg = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.message) errMsg = data.message;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }
  return response.json() as Promise<T>;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{
  success: boolean;
  customerId: string;
  name: string;
  email: string;
  message?: string;
}> {
  try {
    return await request<{
      success: boolean;
      customerId: string;
      name: string;
      email: string;
      message?: string;
    }>("/api/account/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch (error: any) {
    return {
      success: false,
      customerId: "",
      name: "",
      email: "",
      message: error.message || "Invalid credentials.",
    };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  telephone: string,
): Promise<{ success: boolean; message: string }> {
  try {
    return await request<{ success: boolean; message: string }>("/api/account/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, telephone }),
    });
  } catch (error: any) {
    return { success: false, message: error.message || "Email already in use." };
  }
}

export async function getAllReservations(): Promise<Reservation[]> {
  return request<Reservation[]>("/api/reservation/all");
}

export async function getCustomerReservations(customerId: string): Promise<Reservation[]> {
  return request<Reservation[]>(`/api/reservation/customer/${customerId}`);
}

export async function createReservation(
  customerID: string,
  spotID: string,
  date: string,
  time: string,
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>("/api/reservation/create", {
    method: "POST",
    body: JSON.stringify({ customerID, spotID, date, time }),
  });
}

export async function cancelReservation(
  reservationID: string,
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>("/api/reservation/cancel", {
    method: "POST",
    body: JSON.stringify({ reservationID }),
  });
}

export async function processPayment(
  reservationId: string,
  paymentMethod: string,
  amount: number,
): Promise<{ success: boolean; message: string; paymentId: string; amount: number }> {
  return request<{ success: boolean; message: string; paymentId: string; amount: number }>(
    "/api/payment/process",
    {
      method: "POST",
      body: JSON.stringify({ reservationId, paymentMethod, amount }),
    },
  );
}

export async function getPaymentByReservation(reservationId: string): Promise<Payment> {
  return request<Payment>(`/api/payment/by-reservation/${reservationId}`);
}

export async function getAllReceipts(): Promise<Receipt[]> {
  return request<Receipt[]>("/api/receipt/all");
}

export async function generateReceipt(paymentId: string): Promise<Receipt> {
  return request<Receipt>("/api/receipt/generate", {
    method: "POST",
    body: JSON.stringify({ paymentId }),
  });
}

export async function verifyReceiptNumber(
  receiptNumber: string,
): Promise<{ valid: boolean; message: string; receipt?: Receipt }> {
  return request<{ valid: boolean; message: string; receipt?: Receipt }>(
    `/api/receipt/verify/${receiptNumber}`,
  );
}

export async function verifyEntry(
  plateNumber: string,
  reservationID: string,
): Promise<{
  success: boolean;
  message: string;
  entryId: string;
  plateNumber: string;
  spotId: string;
}> {
  return request<{
    success: boolean;
    message: string;
    entryId: string;
    plateNumber: string;
    spotId: string;
  }>("/api/entry/verify", {
    method: "POST",
    body: JSON.stringify({ plateNumber, reservationID }),
  });
}

export async function verifyExit(
  entryId: string,
): Promise<{ success: boolean; exitId: string; durationMinutes: number; message?: string }> {
  return request<{ success: boolean; exitId: string; durationMinutes: number; message?: string }>(
    "/api/exit/verify",
    {
      method: "POST",
      body: JSON.stringify({ entryId }),
    },
  );
}

export async function getAllEntries(): Promise<Entry[]> {
  return request<Entry[]>("/api/entry/all");
}

export async function getAllExits(): Promise<Exit[]> {
  return request<Exit[]>("/api/exit/all");
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return request<AnalyticsSummary>("/api/analytics/summary");
}

export async function getAllSpots(): Promise<ParkingSpot[]> {
  return request<ParkingSpot[]>("/api/spots/all");
}

export async function addSpot(spotId: string, location: string): Promise<ParkingSpot> {
  return request<ParkingSpot>("/api/spots/add", {
    method: "POST",
    body: JSON.stringify({ spotId, location }),
  });
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  return request<Vehicle[]>("/api/vehicle/all");
}

export async function addVehicle(
  model: string,
  type: string,
  plateNumber: string,
  customerId: string,
): Promise<{ success: boolean; vehicleId: string }> {
  return request<{ success: boolean; vehicleId: string }>("/api/vehicle/add", {
    method: "POST",
    body: JSON.stringify({ model, type, plateNumber, customerId }),
  });
}
