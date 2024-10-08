import express from "express";
import Product from "../models/Product.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/add-product", authenticate(["admin"]), async (req, res) => {
  try {
    const { name, desc, category, price, capital, stock, weight } = req.body;

    const profit = price - capital;

    const product = await Product.create({
      name: name,
      desc: desc,
      category: category,
      price: price,
      capital: capital,
      profit: profit,
      stock: stock,
      weight: weight,
      // image: images.map((link) => ({ link })),
    });

    if (!product)
      return res.status(500).json({ error: "Produk gagal ditambahkan" });

    res.status(200).json({ message: "Produk berhasil ditambahkan", product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/show-products", async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/:name", async (req, res, next) => {
  try {
    const product = await Product.findOne({ name: req.params.name });

    if (!product) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.delete("/delete/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    await product.deleteOne();

    res.status(200).json({ message: "produk berhasil dihapus" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.put(
  "/update/:id",
  authenticate(["admin"]),

  async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);

      const { name, desc, category, price, capital, stock, weight } = req.body;

      const profit = price - capital;

      const data = {
        name: name,
        desc: desc,
        category: category,
        price: price,
        capital: capital,
        profit: profit,
        stock: stock,
        weight: weight,
      };
      product = await Product.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({ message: "Produk berhasil diupdate", product });
    } catch (error) {
      console.log(error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
