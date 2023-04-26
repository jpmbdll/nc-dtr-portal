//This component must be only used with `Form Provider`

import {
  FormControl as ChakraFormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  type: "text" | "password";
} & FormControlProps;

export function FormControl(props: Props) {
  const { label, name, type, isRequired = false, isDisabled = false } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <ChakraFormControl
      isInvalid={isRequired && Boolean(errors?.[name])}
      isDisabled={isDisabled}
      mb={2}
    >
      <FormLabel fontSize="sm">{label}</FormLabel>
      <Input
        type={type}
        {...register(name, {
          required: isRequired,
        })}
      />
      <FormErrorMessage>{`${label} is required.`}</FormErrorMessage>
    </ChakraFormControl>
  );
}
