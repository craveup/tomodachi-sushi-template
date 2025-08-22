// utils/images.ts
export const absolutizeImage = (url?: string | null) => {
  if (!url) return null;
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) return url;
  const base =
    process.env.NEXT_PUBLIC_ASSETS_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "";
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
};
