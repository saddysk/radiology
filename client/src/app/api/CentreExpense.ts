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

import { CreateExpenseDto, ErrorDto, Expense, ExpenseDto, SuccessDto } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class CentreExpense<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Centre Expense
   * @name ExpenseControllerCreate
   * @request POST:/api/centre/expense
   */
  expenseControllerCreate = (data: CreateExpenseDto, params: RequestParams = {}) =>
    this.request<ExpenseDto, ErrorDto>({
      path: `/api/centre/expense`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre Expense
   * @name ExpenseControllerUpdate
   * @request PUT:/api/centre/expense
   */
  expenseControllerUpdate = (data: Expense, params: RequestParams = {}) =>
    this.request<ExpenseDto, ErrorDto>({
      path: `/api/centre/expense`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre Expense
   * @name ExpenseControllerGetAll
   * @request GET:/api/centre/expense/{centreId}
   */
  expenseControllerGetAll = (centreId: string, params: RequestParams = {}) =>
    this.request<ExpenseDto[], ErrorDto>({
      path: `/api/centre/expense/${centreId}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre Expense
   * @name ExpenseControllerGet
   * @request GET:/api/centre/expense/{centreId}/{id}
   */
  expenseControllerGet = (id: string, centreId: string, params: RequestParams = {}) =>
    this.request<ExpenseDto, ErrorDto>({
      path: `/api/centre/expense/${centreId}/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Centre Expense
   * @name ExpenseControllerDelete
   * @request DELETE:/api/centre/expense/{id}
   */
  expenseControllerDelete = (id: string, params: RequestParams = {}) =>
    this.request<SuccessDto, ErrorDto>({
      path: `/api/centre/expense/${id}`,
      method: "DELETE",
      format: "json",
      ...params,
    });
}
