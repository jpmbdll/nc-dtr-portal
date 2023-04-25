import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { FormControl, Modal, Button } from "@/components";

type Props = UseDisclosureProps;

export default function ScheduleModal(props: Props) {
  const { isOpen = false, onClose = () => {} } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Schedule"
      size="3xl"
      actions={
        <Button
          colorScheme="green"
          mr={3}
          onClick={onClose}
          label="Add Schedule"
        />
      }
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem colSpan={1}>
          <FormControl label="Day" />
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl label="Subject Code" />
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl label="Start Time" />
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl label="End Time" />
        </GridItem>
      </Grid>
    </Modal>
  );
}
