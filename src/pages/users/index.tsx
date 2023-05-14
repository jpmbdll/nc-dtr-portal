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
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { Layout, Table, Button, Dialog, FormControl } from "@/components";
import { get, checkAuth } from "@/lib";
import { useUserInfo } from "@/hooks";
import { api_url } from "@/data";

import UserModal from "./user-modal";

export default function Users() {
  const queryClient = useQueryClient();

  const { userInfo, isAdmin } = useUserInfo();

  const [page, setPage] = useState(0);

  const [selected, setSelected] = useState<any>(null);

  const methods = useForm({
    defaultValues: {
      search: "",
    },
  });

  const {
    data: users = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["users", methods.watch("search")],
    queryFn: async () =>
      await get({
        url: `api/user`,
        key: "users",
        params: {
          ...(methods.watch("search") && { name: methods.watch("search") }),
        },
      }),
    refetchOnWindowFocus: false,
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
    employmentCode: user.employmentCode,
    empDescription: user.empDescription,
    name: `${user.fName} ${user.lName}`,
    email: user.email,
    contact: user.contact,
    hiredDate: user.hiredDate,
    status: user.status,
    action: user,
  }));

  const columnHelper = createColumn<(typeof tableData)[0]>();

  const columns = [
    columnHelper.accessor("userNo", {
      cell: (info) => info.getValue(),
      header: "No",
    }),
    columnHelper.accessor("empDescription", {
      cell: (info) => info.getValue(),
      header: "Employment Type",
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
      cell: (info) => {
        if (info.getValue().username === userInfo.username || !isAdmin()) {
          return null;
        }
        return (
          <Flex justifyContent="space-between">
            <ChakraButton
              colorScheme="yellow"
              size="sm"
              onClick={() => {
                setSelected(info.getValue());
                onOpenAddUser();
              }}
            >
              <BsPencilFill />
            </ChakraButton>
            <ChakraButton
              colorScheme="red"
              size="sm"
              onClick={() => {
                setSelected(info.getValue());
                onConfirmDeleteOpen();
              }}
            >
              <BsFillTrash3Fill />
            </ChakraButton>
          </Flex>
        );
      },
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
          message={`Are you sure you want to delete this user (${selected?.fName} ${selected?.lName})?`} //Add user name
          onCloseCb={() => {
            setSelected(null);
          }}
          onSaveCb={async () => {
            //TODO::convert to mutate
            try {
              const response = await fetch(
                `${api_url}/api/User/${selected.username}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              toast.success("User has been deleted successfully!");
            } catch (error) {
              toast.error("There was an error deleting this user.");
            } finally {
              queryClient.invalidateQueries("users");
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
              isAdmin() ? (
                <Box>
                  <Button
                    label="Add User"
                    colorScheme="twitter"
                    size="sm"
                    onClick={onOpenAddUser}
                  />
                </Box>
              ) : null
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
