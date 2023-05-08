import { ReactNode } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { SideNav, Nav } from "@/components";

type Props = {
  title?: string;
  children: ReactNode;
};

export function Layout(props: Props) {
  const { children, title } = props;
  return (
    <Flex bg="gray.100" w="100vw" m={0}>
      <Nav />
      <SideNav />
      <Flex
        p={5}
        pt={20}
        w="100%"
        flexDirection="column"
        overflowY="auto"
        gap={5}
      >
        {title && <Heading size="lg">{title}</Heading>}
        {children}
      </Flex>
    </Flex>
  );
}
