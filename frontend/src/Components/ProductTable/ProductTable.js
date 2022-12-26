import React, { useState, useEffect } from 'react'
import { Grid, TextInput, createStyles, Anchor, Button, Box } from '@mantine/core'
import AddProductModal from '../AddProductModal/AddProductModal';
import EditProductModal from '../EditProductModal/EditProductModal';
import DeleteModal from '../DeleteModal/DeleteModal';
import ShowProduct from '../ShowProduct/ShowProduct';
import { getAllProducts, deleteProduct } from '../../api/request';
import { IconPlus, IconTrash, IconSearch } from '@tabler/icons';

const useStyles = createStyles((theme, _params, getRef) => ({
    cell: {
        border: `1px solid ${theme.colors.blue[5]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nameCell: {
        border: `1px solid ${theme.colors.blue[5]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: "pointer"
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

function ProductTable() {
    const { classes } = useStyles();
    const [products, setProducts] = useState([]);
    const [filterProduct, setFilterProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [err, setErr] = useState("");
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [show, setShow] = useState(false);
    useEffect(() => {
        fetchProducts();
    }, [])

    const successAddProduct = () => {
        fetchProducts();
        setOpen(false);
    }

    const successUpdateProduct = () => {
        fetchProducts();
        setEditOpen(false);
    }

    const handleEditModal = (data) => {
        setSelectedProduct({ ...data });
        setEditOpen(true);
    }

    const filterResult = (data) => {
        if (filterProduct.length === 0 && products.length > 0) {
            const a = [...products];
            setFilterProduct(a);
        }
        const newRes = products.filter(e => {
            return (e.name.toLowerCase().includes(data.toLowerCase()))
        })
        setProducts([...newRes]);
        if (data.length === 0) {
            const arr = [...filterProduct];
            setProducts(arr);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await deleteProduct(selectedProduct?._id);
            if (res.code === 200) {
                setDeleteOpen(false);
                fetchProducts();
                setErr("");
            } else {
                setErr(res.err);
            }
        } catch (error) {
            setErr(error);
        }
    }

    const handleDeleteModal = (data) => {
        setSelectedProduct({ ...data });
        setDeleteOpen(true);
    }

    const fetchProducts = async () => {
        const res = await getAllProducts();
        if (res.code === 200) {
            setProducts([...res.data])
            setErr("");
        } else {
            setErr(res.err);
        }
    }
    return (
        <>
            {show ? (
                <ShowProduct id={selectedProduct?._id} setShow={setShow} />
            ) : (
                <>
                    <Grid>
                        <Grid.Col className={classes.cell} span={6}>
                            Product
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
                        <Grid.Col className={classes.cell} span={2}>Price</Grid.Col>
                        <Grid.Col className={classes.cell} span={2}>Product URL</Grid.Col>
                        <Grid.Col className={classes.cell} span={2}>Offer</Grid.Col>
                        <Grid.Col className={classes.cell} span={2}>Edit | Delete</Grid.Col>

                        {products.map((ele, id) => {
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
                                    <Grid.Col onClick={()=>{
                                        setSelectedProduct(ele);
                                        setShow(true);
                                    }} className={classes.nameCell} span={2}>{ele.name}</Grid.Col>
                                    <Grid.Col className={classes.cell} span={2}>
                                        ₹ {' ' + ele.price}
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

                    <AddProductModal successAddProduct={successAddProduct} open={open} setIsOpen={setOpen} />

                    <EditProductModal data={selectedProduct} successUpdateProduct={successUpdateProduct} open={editOpen} setIsOpen={setEditOpen} />

                    <DeleteModal type="Product" handleDelete={handleDelete} open={deleteOpen} setOpen={setDeleteOpen} />
                </>
            )}
        </>
    )
}

export default ProductTable