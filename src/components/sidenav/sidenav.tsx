import { Box, Flex, Text, Divider, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  BsFillHouseFill,
  BsFillFileBarGraphFill,
  BsFillPeopleFill,
  BsTable,
} from "react-icons/bs";
import { BsFacebook, BsTelephoneFill } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";

import { useUserInfo } from "@/hooks";

export function SideNav() {
  const { route } = useRouter();

  const { isAdmin } = useUserInfo();

  const nav = [
    {
      label: "Home",
      icon: <BsFillHouseFill fontSize={25} />,
      link: "/home",
      enabled: true,
    },
    {
      label: "Dashboards",
      icon: <BsFillFileBarGraphFill fontSize={25} />,
      link: "/dashboard",
      enabled: false,
    },
    {
      label: "Employees",
      icon: <BsFillPeopleFill fontSize={25} />,
      link: "/users",
      enabled: isAdmin(),
    },
    {
      label: isAdmin() ? "Daily Time Report" : "My Reports",
      icon: <BsTable fontSize={25} />,
      link: "/reports",
      enabled: true,
    },
  ];

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      bg="white"
      minW="300px"
      h="100vh"
      p={6}
      pt={20}
      ml="0px !important"
      boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
    >
      <Box>
        {nav.map((n, i) => {
          const isActivated = n.link === route;
          if (n.enabled) {
            return (
              <Link href={n.link} key={i}>
                <Flex
                  justifyContent="center"
                  flexDirection="column"
                  h={14}
                  px={6}
                  w="100%"
                  borderRadius={12}
                  cursor="pointer"
                  fontSize="md"
                  fontWeight="bold"
                  my={3}
                  color={isActivated ? "white" : "gray.700"}
                  bg={isActivated ? "#1DA1F2" : "white"}
                  sx={{ _hover: { bg: "#1DA1F2", color: "white" } }}
                >
                  <Text display="flex" gap={4}>
                    {n.icon} {n.label}
                  </Text>
                </Flex>
              </Link>
            );
          }
        })}
      </Box>
      <Box color="gray.600">
        <Divider sx={{ marginY: "30px !important" }} />
        <Heading size="sm" mb={2}>
          Contact
        </Heading>
        <Text fontSize="xs" display="flex" mb={1}>
          <GoGlobe fontSize={14} />
          &#127; norzagaraycollege.edu.ph
        </Text>
        <Text fontSize="xs" display="flex" mb={1}>
          <BsFacebook fontSize={14} />
          &#127; Norzagaray College, Norzagaray Bulacan
        </Text>
        <Text fontSize="xs" display="flex" mb={1}>
          <BsTelephoneFill fontSize={14} />
          &#127; &#40;461&#41; 699-8071
        </Text>
      </Box>
    </Flex>
  );
}
