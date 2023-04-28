import { ReactNode, forwardRef } from "react";
import {
  Card as ChakraCard,
  CardProps,
  CardBody,
  CardHeader,
  Stack,
  StackDivider,
  Heading,
} from "@chakra-ui/react";

type Props = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
} & CardProps;

// eslint-disable-next-line react/display-name
export const Card = forwardRef((props: Props, ref: any) => {
  const { title, children, actions = null, ...rest } = props;
  return (
    <ChakraCard {...rest}>
      <Stack
        divider={<StackDivider m="0 !important" />}
        spacing={1}
        mx={5}
        ref={ref}
      >
        <CardHeader px={0} py={4} display="flex" justifyContent="space-between">
          <Heading size="md">{title}</Heading>
          {actions}
        </CardHeader>
        <CardBody px={0} py={4}>
          {children}
        </CardBody>
      </Stack>
    </ChakraCard>
  );
});
