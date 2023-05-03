import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UseDisclosureProps, Grid, GridItem } from "@chakra-ui/react";
import { FormControl, Modal, Button } from "@/components";
import { toast } from "react-toastify";
import { api_url } from "@/data";

type Props = { user: any } & UseDisclosureProps;

export default function ScheduleModal(props: Props) {
  const { isOpen = false, onClose = () => {}, user } = props;
  const [codes, setCodes] = useState<any>([]);

  const methods = useForm({
    defaultValues: {
      day: "",
      subjectCode: "",
      startTime: "",
      endTime: "",
    },
  });
  const { handleSubmit } = methods;

  const submit = async (data: any) => {
    try {
      const response = await fetch(`${api_url}/api/Schedule/${user.userName}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      toast.success("Schedule has been added successfully!");
    } catch (error) {
      toast.error("There was an error adding this schedule.");
    } finally {
      methods.reset();
      onClose();
    }
  };

  useEffect(() => {
    const getCodes = async () => {
      try {
        const response = await fetch(`${api_url}/api/Subject`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();

        setCodes(
          responseData.map((d: any) => {
            return { value: d.subjectId, label: d.subjectName };
          })
        );
      } catch (error) {
        toast.error("There was an error fetching subject codes.");
      }
    };

    getCodes();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        methods.reset();
        onClose();
      }}
      title="Add Schedule"
      size="3xl"
      actions={
        <Button
          colorScheme="twitter"
          mr={3}
          onClick={handleSubmit(submit)}
          label="Add Schedule"
        />
      }
    >
      {codes && (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <FormProvider {...methods}>
            <GridItem colSpan={1}>
              <FormControl type="text" name="day" label="Day" />
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl
                type="select"
                name="subjectCode"
                label="Subject Code"
                options={codes}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl
                isTimepicker={true}
                type="datepicker"
                name="startTime"
                label="Start Time"
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl
                isTimepicker={true}
                type="datepicker"
                name="endTime"
                label="End Time"
              />
            </GridItem>
          </FormProvider>
        </Grid>
      )}
    </Modal>
  );
}
