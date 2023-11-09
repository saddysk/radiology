/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum UserRole {
  Admin = "admin",
  Receptionist = "receptionist",
  Pr = "pr",
  Doctor = "doctor",
}

export interface CreateUserDto {
  name: string;
  email: string;
  /** @format ^[\d!#$%&*@A-Z^a-z]*$ */
  password: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId?: string;
  role: UserRole;
}

export interface UserDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  name: string;
  email: string;
  /** @format ^[\d!#$%&*@A-Z^a-z]*$ */
  password: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId?: string;
  role: UserRole;
  isFirstLogin?: boolean;
}

export interface AuthUserDto {
  user: UserDto;
  token: string;
}

export interface ErrorDto {
  message: object;
  statusCode: number;
  error: string;
}

export interface ListDto {
  data: object[];
}

export interface LoginUserDto {
  email: string;
  /** @format ^[\d!#$%&*@A-Z^a-z]*$ */
  password: string;
}

export interface UpdateUserDto {
  name?: string;
}

export interface ResetPasswordDto {
  email: string;
  /** @format ^[\d!#$%&*@A-Z^a-z]*$ */
  newPassword: string;
}

export interface SuccessDto {
  message: string;
  statusCode: number;
}

export interface AddressDto {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  state: string;
  country?: string;
}

export interface CreateCentreDto {
  name: string;
  email: string;
  phone: string;
  address: AddressDto;
}

export interface CentreDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  centreNumber: string;
  /** @format date-time */
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  address: AddressDto;
}

export interface UpdateCentreDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: AddressDto;
}

export interface CreateExpenseDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  /** @format date-time */
  date: string;
  /** @example 1 */
  amount: number;
  expenseType: string;
  paymentMethod: string;
  remark?: string;
}

export interface ExpenseDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  /** @format date-time */
  date: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  createdBy: string;
  /** @example 1 */
  amount: number;
  expenseType: string;
  paymentMethod: string;
  remark?: string;
}

export interface UpdateExpenseDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  /** @example 1 */
  amount: number;
  expenseType: string;
  paymentMethod: string;
  remark?: string;
}

export interface InvestigationDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id?: string;
  type: string;
  /** @example 1 */
  amount: number;
  /** @example 1 */
  filmCount: number;
}

export interface RateListDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  modality: string;
  investigation: InvestigationDto[];
}

export interface RateListsDto {
  modality: string;
  investigation: InvestigationDto[];
}

export interface CreateRateListDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  rateLists: RateListsDto[];
}

export interface UpdateRateListDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  investigation: InvestigationDto[];
}

export interface DoctorCommissionDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  doctorId: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  modality: string;
  /** @example 1 */
  amount: number;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  letGo?: boolean;
  doctor?: UserDto;
  centre?: CentreDto;
}

export interface CommissionDto {
  modality: string;
  /** @example 1 */
  amount: number;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
}

export interface CreateDoctorCommissionDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  doctorId: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  letGo?: boolean;
  commissions: CommissionDto[];
}

export interface UpdateDoctorCommissionDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /** @example 1 */
  amount: number;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
}

export interface PatientDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  patientNumber: string;
  /** @format date-time */
  createdAt: string;
  name: string;
  /** @example 1 */
  age: number;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  abhaId?: string;
}

export interface UpdatePatientDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  email?: string;
  address?: string;
  abhaId?: string;
  name?: string;
  /** @example 1 */
  age?: number;
  gender?: string;
  phone?: string;
}

export interface CreatePatientDto {
  name: string;
  /** @example 1 */
  age: number;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  abhaId?: string;
}

export interface BookingPaymentsDto {
  /** @example 1 */
  amount: number;
  paymentType: string;
}

export interface BookingPaymentDto {
  /** @example 1 */
  discount?: number;
  extraCharge?: string;
  payments: BookingPaymentsDto[];
}

export interface CreateBookingDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  consultant: string;
  modality: string;
  investigation: string;
  remark?: string;
  /** @example 1 */
  totalAmount?: number;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  patientId?: string;
  patient?: CreatePatientDto;
  payment: BookingPaymentDto;
  recordFile?: string;
}

export interface BookingRecordDto {
  url: string;
}

export interface PaymentDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /** @format date-time */
  createdAt: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  bookingId: string;
  /** @example 1 */
  amount: number;
  /** @example 1 */
  discount?: number;
  extraCharge?: string;
  paymentType: string;
}

export interface BookingDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  patientId: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  submittedBy: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  consultant: string;
  consultantName: string;
  modality: string;
  investigation: string;
  remark?: string;
  records?: BookingRecordDto[];
  /** @example 1 */
  totalAmount?: number;
  payment?: PaymentDto[];
  patient?: PatientDto;
}

export interface UpdateBookingDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  patientId: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  submittedBy: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  consultant: string;
  modality: string;
  investigation: string;
  remark?: string;
  records?: BookingRecordDto[];
  /** @example 1 */
  totalAmount?: number;
}

export interface UploadRecordDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  recordFile?: string;
}

export enum RequestType {
  Expense = "expense",
  Booking = "booking",
}

export interface CreateUpdateRequestDto {
  type: RequestType;
  expenseData?: ExpenseDto;
  bookingData?: UpdateBookingDto;
}

export enum RequestStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
}

export interface UpdateRequestDto {
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  id: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  centreId: string;
  /** @format date-time */
  createdAt: string;
  /**
   * @format uuid
   * @example "c3611c05-df51-4b47-b601-f2eac02f4ef0"
   */
  requestedBy: string;
  type: RequestType;
  status: RequestStatus;
  expenseData?: ExpenseDto;
  bookingData?: UpdateBookingDto;
}
