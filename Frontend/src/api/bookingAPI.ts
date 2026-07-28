import axiosInstance from "./axiosConfig";

export interface SessionSlot {
  id: number;
  slot_datetime: string;
  is_available: boolean;
}

export interface Booking {
  id: number;
  alias_code: string;
  slot_datetime: string;
  status: "waiting" | "in-session" | "completed" | "cancelled";
  booked_at: string;
}

export async function getSlots(): Promise<SessionSlot[]> {
  const response = await axiosInstance.get<SessionSlot[]>("/slots/");
  return response.data;
}

export async function getMyBooking(): Promise<Booking | null> {
  const response = await axiosInstance.get<Booking | null>("/my-booking/");
  return response.data;
}

export async function createBooking(slotId: number): Promise<Booking> {
  const response = await axiosInstance.post<Booking>("/book/", {
    slot_id: slotId,
  });
  return response.data;
}

export async function cancelBooking(
  bookingId: number,
): Promise<{ message: string }> {
  const response = await axiosInstance.delete<{ message: string }>(
    `/cancel/${bookingId}/`,
  );
  return response.data;
}

export interface QueueBooking {
  id: number;
  alias_code: string;
  slot_datetime: string;
  status: "waiting" | "in-session" | "completed" | "cancelled";
  booked_at: string;
  real_name: string | null;
}

export async function getQueue(): Promise<QueueBooking[]> {
  const response = await axiosInstance.get<QueueBooking[]>("/queue/");
  return response.data;
}

export async function completeSession(
  bookingId: number,
): Promise<QueueBooking> {
  const response = await axiosInstance.post<QueueBooking>(
    `/complete/${bookingId}/`,
    {},
  );
  return response.data;
}

export async function createSlot(
  counselorId: number,
  slotDatetime: string,
): Promise<SessionSlot> {
  const response = await axiosInstance.post<SessionSlot>("/slots/create/", {
    counselor_id: counselorId,
    slot_datetime: slotDatetime,
  });
  return response.data;
}
