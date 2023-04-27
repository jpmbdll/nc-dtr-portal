import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { FormControl, Modal, Button } from "@/components";
import { useForm, FormProvider } from "react-hook-form";

type Props = UseDisclosureProps;

export default function UserModal(props: Props) {
  const { isOpen = false, onClose = () => {} } = props;
  const methods = useForm();
  const { handleSubmit } = methods;

  const submit = async (data: any) => {
    console.log(data);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add User"
      size="6xl"
      actions={
        <Button
          colorScheme="green"
          mr={3}
          onClick={handleSubmit(submit)}
          label="Add"
        />
      }
    >
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <FormProvider {...methods}>
          <GridItem colSpan={6}>
            <FormControl type="text" name="idNo" label="ID No." />
          </GridItem>
          <GridItem colSpan={6}>
            <FormControl type="text" name="jobTitle" label="Job Title" />
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl type="text" name="firstName" label="First Name" />
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl type="text" name="middleName" label="Middle Name" />
          </GridItem>
          <GridItem colSpan={4}>
            <FormControl type="text" name="lastName" label="Last Name" />
          </GridItem>
          <GridItem colSpan={3}>
            <FormControl type="text" name="contact" label="Contact" />
          </GridItem>
          <GridItem colSpan={3}>
            <FormControl type="text" name="email" label="Email" />
          </GridItem>
          <GridItem colSpan={6}>
            <FormControl type="text" name="address" label="Address" />
          </GridItem>
          <GridItem colSpan={6}>
            <FormControl type="text" name="password" label="Password" />
          </GridItem>
          <GridItem colSpan={6}>
            <FormControl type="text" name="status" label="Status" />
          </GridItem>
          <GridItem colSpan={6}>
            <FormControl type="text" name="department" label="Department" />
          </GridItem>
        </FormProvider>
      </Grid>
    </Modal>
  );
}
