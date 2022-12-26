const express = require('express');
const router = express.Router();
const jwtVerify = require("../verifyJWT");
const Product = require("../models/Product");
const Merchant = require('../models/Merchant');
const mongoose = require('mongoose');

// Create Product
router.post("/create", async (req, res) => {
    try {
        const { name, imageUrl, url, desc, price, tag, parameters, offerAmt, offerType, merchantName } = req.body;
        const merchant = await Merchant.findOne({name: merchantName});
        const product = new Product({
            name,
            imageUrl,
            url,
            desc,
            offerAmt,
            offerType,
            price,
            tag,
            parameters,
            status: "active"
        });
        product.merchant.push(merchant);
        const savedProduct = await product.save();
        console.log(savedProduct);
        res.send({
            code: 200,
            msg: "Product created successfully"
        });
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

// Get ALL
router.get("/list", async (req, res) => {
    try {
        const products = await Product.find({});
        res.send({
            code: 200,
            data: products
        })
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

// Get by ID
router.get("/read/:id", async (req, res) => {
    try {
        const id = req.params.id;
        Product.findById(id).populate("merchant").exec((err,foundProduct)=>{
            if(err){
                res.send({
                    code: 400,
                    err
                })
            }else{
                console.log(foundProduct.merchant);
                res.send({
                    code: 200,
                    data: foundProduct
                })
            }
        });
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

// Update Product
router.put("/update/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, imageUrl, url, desc, price, tag, parameter, offerAmt, offerType, merchantName, status } = req.body;
        const merchant = await Merchant.findOne({ name: merchantName });
        const product = {
            name,
            imageUrl,
            url,
            desc,
            offerAmt,
            offerType,
            price,
            tag,
            parameter,
            merchant: [merchant],
            status
        };
        const updatedProduct = await Product.findByIdAndUpdate(id, product);

        res.send({
            code: 200,
            msg: "Product Details Updated",
            data: updatedProduct
        })
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

// Delete
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(id);

        res.send({
            code: 200,
            msg: "Product Deleted",
        })
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

module.exports = router;