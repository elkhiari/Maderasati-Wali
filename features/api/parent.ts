import { apiSlice } from "../apiSlices";

// ============= Request/Response Types =============

interface StudentMobileDto {
  id: string;
  firstName: string;
  lastName: string;
  firstNameArab: string;
  lastNameArab: string;
  massarCode: string;
  schoolId: string;
  schoolName: string;
  communeId: number;
}

interface MobileEnvelope<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

interface TripMobileDto {
  id: number;
  name: string;
  circuitId: number;
  circuitName: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  licensePlate: string;
  nbrStudent: number;
  totalStudent: number;
  departure: string;
  arrival: string;
}

interface MobStudentDto {
  id: string;
  firstName: string;
  lastName: string;
  firstNameArab: string;
  lastNameArab: string;
  massarCode: string;
  class: string;
  gender: string;
  birthDate: string;
  email: string;
  photoId: string | null;
  photo: string;
  schoolYear: string;
  status: string;
  endStation: number;
  arrivalStart: string;
  arrivalEnd: string;
  lastPaymentPeriod: string;
  nfcCardID: string;
  nfcCardUID: string;
  nfcCardNumber: string;
  paymentDetails: Payment[];
}

interface MobCircuitDto {
  id: number;
  code: string;
  name: string;
  description: string;
  estimatedDuration: string;
  distance: number;
  mapData: string;
  color: string;
  startStationId: number;
  endStationId: number;
  isActive: boolean;
  startStation: string;
  endStation: string;
}

interface Children {
  student: MobStudentDto;
  circuit: MobCircuitDto;
}

interface PSFamilyDto {
  id: string;
  fullName: string;
  fullNameArab: string;
  email: string;
  phoneNumber: string;
  address: string;
  createdOn: string;
  updatedOn: string;
}

interface ParentDto {
  parent: PSFamilyDto;
  childrens: Children[];
}

interface DocumentBase64Response {
  fileName: string;
  contentType: string;
  base64Content: string;
  fileSize: number;
}

export interface Payment {
  id: string;
  paymentCode: string;
  externalReference: string;
  monthAmount: number;
  details: string | null;
  isMandatory: boolean;
  duetDate: string;
  paymentDate: string;
  agenceCode: string;
  agentCode: string;
  status: "PAID" | "INIT";
}

export const parentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrips: builder.query<TripMobileDto[], void>({
      query: () => "/api/parent/trips",
      transformResponse: (response: MobileEnvelope<TripMobileDto[]>) =>
        response.data,
    }),

    getStudentsByParentId: builder.query<StudentMobileDto[], string>({
      query: (parentId) => `/api/parent/${parentId}/students`,
      transformResponse: (response: MobileEnvelope<StudentMobileDto[]>) =>
        response.data,
    }),

    getCircuitDetails: builder.query<ParentDto, string>({
      query: (parentId) => `/api/parent/${parentId}/circuit/details`,
      transformResponse: (response: MobileEnvelope<ParentDto>) => response.data,
    }),

    getDocumentBase64: builder.query<DocumentBase64Response, string>({
      query: (documentId) => `/api/parent/documents/${documentId}/base64`,
    }),
  }),
});

export const {
  useGetTripsQuery,
  useGetStudentsByParentIdQuery,
  useGetCircuitDetailsQuery,
  useGetDocumentBase64Query,
} = parentApi;
