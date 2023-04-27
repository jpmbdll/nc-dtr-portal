import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { FormControl, Modal, Button } from "@/components";

type Props = UseDisclosureProps;

export default function ScheduleModal(props: Props) {
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
      title="Add Schedule"
      size="3xl"
      actions={
        <Button
          colorScheme="twitter"
          mr={3}
          onClick={handleSubmit(submit)}
          label="Add Schedule"
        />
      }
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <FormProvider {...methods}>
          <GridItem colSpan={1}>
            <FormControl type="text" name="day" label="Day" />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl type="text" name="subjectCode" label="Subject Code" />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl type="text" name="startTime" label="Start Time" />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl type="text" name="endTime" label="End Time" />
          </GridItem>
        </FormProvider>
      </Grid>
    </Modal>
  );
}
