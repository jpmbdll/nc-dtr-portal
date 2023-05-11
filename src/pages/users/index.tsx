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
import { FormProvider, useForm } from "react-hook-form";
import { createColumn } from "react-chakra-pagination";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { Layout, Table, Button, Dialog, FormControl } from "@/components";
import { useSelectedUser, useUserInfo } from "@/hooks";
import { checkAuth, get } from "@/lib";
import { api_url } from "@/data";

import UserModal from "./user-modal";

export default function Users() {
  const { userInfo } = useUserInfo();

  const [page, setPage] = useState(0);

  const [selected, setSelected] = useState<any>(null);

  const {
    data: users = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () =>
      await get({
        url: `api/user`,
        key: "users",
      }),
  });

  const methods = useForm({
    defaultValues: {
      search: "",
    },
  });

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

  const tableData = users?.map((user: any) => ({
    userNo: user.userNo,
    role: user.role,
    name: `${user.fName} ${user.lName}`,
    email: user.email,
    contact: user.contact,
    hiredDate: user.hiredDate,
    status: user.status,
  }));

  const columnHelper = createColumn<(typeof tableData)[0]>();

  const columns = [
    columnHelper.accessor("userNo", {
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
    columnHelper.accessor("hiredDate", {
      cell: (info) => info.getValue(),
      header: "Hired Date",
    }),
    columnHelper.accessor("action", {
      cell: (info) => (
        <Flex justifyContent="space-between">
          <ChakraButton
            colorScheme="yellow"
            size="sm"
            onClick={() => {
              setSelected(info.row.original);
              onOpenAddUser();
            }}
          >
            <BsPencilFill />
          </ChakraButton>
          <ChakraButton
            colorScheme="red"
            size="sm"
            onClick={() => {
              setSelected(info.row.original);
              onConfirmDeleteOpen();
            }}
          >
            <BsFillTrash3Fill />
          </ChakraButton>
        </Flex>
      ),
      header: "",
    }),
  ];

  return (
    <Layout>
      <>
        <Dialog
          isOpen={isConfirmDeleteOpen}
          onClose={onConfirmDeleteClose}
          title="Delete User"
          color="red"
          message={`Are you sure you want to delete this user (${selected?.fname} ${selected?.lname})?`} //Add user name
          onCloseCb={() => {
            setSelected(null);
          }}
          onSaveCb={async () => {
            try {
              const response = await fetch(
                `${api_url}/api/DeleteUser/${userInfo.userName}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              const responseData = await response.json();
              toast.success("User has been deleted successfully!");
            } catch (error) {
              toast.error("There was an error deleting this user.");
            } finally {
              onConfirmDeleteClose();
              setSelected(null);
            }
          }}
        />
        {isOpenAddUser && (
          <UserModal
            isOpen={isOpenAddUser}
            onClose={onCloseAddUser}
            selected={selected}
            setSelected={setSelected}
            list={users}
          />
        )}
        <VStack w="100%">
          <Card display="flex" flexDirection="row" w="100%" p={5} gap={10}>
            <FormProvider {...methods}>
              <FormControl label="" type="text" name="search" />

              <Flex flexDirection="column-reverse" pb={2}>
                <Button
                  label="Search"
                  colorScheme="green"
                  onClick={methods.handleSubmit((data: any) => {
                    //filter here
                  })}
                />
              </Flex>
            </FormProvider>
          </Card>
          <Table
            title="User Management"
            data={tableData}
            list={users}
            page={page}
            columns={columns}
            isLoading={isFetching || isLoading}
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
      </>
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
