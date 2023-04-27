import { useState } from "react";
import {
  VStack,
  Box,
  Grid,
  GridItem,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { Layout, FormControl, Button, Card } from "@/components";
import ChangePasswordModal from "./change-password-modal";
import { checkAuth } from "@/lib";
import { DepartmentOptions } from "@/data";

export default function AccountDetails() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const methods = useForm();
  const { handleSubmit } = methods;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submit = async (data: any) => {
    console.log(data);
  };

  return (
    <Layout>
      <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
      <VStack w="100%">
        <Card
          title={"Account Details"}
          actions={
            <Box>
              <Button
                label="Edit"
                colorScheme="yellow"
                size="sm"
                mr={3}
                onClick={() => setIsEditing((state) => !state)}
              />
              <Button
                label="Change Password"
                colorScheme="twitter"
                size="sm"
                onClick={onOpen}
              />
            </Box>
          }
          w={"100%"}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submit)}>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={6}>
                  <FormControl
                    label="ID No."
                    type="text"
                    name="idNo"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Job Title"
                    type="text"
                    name="jobTitle"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="First Name"
                    type="text"
                    name="firstName"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Middle Name"
                    type="text"
                    name="middleName"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={4}>
                  <FormControl
                    label="Last Name"
                    type="text"
                    name="lastName"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={3}>
                  <FormControl
                    label="Contact"
                    type="text"
                    name="contact"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={3}>
                  <FormControl
                    label="Email"
                    type="text"
                    name="email"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Address"
                    type="text"
                    name="address"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Password"
                    type="text"
                    name="password"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Status"
                    type="text"
                    name="status"
                    isReadOnly={!isEditing}
                  />
                </GridItem>
                <GridItem colSpan={6}>
                  <FormControl
                    label="Department"
                    type="select"
                    name="department"
                    options={DepartmentOptions}
                    isReadOnly={!isEditing}
                  />
                </GridItem>
              </Grid>
              <Flex justifyContent={"flex-end"} mt={5} hidden={!isEditing}>
                <Button type="submit" label="Save" colorScheme="twitter" />
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
