import {
  FormControl as ChakraFormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";

export function FormControl(props: FormControlProps) {
  const {
    label,
    isInvalid = false,
    isRequired = false,
    isDisabled = false,
    ...rest
  } = props;
  return (
    <ChakraFormControl
      isInvalid={isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      mb={2}
    >
      <FormLabel fontSize="sm">{label}</FormLabel>
      <Input type="email" value="" onChange={() => {}} />
      {true && <FormErrorMessage>Email is required.</FormErrorMessage>}
    </ChakraFormControl>
  );
}
