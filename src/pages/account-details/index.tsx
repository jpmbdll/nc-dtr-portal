import { useState, useCallback } from "react";
import {
  VStack,
  Box,
  Grid,
  GridItem,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import { useForm, FormProvider } from "react-hook-form";
import { Layout, FormControl, Button, Card } from "@/components";
import { useUser } from "@/hooks";
import { checkAuth } from "@/lib";
import {
  JobtitleOptions,
  StatusOptions,
  DepartmentOptions,
  api_url,
} from "@/data";

import ChangePasswordModal from "./change-password-modal";

export default function AccountDetails() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const methods = useForm({
    defaultValues: user,
  });
  const { handleSubmit } = methods;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submitUser = async (data: any) => {
    const res = await fetch(`${api_url}/api/User/${user.Username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  };

  const mutation = useMutation(submitUser);

  const onSubmit = useCallback(
    (data: any) => {
      mutation.mutate(data, {
        onSuccess: () => {
          toast.success("Account details saved successfully!");
        },
        onError: () => {
          toast.error("There was an error updating account details.");
        },
        onSettled: () => {
          setIsEditing(false);
        },
      });
    },
    [mutation, setIsEditing]
  );

  return (
    <Layout>
      <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
      <VStack w="100%">
        <Card
          title={"Account Details"}
          actions={
            <Box>
              {!isEditing && (
                <Button
                  label="Edit"
                  colorScheme="yellow"
                  size="sm"
                  mr={3}
                  onClick={() => setIsEditing((state) => !state)}
                />
              )}
              <Button
                label="Change Password"
                colorScheme="twitter"
                size="sm"
                onClick={onOpen}
              />
            </Box>
          }
          w="100%"
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={6}>
                  <FormControl
                    label="ID No."
                    type="text"
                    name="UserNo"
                    isReadOnly={true}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Job Title"
                    type="select"
                    name="JobTitle"
                    options={JobtitleOptions}
                    isReadOnly={true}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="First Name"
                    type="text"
                    name="Fname"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Middle Name"
                    type="text"
                    name="Mname"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Last Name"
                    type="text"
                    name="Lname"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Contact"
                    type="text"
                    name="Contact"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Email"
                    type="text"
                    name="email"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Status"
                    type="select"
                    name="Status"
                    options={StatusOptions}
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Department"
                    type="select"
                    name="Department"
                    options={DepartmentOptions}
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={12}>
                  <FormControl
                    label="Address"
                    type="text"
                    name="Address"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
              </Grid>
              <Flex
                gap={3}
                justifyContent={"flex-end"}
                mt={5}
                hidden={!isEditing}
              >
                <Button
                  type="submit"
                  label="Save"
                  colorScheme="twitter"
                  isLoading={mutation.isLoading}
                />
                <Button
                  label="Cancel"
                  colorScheme="gray"
                  isLoading={mutation.isLoading}
                  onClick={() => setIsEditing(false)}
                />
              </Flex>
            </form>
          </FormProvider>
        </Card>
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
