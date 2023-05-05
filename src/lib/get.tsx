import { toast } from "react-toastify";
import { api_url } from "@/data";

type Props = {
  url: string;
  key: string;
};

export async function get({ url, key }: Props) {
  try {
    const res = await fetch(`${api_url}${url}`, {
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
