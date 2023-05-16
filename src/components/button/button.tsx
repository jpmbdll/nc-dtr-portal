import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

type Props = {
  label: string;
} & ButtonProps;

export function Button(props: Props) {
  const {
    label,
    colorScheme = "messenger",
    variant = "solid",
    ...rest
  } = props;
  return (
    <ChakraButton colorScheme={colorScheme} variant={variant} {...rest}>
      {label}
    </ChakraButton>
  );
}
