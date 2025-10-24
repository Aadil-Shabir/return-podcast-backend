const axios = require("axios");

const PRINTIFY_API = "https://api.printify.com/v1/shops/24876550/products.json";
const PRINTIFY_TOKEN = process.env.PRINTIFY_TOKEN; // store in .env

// 📌 Get all products
const getAllProducts = async (req, res) => {
  try {
    const response = await axios.get(PRINTIFY_API, {
      headers: {
        Authorization: `Bearer ${PRINTIFY_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Error fetching products: ", err.message);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// 📌 Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://api.printify.com/v1/shops/24876550/products/${id}.json`,
      {
        headers: {
          Authorization: `Bearer ${PRINTIFY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Error fetching product by ID: ", err.message);
    res.status(500).json({ message: "Error fetching product by id" });
  }
};

module.exports = { getAllProducts, getProductById };
