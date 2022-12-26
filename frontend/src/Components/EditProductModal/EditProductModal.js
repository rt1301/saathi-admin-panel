import React, { useEffect, useState } from 'react'
import { Modal, Box, TextInput, Button, NumberInput, Select, Group, ScrollArea, Grid, Stack } from "@mantine/core"
import { useForm } from "@mantine/form";
import { WithContext as ReactTags } from 'react-tag-input';
import { IconMinus, IconPlus } from '@tabler/icons';
import { updateProduct, getAllMerchants, getOneMerchant } from '../../api/request';
// import './styles.css'

const KeyCodes = {
    comma: 188,
    enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function EditProductModal({ open, setIsOpen, successUpdateProduct, data }) {
    const [tags, setTags] = useState([{
        "Product Tags":"text",
        id:"text"
    }]);
    const [tabs, setTabs] = useState([-1]);
    const [merchants, setMerchants] = useState([]);
    const handleClose = () => {
        setIsOpen(false);
    }
    const form = useForm({
        initialValues: {
            name: "",
            imageUrl: "",
            url: "",
            desc: "",
            offerAmt: 0,
            offerType: "",
            price: 0,
            merchant: "",
            parameters: {}
        },
        validate: {
            name: (val) => val.length > 0 ? null : "Invalid Name",
            imageUrl: (val) => val.length > 0 ? null : "Invalid URL",
            url: (val) => val.length > 0 ? null : "Invalid URL",
            desc: (val) => val.length > 0 ? null : "Invalid description",
            offerAmt: (val) => val >= 0 ? null : "Invalid Offer",
            offerType: (val) => val.length > 0 ? null : "Invalid Offer Type",
            merchant: (val) => val.length > 0 ? null : "Invalid Merchant",
            price: (val) => val >= 0 ? null : "Incorrect Price"
        }
    })

    const fetchCurrentMerchant = async () => {
        try {
            const res = await getOneMerchant(data?.merchant[0]);
            console.log(res);
            if (res.code === 200) {
                form.setFieldValue("merchant",res.data.name);
            } else {
                console.log(res?.err);
            }
        } catch (error) {
            
        }
    }

    const fetchMerchants = async () => {
        try {
            const res = await getAllMerchants();
            if (res.code === 200) {
                let m = [];
                res?.data?.map((ele, id) => {
                    m.push({
                        value: ele.name,
                        label: ele.name
                    });
                })
                setMerchants([...m]);
            } else {
                console.log(res?.err);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const keys = Object.keys(data?.parameters || {});
        const len = keys.length || 1;
        const arr = Array.apply(null, Array(len)).map(function (x, i) { return i; })
        setTabs([...arr]);
        defaultTags();
        fetchCurrentMerchant();
        fetchMerchants();
        form.setValues(data);
        return () => {
            form.reset();
        }
    }, [data])

    const defaultTags = () => {
        const tag = data?.tag;
        let t = [];
        tag?.map((ele,id)=>{
            t.push({
                "Product Tags": ele,
                id: ele
            })
        });

        setTags([...t]);
    }

    const handleDelete = i => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags(newTags);
    };

    const handleTagClick = index => {
        console.log('The tag at index ' + index + ' was clicked');
    };

    const handleSubmit = async (product) => {
        let t = [];
        tags.map((ele) => {
            t.push(ele.id);
        })
        product["tag"] = t;
        const res = await updateProduct(product, data._id);
        if (res.code === 200) {
            successUpdateProduct();
            form.reset();
        } else {
            setIsOpen(false);
        }
    }
    const addTab = (key = 1) => {
        const oldTab = [...tabs];
        oldTab.push(key);
        setTabs([...oldTab]);
    }

    const handleAddParams = (id) => {
        const key = document.getElementById(`update_params_k_${id}`).value;
        const val = document.getElementById(`update_params_v_${id}`).value;
        const params = form.values.parameters;
        params[key] = val;
        form.setFieldValue("parameters", params);
        addTab(id);
    }

    const handleRemoveParams = (id) => {
        const key = document.getElementById(`update_params_k_${id}`).value;
        if (key.length > 0) {
            const params = form.values.parameters;
            if (params[key]) {
                delete params[key]
            }
        }
        const oldTab = [...tabs];
        oldTab.pop();
        setTabs([...oldTab]);
    }
  return (
      <>
          <Modal
              size="lg"
              opened={open}
              onClose={handleClose}
              sx={{ overflowX: "hidden" }}
              title="Add a new Product"
              centered
          >
              <ScrollArea h={400}>
                  <Box mx="auto" sx={{ overflowX: "hidden" }}>
                      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                          <TextInput
                              withAsterisk
                              label="Product Name"
                              placeholder='Enter Product Name'
                              {...form.getInputProps("name")}
                          />
                          <TextInput
                              withAsterisk
                              label="Product Image URL"
                              placeholder='Enter Image URL'
                              {...form.getInputProps("imageUrl")}
                          />
                          <TextInput
                              withAsterisk
                              label="Product's Website"
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
                              label="Product Price"
                              placeholder='Enter Price'
                              min={0}
                              parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                              {...form.getInputProps("price")}
                          />
                          <Stack mt={5}>
                              <label>Product Tags <span style={{ color: "red" }}>*</span></label>
                              <ReactTags
                                  tags={tags}
                                  labelField="Product Tags"
                                  delimiters={delimiters}
                                  handleDelete={handleDelete}
                                  handleAddition={handleAddition}
                                  handleDrag={handleDrag}
                                  handleTagClick={handleTagClick}
                              // inputFieldPosition="bottom"
                              />
                          </Stack>
                          <NumberInput
                              withAsterisk
                              label="Product Offer Amount"
                              placeholder='Enter Offer Amount'
                              min={0}
                              parser={(value) => value.replace(/\₹\s?|(,*)/g, '')}
                              {...form.getInputProps("offerAmt")}
                          />
                          <Grid my="sm">
                              <Grid.Col span={12}>
                                  Parameters
                              </Grid.Col>
                              {tabs?.map((ele, id) => {
                                  const key = Object.keys(data?.parameters || {});
                                  const val = Object.values(data?.parameters || {});
                                  return (
                                      <>
                                          <Grid.Col className='params_col' span={5}>
                                              <TextInput defaultValue={key[ele] || ''} id={`update_params_k_${id}`} placeholder='eg: Weight' />
                                          </Grid.Col>
                                          <Grid.Col span={5}>
                                              <TextInput defaultValue={val[ele] || ''} id={`update_params_v_${id}`} placeholder='eg: 1.2kg' />
                                          </Grid.Col>
                                          <Grid.Col onClick={() => handleAddParams(id)} className='cursor-pointer' span={1}>
                                              <IconPlus color="white" />
                                          </Grid.Col>
                                          <Grid.Col onClick={() => handleRemoveParams(id)} className='cursor-pointer' span={1}>
                                              <IconMinus color="white" />
                                          </Grid.Col>
                                      </>
                                  )
                              })}
                          </Grid>
                          <Select
                              label="Merchant Name"
                              withAsterisk
                              placeholder='Select Merchant Name'
                              {...form.getInputProps("merchant")}
                              data={merchants}
                          />
                          <Select
                              label="Product Offer Type"
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
              </ScrollArea>
          </Modal>
      </>
  )
}

export default EditProductModal