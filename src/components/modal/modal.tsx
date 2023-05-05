import { ReactNode } from "react";
import {
  Modal as ChakraModal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  UseDisclosureProps,
  ModalProps,
  Divider,
} from "@chakra-ui/react";

type Props = {
  title: string;
  actions?: ReactNode;
} & UseDisclosureProps &
  ModalProps;
export function Modal(props: Props) {
  const {
    title,
    isOpen = false,
    onClose = () => {},
    actions = null,
    children,
    ...rest
  } = props;

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody px={10} maxH="calc(100vh - 300px)" overflowY="auto">
          {children}
        </ModalBody>
        <ModalFooter>{actions}</ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
