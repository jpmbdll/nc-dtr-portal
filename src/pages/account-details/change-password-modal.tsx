import { useCallback } from "react";
import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import { FormControl, Modal, Button } from "@/components";
import { useUserInfo } from "@/hooks";
import { api_url } from "@/data";

type Props = UseDisclosureProps;

export default function ChangePasswordModal(props: Props) {
  const { userInfo } = useUserInfo();
  const { isOpen = false, onClose = () => {} } = props;
  const methods = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { handleSubmit } = methods;

  const submitChangePassword = async (data: any) => {
    const res = await fetch(`${api_url}/api/User/ChangePassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: userInfo.username,
        oldPassword: data.oldPassword,
        newPassword: data.confirmPassword,
      }),
    });

    return await res;
  };

  const mutation = useMutation(submitChangePassword);

  const onSubmit = useCallback(
    (data: any) => {
      mutation.mutate(data, {
        onSuccess: () => {
          toast.success("Successfully changed password!");
        },
        onError: () => {
          toast.error("There was an error changing password.");
        },
        onSettled: () => {
          methods.reset();
          onClose();
        },
      });
    },
    [mutation, onClose, methods]
  );

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
          onClick={handleSubmit(onSubmit)}
          isLoading={mutation.isLoading}
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
              validator={(value: any) =>
                methods.watch("newPassword") === value ||
                "Passwords do not match"
              }
              isRequired
            />
          </GridItem>
        </FormProvider>
      </Grid>
    </Modal>
  );
}
