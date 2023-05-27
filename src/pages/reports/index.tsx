import { useState, useRef } from "react";
import { VStack, Card, Flex, HStack } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { createColumn } from "react-chakra-pagination";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { Layout, Table, Button, FormControl } from "@/components";
import { checkAuth, get } from "@/lib";
import { useUserInfo } from "@/hooks";

export default function Reports() {
  const { userInfo, isAdmin } = useUserInfo();
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
        url: isAdmin()
          ? "api/Attendance"
          : `api/Attendance/${userInfo?.username}`,
        key: "attendance",
        params: {
          ...(methods.watch("name") && {
            name: methods.watch("name"),
          }),
          ...(methods.watch("fromDate") && {
            fromDate: format(new Date(methods.watch("fromDate")), "yyyy-MM-dd"),
          }),
          ...(methods.watch("toDate") && {
            toDate: format(new Date(methods.watch("toDate")), "yyyy-MM-dd"),
          }),
        },
      }),
    enabled: Boolean(userInfo),
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
      return "No Out";
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
      return "No Out";
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
      lastName: report.lastName ? report.lastName : "",
      employeeType: report.empDescription,
      amArrival: ifAmArrival(report.timeIn),
      amDeparture: ifAmDeparture(report.timeOut),
      pmArrival: ifPmArrival(report.timeIn),
      pmDeparture: ifPmDeparture(report.timeOut),
      hours: !report.totalHours
        ? "00:00"
        : format(new Date().setHours(report.totalHours, 0), "HH:mm"),
      late: !report.late
        ? "00:00"
        : format(new Date().setHours(report.late, 0), "HH:mm"),
      undertime:
        !report.underTime || report.minute === "0"
          ? "00:00"
          : report.underTime.replace(/\*/g, "0"),
      minutes:
        !report.minute || report.minute === "0"
          ? "00:00"
          : `00:${report.minute}`,
      total: !report.totalHours
        ? "00:00"
        : format(new Date().setHours(report.totalHours, 0), "HH:mm"),
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
      cell: (info) => info.getValue(),
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
      cell: (info) => info.getValue(),
      header: "Total Hours",
    }),
  ];

  const printRef: any = useRef();

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    const table = tableData.map((item: any, index: number) => [
      item.id,
      item.date,
      item.name,
      item.empDescription,
      item.lastName,
      item.amArrival,
      item.amDeparture,
      item.pmArrival,
      item.pmDeparture,
      item.hours,
      item.late,
      item.undertime,
      item.minutes,
      item.total,
    ]);

    table.sort((a: any, b: any) => {
      console.log(a, b);
      const nameA = a[4].toUpperCase();
      const nameB = b[4].toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });

    const headers = [
      [
        "ID",
        "Date",
        "Name",
        "Emp. Type",
        "Arrival (Am)",
        "Departure (Am)",
        "Arrival (Pm)",
        "Departure (Pm)",
        "Hours",
        "Minutes",
        "Late",
        "Undertime",
        "Total Hours",
      ],
    ];

    const tableConfig = {
      startY: methods.watch("fromDate") && methods.watch("toDate") ? 40 : 20,
      margin: { top: 20 },
      head: headers,
      body: table,
    };
    doc.text("Norzagaray College DTR Report", 15, 10);
    doc.setFontSize(10);
    if (methods.watch("fromDate") && methods.watch("toDate")) {
      doc.text(
        `From: ${format(new Date(methods.watch("fromDate")), "mm-dd-yyyy")}`,
        15,
        20
      );
      doc.text(
        `To: ${format(new Date(methods.watch("toDate")), "mm-dd-yyyy")}`,
        15,
        30
      );
    }
    // @ts-ignore
    doc.autoTable(tableConfig);

    doc.save(`DTR Report_${new Date()}.pdf`);
  };
  return (
    <Layout>
      <VStack w="100%">
        <Card display="flex" flexDirection="row" w="100%" p={5} gap={10}>
          <FormProvider {...methods}>
            {isAdmin() && <FormControl label="Name" type="text" name="name" />}
            <FormControl
              label="From"
              type="datepicker"
              name="fromDate"
              maxDate={new Date(methods.watch("toDate"))}
            />
            <FormControl
              label="To"
              type="datepicker"
              name="toDate"
              minDate={new Date(methods.watch("fromDate"))}
            />
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
            <HStack gap={2}>
              <CSVLink data={tableData} filename="DTR_report">
                <Button label="Extract" colorScheme="twitter" size="sm" />
              </CSVLink>
              <Button
                label="Print"
                colorScheme="green"
                size="sm"
                onClick={generatePDF}
              />
            </HStack>
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
