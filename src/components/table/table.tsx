import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { Table as ChakraTable } from "react-chakra-pagination";
import { Card } from "@/components";

type Props = {
  title: string;
  actions?: ReactNode;
  list: any;
  page: number;
  columns: any;
  data: any;
  setPage: any;
  itemsPerPage?: number;
};

export function Table(props: Props) {
  const {
    title,
    actions,
    list,
    columns,
    data,
    setPage,
    itemsPerPage = 8,
    ...rest
  } = props;
  return (
    <Card
      className="table-container"
      title={title}
      actions={<Box>{actions}</Box>}
      w="100%"
      sx={{
        "&  .chakra-card__body > div": {
          p: "0 !important",
        },
        "&  td": { color: "gray.700", fontSize: "sm" },
        "&  th": {
          color: "gray.700",
          fontWeight: "bold",
        },
        "&  table  tr  td:last-child": {
          px: 0,
          w: 24,
        },
      }}
    >
      <ChakraTable
        itemsPerPage={itemsPerPage}
        colorScheme="twitter"
        emptyData={{
          text: "Nobody is registered here.",
        }}
        totalRegisters={list.length}
        onPageChange={(page) => setPage(page)}
        columns={columns}
        data={data}
        {...rest}
      />
    </Card>
  );
}
