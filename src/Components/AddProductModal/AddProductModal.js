import React, { useState, useEffect } from 'react'
import { Modal, Box, TextInput, Button, NumberInput, Select, Group, ScrollArea, Grid, Stack } from "@mantine/core"
import { useForm } from "@mantine/form";
import { createProducts, getAllMerchants } from '../../api/request';
import { WithContext as ReactTags } from 'react-tag-input';
import { IconMinus, IconPlus } from '@tabler/icons';
import './styles.css'

const KeyCodes = {
    comma: 188,
    enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function AddProductModal({ open, setIsOpen, successAddProduct }) {
    const [tags, setTags] = useState([]);
    const [tabs, setTabs] = useState([-1]);
    const [merchants, setMerchants] = useState([]);

    useEffect(() => {
      fetchMerchants();
    }, [])

    const fetchMerchants = async () => {
        try {
            const res = await getAllMerchants();
            if(res.code === 200){
                let m = [];
                res?.data?.map((ele,id)=>{
                    m.push({
                        value: ele.name,
                        label: ele.name
                    });
                })
                setMerchants([...m]);
            }else{
                console.log(res?.err);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleClose = () => {
        setIsOpen(false);
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

    const form = useForm({
        initialValues: {
            name: "",
            imageUrl: "",
            url: "",
            desc: "",
            offerAmt: 0,
            offerType: "",
            price: 0,
            merchantName: "",
            parameters: {}
        },
        validate: {
            name: (val) => val.length > 0 ? null : "Invalid Name",
            imageUrl: (val) => val.length > 0 ? null : "Invalid URL",
            url: (val) => val.length > 0 ? null : "Invalid URL",
            desc: (val) => val.length > 0 ? null : "Invalid description",
            offerAmt: (val) => val >= 0 ? null : "Invalid Offer", 
            offerType: (val) => val.length > 0 ? null : "Invalid Offer Type",
            merchantName: (val) => val.length > 0 ? null : "Invalid Merchant",
            price: (val) => val >= 0 ? null : "Incorrect Price"
        }
    })

    const handleSubmit = async (data) => {
        let t = [];
        tags.map((ele)=>{
            t.push(ele.id);
        })
        data["tag"] = t;
        const res = await createProducts(data);
        if (res.code === 200) {
            successAddProduct();
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
        const key = document.getElementById(`add_params_k_${id}`).value;
        const val = document.getElementById(`add_params_v_${id}`).value;
        const params = form.values.parameters;
        params[key] = val;
        form.setFieldValue("parameters", params);
        addTab(id);
    }

    const handleRemoveParams = (id) => {
        const key = document.getElementById(`add_params_k_${id}`).value;
        if (key.length > 0) {
            const params = form.values.parameters;
            if(params[key]){
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
                sx={{ overflowX: "hidden" }}
                onClose={handleClose}
                title="Add a new Product"
                centered
            >
                <ScrollArea h={400} sx={{ overflowX: "hidden" }}>
                    <Box mx="auto">
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
                                contentEditable
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
                                {tabs.map((ele, id) => {
                                    return (
                                        <>
                                            <Grid.Col className='params_col' span={5}>
                                                <TextInput id={`add_params_k_${id}`} placeholder='eg: Weight' />
                                            </Grid.Col>
                                            <Grid.Col span={5}>
                                                <TextInput id={`add_params_v_${id}`} placeholder='eg: 1.2kg' />
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
                            {...form.getInputProps("merchantName")}
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

export default AddProductModal