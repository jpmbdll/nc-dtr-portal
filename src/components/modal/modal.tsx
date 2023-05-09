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
  scrollable?: boolean;
} & UseDisclosureProps &
  ModalProps;
export function Modal(props: Props) {
  const {
    title,
    isOpen = false,
    onClose = () => {},
    actions = null,
    scrollable = false,
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
        <ModalBody
          px={10}
          sx={{
            ...(scrollable && {
              maxH: "calc(100vh - 300px)",
              overflowY: "auto",
            }),
          }}
        >
          {children}
        </ModalBody>
        <ModalFooter>{actions}</ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
