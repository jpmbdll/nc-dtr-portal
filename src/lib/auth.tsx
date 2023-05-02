import cookies from "next-cookies";

export const checkAuth = async (context: any, cb: any) => {
  const { isAuthenticated, authToken, user } = cookies(context);
  if (!Boolean(isAuthenticated) && !authToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return cb({ isAuthenticated, user });
};
