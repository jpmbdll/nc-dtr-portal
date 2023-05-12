import { useState, useRef } from "react";
import { VStack, Box, Flex, Card } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { createColumn } from "react-chakra-pagination";
import { useQuery } from "react-query";

import { Layout, Table, Button, FormControl } from "@/components";
import { checkAuth, get } from "@/lib";

export default function Reports() {
  const [page, setPage] = useState(0);

  const methods = useForm({
    defaultValues: {
      name: "",
      from: "",
      to: "",
    },
  });

  const {
    data: attendance = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: async () =>
      await get({
        url: `api/Attendance`,
        key: "attendance",
      }),
  });

  const submit = async (data: any) => {
    //Perform search
  };

  const tableData = attendance?.map((report: any) => ({
    id: report.attendanceId,
    date: report.date,
    name: `${report.firstName} ${report.lastName}`,
    employeeType: report.employeeType,
    amArrival: report.timeIn,
    amDeparture: report.timeOut,
    pmArrival: report.timeIn,
    pmDeparture: report.timeOut,
    hours: report.totalHours === null ? 0 : report.totalHours,
    late: report.late,
    undertime: report.undertime,
    minutes: null,
    total: null,
  }));

  const columnHelper = createColumn<(typeof tableData)[0]>();

  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "Id",
    }),
    columnHelper.accessor("date", {
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      header: "Date",
    }),
    columnHelper.accessor("name", {
      cell: (info) => {
        return info.getValue();
      },
      header: "Name",
    }),
    columnHelper.accessor("employeeType", {
      cell: (info) => {
        return info.getValue();
      },
      header: "Emp. Type",
    }),
    columnHelper.accessor("amArrival", {
      cell: (info) => {
        const clockIn = info.getValue();
        if (!clockIn) {
          return "";
        }
        const hours = parseInt(clockIn.slice(0, 2));
        if (hours >= 12) {
          return "";
        } else {
          const ampm = hours < 12 ? "AM" : "PM";
          const formattedHours = hours % 12 || 12;
          const formattedClockIn = `${formattedHours}${clockIn.slice(
            2
          )} ${ampm}`;
          return formattedClockIn;
        }
      },
      header: "Arrival (AM)",
    }),
    columnHelper.accessor("amDeparture", {
      cell: (info) => {
        const clockIn = info.getValue();
        if (!clockIn) {
          return "";
        }
        const hours = parseInt(clockIn.slice(0, 2));
        if (hours >= 12) {
          return "";
        } else {
          const ampm = hours < 12 ? "AM" : "PM";
          const formattedHours = hours % 12 || 12;
          const formattedClockIn = `${formattedHours}${clockIn.slice(
            2
          )} ${ampm}`;
          return formattedClockIn;
        }
      },
      header: "Departure (AM)",
    }),
    columnHelper.accessor("pmArrival", {
      cell: (info) => {
        const clockIn = info.getValue();
        if (!clockIn) {
          return "";
        }
        const hours = parseInt(clockIn.slice(0, 2));
        if (hours < 12) {
          return "";
        } else {
          const ampm = hours >= 12 ? "PM" : "AM";
          const formattedHours = hours % 12 || 12;
          const formattedClockIn = `${formattedHours}${clockIn.slice(
            2
          )} ${ampm}`;
          return formattedClockIn;
        }
      },
      header: "Arrival (PM)",
    }),
    columnHelper.accessor("pmDeparture", {
      cell: (info) => {
        const clockOut = info.getValue();
        if (!clockOut) {
          return "";
        }
        const hours = parseInt(clockOut.slice(0, 2));
        if (hours < 12) {
          return "";
        } else {
          const ampm = hours >= 12 ? "PM" : "AM";
          const formattedHours = hours % 12 || 12;
          const formattedclockOut = `${formattedHours}${clockOut.slice(
            2
          )} ${ampm}`;
          return formattedclockOut;
        }
      },
      header: "Departure (PM)",
    }),
    columnHelper.accessor("hours", {
      cell: (info) => info.getValue(),
      header: "Hours",
    }),

    columnHelper.accessor("minutes", {
      cell: (info) => {
        const totalHours = info.getValue();
        if (!totalHours) {
          return 0;
        }
        const minutes = totalHours.slice(3, 5);
        return `${minutes}`;
      },
      header: "Minutes",
    }),
    columnHelper.accessor("late", {
      cell: (info) => {
        return info.getValue();
      },
      header: "Late",
    }),
    columnHelper.accessor("undertime", {
      cell: (info) => {
        return info.getValue();
      },
      header: "Undertime",
    }),
    columnHelper.accessor("total", {
      cell: (info) => {
        const totalHours = info.getValue();
        if (!totalHours) {
          return "";
        }
        const hours = totalHours.slice(0, 2).replace(/^0+/, "") || "0";
        const minutes = totalHours.slice(3, 5);
        return `${hours}:${minutes}`;
      },
      header: "Total Hours",
    }),
  ];

  const printRef: any = useRef();

  return (
    <Layout>
      <VStack w="100%">
        <Card display="flex" flexDirection="row" w="100%" p={5} gap={10}>
          <FormProvider {...methods}>
            <FormControl label="Name" type="text" name="name" />
            <FormControl label="From" type="datepicker" name="from" />
            <FormControl label="To" type="datepicker" name="to" />
            <Flex flexDirection="column-reverse" pb={2}>
              <Button
                label="Search"
                colorScheme="green"
                onClick={methods.handleSubmit(submit)}
              />
            </Flex>
          </FormProvider>
        </Card>
        <Table
          ref={printRef}
          title="DTR Reports"
          data={tableData}
          list={attendance}
          page={page}
          itemsPerPage={6}
          columns={columns}
          setPage={setPage}
          isLoading={isFetching || isLoading}
          actions={
            <Box>
              <Button
                label="Print"
                colorScheme="twitter"
                size="sm"
                onClick={async () => {
                  await get({
                    url: `Attendance/exportAttendance`,
                    key: "attendance",
                  });
                }}
              />
            </Box>
          }
        />
      </VStack>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  return checkAuth(context, ({ isAuthenticated }: any) => {
    return {
      props: { isAuthenticated },
    };
  });
}
