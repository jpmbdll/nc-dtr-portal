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
      no: report.no,
      date: report.date,
      name: report.name,
      amArrival: report.clockIn.toLocalTimeString().includes("AM") ? report.clockIn.toLocalTimeString() : '',
      amDeparture: report.clockOut.toLocalTimeString().includes("AM") ? report.clockOut.toLocalTimeString() : '',
      pmArrival: report.clockIn.toLocalTimeString().includes("PM") ? report.clockIn.toLocalTimeString() : '',
      pmDeparture: report.clockOut.toLocalTimeString().includes("PM") ? report.clockOut.toLocalTimeString() : '',
      hours: report.totalHours,
      undertime: report.undertime,
      total: report.totalHours,
    }));

  const columnHelper = createColumn<(typeof tableData)[0]>();

  const columns = [
    columnHelper.accessor("no", {
      cell: (info) => info.getValue(),
      header: "No",
    }),
    columnHelper.accessor("date", {
      cell: (info) => info.getValue(),
      header: "Date",
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name",
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
    columnHelper.accessor("undertime", {
      cell: (info) => info.getValue(),
      header: "Undertime",
    }),
    columnHelper.accessor("total", {
      cell: (info) => info.getValue(),
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
