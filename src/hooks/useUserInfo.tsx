import { useState, useEffect } from "react";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const saveUser = (user: any) => {
    localStorage.setItem("userInfo", JSON.stringify(user));
    setUserInfo(user);
  };

  const destroyUser = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  return { userInfo, saveUser, destroyUser };
};
