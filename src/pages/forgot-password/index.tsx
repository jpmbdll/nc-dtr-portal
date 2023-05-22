import { useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "react-query";
import { CgCheckO } from "react-icons/cg";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import cookies from "next-cookies";

import { FormControl, Button, AuthLayout } from "@/components";
import { VStack, Text, Heading } from "@chakra-ui/react";
import {api_url} from "@/data";

export default function Phone() {
  const [done, setDone] = useState<boolean>(false);
  const router = useRouter();
  const methods = useForm();
  const { handleSubmit } = methods;

  const submit = async (data: any) => {
    const url = `${api_url}/api/user/ForgotPassword/`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data.username),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  };

  const mutation = useMutation(submit);

  const onSubmit = useCallback(async (data: any) => {
    try {
      const url = `${api_url}/api/user/ForgotPassword/`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data.username),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (res.ok) {
        setDone(true);
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      toast.error("An errror occured while retrieving the user credential. Check if your username is correct otherwise, contact your administrator.");
    } finally {
      methods.reset();
    }
  }, []);

  return (
    <AuthLayout header={done ? "" : "Forgot Password"}>
      {done && (
        <VStack spacing={5}>
          <CgCheckO size={90} color="green" />
          <Heading>Success!</Heading>
          <Text>We have successfully sent you an email.</Text>
          <Button
            type="submit"
            label="Back to login"
            colorScheme="twitter"
            w="100%"
            my={5}
            onClick={() => {
              router.replace("/login");
            }}
          />
        </VStack>
      )}
      {!done && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              type="text"
              label="Username"
              name="username"
              isRequired
            />

            <Button
              type="submit"
              label="Send"
              colorScheme="twitter"
              isLoading={mutation.isLoading}
              w="100%"
              my={5}
            />
          </form>
        </FormProvider>
      )}
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
