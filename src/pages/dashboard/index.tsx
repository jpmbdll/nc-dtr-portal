import React, { useEffect } from "react";
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
import { useQuery } from "react-query";
import { Bar } from "react-chartjs-2";
import { VStack, Grid, GridItem } from "@chakra-ui/react";
import { Layout, Card, Spinner } from "@/components";
import { checkAuth, get } from "@/lib";

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

export default function Dashboard(props: any) {
  const { user } = props;

  const {
    data: attendance = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: async () =>
      await get({
        url: `/api/Attendance`,
        key: "attendance",
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
    <Layout user={user}>
      <VStack w="100%">
        {isFetching || (isLoading && <Spinner />)}
        {!isFetching && !isLoading && <Spinner /> && (
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(2, 1fr)"
            gap={4}
            w="100%"
            maxH="calc(100vh - 100px)"
            overflowY="auto"
          >
            {attendance && (
              <GridItem colSpan={1} rowSpan={1}>
                <Card title="Attendance Graph" w="100%">
                  <Bar options={barOptions} data={data} />
                </Card>
              </GridItem>
            )}
          </Grid>
        )}
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
