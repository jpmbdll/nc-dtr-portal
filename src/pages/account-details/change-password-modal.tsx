import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { FormControl, Modal, Button } from "@/components";

type Props = {} & UseDisclosureProps;

export default function ChangePasswordModal(props: Props) {
  const { isOpen = false, onClose = () => {} } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      size="lg"
      actions={
        <Button
          mr={3}
          colorScheme="green"
          onClick={onClose}
          label="Change Password"
        />
      }
    >
      <Grid templateColumns="repeat(1, 1fr)" gap={4}>
        <GridItem colSpan={1}>
          <FormControl label="Old Password" />
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl label="New Password" />
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl label="Confirm Password" />
        </GridItem>
      </Grid>
    </Modal>
  );
}
