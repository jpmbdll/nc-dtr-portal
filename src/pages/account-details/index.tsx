import { useState, useCallback, useEffect } from "react";
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
import { useUserInfo } from "@/hooks";
import { checkAuth } from "@/lib";
import {
  EmploymentTypeOptions,
  StatusOptions,
  DepartmentOptions,
  api_url,
} from "@/data";

import ChangePasswordModal from "./change-password-modal";
import ScheduleModal from "./schedule-modal";

export default function AccountDetails() {
  const { userInfo, saveUser, isAdmin } = useUserInfo();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const methods = useForm({
    defaultValues: userInfo,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: iSOpenScheduleModal,
    onOpen: onOpenScheduleModal,
    onClose: onCloseScheduleModal,
  } = useDisclosure();

  const submitUser = async (data: any) => {
    try {
      const res = await fetch(`${api_url}/api/User`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error();
      }
      return res;
    } catch (error) {
      throw new Error();
    }
  };

  const mutation = useMutation(submitUser);

  const onSubmit = useCallback(
    (data: any) => {
      mutation.mutate(data, {
        onSuccess: () => {
          toast.success("Account details saved successfully!");
          saveUser(data);
          window.location.reload();
        },
        onError: () => {
          toast.error("There was an error updating account details.");
        },

        onSettled: () => {
          setIsEditing(false);
        },
      });
    },
    [mutation, setIsEditing, saveUser]
  );

  useEffect(() => {
    if (userInfo) {
      methods.setValue("userNo", userInfo.userNo);
      methods.setValue("employmentCode", userInfo.employmentCode);
      methods.setValue("status", userInfo.status);
      methods.setValue("username", userInfo.username);
      methods.setValue("lName", userInfo.lName);
      methods.setValue("mName", userInfo.mName);
      methods.setValue("fName", userInfo.fName);
      methods.setValue("email", userInfo.email);
      methods.setValue("departmentName", userInfo.departmentName);
      methods.setValue("contact", userInfo.contact);
      methods.setValue("address", userInfo.address);
      methods.setValue(
        "hiredDate",
        userInfo.hiredDate ? new Date(userInfo.hiredDate) : ""
      );
    }
  }, [userInfo, methods]);

  return (
    <Layout>
      {isOpen && <ChangePasswordModal isOpen={isOpen} onClose={onClose} />}
      {iSOpenScheduleModal && (
        <ScheduleModal
          isOpen={iSOpenScheduleModal}
          onClose={onCloseScheduleModal}
        />
      )}
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
              {userInfo &&
                (userInfo?.employmentCode === "partTime" || isAdmin()) && (
                  <Button
                    label="Schedules"
                    colorScheme="green"
                    size="sm"
                    mr={3}
                    onClick={onOpenScheduleModal}
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
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Grid templateColumns="repeat(10, 1fr)" gap={4}>
                <GridItem colSpan={4}>
                  <FormControl
                    label="ID No."
                    type="text"
                    name="userNo"
                    isReadOnly={true}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    type="text"
                    name="username"
                    label="Username"
                    isRequired
                    isReadOnly={true}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Employment Type"
                    type="select"
                    name="employmentCode"
                    options={EmploymentTypeOptions}
                    isReadOnly={true}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="First Name"
                    type="text"
                    name="fName"
                    isReadOnly={!isEditing}
                    isRequired
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Middle Name"
                    type="text"
                    name="mName"
                    isReadOnly={!isEditing}
                    isRequired
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Last Name"
                    type="text"
                    name="lName"
                    isReadOnly={!isEditing}
                    isRequired
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Contact"
                    type="text"
                    name="contact"
                    isReadOnly={!isEditing}
                    isRequired
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Email"
                    type="text"
                    name="email"
                    isReadOnly={!isEditing}
                    isRequired
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Hired Date"
                    type="datepicker"
                    name="hiredDate"
                    isReadOnly={!isEditing}
                    isRequired
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Status"
                    type="select"
                    name="status"
                    options={StatusOptions}
                    isReadOnly={!isEditing}
                    isRequired
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Department"
                    type="select"
                    name="departmentName"
                    options={DepartmentOptions}
                    isReadOnly={!isEditing}
                    isRequired
                  />
                </GridItem>
                <GridItem colSpan={12}>
                  <FormControl
                    label="Address"
                    type="text"
                    name="address"
                    isReadOnly={!isEditing}
                    isRequired
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
