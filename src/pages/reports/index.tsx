import { useState, useRef, useEffect } from "react";
import ReactToPrint from "react-to-print";
import { VStack, Box, Flex, Card } from "@chakra-ui/react";
import { Layout, Table, Button, FormControl } from "@/components";
import { api_url } from "@/data";
import { checkAuth } from "@/lib";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { createColumn } from "react-chakra-pagination";

export default function Reports(props: any) {
  const { user } = props;
  const [page, setPage] = useState(0);
  const [attendance, setAttendance] = useState<any>([]);

  const methods = useForm({
    defaultValues: {
      name: "",
      from: "",
      to: "",
    },
  });

  useEffect(() => {
    const getAttendance = async () => {
      try {
        const response = await fetch(`${api_url}/api/Attendance`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();

        setAttendance(responseData);
      } catch (error) {
        toast.error("There was an error fetching reports.");
      }
    };

    getAttendance();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  const submit = async (data: any) => {
    console.log(data);
    //Perform search
  };

  const tableData =
    attendance ||
    [].map((report: any) => ({
      id: report.id,
      date: report.date,
      name: report.name,
      amArrival: report.clockIn,
      amDeparture: report.clockOut,
      pmArrival: report.clockIn,
      pmDeparture: report.pmDeparture,
      hours: report.totalHours === null ? 0 : report.totalHours,
      minutes: report.minutes,
      total: report.total,
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
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("clockIn", {
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
    columnHelper.accessor("clockOut", {
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
    columnHelper.accessor("clockIn", {
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
    columnHelper.accessor("clockOut", {
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
    columnHelper.accessor("totalHours", {
      cell: (info) => {
        const totalHours = info.getValue();
        if (!totalHours) {
          return 0;
        }
        const hours = totalHours.slice(0, 2).replace(/^0+/, "") || "0";
        return `${hours}`;
      },
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
    columnHelper.accessor("totalHours", {
      cell: (info) => {
        const totalHours = info.getValue();
        if (!totalHours) {
          return "";
        }
        const hours = totalHours.slice(0, 2).replace(/^0+/, "") || "0";
        const minutes = totalHours.slice(3, 5);
        return `${hours}:${minutes}`;
      },
      header: "Total",
    }),
  ];

  const printRef: any = useRef();

  return (
    <Layout user={user}>
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
          actions={
            <Box>
              <ReactToPrint
                trigger={() => (
                  <Button label="Print" colorScheme="twitter" size="sm" />
                )}
                content={() => printRef.current}
              />
            </Box>
          }
        />
      </VStack>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  return checkAuth(context, ({ isAuthenticated, user }: any) => {
    return {
      props: { isAuthenticated, user },
    };
  });
}
