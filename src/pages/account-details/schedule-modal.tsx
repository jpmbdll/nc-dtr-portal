import { useCallback, useState } from "react";
import { UseDisclosureProps, Grid, GridItem, Box } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { createColumn } from "react-chakra-pagination";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { FormControl, Modal, Button, Table } from "@/components";
import { useUserInfo } from "@/hooks";
import { api_url } from "@/data";
import { get } from "@/lib";

type Props = UseDisclosureProps;

export default function ScheduleModal(props: Props) {
  const queryClient = useQueryClient();
  const { userInfo } = useUserInfo();
  const [page, setPage] = useState(0);
  const { isOpen = false, onClose = () => {} } = props;
  const methods = useForm({
    defaultValues: {
      workDay: "",
      subjectCode: "",
      startTime: "",
      endTime: "",
    },
  });
  const { handleSubmit } = methods;

  const submit = async (data: any) => {
    try {
      const url = `${api_url}/api/Schedule/`;
      const res = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          ...data,
          username: userInfo?.username,
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
  const mutation = useMutation(submit);

  const onSubmit = useCallback(
    (data: any) => {
      mutation.mutate(data, {
        onSuccess: () => {
          toast.success("Successfully added schedule!");
          queryClient.invalidateQueries("schedules");
        },
        onError: () => {
          toast.error("There was an error adding schedule.");
        },
        onSettled: () => {
          methods.reset();
        },
      });
    },
    [mutation, methods, queryClient]
  );

  const {
    data: schedules = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () =>
      await get({
        url: `api/Schedule/${userInfo?.username}`,
        key: "schedules",
      }),
    enabled: Boolean(userInfo),
  });

  const {
    data: codes = [],
    isFetching: isFetchingCodes,
    isLoading: isLoadingCodes,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () =>
      await get({
        url: `api/Subject`,
        key: "subjects",
      }),
  });

  const tableData = schedules?.map((sched: any) => ({
    day: sched.workDay,
    subjectCode: sched.subjectCode,
    startTime: sched.startTime,
    endTime: sched.endTime,
    action: sched,
  }));

  const columnHelper = createColumn<(typeof tableData)[0]>();

  const columns = [
    columnHelper.accessor("day", {
      cell: (info) => info.getValue(),
      header: "Day",
    }),
    columnHelper.accessor("subjectCode", {
      cell: (info) => info.getValue(),
      header: "Subject Code",
    }),
    columnHelper.accessor("startTime", {
      cell: (info) => info.getValue(),
      header: "Start Time",
    }),
    columnHelper.accessor("endTime", {
      cell: (info) => info.getValue(),
      header: "End Time",
    }),
    columnHelper.accessor("action", {
      cell: (info) => {
        return null;
      },
      header: "",
    }),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        methods.reset();
        onClose();
      }}
      title={`${userInfo?.fName} ${userInfo?.lName}'s Schedules`}
      size="3xl"
    >
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
              isReadOnly={isLoading || isFetching}
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
              isReadOnly={
                isFetchingCodes || isLoadingCodes || isLoading || isFetching
              }
              isRequired
            />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl
              isTimepicker={true}
              type="datepicker"
              name="startTime"
              label="Start Time"
              isReadOnly={
                isFetchingCodes || isLoadingCodes || isLoading || isFetching
              }
              isRequired
            />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl
              isTimepicker={true}
              type="datepicker"
              name="endTime"
              label="End Time"
              isReadOnly={
                isFetchingCodes || isLoadingCodes || isLoading || isFetching
              }
              isRequired
            />
          </GridItem>
          <GridItem colSpan={2}>
            <Button
              label="Add Schedule"
              colorScheme="green"
              isDisabled={
                isFetchingCodes || isLoadingCodes || isLoading || isFetching
              }
              w={"100%"}
              onClick={handleSubmit(onSubmit)}
            />
          </GridItem>
        </FormProvider>
      </Grid>
      <Box mt={6}>
        <Table
          title="Schedules"
          data={tableData}
          list={schedules}
          page={page}
          columns={columns}
          isLoading={isFetching || isLoading}
          setPage={setPage}
        />
      </Box>
    </Modal>
  );
}
