import { useState } from "react";
import {
  VStack,
  Box,
  Grid,
  GridItem,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { Layout, FormControl, Button, Card } from "@/components";
import ChangePasswordModal from "./change-password-modal";

export default function AccountDetails() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
                colorScheme="green"
                size="sm"
                onClick={onOpen}
              />
            </Box>
          }
          w={"100%"}
        >
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={6}>
              <FormControl label="ID No." isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl label="Job Title" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={4}>
              <FormControl label="First Name" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={4}>
              <FormControl label="Middle Name" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={4}>
              <FormControl label="Last Name" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={3}>
              <FormControl label="Contact" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={3}>
              <FormControl label="Email" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl label="Address" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl label="Password" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl label="Status" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl label="Department" isReadOnly={!isEditing} />
            </GridItem>
            <GridItem colSpan={6}>
              <FormControl label="Address" isReadOnly={!isEditing} />
            </GridItem>
          </Grid>
          <Flex justifyContent={"flex-end"} mt={5} hidden={!isEditing}>
            <Button label="Save" colorScheme="green" />
          </Flex>
        </Card>
      </VStack>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}
