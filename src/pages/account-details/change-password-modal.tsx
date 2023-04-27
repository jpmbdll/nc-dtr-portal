import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { FormControl, Modal, Button } from "@/components";
type Props = {} & UseDisclosureProps;

export default function ChangePasswordModal(props: Props) {
  const { isOpen = false, onClose = () => {} } = props;
  const methods = useForm();
  const { handleSubmit } = methods;

  const submit = async (data: any) => {
    console.log(data);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      size="lg"
      actions={
        <Button
          mr={3}
          colorScheme="twitter"
          onClick={handleSubmit(submit)}
          label="Change Password"
        />
      }
    >
      <Grid templateColumns="repeat(1, 1fr)" gap={4}>
        <FormProvider {...methods}>
          <GridItem colSpan={1}>
            <FormControl label="Old Password" type="text" name="oldPassword" />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl label="New Password" type="text" name="newPassword" />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl
              label="Confirm Password"
              type="text"
              name="confirmPassword"
            />
          </GridItem>
        </FormProvider>
      </Grid>
    </Modal>
  );
}
