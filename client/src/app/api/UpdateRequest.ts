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

import {
  CreateUpdateRequestDto,
  ErrorDto,
  SuccessDto,
  UpdateRequestDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class UpdateRequest<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Update Request
   * @name UpdateRequestControllerSave
   * @request POST:/api/update-request
   */
  updateRequestControllerSave = (
    data: CreateUpdateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<SuccessDto, ErrorDto>({
      path: `/api/update-request`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Update Request
   * @name UpdateRequestControllerGetById
   * @request GET:/api/update-request/{id}
   */
  updateRequestControllerGetById = (id: string, params: RequestParams = {}) =>
    this.request<UpdateRequestDto, ErrorDto>({
      path: `/api/update-request/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Update Request
   * @name UpdateRequestControllerUpdate
   * @request PUT:/api/update-request/{id}
   */
  updateRequestControllerUpdate = (
    id: string,
    query: {
      status: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<SuccessDto, ErrorDto>({
      path: `/api/update-request/${id}`,
      method: "PUT",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Update Request
   * @name UpdateRequestControllerGet
   * @request GET:/api/update-request/{centreId}/centre
   */
  updateRequestControllerGet = (centreId: string, params: RequestParams = {}) =>
    this.request<UpdateRequestDto[], ErrorDto>({
      path: `/api/update-request/${centreId}/centre`,
      method: "GET",
      format: "json",
      ...params,
    });
}
