import axios from "axios";
import { getAuthToken } from "./local-storage";
import { STORE_FRONT_API_BASE_URL } from "@/constants";

export const fetcherSWR = async (
  endPoint: string,
  baseUrl = STORE_FRONT_API_BASE_URL
) => {
  return handleRequestClientSide(endPoint, undefined, undefined, baseUrl).then(
    (res) => res.data
  );
};

// REST APIs Request handlers
async function handleRequestClientSide(
  endPoint: string,
  method = "GET",
  data?: Record<any, any>,
  baseUrl = STORE_FRONT_API_BASE_URL
) {
  const fullEndpoint = `${baseUrl}${endPoint}`;

  const token = getAuthToken();

  return axios({
    method: method,
    url: fullEndpoint,
    ...(data && { data }),
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.NEXT_PUBLIC_API_KEY as string,
      ...(Boolean(token) && { Authorization: `Bearer ${token}` }),
    },
  });
}

export const fetchData = async (
  endPoint: string,
  baseUrl?: string,
  revalidateTime?: number
) => {
  const response = await handleRequestClientSide(
    endPoint,
    undefined,
    undefined,
    baseUrl
  );

  return response.data;
};

export const postData = async (
  endpoint: string,
  data: Record<any, any>,
  baseUrl?: string
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "post",
    data,
    baseUrl
  );

  return response.data;
};

export const putData = async (
  endpoint: string,
  data: Record<any, any>,
  baseUrl?: string
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "put",
    data,
    baseUrl
  );
  return response.data;
};

export const patchData = async (
  endpoint: string,
  data: Record<any, any>,
  baseUrl?: string
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "patch",
    data,
    baseUrl
  );
  return response.data;
};

export const deleteData = async (
  endpoint: string,
  data?: Record<any, any>,
  baseUrl?: string
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "delete",
    data,
    baseUrl
  );
  return response.data;
};
