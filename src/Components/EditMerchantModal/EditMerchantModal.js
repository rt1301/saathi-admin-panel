import React, { useEffect } from 'react'
import { Modal, Box, TextInput, Button, NumberInput, Select, Group, Checkbox } from "@mantine/core"
import { useForm } from "@mantine/form";
import { updateMerchant } from '../../api/request';

function EditMerchantModal({ open, setIsOpen, successUpdateMerchant, data }) {
    // console.log(data);
    const handleClose = () => {
        setIsOpen(false);
    }

    const form = useForm({
        initialValues: {
            name: data.name,
            logoUrl: data.logoUrl,
            url: data.url,
            desc: data.desc,
            offerAmt: data.offerAmt,
            offerType: data.offerType,
            status: data.status
        }
        ,
        validate: {
            name: (val) => val.length > 0 ? null : "Invalid Name",
            logoUrl: (val) => val.length > 0 ? null : "Invalid URL",
            url: (val) => val.length > 0 ? null : "Invalid URL",
            desc: (val) => val.length > 0 ? null : "Invalid description",
            offerAmt: (val) => val > 0 ? null : "Invalid Offer",
            offerType: (val) => val.length > 0 ? null : "Invalid Offer Type",
            status: (val) => val.length>0 ? null:"Invalid Status"
        }
    })

    useEffect(() => {
        form.setValues(data);
        return () => {
            form.reset();
        }
    }, [data])
    

    const handleSubmit = async (merchant) => {
        const res = await updateMerchant(merchant, data._id);
        if (res.code === 200) {
            successUpdateMerchant();
        } else {
            setIsOpen(false);
        }
    }
  return (
      <>
          <Modal
              opened={open}
              onClose={handleClose}
              title="Update Merchant"
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
                          label="Merchant Logog URL"
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
                      <Select
                          label="Status"
                          withAsterisk
                          placeholder='Update Status'
                          {...form.getInputProps("status")}
                          data={[
                              { value: "active", label: "Active" },
                              { value: "inactive", label: "Inactive" }
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

export default EditMerchantModal