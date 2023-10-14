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

import { CreateDoctorCommissionDto, DoctorCommissionDto, ErrorDto, UpdateDoctorCommissionDto } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class DoctorCommission<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags DoctorCommission
   * @name DoctorCommissionControllerAdd
   * @request POST:/api/doctor-commission
   */
  doctorCommissionControllerAdd = (data: CreateDoctorCommissionDto, params: RequestParams = {}) =>
    this.request<DoctorCommissionDto[], ErrorDto>({
      path: `/api/doctor-commission`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags DoctorCommission
   * @name DoctorCommissionControllerUpdate
   * @request PUT:/api/doctor-commission
   */
  doctorCommissionControllerUpdate = (data: UpdateDoctorCommissionDto, params: RequestParams = {}) =>
    this.request<DoctorCommissionDto, ErrorDto>({
      path: `/api/doctor-commission`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags DoctorCommission
   * @name DoctorCommissionControllerGetById
   * @request GET:/api/doctor-commission/{id}
   */
  doctorCommissionControllerGetById = (id: string, params: RequestParams = {}) =>
    this.request<DoctorCommissionDto, ErrorDto>({
      path: `/api/doctor-commission/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags DoctorCommission
   * @name DoctorCommissionControllerGetAllDoctorsForCentre
   * @request GET:/api/doctor-commission/centre/{centreId}/all
   */
  doctorCommissionControllerGetAllDoctorsForCentre = (centreId: string, params: RequestParams = {}) =>
    this.request<DoctorCommissionDto[], ErrorDto>({
      path: `/api/doctor-commission/centre/${centreId}/all`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags DoctorCommission
   * @name DoctorCommissionControllerGetAllCentresForDoctor
   * @request GET:/api/doctor-commission/centres-by-doctor
   */
  doctorCommissionControllerGetAllCentresForDoctor = (params: RequestParams = {}) =>
    this.request<DoctorCommissionDto[], ErrorDto>({
      path: `/api/doctor-commission/centres-by-doctor`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags DoctorCommission
   * @name DoctorCommissionControllerGet
   * @request GET:/api/doctor-commission/{centreId}/doctor/{doctorId}
   */
  doctorCommissionControllerGet = (centreId: string, doctorId: string, params: RequestParams = {}) =>
    this.request<DoctorCommissionDto[], ErrorDto>({
      path: `/api/doctor-commission/${centreId}/doctor/${doctorId}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
