import React, { useEffect, useState } from 'react'
import { Grid, TextInput, createStyles, Anchor, Button, Box } from '@mantine/core'
import AddMerchantModal from '../AddMerchantModal/AddMerchantModal';
import EditMerchantModal from '../EditMerchantModal/EditMerchantModal';
import ShowMerchant from '../ShowMerchant/ShowMerchant';
import DeleteModal from '../DeleteModal/DeleteModal';
import { getAllMerchants, deleteMerchant } from '../../api/request';
import { IconPlus, IconTrash, IconSearch } from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => ({
  cell: {
    border: `1px solid ${theme.colors.blue[5]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    backgroundColor: theme.colors.blue[1],
    color: theme.colors.blue[0]
  },
  link: {
    textDecoration: 'none',
    color: theme.colors.orange,
    ":hover": {
      textDecoration: "none"
    }
  }
}));


function MerchantTable() {
  const { classes } = useStyles();
  const [merchants, setMerchants] = useState([]);
  const [filterMerchant, setFilterMerchant] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState({});
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    fetchMerchants();
  }, [])

  const successAddMerchant = () => {
    fetchMerchants();
    // setOpen(false);
  }

  const successUpdateMerchant = () => {
    fetchMerchants();
    setEditOpen(false);
  }

  const handleEditModal = (data) => {
    setSelectedMerchant({ ...data });
    setEditOpen(true);
  }

  const filterResult = (data) => {
    if (filterMerchant.length === 0 && merchants.length > 0) {
      const a = [...merchants];
      setFilterMerchant(a);
    }
    const newRes = merchants.filter(e => {
      return (e.name.toLowerCase().includes(data.toLowerCase()))
    })
    setMerchants([...newRes]);
    if (data.length === 0) {
      const arr = [...filterMerchant];
      setMerchants(arr);
    }
  }

  const handleDelete = async () => {
    try {
      const res = await deleteMerchant(selectedMerchant?._id);
      if (res.code === 200) {
        setDeleteOpen(false);
        fetchMerchants();
        setErr("");
      } else {
        setErr(res.err);
      }
    } catch (error) {
      setErr(error);
    }
  }

  const handleDeleteModal = (data) => {
    setSelectedMerchant({ ...data });
    setDeleteOpen(true);
  }

  const fetchMerchants = async () => {
    const res = await getAllMerchants();
    if (res.code === 200) {
      setMerchants([...res.data])
      setErr("");
    } else {
      setErr(res.err);
    }
  }

  return (
    <>
      {show ? (
        <ShowMerchant id={selectedMerchant?._id} setShow={setShow} />
      ) : (
        <>
          <Grid>
            <Grid.Col className={classes.cell} span={6}>
              Merchant
            </Grid.Col>
            <Grid.Col className={classes.cell} span={4}>
              <TextInput rightSection={<IconSearch color="white" />} onChange={(e) => filterResult(e.target.value)}></TextInput>
            </Grid.Col>
            <Grid.Col className={classes.cell} span={2}>
              <Button onClick={() => setOpen(true)} variant='outline' rightIcon={<IconPlus color='white' size={14} />}>
                Add
              </Button>
            </Grid.Col>

            <Grid.Col className={classes.cell} span={2}>ID</Grid.Col>
            <Grid.Col className={classes.cell} span={2}>Name</Grid.Col>
            <Grid.Col className={classes.cell} span={2}>Logo URL</Grid.Col>
            <Grid.Col className={classes.cell} span={2}>Product URL</Grid.Col>
            <Grid.Col className={classes.cell} span={2}>Offer</Grid.Col>
            <Grid.Col className={classes.cell} span={2}>Edit | Delete</Grid.Col>

            {merchants.map((ele, id) => {
              const { offerAmt, offerType } = ele;
              let suffix = '%'
              let prefix = '';
              if (offerType === 'percent') {
                suffix = '%'
                prefix = ''
              } else {
                suffix = '';
                prefix = '₹';
              }
              return (
                <>
                  <Grid.Col className={classes.cell} span={2}>{id + 1}</Grid.Col>
                  <Grid.Col sx={{cursor: "pointer"}} className={classes.cell} onClick={()=>{
                    setSelectedMerchant(ele);
                    setShow(true);
                  }} span={2}>{ele.name}</Grid.Col>
                  <Grid.Col className={classes.cell} span={2}>
                    <Button variant='outline'>
                      <Anchor className={classes.link} href={ele.logoUrl} target="_blan">Logo</Anchor>
                    </Button>
                  </Grid.Col>
                  <Grid.Col className={classes.cell} span={2}>
                    <Button variant='outline'>
                      <Anchor className={classes.link} href={ele.url} target="_blan">Product</Anchor>
                    </Button>
                  </Grid.Col>
                  <Grid.Col className={classes.cell} span={2}>{prefix}{offerAmt}{suffix}</Grid.Col>
                  <Grid.Col className={classes.cell} span={2}>
                    <Button onClick={() => handleEditModal(ele)} variant='outline'>
                      Edit
                    </Button>
                    <Box h={30} ml={10} mr={4} sx={{ borderRight: "1px solid white" }}></Box>
                    <IconTrash onClick={() => handleDeleteModal(ele)} color='red' size={30} />
                  </Grid.Col>
                </>
              )
            })}
          </Grid>

          <AddMerchantModal successAddMerchant={successAddMerchant} open={open} setIsOpen={setOpen} />

          <EditMerchantModal data={selectedMerchant} successUpdateMerchant={successUpdateMerchant} open={editOpen} setIsOpen={setEditOpen} />

          <DeleteModal type="Merchant" handleDelete={handleDelete} open={deleteOpen} setOpen={setDeleteOpen} />
        </>
      )}

    </>
  )
}

export default MerchantTable