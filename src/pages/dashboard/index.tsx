import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { VStack, Grid, GridItem } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Bar } from "react-chartjs-2";
import { BsFillBuildingFill, BsFillPeopleFill } from "react-icons/bs";

import { Layout, Card, Spinner, Metrics } from "@/components";
import { get, checkAuth } from "@/lib";

ChartJS.register(
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Dashboard() {
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

  const { data: dashboards = [] } = useQuery({
    queryKey: ["dashboards"],
    queryFn: async () =>
      await get({
        url: `api/Dashboard`,
        key: "dashboards",
      }),
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Attendance",
        data: labels.map((label: any) => {
          const filtered = attendance.filter(
            (a: any) => new Date(a.date).getMonth() === labels.indexOf(label)
          );
          return filtered.length;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Layout title="Dashboards">
      {isFetching || (isLoading && <Spinner />)}
      {!isFetching && !isLoading && (
        <VStack spacing={4}>
          <Grid templateColumns="repeat(3, 1fr)" w="100%" gap={4}>
            <GridItem colSpan={1}>
              <Metrics
                heading="Total Departments"
                count={dashboards?.employeeCount}
                color="green.400"
                icon={
                  <BsFillBuildingFill width="100%" color="white" size={56} />
                }
              />
            </GridItem>
            <GridItem colSpan={1}>
              <Metrics
                heading="Total Employees"
                count={dashboards.departmentCount}
                color="blue.400"
                icon={<BsFillPeopleFill width="100%" color="white" size={56} />}
              />
            </GridItem>
          </Grid>
          <VStack w="100%">
            <Card title="Attendance Graph" w="100%">
              <Bar options={barOptions} data={data} height="100px !important" />
            </Card>
          </VStack>
        </VStack>
      )}
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
