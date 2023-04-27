import {
  Modal as ChakraModal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  UseDisclosureProps,
  Text,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { Button } from "@/components";

type Props = {
  title: string;
  message: string;
  color?: "green" | "red";
  cb: any;
} & UseDisclosureProps;

export function Dialog(props: Props) {
  const {
    title,
    message,
    color = "green",
    isOpen = false,
    onClose = () => {},
    cb,
    ...rest
  } = props;

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody py={5}>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={5}>
            <Button label="Yes" colorScheme={color} onClick={cb} />
            <Button label="No" colorScheme="gray" onClick={onClose} />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
