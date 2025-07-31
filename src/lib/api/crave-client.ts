import axios from "axios";

const STORE_FRONT_API_BASE_URL = process.env.NEXT_PUBLIC_STORE_FRONT_API_URL || "http://localhost:8000";

// SWR fetcher function
export const fetcherSWR = async (
  endPoint: string,
  baseUrl = STORE_FRONT_API_BASE_URL,
) => {
  return handleRequestClientSide(endPoint, undefined, undefined, baseUrl).then(
    (res) => res.data,
  );
};

// Core request handler
async function handleRequestClientSide(
  endPoint: string,
  method = "GET",
  data?: Record<any, any>,
  baseUrl = STORE_FRONT_API_BASE_URL,
) {
  const fullEndpoint = `${baseUrl}${endPoint}`;

  // Get auth token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  return axios({
    method: method,
    url: fullEndpoint,
    ...(data && { data }),
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.NEXT_PUBLIC_CRAVEUP_API_KEY || process.env.NEXT_PUBLIC_API_KEY as string,
      ...(Boolean(token) && { Authorization: `Bearer ${token}` }),
    },
  });
}

// API request methods
export const fetchData = async (
  endPoint: string,
  baseUrl?: string,
) => {
  const response = await handleRequestClientSide(
    endPoint,
    undefined,
    undefined,
    baseUrl,
  );

  return response.data;
};

export const postData = async (
  endpoint: string,
  data: Record<any, any>,
  baseUrl?: string,
) => {
  try {
    const response = await handleRequestClientSide(
      endpoint,
      "POST",
      data,
      baseUrl,
    );

    return response.data;
  } catch (error: any) {
    console.error('POST request failed:', {
      endpoint,
      data,
      error: error.response?.data || error.message,
      status: error.response?.status
    });
    throw error;
  }
};

export const putData = async (
  endpoint: string,
  data: Record<any, any>,
  baseUrl?: string,
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "PUT",
    data,
    baseUrl,
  );
  return response.data;
};

export const patchData = async (
  endpoint: string,
  data: Record<any, any>,
  baseUrl?: string,
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "PATCH",
    data,
    baseUrl,
  );
  return response.data;
};

export const deleteData = async (
  endpoint: string,
  data?: Record<any, any>,
  baseUrl?: string,
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "DELETE",
    data,
    baseUrl,
  );
  return response.data;
};