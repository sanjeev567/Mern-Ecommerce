const Product = require("../models/Product");
const {
    verifyToken,
    verifyAndAuthorize,
    verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE




router.put("/:id", verifyTokenAndAdmin, async (req, res) => {


    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET A PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCat = req.query.category;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ _id: -1 }).limit(1);
        } else if(qCat){
            products = await Product.find({ 
                categories: {
                     $in: [qCat]
                    }
             })
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

// // GET USER STATS
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastYear } } },
//       {
//         $project: {
//             month: { $month: "$createdAt"}, // it set month of createAt user to month var here. if you say year it will do so.
//         },
//       },
//       {
//         $group: {
//             _id: "$month",
//             total: {$sum: 1}
//         }
//       }
//     ]);

//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
