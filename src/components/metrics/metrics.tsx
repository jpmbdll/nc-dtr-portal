import {
  Card,
  Stack,
  CardBody,
  Heading,
  Text,
  Grid,
  GridItem,
  Box,
} from "@chakra-ui/react";

type Props = {
  heading: string;
  count: number;
  icon?: any;
  color?: string;
};
export function Metrics(props: Props) {
  const { heading, count, icon = null, color } = props;

  return (
    <Card
      w="100%"
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
    >
      <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%">
        <GridItem
          colSpan={1}
          bgColor={color}
          p={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {icon}
        </GridItem>
        <GridItem colSpan={2}>
          <Stack>
            <CardBody>
              <Heading size="sm">{heading}</Heading>
              <Text py="2" fontWeight="bold" fontSize={24}>
                {count}
              </Text>
            </CardBody>
          </Stack>
        </GridItem>
      </Grid>
    </Card>
  );
}
