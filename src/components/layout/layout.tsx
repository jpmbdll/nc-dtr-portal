import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import { SideNav, Nav } from "@/components";

type Props = {
  user: any;
  children: ReactNode;
};

export function Layout(props: Props) {
  const { children, user } = props;
  return (
    <Flex bg="gray.100" w="100vw" m={0}>
      <Nav user={user} />
      <SideNav />
      <Flex p={5} pt={20} w="100%">
        {children}
      </Flex>
    </Flex>
  );
}
