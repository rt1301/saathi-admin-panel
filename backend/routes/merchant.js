const express = require('express');
const router = express.Router();
// const jwtVerify = require("../verifyJWT");
const Merchant = require("../models/Merchant");

// Create Merchant
router.post("/create",async (req,res)=>{
    try {
        const { name, logoUrl, url, desc, offerAmt, offerType } = req.body;
        const merchant = new Merchant({
            name,
            logoUrl,
            url,
            desc,
            offerAmt,
            offerType,
            status: "active"
        });
        const savedMerchant = await merchant.save();
        console.log(savedMerchant);
        res.send({
            code: 200,
            msg: "Merchant created successfully"
        });
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

// Get ALL
router.get("/list", async (req,res)=>{
    try {
        const merchants = await Merchant.find({});
        res.send({
            code: 200,
            data: merchants
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
        const merchant = await Merchant.findById(id);
        res.send({
            code: 200,
            data: merchant
        })
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

// Update Merchant
router.put("/update/:id",  async (req,res)=> {
    try {
        const id = req.params.id;
        const { name, logoUrl, url, desc, offerAmt, offerType, status } = req.body;
        const merchant = {
            name,
            logoUrl,
            url,
            desc,
            offerAmt,
            offerType,
            status
        };
        const updatedUser = await Merchant.findByIdAndUpdate(id, merchant);

        res.send({
            code: 200,
            msg: "Merchant Details Updated",
            data: updatedUser
        })
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

// Delete
router.delete("/delete/:id",  async (req,res)=> {
    try {
        const id = req.params.id;
        const deletedUser = await Merchant.findByIdAndDelete(id);

        res.send({
            code: 200,
            msg: "Merchant Deleted",
        })
    } catch (error) {
        res.send({
            code: 400,
            err: error.message
        })
    }
})

module.exports = router;