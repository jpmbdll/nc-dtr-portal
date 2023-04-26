export const checkAuth = async (context: any, cb: any) => {
  const isAuthenticated = context.req.headers.cookie;

  if (!Boolean(isAuthenticated)) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return cb({ isAuthenticated });
};
