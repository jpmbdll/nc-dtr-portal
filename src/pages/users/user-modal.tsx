import { Fragment, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { createColumn } from "react-chakra-pagination";
import { useMutation } from "react-query";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import {
  UseDisclosureProps,
  Grid,
  GridItem,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

import { FormControl, Modal, Button, Table } from "@/components";
import {
  JobtitleOptions,
  StatusOptions,
  DepartmentOptions,
  api_url,
} from "@/data";
import { useSelectedUser } from "@/hooks";
import { get } from "@/lib";

import ScheduleModal from "./schedule-modal";

type Props = {
  list: any;
} & UseDisclosureProps;

export default function UserModal(props: Props) {
  const { isOpen = false, onClose = () => {}, list } = props;
  const { selected, setSelected } = useSelectedUser();
  const [page, setPage] = useState(0);
  const methods = useForm({
    defaultValues: selected ? selected : {},
  });
  const { handleSubmit } = methods;
  const {
    isOpen: isAddScheduleOpen,
    onOpen: onAddScheduleOpen,
    onClose: onAddScheduleClose,
  } = useDisclosure();

  const submitUser = async (data: any) => {
    const url = selected
      ? `${api_url}/api/User/${selected?.userName}`
      : `${api_url}/api/User/`;
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await res.json();
  };

  const mutation = useMutation(submitUser);

  const onSubmit = useCallback(
    (data: any) => {
      mutation.mutate(data, {
        onSuccess: () => {
          toast.success("User has been added/updated successfully!");
        },
        onError: () => {
          toast.error("There was an error adding/updating this user.");
        },
        onSettled: () => {
          methods.reset();
          setSelected(null);
          onClose();
        },
      });
    },
    [mutation, setSelected, onClose, methods]
  );

  const {
    data: schedules = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () =>
      await get({
        url: `api/Schedules/${selected.userName}`,
        key: "schedules",
      }),
    enabled: Boolean(selected),
  });

  const tableData =
    schedules ||
    [].map((sched: any) => ({
      day: sched.day,
      subjectCode: sched.subjectCode,
      startTime: sched.startTime,
      endTime: sched.endTime,
    }));

  const columnHelper = createColumn<(typeof tableData)[0]>();

  const columns = [
    columnHelper.accessor("workDay", {
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
  ];

  const validateIdNo = (value: any) => {
    if (!/^\d{4}-[A-Z]{2}-\d{4}$/.test(value)) {
      return "ID No. has invalid format.";
    } else {
      if (list.find((l: any) => l.no === value)) {
        return "ID No. is already existing.";
      }
    }
  };

  return (
    <Fragment>
      {isAddScheduleOpen && (
        <ScheduleModal
          isOpen={isAddScheduleOpen}
          onClose={onAddScheduleClose}
        />
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          methods.reset();
          setSelected(null);
          onClose();
        }}
        title="Add User"
        size="6xl"
        scrollable
        actions={
          <Button
            colorScheme={selected ? "yellow" : "twitter"}
            mr={3}
            onClick={handleSubmit(onSubmit)}
            label={selected ? "Edit" : "Add"}
          />
        }
      >
        <VStack spacing={10}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4} w="100%">
            <FormProvider {...methods}>
              <GridItem colSpan={6}>
                <FormControl
                  type="text"
                  name="userNo"
                  label="ID No."
                  validator={validateIdNo}
                  isRequired={true}
                />
              </GridItem>
              <GridItem colSpan={6}>
                <FormControl
                  type="select"
                  name="jobTitle"
                  label="Job Title"
                  options={JobtitleOptions}
                />
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl type="text" name="fName" label="First Name" />
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl type="text" name="mName" label="Middle Name" />
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl type="text" name="lName" label="Last Name" />
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl type="text" name="contact" label="Contact" />
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl type="text" name="email" label="Email" />
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl type="password" name="password" label="Password" />
              </GridItem>
              <GridItem colSpan={6}>
                <FormControl
                  type="select"
                  name="status"
                  label="Status"
                  options={StatusOptions}
                />
              </GridItem>
              <GridItem colSpan={6}>
                <FormControl
                  type="select"
                  name="department"
                  label="Department"
                  options={DepartmentOptions}
                />
              </GridItem>
              <GridItem colSpan={12}>
                <FormControl type="text" name="address" label="Address" />
              </GridItem>
            </FormProvider>
          </Grid>

          <Table
            title="Schedule"
            data={tableData}
            list={schedules}
            page={page}
            columns={columns}
            isLoading={isFetching || isLoading}
            actions={
              <Button
                label="Add Schedule"
                colorScheme="green"
                size="sm"
                onClick={onAddScheduleOpen}
              />
            }
            setPage={setPage}
          />
        </VStack>
      </Modal>
    </Fragment>
  );
}
