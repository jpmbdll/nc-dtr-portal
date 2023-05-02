import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  UseDisclosureProps,
  Grid,
  GridItem,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FormControl, Modal, Button, Table } from "@/components";
import { createColumn } from "react-chakra-pagination";
import { useForm, FormProvider } from "react-hook-form";
import { api_url } from "@/data";
import {
  JobtitleOptions,
  UserSchedule,
  StatusOptions,
  DepartmentOptions,
} from "@/data";
import ScheduleModal from "./schedule-modal";

type Props = {
  selected: {};
  setSelected: any;
  list: any;
  user: any;
} & UseDisclosureProps;

export default function UserModal(props: Props) {
  const {
    isOpen = false,
    onClose = () => {},
    selected,
    setSelected,
    list,
    user,
  } = props;
  const [page, setPage] = useState(0);
  const [schedules, setSchedules] = useState<any>(null);
  const methods = useForm({
    defaultValues: selected ? selected : user,
  });
  const { handleSubmit } = methods;
  const {
    isOpen: isAddScheduleOpen,
    onOpen: onAddScheduleOpen,
    onClose: onAddScheduleClose,
  } = useDisclosure();

  useEffect(() => {
    const getSchedules = async () => {
      try {
        const response = await fetch(`${api_url}/api/Schedule`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();

        setSchedules(responseData);
      } catch (error) {
        toast.error("There was an error fetching schedules.");
      }
    };

    getSchedules();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  const submit = async (data: any) => {
    try {
      const response = await fetch(`${api_url}/api/User/${user.userName}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      toast.success("User has been added/updated successfully!");
    } catch (error) {
      toast.error("There was an error adding/updating this user.");
    } finally {
      methods.reset();
      setSelected(null);
      onClose();
    }
  };

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
          user={user}
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
        actions={
          <Button
            colorScheme={selected ? "yellow" : "twitter"}
            mr={3}
            onClick={handleSubmit(submit)}
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
                <FormControl type="text" name="fname" label="First Name" />
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl type="text" name="mname" label="Middle Name" />
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl type="text" name="lname" label="Last Name" />
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
