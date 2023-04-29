import { useState } from "react";
import {
  Flex,
  Button as ChakraButton,
  VStack,
  useDisclosure,
  Badge,
  Box,
  Card,
} from "@chakra-ui/react";
import { BsFillTrash3Fill, BsPencilFill } from "react-icons/bs";
import { createColumn } from "react-chakra-pagination";
import { FormProvider, useForm } from "react-hook-form";

import { Layout, Table, Button, Dialog, FormControl } from "@/components";
import { Users as usersList } from "@/data";
import { checkAuth } from "@/lib";

import UserModal from "./user-modal";
import { toast } from "react-toastify";

export default function Users() {
  const [page, setPage] = useState(0);

  const [selected, setSelected] = useState<any>(null);

  const methods = useForm({
    defaultValues: {
      search: "",
    },
  });

  const submit = async (data: any) => {
    console.log(data);
    //Perform search
  };

  const {
    isOpen: isOpenAddUser,
    onOpen: onOpenAddUser,
    onClose: onCloseAddUser,
  } = useDisclosure();

  const {
    isOpen: isConfirmDeleteOpen,
    onOpen: onConfirmDeleteOpen,
    onClose: onConfirmDeleteClose,
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
        <ChakraButton
          colorScheme="yellow"
          size="sm"
          onClick={() => {
            setSelected(user);
            onOpenAddUser();
          }}
        >
          <BsPencilFill />
        </ChakraButton>
        <ChakraButton
          colorScheme="red"
          size="sm"
          onClick={() => {
            setSelected(user);
            onConfirmDeleteOpen();
          }}
        >
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
      <Dialog
        isOpen={isConfirmDeleteOpen}
        onClose={onConfirmDeleteClose}
        title="Delete User"
        color="red"
        message={`Are you sure you want to delete this user (${selected?.name})?`} //Add user name
        onCloseCb={() => {
          setSelected(null);
        }}
        onSaveCb={() => {
          toast.success("User has been deleted successfully!");
          onConfirmDeleteClose();
          setSelected(null);
        }}
      />
      {isOpenAddUser && (
        <UserModal
          isOpen={isOpenAddUser}
          onClose={onCloseAddUser}
          selected={selected}
          setSelected={setSelected}
        />
      )}
      <VStack w={"100%"}>
        <Card display="flex" flexDirection="row" w="100%" p={5} gap={10}>
          <FormProvider {...methods}>
            <FormControl label="" type="text" name="search" />

            <Flex flexDirection="column-reverse" pb={2}>
              <Button
                label="Search"
                colorScheme="green"
                onClick={methods.handleSubmit(submit)}
              />
            </Flex>
          </FormProvider>
        </Card>
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
                colorScheme="twitter"
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
