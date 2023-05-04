import { useEffect, useState } from "react";
import { api_url } from "@/data";
import { toast } from "react-toastify";

export function useUsers() {
  const [users, setUsers] = useState<any>(null);
  const getUsers = async () => {
    try {
      const response = await fetch(`${api_url}/api/User`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      setUsers(responseData);
    } catch (error) {
      toast.error("There was an error fetching users.");
    }
  };

  const refetch = () => {
    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, []);
  return { users, setUsers, getUsers, refetch };
}
