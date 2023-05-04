import { useEffect, useState, useCallback } from "react";
import { api_url } from "@/data";
import { toast } from "react-toastify";

export function useUsers() {
  const [users, setUsers] = useState<any>(null);
  const [errors, setErrors] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api_url}/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (response.ok) {
        setUsers(responseData);
      } else {
        throw Error;
      }
    } catch (error) {
      setErrors(true);
      toast.error("There was an error fetching users.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = () => getUsers();

  const filter = (search: string) => {
    //fetch with parameters
    setUsers(
      users.filter((u: any) => u.fName === search || u.lName === search)
    );
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return { users, refetch, loading, errors, filter };
}
