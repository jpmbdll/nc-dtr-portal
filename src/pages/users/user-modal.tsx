import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { FormControl, Modal, Button } from "@/components";

type Props = UseDisclosureProps;

export default function UserModal(props: Props) {
  const { isOpen = false, onClose = () => {} } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add User"
      size="6xl"
      actions={
        <Button colorScheme="green" mr={3} onClick={onClose} label="Add" />
      }
    >
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={6}>
          <FormControl label="ID No." />
        </GridItem>
        <GridItem colSpan={6}>
          <FormControl label="Job Title" />
        </GridItem>
        <GridItem colSpan={4}>
          <FormControl label="First Name" />
        </GridItem>
        <GridItem colSpan={4}>
          <FormControl label="Middle Name" />
        </GridItem>
        <GridItem colSpan={4}>
          <FormControl label="Last Name" />
        </GridItem>
        <GridItem colSpan={3}>
          <FormControl label="Contact" />
        </GridItem>
        <GridItem colSpan={3}>
          <FormControl label="Email" />
        </GridItem>
        <GridItem colSpan={6}>
          <FormControl label="Address" />
        </GridItem>
        <GridItem colSpan={6}>
          <FormControl label="Password" />
        </GridItem>
        <GridItem colSpan={6}>
          <FormControl label="Status" />
        </GridItem>
        <GridItem colSpan={6}>
          <FormControl label="Department" />
        </GridItem>
        <GridItem colSpan={6}>
          <FormControl label="Address" />
        </GridItem>
      </Grid>
    </Modal>
  );
}
