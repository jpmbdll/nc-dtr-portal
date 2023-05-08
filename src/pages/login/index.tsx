import { useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  Center,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import cookies from "next-cookies";
import Image from "next/image";
import Link from "next/link";

import { FormControl, Button } from "@/components";
import { useUser } from "@/hooks";
import { api_url } from "@/data";

export default function Login() {
  const methods = useForm();
  const router = useRouter();
  const { setUser } = useUser();
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
          document.cookie = `user=${JSON.stringify(data?.user)}; path=/`;
          setUser(JSON.stringify(data?.user));
          router.replace("/home");
        },
        onError: () => {
          toast.error(data?.message || "Invalid username and password.");
        },
      });
    },
    [mutation, router, setUser]
  );

  return (
    <VStack
      sx={{
        w: "100vw",
        h: "100vh",
        bgImage: "/bg.png",
        bgRepeat: "no-repeat",
        bgAttachment: "con",
        bgSize: "cover",
      }}
    >
      <VStack>
        <Center mb={5} mt="10%">
          <Image src="/logo.png" alt="logo" width={150} height={150} />
        </Center>
        <Center mb={5}>
          <Heading mb={5}>Norzagaray College Face Recognition DTR</Heading>
        </Center>
        <Card variant="elevated" size="lg" w="40rem">
          <CardHeader px={8} pt={8} pb={0}>
            <Center>
              <Heading size="lg">Login</Heading>
            </Center>
          </CardHeader>
          <CardBody px={8} pt={4} pb={8}>
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
                  <Link href="/forgot-password-phone">Forgot Password?</Link>
                </Text>
                <Button
                  type="submit"
                  label="Login"
                  colorScheme="twitter"
                  w="100%"
                  my={5}
                />
              </form>
            </FormProvider>
          </CardBody>
        </Card>
      </VStack>
    </VStack>
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
