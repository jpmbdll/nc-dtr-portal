import React, { useEffect, useState } from "react";
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
import { Layout, Card } from "@/components";
import { Bar } from "react-chartjs-2";
import { VStack, Grid, GridItem } from "@chakra-ui/react";
import { checkAuth } from "@/lib";
import { api_url } from "@/data";
import { toast } from "react-toastify";

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

  const [attendance, setAttendance] = useState<any>([]);

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
        toast.error("There was an error fetching attendance.");
      }
    };

    getAttendance();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

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
