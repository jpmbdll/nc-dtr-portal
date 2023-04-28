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
  onSaveCb: any;
  onCloseCb: any;
} & UseDisclosureProps;

export function Dialog(props: Props) {
  const {
    title,
    message,
    color = "green",
    isOpen = false,
    onClose = () => {},
    onSaveCb,
    onCloseCb,
    ...rest
  } = props;

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={() => {
        onCloseCb();
        onClose();
      }}
      {...rest}
    >
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
            <Button label="Yes" colorScheme={color} onClick={onSaveCb} />
            <Button
              label="No"
              colorScheme="gray"
              onClick={() => {
                onCloseCb();
                onClose();
              }}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
