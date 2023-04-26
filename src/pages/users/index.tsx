import { useState } from "react";
import {
  Flex,
  Button as ChakraButton,
  VStack,
  useDisclosure,
  Badge,
  Box,
} from "@chakra-ui/react";
import { BsFillTrash3Fill, BsPencilFill } from "react-icons/bs";
import { createColumn } from "react-chakra-pagination";

import { Layout, Table, Button } from "@/components";
import { Users as usersList } from "@/data";
import { checkAuth } from "@/lib";

import UserModal from "./user-modal";

export default function Users() {
  const [page, setPage] = useState(0);

  const {
    isOpen: isOpenAddUser,
    onOpen: onOpenAddUser,
    onClose: onCloseAddUser,
  } = useDisclosure();

  const tableData = usersList.map((user) => ({
    no: user.no,
    role: user.role,
    name: user.name,
    email: user.email,
    contact: user.contact,
    regDate: user.regDate,
    status: user.status,
    action: (
      <Flex justifyContent={"space-between"}>
        <ChakraButton colorScheme="yellow" size="sm" onClick={onOpenAddUser}>
          <BsPencilFill />
        </ChakraButton>
        <ChakraButton colorScheme="red" size="sm">
          <BsFillTrash3Fill />
        </ChakraButton>
      </Flex>
    ),
  }));

  const columnHelper = createColumn<(typeof tableData)[0]>();

  const columns = [
    columnHelper.accessor("no", {
      cell: (info) => info.getValue(),
      header: "No",
    }),
    columnHelper.accessor("role", {
      cell: (info) => info.getValue(),
      header: "Role",
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: "Email",
    }),
    columnHelper.accessor("contact", {
      cell: (info) => info.getValue(),
      header: "Contact",
    }),
    columnHelper.accessor("status", {
      cell: (info) => {
        const value = info.getValue();
        return (
          <Badge colorScheme={value === "active" ? "green" : "red"}>
            {value}
          </Badge>
        );
      },
      header: "Status",
    }),
    columnHelper.accessor("regDate", {
      cell: (info) => info.getValue(),
      header: "Reg. Date",
    }),
    columnHelper.accessor("action", {
      cell: (info) => info.getValue(),
      header: "",
    }),
  ];

  return (
    <Layout>
      <UserModal isOpen={isOpenAddUser} onClose={onCloseAddUser} />
      <VStack w={"100%"}>
        <Table
          title="User Management"
          data={tableData}
          list={usersList}
          page={page}
          columns={columns}
          actions={
            <Box>
              <Button
                label="Add User"
                colorScheme="green"
                size="sm"
                onClick={onOpenAddUser}
              />
            </Box>
          }
          setPage={setPage}
        />
      </VStack>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  return checkAuth(context, ({ isAuthenticated }: any) => {
    return {
      props: { isAuthenticated },
    };
  });
}
