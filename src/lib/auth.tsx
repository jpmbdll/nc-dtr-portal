import cookies from "next-cookies";

const adminAccess = ["/users", "/dashboard"];

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

  if (adminAccess.includes(currentPath) && accessType !== "admin") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return cb({ isAuthenticated });
};
