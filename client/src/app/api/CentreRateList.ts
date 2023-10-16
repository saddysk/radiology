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

import { CreateRateListDto, ErrorDto, RateListDto, UpdateRateListDto } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class CentreRateList<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Centre Rate List
   * @name RateListControllerCreate
   * @request POST:/api/centre/rate-list
   */
  rateListControllerCreate = (data: CreateRateListDto, params: RequestParams = {}) =>
    this.request<RateListDto[], ErrorDto>({
      path: `/api/centre/rate-list`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre Rate List
   * @name RateListControllerUpdate
   * @request PUT:/api/centre/rate-list
   */
  rateListControllerUpdate = (data: UpdateRateListDto, params: RequestParams = {}) =>
    this.request<RateListDto, ErrorDto>({
      path: `/api/centre/rate-list`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre Rate List
   * @name RateListControllerGet
   * @request GET:/api/centre/rate-list/{centreId}/centre
   */
  rateListControllerGet = (centreId: string, params: RequestParams = {}) =>
    this.request<RateListDto[], ErrorDto>({
      path: `/api/centre/rate-list/${centreId}/centre`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre Rate List
   * @name RateListControllerGetById
   * @request GET:/api/centre/rate-list/{id}
   */
  rateListControllerGetById = (id: string, params: RequestParams = {}) =>
    this.request<RateListDto, ErrorDto>({
      path: `/api/centre/rate-list/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
