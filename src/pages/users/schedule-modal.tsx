import { useCallback } from "react";
import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { FormControl, Modal, Button } from "@/components";
import { api_url } from "@/data";
import { get } from "@/lib";

type Props = { selected: any } & UseDisclosureProps;

export default function ScheduleModal(props: Props) {
  const queryClient = useQueryClient();
  const { isOpen = false, onClose = () => {}, selected } = props;

  const methods = useForm({
    defaultValues: {
      workDay: "",
      subjectCode: "",
      startTime: "",
      endTime: "",
    },
  });
  const { handleSubmit } = methods;

  const submitSchedule = async (data: any) => {
    try {
      const url = `${api_url}/api/Schedule/`;
      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          ...data,
          username: selected.username,
          startTime: format(new Date(data.startTime), "HH:mm"),
          endTime: format(new Date(data.endTime), "HH:mm"),
        }),
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

  const mutation = useMutation(submitSchedule);

  const onSubmit = useCallback(
    (data: any) => {
      mutation.mutate(data, {
        onSuccess: () => {
          toast.success("Schedule has been added successfully!");
          queryClient.invalidateQueries("schedules");
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
    [mutation, onClose, methods, queryClient]
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
              <FormControl
                type="select"
                name="workDay"
                label="Work Day"
                options={[
                  { value: "Monday", label: "Monday" },
                  { value: "Tuesday", label: "Tuesday" },
                  { value: "Wednesday", label: "Wednesday" },
                  { value: "Thursday", label: "Thursday" },
                  { value: "Friday", label: "Friday" },
                  { value: "Saturday", label: "Saturday" },
                ]}
                isRequired
              />
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
                isRequired
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl
                isTimepicker={true}
                type="datepicker"
                name="startTime"
                label="Start Time"
                isRequired
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl
                isTimepicker={true}
                type="datepicker"
                name="endTime"
                label="End Time"
                isRequired
              />
            </GridItem>
          </FormProvider>
        </Grid>
      )}
    </Modal>
  );
}
