import Image from "next/image";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import cookies from "next-cookies";

import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  Link,
  Center,
} from "@chakra-ui/react";

import { FormControl, Button } from "@/components";

export default function Login() {
  const methods = useForm();
  const router = useRouter();
  const { handleSubmit } = methods;

  const submit = async (data: any) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ ...data }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      if (
        !responseData?.hasError &&
        responseData?.user &&
        responseData?.user?.authToken
      ) {
        document.cookie = "isAuthenticated=true; path=/";
        document.cookie = `authToken=${responseData?.user?.authToken}; path=/`;
        router.replace("/home");
      } else {
        // has error, no auth data!!!
      }
    } catch (error) {
      // toast error
    }
  };

  return (
    <VStack
      sx={{
        w: "100vw",
        h: "100vh",
        bgColor: "#52ACFF",
        bgImage: "linear-gradient(315deg, #52ACFF 25%, #FFE32C 100%)",
      }}
    >
      <VStack>
        <Center mb={5} mt="20%">
          <Image src="/logo.png" alt="logo" width={150} height={150} />
        </Center>
        <Card variant="elevated" size="lg" w="30rem">
          <CardHeader px={8} pt={8} pb={0}>
            <Center>
              <Heading size="lg">Login</Heading>
            </Center>
          </CardHeader>
          <CardBody px={8} pt={4} pb={8}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(submit)}>
                <FormControl type="text" label="Username" name="username" />
                <FormControl type="password" label="Password" name="password" />

                <Text fontSize="xs">
                  <Link href="#" color="blue.400">
                    Forgot Password?
                  </Link>
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
            <Center>
              <Text fontSize="xs">
                Not a member?{" "}
                <Link href="#" color="blue.400">
                  Sign up now.
                </Link>
              </Text>
            </Center>
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
