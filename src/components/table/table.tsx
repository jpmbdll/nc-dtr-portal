import { ReactNode, forwardRef } from "react";
import { Box } from "@chakra-ui/react";
import { Table as ChakraTable } from "react-chakra-pagination";
import { Card, Spinner } from "@/components";

type Props = {
  title: string;
  actions?: ReactNode;
  list: any;
  page: number;
  columns: any;
  data: any;
  setPage: any;
  itemsPerPage?: number;
  isLoading?: boolean;
};

// eslint-disable-next-line react/display-name
export const Table = forwardRef((props: Props, ref: any) => {
  const {
    title,
    actions,
    list,
    columns,
    data,
    setPage,
    itemsPerPage = 8,
    isLoading = true,
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
          overflowX: "auto",
        },
        "&  td": { color: "gray.700", fontSize: "sm" },
        "&  th": {
          color: "gray.700",
          fontWeight: "bold",
        },
      }}
      ref={ref}
    >
      {isLoading && <Spinner />}
      {!isLoading && (
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
        />
      )}
    </Card>
  );
});
