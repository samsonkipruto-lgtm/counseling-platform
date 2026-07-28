import axiosInstance from "./axiosConfig";

export interface CounselingRecord {
  id: number;
  booking: number;
  counselor: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export async function createRecord(
  bookingId: number,
  notes: string,
): Promise<CounselingRecord> {
  const response = await axiosInstance.post<CounselingRecord>(
    "/records/create/",
    {
      booking_id: bookingId,
      notes,
    },
  );
  return response.data;
}

export async function getRecord(recordId: number): Promise<CounselingRecord> {
  const response = await axiosInstance.get<CounselingRecord>(
    `/records/${recordId}/`,
  );
  return response.data;
}

export async function updateRecord(
  recordId: number,
  notes: string,
): Promise<CounselingRecord> {
  const response = await axiosInstance.put<CounselingRecord>(
    `/records/${recordId}/update/`,
    {
      notes,
    },
  );
  return response.data;
}

export async function getRecordByBooking(
  bookingId: number,
): Promise<CounselingRecord> {
  const response = await axiosInstance.get<CounselingRecord>(
    `/records/by-booking/${bookingId}/`,
  );
  return response.data;
}
