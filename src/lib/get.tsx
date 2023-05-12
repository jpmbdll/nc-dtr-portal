import { toast } from "react-toastify";
import { api_url } from "@/data";

type Props = {
  url: string;
  key: string;
  params?: any;
};

function convertObjectToAPIParams(obj: any) {
  const params = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (Array.isArray(value)) {
        // Handle array values by repeating the parameter with different values
        for (let i = 0; i < value.length; i++) {
          params.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value[i])}`
          );
        }
      } else {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }

  return params.join("&");
}

export async function get({ url, key, params }: Props) {
  let urlPath = `${api_url}${url}`;

  if (params && Object.keys(params).length > 0) {
    const paramString = convertObjectToAPIParams(params);
    urlPath = `${api_url}${url}?${paramString}`;
  }

  try {
    const res = await fetch(urlPath, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      return await res.json();
    } else {
      toast.error(`There was an error fetching ${key}.`);
    }
  } catch {
    toast.error("Internal server error. Please contact administrator.");
  }
}
