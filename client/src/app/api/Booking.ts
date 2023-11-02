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

import { BookingDto, CreateBookingDto, ErrorDto, UpdateBookingDto } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Booking<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Booking
   * @name BookingControllerCreate
   * @request POST:/api/booking
   */
  bookingControllerCreate = (data: CreateBookingDto, params: RequestParams = {}) =>
    this.request<BookingDto, ErrorDto>({
      path: `/api/booking`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Booking
   * @name BookingControllerUpdate
   * @request PUT:/api/booking
   */
  bookingControllerUpdate = (data: UpdateBookingDto, params: RequestParams = {}) =>
    this.request<BookingDto, ErrorDto>({
      path: `/api/booking`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Booking
   * @name BookingControllerGetById
   * @request GET:/api/booking/{id}
   */
  bookingControllerGetById = (id: string, params: RequestParams = {}) =>
    this.request<BookingDto, ErrorDto>({
      path: `/api/booking/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Booking
   * @name BookingControllerGet
   * @request GET:/api/booking/centre/{centreId}
   */
  bookingControllerGet = (centreId: string, params: RequestParams = {}) =>
    this.request<BookingDto[], ErrorDto>({
      path: `/api/booking/centre/${centreId}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
