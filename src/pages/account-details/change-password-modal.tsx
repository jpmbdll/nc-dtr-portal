import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";

import { FormControl, Modal, Button } from "@/components";
import { useUser } from "@/hooks";
import { api_url } from "@/data";

type Props = UseDisclosureProps;

export default function ChangePasswordModal(props: Props) {
  const { user } = useUser();
  const { isOpen = false, onClose = () => {} } = props;
  const methods = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { handleSubmit } = methods;

  const submit = async (data: any) => {
    try {
      const response = await fetch(
        `${api_url}/api/ChangePassword/${user.Username}`,
        {
          method: "POST",
          body: JSON.stringify({ ...data }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();

      toast.success("Successfully changed  password!");
    } catch (error) {
      toast.error("There was an error changing password.");
    } finally {
      methods.reset();
      onClose();
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        methods.reset();
        onClose();
      }}
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
            <FormControl
              label="Old Password"
              type="password"
              name="oldPassword"
              isRequired
            />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl
              label="New Password"
              type="password"
              name="newPassword"
              isRequired
            />
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              isRequired
            />
          </GridItem>
        </FormProvider>
      </Grid>
    </Modal>
  );
}
