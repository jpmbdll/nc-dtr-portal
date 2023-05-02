import Link from "next/link";
import { useRouter } from "next/router";
import {
  Avatar as ChakraAvatar,
  Flex,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuDivider,
} from "@chakra-ui/react";
import { BsFillCaretDownFill, BsPersonFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";

type Props = {
  name: string;
  accessType: string;
};

export function Avatar(props: Props) {
  const { name, accessType } = props;
  const router = useRouter();
  const handleLogout = () => {
    document.cookie =
      "isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.replace("/login");
  };
  return (
    <HStack>
      <ChakraAvatar size="sm" name={name} src="" mr={1} bg="black" />
      <Flex flexDirection="column" justifyContent="center">
        <Text fontWeight="bold" h={5}>
          {name}
        </Text>
        <Text fontSize="xs" color="gray.600" h={5}>
          {accessType}
        </Text>
      </Flex>
      <Menu>
        <MenuButton
          border="none"
          as={IconButton}
          aria-label="Options"
          icon={<BsFillCaretDownFill />}
          variant="outline"
          p={0}
          m="0 !important"
          _hover={{ bg: "white !important" }}
          _active={{ bg: "white !important" }}
        />
        <MenuList>
          <Link href="/account-details">
            <MenuItem icon={<BsPersonFill size={20} />}>
              Account Details
            </MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem icon={<BiLogOut size={20} />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}
