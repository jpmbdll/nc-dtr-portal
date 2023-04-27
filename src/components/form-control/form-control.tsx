//This component must be only used with `Form Provider`

import {
  FormControl as ChakraFormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  type: "text" | "password" | "select";
  options?: { value: string; label: string }[];
} & FormControlProps;

export function FormControl(props: Props) {
  const {
    label,
    name,
    type,
    isRequired = false,
    isDisabled = false,
    options = [],
    isReadOnly = false,
  } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  let control = null;

  switch (type) {
    case "select":
      control = (
        <Select
          placeholder="Select option"
          {...register(name, {
            required: isRequired,
          })}
          disabled={isReadOnly}
        >
          {options.map(({ value, label }, index) => (
            <option key={index} value={value}>
              {label}
            </option>
          ))}
        </Select>
      );
      break;
    default:
      control = (
        <Input
          type={type}
          {...register(name, {
            required: isRequired,
          })}
          disabled={isReadOnly}
        />
      );
      break;
  }

  return (
    <ChakraFormControl
      isInvalid={isRequired && Boolean(errors?.[name])}
      isDisabled={isDisabled}
      mb={2}
    >
      <FormLabel fontSize="sm">{label}</FormLabel>
      {control}
      <FormErrorMessage>{`${label} is required.`}</FormErrorMessage>
    </ChakraFormControl>
  );
}
