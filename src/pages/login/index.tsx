import { useCallback } from "react";
import { Text } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import cookies from "next-cookies";
import Link from "next/link";

import { FormControl, Button, AuthLayout } from "@/components";
import { useUserInfo } from "@/hooks";
import { api_url } from "@/data";

export default function Login() {
  const methods = useForm();
  const router = useRouter();
  const { saveUser } = useUserInfo();
  const { handleSubmit } = methods;

  const login = async (data: any) => {
    const res = await fetch(`${api_url}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();
  };

  const mutation = useMutation(login);

  const onSubmit = useCallback(
    (data: any) => {
      mutation.mutate(data, {
        onSuccess: (data) => {
          document.cookie = "isAuthenticated=true; path=/";
          document.cookie = `authToken=${data?.authToken}; path=/`;
          saveUser(data?.user);
          router.replace("/home");
        },
        onError: () => {
          toast.error(data?.message || "Invalid username and password.");
        },
      });
    },
    [mutation, router, saveUser]
  );

  return (
    <AuthLayout header="Login">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            type="text"
            label="Username"
            name="username"
            isRequired
          />
          <FormControl
            type="password"
            label="Password"
            name="password"
            isRequired={true}
          />

          <Text fontSize="xs" color="blue.400">
            <Link href="/forgot-password">Forgot Password?</Link>
          </Text>
          <Button
            type="submit"
            label="Login"
            isLoading={mutation.isLoading}
            colorScheme="twitter"
            w="100%"
            my={5}
          />
        </form>
      </FormProvider>
    </AuthLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { isAuthenticated, authToken } = cookies(context);
  if (Boolean(isAuthenticated) && authToken) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
