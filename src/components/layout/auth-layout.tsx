import { ReactNode } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  Center,
} from "@chakra-ui/react";

type Props = { header: string; children: ReactNode };

export function AuthLayout(props: Props) {
  const { children, header = "Login" } = props;
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
          <Image src="/nclogo.png" alt="logo" width={150} height={150} />
        </Center>
        <Center mb={5}>
          <Heading mb={5}>Norzagaray College Daily Time Portal</Heading>
        </Center>
        <Card variant="elevated" size="lg" w="40rem">
          {header && (
            <CardHeader px={8} pt={8} pb={0}>
              <Center>
                <Heading size="lg">{header}</Heading>
              </Center>
            </CardHeader>
          )}
          <CardBody px={8} pt={8} pb={8}>
            {children}
          </CardBody>
        </Card>
      </VStack>
    </VStack>
  );
}
