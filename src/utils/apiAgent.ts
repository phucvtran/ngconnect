import Axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { SignInObject, UpdateCreateUserDto } from "../models/User";
import {
  UpdateCreateJobListingDto,
  UpdateCreateListingDto,
} from "../models/Listing";
import { ApiResponse, PaginationResponse } from "./commonTypes";
import { CreateListingRequestDto } from "../models/ListingRequest";

import { store } from "../redux/store";
import { logout, updateAccessToken } from "../redux/userSlice";

export const axios = Axios.create({
  baseURL: process.env["REACT_APP_API_HOST"],
});
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ERR_CANCELED") {
      // ignore abort error
      return new Promise(() => {});
    }

    // call refresh token when it expired
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.data.message === "Token expired!" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

      try {
        const refreshToken = localStorage.getItem("refreshToken"); // Retrieve the stored refresh token.

        const response = await axios.post("/users/refresh-token", {
          refreshToken,
        });

        const { accessToken } = response.data;
        // Store the new access tokens.
        store.dispatch(updateAccessToken(accessToken));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log(originalRequest);
        return axios(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error("Token refresh failed:", refreshError);
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // showing error notification
    else return handleResponseErrors(error);
  }
);

const handleResponseErrors = (error: any) => {
  //TODO: Fix navigate to no access
  console.log(error.response);
  if (!error.response) {
    window.notify("error", error.message);
  } else {
    const responseData = error.response;
    let statusCode: number = responseData?.status;
    let message: string = `${responseData?.data?.message}`;

    switch (statusCode) {
      case 400:
        // bad request
        window.notify("error", `Bad Request: ${message}`);

        // email validation error will throw a 400, don't want to push to notfound page in that case
        // NOTE: for some reason message comes in as ['whatever message']... which is annoying
        // if (!message.toString().includes("email")) navigate(`/not-found`);
        break;
      case 401:
        // unauthorized
        window.notify("error", `Unauthorized! ${message}`);
        // navigate(`/noaccess`);
        break;
      case 403:
        // forbidden resource - user isn't in correct role or no token in auth header
        window.notify(
          "error",
          `You might not be logged in or do not have the correct role privileges for this. ${message}`
        );
        // navigate(`/noaccess`);
        break;
      case 404:
        // not found
        window.notify("error", `Not Found: ${message}`);
        if (
          !message.toLowerCase().includes("list") &&
          !message.toLowerCase().includes("field definition")
        ) {
          // if error msg includes 'list' don't want to push to not-found
          // if error msg includes 'field definition' don't want to push to not-found
          // navigate(`/not-found`);
        }

        // we might have other 404 errors not related to user login,
        // so we only want to push noaccess if user not found
        if (
          message?.toLowerCase().includes("no user with id") ||
          message?.toLowerCase().includes("no user with email")
        ) {
          // navigate(`/noaccess`);
        }
        break;
      case 422:
        // we throw 422 errors ('Unprocessable Entity') from the API
        // when something unexpected happens while making calls to/from the db
        window.notify("error", message);
        break;
      case 500:
        // server error
        window.notify("error", `Server Error: ${message}`);
        break;
      case 502:
        // Web server received an invalid response while acting as a gateway or proxy server.
        // means the API is likely not running on the server
        window.notify("error", "API may be down");
        // navigate(`/noaccess`);
        break;
      default:
        break;
    }
  }

  return new Promise(() => {});
};

// attach token to private api
const attachToken = (): InternalAxiosRequestConfig<any> => {
  const accessToken = localStorage.getItem("accessToken");

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  } as InternalAxiosRequestConfig<any>;
};

// reusable requests object using generic types
// (passing in request method to the interceptor for PoP token stuff)
const requests = {
  get: <T>(url: string, config?: InternalAxiosRequestConfig<any>) =>
    axios
      .get<T>(url, config ? { ...config, method: "GET" } : { method: "GET" })
      .then(responseBody),
  post: <T>(url: string, body: {}, config?: InternalAxiosRequestConfig<any>) =>
    axios
      .post<T>(
        url,
        body,
        config ? { ...config, method: "POST" } : { method: "POST" }
      )
      .then(responseBody),
  put: <T>(url: string, body: {}, config?: InternalAxiosRequestConfig<any>) =>
    axios
      .put<T>(
        url,
        body,
        config ? { ...config, method: "PUT" } : { method: "PUT" }
      )
      .then(responseBody),
  delete: <T>(url: string) =>
    axios.delete<T>(url, { method: "DELETE" }).then(responseBody),
};

const Auth = {
  login: (body: SignInObject) => requests.post<any>(`/users/login`, body),
  logout: (body: { refreshToken: string }) =>
    requests.post<ApiResponse>(`/users/logout`, body),
};

const Users = {
  createUser: (user: UpdateCreateUserDto) =>
    requests.post<ApiResponse>(`/users/register`, user),
};

const Listings = {
  createJob: (body: UpdateCreateJobListingDto) =>
    requests.post<ApiResponse>(`/listing/job`, body, attachToken()),

  createListing: (body: UpdateCreateListingDto) =>
    requests.post<ApiResponse>(`/listing`, body, attachToken()),

  getAllListings: (params?: string) =>
    requests.get<PaginationResponse>(`/listing?${params ? params : ""}`),

  getListingById: (id: string) => requests.get<any>(`/listing/${id}`),

  getMyListings: (params?: string) =>
    requests.get<PaginationResponse>(
      `/listing/my-listings?${params ? params : ""}`,
      attachToken()
    ),

  updateJob: (id: string, body: UpdateCreateJobListingDto) =>
    requests.put<ApiResponse>(`/listing/job/${id}`, body, attachToken()),

  updateListing: (id: string, body: UpdateCreateListingDto) =>
    requests.put<ApiResponse>(`/listing/${id}`, body, attachToken()),

  uploadListingImage: (listingId: string, body: FormData) => {
    const accessToken = localStorage.getItem("accessToken");
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    } as InternalAxiosRequestConfig<any>;
    requests.post<ApiResponse>(
      `/listing/${listingId}/uploadImage`,
      body,
      header
    );
  },
};

const ListingRequests = {
  createListingRequest: (body: CreateListingRequestDto) =>
    requests.post<ApiResponse>(`/request`, body, attachToken()),

  getRequestsByListingId: (listingId: string, params?: string) =>
    requests.get<PaginationResponse>(
      `/request/by-listing-id/${listingId}?${params ? params : ""}`,
      attachToken()
    ),

  getRequestsByUserId: (userId: string, params?: string) =>
    requests.get<PaginationResponse>(
      `/request/by-user-id/${userId}?${params ? params : ""}`,
      attachToken()
    ),

  getConversationByRequestId: (requestId: string | number, params?: string) =>
    requests.get<PaginationResponse>(
      `/request/conversation/${requestId}?${params ? params : ""}`,
      attachToken()
    ),
};

const apiAgent = {
  Auth,
  Users,
  Listings,
  ListingRequests,
};
export default apiAgent;
