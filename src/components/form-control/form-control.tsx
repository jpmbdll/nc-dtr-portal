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
import { MdDateRange } from "react-icons/md";
import { BiTime } from "react-icons/bi";

type Props = {
  name: string;
  type: "text" | "password" | "select" | "datepicker";
  options?: { value: string; label: string }[];
  isTimepicker?: boolean;
  validator?: any;
  minDate?: Date;
  maxDate?: Date;
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
    validator,
    minDate = null,
    maxDate = null,
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
    ({ value, onClick, onChange, isTimepicker, isDisabled }: any, ref: any) => (
      <InputGroup onClick={onClick}>
        <Input
          value={value}
          onChange={onChange}
          ref={ref}
          isDisabled={isDisabled}
        />
        <InputRightElement width="3rem">
          <Box onClick={handleClick}>
            {isTimepicker ? (
              <BiTime size="20px" />
            ) : (
              <MdDateRange size="20px" />
            )}
          </Box>
        </InputRightElement>
      </InputGroup>
    )
  );

  switch (type) {
    case "select":
      controlInput = (
        <Select
          placeholder=""
          {...register(name, {
            required: isRequired ? `${label} is required.` : false,
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
          rules={{ required: isRequired ? `${label} is required.` : false }}
          render={({ field }) => (
            <DatePicker
              placeholderText="Select date"
              onChange={(date) => field.onChange(date)}
              selected={field.value}
              showPopperArrow={false}
              showTimeSelect={isTimepicker}
              showTimeSelectOnly={isTimepicker}
              timeIntervals={30}
              timeCaption=""
              dateFormat={isTimepicker ? "h:mm aa" : "MM/dd/yyyy"}
              minDate={minDate ? minDate : null}
              maxDate={maxDate ? maxDate : null}
              customInput={
                <CustomInput
                  isTimepicker={isTimepicker}
                  isDisabled={isReadOnly}
                />
              }
              disabled={isReadOnly}
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
              required: isRequired ? `${label} is required.` : false,
              validate: validator,
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
            required: isRequired ? `${label} is required.` : false,
            validate: validator,
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
      <FormErrorMessage>
        <>{errors[name]?.message}</>
      </FormErrorMessage>
    </ChakraFormControl>
  );
}
