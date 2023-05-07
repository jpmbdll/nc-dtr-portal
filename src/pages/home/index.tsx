import {
  Text,
  OrderedList,
  UnorderedList,
  ListItem,
  Stack,
  Box,
  Heading,
  StackDivider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Card, Layout } from "@/components";
import { Announcements } from "@/data";
import { checkAuth } from "@/lib";

export default function Home() {
  return (
    <Layout>
      <Grid
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(6, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={1} colSpan={4}>
          <Card title="Vision">
            <Text pt="2" fontSize="sm" fontWeight="bold">
              Norzagaray College envisions itself to transform lives of
              individuals and communities through life-long learning.
            </Text>
          </Card>
        </GridItem>

        <GridItem rowSpan={2} colSpan={2}>
          <Card title="Announcements">
            <Stack divider={<StackDivider />} spacing="4">
              {Announcements.map(
                ({ month, year, isNew, announcements }, index) => (
                  <Box key={index}>
                    <Heading fontSize="sm" display="flex">
                      {isNew && <Text color="red">*</Text>}
                      {month}, {year}
                    </Heading>
                    <UnorderedList fontSize="sm" pl={5} pt={3}>
                      {announcements.map((a, index) => (
                        <ListItem key={index}>{a}</ListItem>
                      ))}
                    </UnorderedList>
                  </Box>
                )
              )}
            </Stack>
          </Card>
        </GridItem>
        <GridItem rowSpan={1} colSpan={4}>
          <Card title="Mission">
            <Text pt="2" fontSize="sm" fontWeight="bold">
              As an institution of Higher Education, we commit ourselves to:
            </Text>
            <OrderedList fontSize="sm" pl={5} pt={3}>
              <ListItem>
                Produce local and global competitive professionals through
                quality, accessible and affordable education
              </ListItem>
              <ListItem>
                Develop the intellectual, physical, physical, social, spiritual,
                cultural and career potential of the individual capable of
                meeting the needs of industry, public service and civilsociety
              </ListItem>
              <ListItem>
                Provide innovative educational environment, opportunities and
                experiences that enable individuals and communities to go,
                thrive and prosper.
              </ListItem>
            </OrderedList>
          </Card>
        </GridItem>
      </Grid>
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
