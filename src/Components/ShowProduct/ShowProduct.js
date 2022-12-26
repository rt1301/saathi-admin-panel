import React, { useState, useEffect } from 'react'
import { Box, Grid, Image, Title, Paper, Button, ScrollArea } from '@mantine/core'

import { getOneProduct } from '../../api/request'

function ShowProduct({ id, setShow }) {
    const [product, setProduct] = useState({});
    useEffect(() => {
        fetchProduct();
    }, [])

    const fetchProduct = async () => {
        try {
            const res = await getOneProduct(id);
            if (res.code === 200) {
                // console.log(res.data);
                let d = res.data;
                d["merchant"] = d["merchant"][0].name;
                setProduct(res.data);
                
            } else {
                console.log("Error");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ScrollArea h={550} type="scroll">
            <Box ml={10} mb={10}>
                <Grid>
                    <Grid.Col span={12}>
                        <Paper>
                            Name: {product?.name}
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Image src={product?.imageUrl} height={300} width={300} />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Button variant='outline' onClick={() => window.open(product?.url, "_blank")}>
                            Product's Website
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Paper shadow="sm">
                            {product?.desc}
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Paper shadow="sm">
                          Price: ₹ {product?.price}
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Paper>Offer Amount: {product?.offerAmt}</Paper>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Paper>Offer Type: {product?.offerType}</Paper>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Paper shadow="sm">
                            Merchant: {product?.merchant}
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <h3>Status: {product?.status}</h3>
                    </Grid.Col>
                    <Button onClick={() => setShow(false)} variant='outline' color="orange">
                        Go Back
                    </Button>
                </Grid>
            </Box>
        </ScrollArea>
    )
}

export default ShowProduct