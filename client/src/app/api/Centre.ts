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

import { CentreDto, CreateCentreDto, ErrorDto, SuccessDto } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Centre<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Centre
   * @name CentreControllerCreate
   * @request POST:/api/centre
   */
  centreControllerCreate = (data: CreateCentreDto, params: RequestParams = {}) =>
    this.request<CentreDto, ErrorDto>({
      path: `/api/centre`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre
   * @name CentreControllerGetAll
   * @request GET:/api/centre
   */
  centreControllerGetAll = (params: RequestParams = {}) =>
    this.request<CentreDto[], ErrorDto>({
      path: `/api/centre`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre
   * @name CentreControllerAddAdmin
   * @request POST:/api/centre/{centreId}/add-admin
   */
  centreControllerAddAdmin = (centreId: string, params: RequestParams = {}) =>
    this.request<SuccessDto, ErrorDto>({
      path: `/api/centre/${centreId}/add-admin`,
      method: "POST",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre
   * @name CentreControllerGetCentres
   * @request GET:/api/centre/all
   */
  centreControllerGetCentres = (params: RequestParams = {}) =>
    this.request<CentreDto[], ErrorDto>({
      path: `/api/centre/all`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre
   * @name CentreControllerGet
   * @request GET:/api/centre/{id}
   */
  centreControllerGet = (id: string, params: RequestParams = {}) =>
    this.request<CentreDto, ErrorDto>({
      path: `/api/centre/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
