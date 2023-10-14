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

export interface SuccessDto {
  message: string;
  statusCode: number;
}

export interface AddressDto {
  line1: string;
  line2?: string;
  city: string;
  /** @example 1 */
  postalCode: number;
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
  id: string;
  /** @format date-time */
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  address: AddressDto;
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
