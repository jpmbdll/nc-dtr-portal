import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  AbsoluteCenter,
  Text,
  VStack,
  Link,
  Center,
} from "@chakra-ui/react";

import { FormControl, Button } from "@/components";

export default function Login() {
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
            <FormControl label="Username" />
            <FormControl label="Password" />
            <Text fontSize="xs">
              <Link href="#" color="blue.400">
                Forgot Password?
              </Link>
            </Text>
            <Button label="Login" colorScheme="twitter" w="100%" my={5} />
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
  return {
    props: {},
  };
}
