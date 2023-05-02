import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import cookies from "next-cookies";

import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  Center,
} from "@chakra-ui/react";
import { FormControl, Button } from "@/components";
import { api_url } from "@/data";

export default function ChangePassword() {
  const methods = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });
  const router = useRouter();
  const { handleSubmit } = methods;

  const submit = async (data: any) => {
    try {
      const response = await fetch(`${api_url}/api/ChangePassword`, {
        method: "POST",
        body: JSON.stringify({ ...data }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      if (responseData) {
        toast.success("Successfully changed password");
        router.replace("/login");
      } else {
        toast.error(responseData?.message || "Invalid otp code");
      }
    } catch (error) {
      toast.error(
        "There is an issue processing your request. Please contact your administrator."
      );
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
              <Heading size="lg">Forgot Password</Heading>
            </Center>
          </CardHeader>
          <CardBody px={8} pt={4} pb={8}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(submit)}>
                <FormControl
                  type="password"
                  label="New Password"
                  name="newPassword"
                  isRequired
                />
                <FormControl
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  isRequired
                />
                <Button
                  type="submit"
                  label="Submit"
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
