import { useCallback } from "react";
import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import { FormControl, Modal, Button } from "@/components";
import { useUserInfo } from "@/hooks";
import { api_url } from "@/data";
import { get } from "@/lib";

type Props = { selected: any } & UseDisclosureProps;

export default function ScheduleModal(props: Props) {
  const { isOpen = false, onClose = () => {}, selected } = props;

  const methods = useForm({
    defaultValues: {
      day: "",
      subjectCode: "",
      startTime: "",
      endTime: "",
    },
  });
  const { handleSubmit } = methods;

  const submitSchedule = async (data: any) => {
    const url = `${api_url}/api/Schedule/${selected.username}`;
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  };

  const mutation = useMutation(submitSchedule);

  const onSubmit = useCallback(
    (data: any) => {
      mutation.mutate(data, {
        onSuccess: () => {
          toast.success("Schedule has been added successfully!");
        },
        onError: () => {
          toast.error("There was an error adding this schedule.");
        },
        onSettled: () => {
          methods.reset();
          onClose();
        },
      });
    },
    [mutation, onClose, methods]
  );

  const {
    data: codes = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () =>
      await get({
        url: `api/Subject`,
        key: "subjects",
      }),
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        methods.reset();
        onClose();
      }}
      title="Add Schedule"
      size="3xl"
      actions={
        <Button
          colorScheme="twitter"
          mr={3}
          onClick={handleSubmit(onSubmit)}
          label="Add Schedule"
          isLoading={mutation.isLoading}
        />
      }
    >
      {!isFetching && !isLoading && (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <FormProvider {...methods}>
            <GridItem colSpan={1}>
              <FormControl type="text" name="day" label="Day" />
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl
                type="select"
                name="subjectCode"
                label="Subject Code"
                options={codes.map((c: any) => ({
                  value: c.subjectCode,
                  label: c.description,
                }))}
                isDisabled={isFetching || isLoading}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl
                isTimepicker={true}
                type="datepicker"
                name="startTime"
                label="Start Time"
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl
                isTimepicker={true}
                type="datepicker"
                name="endTime"
                label="End Time"
              />
            </GridItem>
          </FormProvider>
        </Grid>
      )}
    </Modal>
  );
}
