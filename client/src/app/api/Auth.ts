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
  AuthUserDto,
  CreateUserDto,
  ErrorDto,
  LoginUserDto,
  SuccessDto,
  UserDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Auth<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerRegister
   * @request POST:/api/auth
   */
  authControllerRegister = (data: CreateUserDto, params: RequestParams = {}) =>
    this.request<AuthUserDto, ErrorDto>({
      path: `/api/auth`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerLogout
   * @request DELETE:/api/auth
   */
  authControllerLogout = (params: RequestParams = {}) =>
    this.request<SuccessDto, ErrorDto>({
      path: `/api/auth`,
      method: "DELETE",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerGetDoctors
   * @request GET:/api/auth/all
   */
  authControllerGetDoctors = (params: RequestParams = {}) =>
    this.request<UserDto[], ErrorDto>({
      path: `/api/auth/all`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerLogin
   * @request POST:/api/auth/login
   */
  authControllerLogin = (data: LoginUserDto, params: RequestParams = {}) =>
    this.request<AuthUserDto, ErrorDto>({
      path: `/api/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
