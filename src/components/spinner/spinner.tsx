import { Flex, Spinner as ChakraSpinner } from "@chakra-ui/react";

export function Spinner() {
  return (
    <Flex justifyContent={"space-around"}>
      <ChakraSpinner
        thickness="6px"
        speed="1s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
}
