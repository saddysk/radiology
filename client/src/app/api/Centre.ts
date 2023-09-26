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

import { CentreDto, CreateCentreDto, ErrorDto } from "./data-contracts";
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
}
