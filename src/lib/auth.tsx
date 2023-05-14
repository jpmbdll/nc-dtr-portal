import cookies from "next-cookies";

export const checkAuth = async (context: any, cb: any) => {
  const { isAuthenticated, authToken, accessType } = cookies(context);
  const { req } = context;
  const currentPath = req.url;

  if (!Boolean(isAuthenticated) && !authToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (currentPath === "/users" && accessType !== "admin") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return cb({ isAuthenticated });
};
