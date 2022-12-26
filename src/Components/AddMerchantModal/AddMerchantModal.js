import React from 'react'
import { Modal, Box, TextInput, Button, NumberInput, Select, Group, Checkbox } from "@mantine/core"
import { useForm } from "@mantine/form";
import { createMerchants } from '../../api/request';

function AddMerchantModal({ open, setIsOpen, successAddMerchant }) {
  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  }
  
  const form = useForm({
    initialValues:{
      name: "",
      logoUrl: "",
      url: "",
      desc: "",
      offerAmt: 0,
      offerType: ""
    },
    validate:{
      name: (val)=>val.length>0?null:"Invalid Name",
      logoUrl: (val) => val.length > 0 ? null : "Invalid URL",
      url: (val) => val.length > 0 ? null : "Invalid URL",
      desc: (val) => val.length > 0 ? null : "Invalid description",
      offerAmt: (val) => val >= 0 ? null : "Invalid Offer",
      offerType: (val) => val.length>0 ? null : "Invalid Offer Type"
    }
  })

  const handleSubmit = async (data) => {
    const res = await createMerchants(data);
    if(res.code === 200){
      successAddMerchant();
      handleClose();
    }else{
      handleClose();
    }
  }
  return (
    <>
      <Modal
        opened={open}
        onClose={handleClose}
        title="Add a new Merchant"
        centered
      >
        <Box mx="auto">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              withAsterisk
              label="Merchant Name"
              placeholder='Enter Merchant Name'
              {...form.getInputProps("name")}
            />
            <TextInput
              withAsterisk
              label="Merchant Logo URL"
              placeholder='Enter Logo URL'
              {...form.getInputProps("logoUrl")}
            />
            <TextInput
              withAsterisk
              label="Company's Website"
              placeholder='Enter Website URL'
              {...form.getInputProps("url")}
            />
            <TextInput
              withAsterisk
              label="Description"
              placeholder='Enter Description'
              {...form.getInputProps("desc")}
            />
            <NumberInput
              withAsterisk
              label="Merchant Offer Amount"
              placeholder='Enter Offer Amount'
              min={0}
              parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
              {...form.getInputProps("offerAmt")}
            />
            <Select
              label="Merchant Offer Type"
              withAsterisk
              placeholder='Select Offer Type'
              {...form.getInputProps("offerType")}
              data={[
                { value: "percent", label: "Percentage" },
                { value: "amount", label: "Amount" }
              ]}
            />

            <Group position="left" mt="md">
              <Button variant='outline' type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default AddMerchantModal