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

import { ErrorDto, PatientDto, UpdatePatientDto } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Patient<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Patient
   * @name PatientControllerGet
   * @request GET:/api/patient
   */
  patientControllerGet = (
    query: {
      centreId: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<PatientDto[], ErrorDto>({
      path: `/api/patient`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Patient
   * @name PatientControllerUpdate
   * @request PUT:/api/patient
   */
  patientControllerUpdate = (data: UpdatePatientDto, params: RequestParams = {}) =>
    this.request<PatientDto, ErrorDto>({
      path: `/api/patient`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Patient
   * @name PatientControllerGetById
   * @request GET:/api/patient/{id}
   */
  patientControllerGetById = (id: string, params: RequestParams = {}) =>
    this.request<PatientDto, ErrorDto>({
      path: `/api/patient/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
