import React, {useState, useEffect} from 'react'
import { Box, Grid, Image, Title, Paper, Button } from '@mantine/core'

import { getOneMerchant } from '../../api/request'

function ShowMerchant({ id, setShow }) {
    const [merchant, setMerchant] = useState({});
    useEffect(() => {
      fetchMerchant();
    }, [])

    const fetchMerchant = async () => {
        try {
            const res = await getOneMerchant(id);
            if(res.code === 200){
                setMerchant(res.data);
            }else{
                console.log("Error");
            }
        } catch (error) {
            console.log(error);
        }
    }
    
  return (
    <Box>
        <Grid>
            <Grid.Col span={12}>
                <Paper>
                      Name: {merchant?.name}
                </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
                <Image src={merchant?.logoUrl} height={300} width={300} />
            </Grid.Col>
            <Grid.Col span={12}>
                <Button variant='outline' onClick={()=>window.open(merchant?.url,"_blank")}>
                    Company's Website
                </Button>
            </Grid.Col>
            <Grid.Col span={12}>
                <Paper>
                    {merchant?.desc}
                </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
                  <Paper>Offer Amount: {merchant?.offerAmt}</Paper>
            </Grid.Col>
            <Grid.Col span={6}>
                  <Paper>Offer Type: {merchant?.offerType}</Paper>
            </Grid.Col>
            <Grid.Col span={12}>
                <h3>Status: {merchant?.status}</h3>
            </Grid.Col>
            <Button onClick={()=>setShow(false)} variant='outline' color="orange">
                Go Back
            </Button>
        </Grid>
    </Box>
  )
}

export default ShowMerchant