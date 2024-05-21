const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const { ObjectId } = require("mongoose").Types;
var moment = require("moment");

// GET: display all products
router.get("/", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  const perPage = 9;
  let page = parseInt(req.query.page) || 1;

  const filterOptions = {};
  if (req.query.categories) {
    filterOptions.category = { $in: req.query.categories };
  }

  try {
    const products = await Product.find(filterOptions)
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.countDocuments(filterOptions);

    res.render("shop/index", {
      pageName: "All Products",
      products,
      successMsg,
      errorMsg,
      current: page,
      breadcrumbs: null,
      home: "/products/?",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// GET: search box
router.get("/search", async (req, res) => {
  const perPage = 9;
  let page = parseInt(req.query.page) || 1;
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  let filters = {};

  try {
    const searchKeywords = req.query.search.trim().split(" ").slice(0, 15); // Extract and limit keywords to a maximum of 15 words
    const searchRegex = new RegExp(searchKeywords.map(keyword => `(?=.*${keyword})`).join(""), "i"); // Create a regex pattern to match at least 1 word

    filters = {
      $or: [
        { title: searchRegex },
        { materials: searchRegex }
      ]
    };
    if (req.query.category) {
      filters.category = { $in: req.query.category }; // Use $in operator for multiple selections
    }
    if (req.query.price) {
      filters.price = { $in: req.query.price };
    }
    if (req.query.rating) {
      filters.rating = { $gte: parseInt(req.query.rating) };
    }
    const sortOptions = {};
    if (req.query.sort === "newest") {
      sortOptions["createdAt"] = -1;
    } else if (req.query.sort === "price-high-to-low") {
      sortOptions["price"] = -1;
    } else if (req.query.sort === "price-low-to-high") {
      sortOptions["price"] = 1;
    }

    const products = await Product.find(filters)
      .sort(sortOptions)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category")
      .exec();

    const count = await Product.count(filters);
    const filterOptions = {
      selectedCategory: req.query.category || "",
      selectedPrice: req.query.price || [],
      selectedRating: req.query.rating || ""
    };

    res.render("shop/index", {
      pageName: "Search Results",
      products,
      successMsg,
      errorMsg,
      current: page,
      breadcrumbs: null,
      home: "/products/search?search=" + req.query.search + "&",
      pages: Math.ceil(count / perPage),
      selectedFilters: req.query,
      filterOptions,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//GET: get a certain category by its slug (this is used for the categories navbar)
router.get("/:slug", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  const perPage = 9;
  let page = parseInt(req.query.page) || 1;

  // Retrieve selected category (if any)
  const selectedCategory = req.query.category;

  try {
    const foundCategory = await Category.findOne({ slug: req.params.slug });

    // Build filter query based on category and optional selectedCategory
    const filter = { category: foundCategory.id };
    if (selectedCategory) {
      // Apply additional filter based on selectedCategory (replace with your logic)
      // This example assumes selectedCategory is a sub-category within the foundCategory
      filter["subCategory"] = selectedCategory; // Adjust the field name as needed
    }

    const allProducts = await Product.find(filter)
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.count(filter);

    res.render("shop/index", {
      pageName: foundCategory.title,
      currentCategory: foundCategory,
      products: allProducts,
      successMsg,
      errorMsg,
      current: page,
      breadcrumbs: req.breadcrumbs,
      home: "/products/" + req.params.slug.toString() + "/?",
      pages: Math.ceil(count / perPage),
      selectedCategory, // Pass the selectedCategory for potential UI updates
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});


// GET: display a certain product by its id
router.get("/:slug/:id", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.render("shop/product", {
      pageName: product.title,
      product,
      successMsg,
      errorMsg,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

module.exports = router;
