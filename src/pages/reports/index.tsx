import { useState, useRef } from "react";
import { VStack, Box, Card, Flex } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { createColumn } from "react-chakra-pagination";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { CSVLink } from "react-csv";

import { Layout, Table, Button, FormControl } from "@/components";
import { checkAuth, get } from "@/lib";

export default function Reports() {
  const [page, setPage] = useState(0);

  const methods = useForm({
    defaultValues: {
      name: "",
      fromDate: "",
      toDate: "",
    },
  });

  const {
    data: attendance = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [
      "attendance",
      {
        name: methods.watch("name"),
        fromDate: methods.watch("fromDate"),
        toDate: methods.watch("toDate"),
      },
    ],
    queryFn: async () =>
      await get({
        url: `api/Attendance`,
        key: "attendance",
        params: {
          ...(methods.watch("name") && { name: methods.watch("name") }),
          ...(methods.watch("fromDate") && {
            fromDate: format(new Date(methods.watch("fromDate")), "yyyy-MM-dd"),
          }),
          ...(methods.watch("toDate") && {
            toDate: format(new Date(methods.watch("toDate")), "yyyy-MM-dd"),
          }),
        },
      }),
  });

  const ifAmArrival = (value: any) => {
    const clockIn = value;
    if (!clockIn) {
      return "";
    }
    const hours = parseInt(clockIn.slice(0, 2));
    if (hours >= 12) {
      return "";
    } else {
      const ampm = hours < 12 ? "AM" : "PM";
      const formattedHours = hours % 12 || 12;
      const formattedClockIn = `${formattedHours}${clockIn.slice(2)} ${ampm}`;
      return formattedClockIn;
    }
  };

  const ifAmDeparture = (value: any) => {
    const clockIn = value;
    if (!clockIn) {
      return "";
    }
    const hours = parseInt(clockIn.slice(0, 2));
    if (hours >= 12) {
      return "";
    } else {
      const ampm = hours < 12 ? "AM" : "PM";
      const formattedHours = hours % 12 || 12;
      const formattedClockIn = `${formattedHours}${clockIn.slice(2)} ${ampm}`;
      return formattedClockIn;
    }
  };

  const ifPmArrival = (value: any) => {
    const clockIn = value;
    if (!clockIn) {
      return "";
    }
    const hours = parseInt(clockIn.slice(0, 2));
    if (hours < 12) {
      return "";
    } else {
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedClockIn = `${formattedHours}${clockIn.slice(2)} ${ampm}`;
      return formattedClockIn;
    }
  };

  const ifPmDeparture = (value: any) => {
    const clockOut = value;
    if (!clockOut) {
      return "";
    }
    const hours = parseInt(clockOut.slice(0, 2));
    if (hours < 12) {
      return "";
    } else {
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedclockOut = `${formattedHours}${clockOut.slice(2)} ${ampm}`;
      return formattedclockOut;
    }
  };

  const tableData = attendance?.map((report: any) => {
    return {
      id: report.userNumber,
      date: report.date,
      name: `${report.firstName} ${report.lastName}`,
      employeeType: report.employeeType,
      amArrival: ifAmArrival(report.timeIn),
      amDeparture: ifAmDeparture(report.timeOut),
      pmArrival: ifPmArrival(report.timeIn),
      pmDeparture: ifPmDeparture(report.timeOut),
      hours: report.totalHours === null ? 0 : report.totalHours,
      late: report.late,
      undertime: report.underTime,
      minutes: null,
      total: null,
    };
  });

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
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("employeeType", {
      cell: (info) => info.getValue(),
      header: "Emp. Type",
    }),
    columnHelper.accessor("amArrival", {
      cell: (info) => info.getValue(),
      header: "Arrival (AM)",
    }),
    columnHelper.accessor("amDeparture", {
      cell: (info) => info.getValue(),
      header: "Departure (AM)",
    }),
    columnHelper.accessor("pmArrival", {
      cell: (info) => info.getValue(),
      header: "Arrival (PM)",
    }),
    columnHelper.accessor("pmDeparture", {
      cell: (info) => info.getValue(),
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
            <FormControl label="From" type="datepicker" name="fromDate" />
            <FormControl label="To" type="datepicker" name="toDate" />
            <Flex flexDirection="column-reverse" pb={2}>
              <Button
                label="Clear filters"
                colorScheme="red"
                onClick={() => {
                  methods.reset();
                }}
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
              <CSVLink data={tableData} filename="DTR_report">
                <Button label="Extract" colorScheme="twitter" size="sm" />
              </CSVLink>
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
