export function getCartId(keyName: string) {
  if (typeof window !== "undefined") {
    return localStorage.getItem(keyName);
  }

  return "";
}

export function setCartId(keyName: string, cartId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(keyName, cartId);
  }
}

export function removeCartCartId(keyName: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(keyName);
  }
}

// AUTH STORAGE
const keyName = "authToken";

export function getAuthToken() {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(keyName);
  }

  return "";
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    return localStorage.setItem(keyName, token);
  }
}

export function deleteAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(keyName);
  }
}
