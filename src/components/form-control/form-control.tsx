//This component must be only used with `Form Provider`
import { forwardRef, useState } from "react";
import {
  FormControl as ChakraFormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  InputGroup,
  Box,
  InputRightElement,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { useFormContext, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

type Props = {
  name: string;
  type: "text" | "password" | "select" | "datepicker";
  options?: { value: string; label: string }[];
  isTimepicker?: boolean;
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
    isTimepicker = false,
  } = props;

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  let controlInput = null;

  // eslint-disable-next-line react/display-name
  const CustomInput = forwardRef(
    ({ value, onClick, onChange }: any, ref: any) => (
      <Input onClick={onClick} value={value} onChange={onChange} ref={ref} />
    )
  );

  switch (type) {
    case "select":
      controlInput = (
        <Select
          placeholder=""
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
    case "datepicker":
      controlInput = (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <DatePicker
              placeholderText="Select date"
              onChange={(date) => field.onChange(date)}
              selected={field.value}
              showPopperArrow={false}
              showTimeSelect={isTimepicker}
              showTimeSelectOnly={isTimepicker}
              timeIntervals={10}
              timeCaption=""
              dateFormat="h:mm aa"
              customInput={<CustomInput />}
            />
          )}
        />
      );
      break;
    case "password":
      controlInput = (
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            {...register(name, {
              required: isRequired,
            })}
            disabled={isReadOnly}
          />
          <InputRightElement width="3rem">
            <Box onClick={handleClick}>
              {show ? (
                <AiOutlineEyeInvisible size="20px" />
              ) : (
                <AiOutlineEye size="20px" />
              )}
            </Box>
          </InputRightElement>
        </InputGroup>
      );
      break;
    default:
      controlInput = (
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
      {controlInput}
      <FormErrorMessage>{`${label} is required.`}</FormErrorMessage>
    </ChakraFormControl>
  );
}
