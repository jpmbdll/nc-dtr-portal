import Image from "next/image";
import { Flex, Heading } from "@chakra-ui/react";
import { Avatar } from "@/components";

export function Nav(props: any) {
  const { user } = props;

  return (
    <Flex
      sx={{
        justifyContent: "space-between",
        w: "100%",
        h: "65px",
        position: " absolute",
        bg: "white",
        top: 0,
        zIndex: 100,
        pl: 8,
        pr: 4,
        py: 2,
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <Flex>
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <Heading
          pl={5}
          size="md"
          color="gray.700"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          Norzagaray College Face Recognition DTR
        </Heading>
      </Flex>
      <Avatar
        name={`${user?.fName} ${user?.lName}`}
        accessType={user.JobTitle || "admin"}
      />
    </Flex>
  );
}
