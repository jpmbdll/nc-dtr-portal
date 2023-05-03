import { useEffect, useState } from "react";
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
import { api_url } from "@/data";
import { checkAuth } from "@/lib";

import UserModal from "./user-modal";
import { toast } from "react-toastify";

export default function Users(props: any) {
  const { user } = props;
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState<any>(null);

  const [selected, setSelected] = useState<any>(null);

  const methods = useForm({
    defaultValues: {
      search: "",
    },
  });

  const submit = async (data: any) => {
    setUsers(
      users.filter(
        (u: any) => u.fName === data.search || u.lName === data.search
      )
    );
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

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`${api_url}/api/User`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();

        console.log(JSON.stringify(">>>>>>>>>>>" + responseData));

        setUsers(responseData);
      } catch (error) {
        toast.error("There was an error fetching users.");
      }
    };

    getUsers();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  const tableData =
    users ||
    [].map((user: any) => ({
      userNo: user.userNo,
      role: user.role,
      name: user.name,
      email: user.email,
      contact: user.contact,
      regDate: user.regDate,
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
    columnHelper.accessor("naame", {
      cell: (info) => {
        const { fName, lName } = info.row.original;
        return `${fName} ${lName}`;
      },
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
    columnHelper.accessor("createdAt", {
      cell: (info) => info.getValue(),
      header: "Reg. Date",
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
    <Layout user={user}>
      {!users ? null : (
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
              try {
                const response = await fetch(
                  `${api_url}/api/DeleteUser/${user.userName}`,
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
              user={user}
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
              list={users}
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
        </>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  return checkAuth(context, ({ isAuthenticated, user }: any) => {
    return {
      props: { isAuthenticated, user },
    };
  });
}
