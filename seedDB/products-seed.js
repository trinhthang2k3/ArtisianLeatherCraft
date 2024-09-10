const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");
const faker = require("faker");
const connectDB = require("./../config/db");
const priceOptions = [700000, 750000, 800000, 850000, 900000, 950000, 1000000, 
  1050000, 1100000, 1150000, 1200000, 1250000, 1300000, 1350000, 1400000, 1450000, 
  1500000, 1550000, 1600000, 1650000, 1700000, 1750000, 1800000, 1850000, 1900000, 
  1950000, 2000000, 2050000, 2100000, 2150000, 2200000, 2250000, 2300000, 2350000, 
  2400000, 2450000, 2500000, 2550000, 2600000, 2650000, 2700000, 2750000, 2800000,
   2850000, 2900000, 2950000, 3000000, 3050000, 3100000, 3150000, 3200000, 3250000,
    3300000, 3350000, 3400000, 3450000, 3500000.];
connectDB();

async function seedDB() {
  faker.seed(0);

  //----------------------Backpacks
  const tui_titles = [
    "Túi bucket màu be vàng Cindy",
    "Túi bucket Gracie màu trắng mix nâu",
    "Túi đeo chéo da thật Elle màu trắng phối nâu",
    "Túi kẹp nách da thật màu đỏ",
    "Túi chần trám da thật Sophia màu beige",
    "Túi da đựng máy tính bảng đen",
    "Túi Bao Tử Da Bò Nhỏ Gọn Màu Đen",
    "Túi Da Công Sở Da Bò TOGO Cao Cấp",
    "Túi Xách Nữ Da Đeo Chéo & Xách Tay",
    "Túi Da Đeo Chéo & Xách Tay Phong Cách Hiện Đại Màu Trắng"

  ];
  const tui_imgs = [
    "https://kat.vn/wp-content/uploads/2024/03/tui-bucket-mau-be-vang-cindy-da-that-2-100x100.jpg",
    "https://kat.vn/wp-content/uploads/2022/11/tui-bucket-da-that-Kat-Gracie-36.jpg",
    "https://kat.vn/wp-content/uploads/2023/10/tui-nu-deo-cheo-da-that-Kat-Elle-2-100x100.png",
    "https://kat.vn/wp-content/uploads/2023/11/tui-kep-nach-da-that-Kat-Flora-45.jpg",
    "https://kat.vn/wp-content/uploads/2022/07/tui-kep-nach-da-that-Kat-Sophia-33.jpg",
    "https://vuadasaigon.com/images/detailed/8/tui_da_dung_may_tinh_bang_csd91d_1.jpg",
    "https://vuadasaigon.com/images/thumbnails/480/480/detailed/5/tui_bao_tu_da_bo_nho_gon_mau_den_db152_5.jpg",
    "https://product.hstatic.net/1000397717/product/435923061_724629929837866_6820518196375734363_n_279c095774424dd284d76782c8909179_master.jpg",
    "https://product.hstatic.net/1000397717/product/434372346_717965310504328_6200835625538282201_n_dc5590cd0a0f446dbdce82eb0fd28273_master.jpg",
    "https://product.hstatic.net/1000397717/product/o1cn012wbyqh1m4xitbkirw___3074981381-0-cib_5242570bf19547408f29ff147638e78b_master.jpg"
  ];

  //--------------------Travel Bags
  const vida_titles = [
    "Ví da bò nam đen trơn",
    "Ví nam da Cá Sấu nhỏ gọn",
    "Ví da Passport hộ chiếu da bò Handmade (xanh Army)",
    "Ví da bò phối da cao cấp ORI",
    "Ví ngang da bò vân voi "
  ];

  const vida_imgs = [
    "https://sp-ao.shortpixel.ai/client/to_webp,q_lossless,ret_img,w_768/https://mrluu.vn/wp-content/uploads/2018/11/vi-nam-da-bo-handmade-mrluu11-768x512.jpg",
    "https://sp-ao.shortpixel.ai/client/to_webp,q_lossless,ret_img,w_768/https://mrluu.vn/wp-content/uploads/2019/03/vi-nam-da-ca-sau-nho-gon-handmade4-768x512.jpg",
    "https://sp-ao.shortpixel.ai/client/to_webp,q_lossless,ret_img,w_768/https://mrluu.vn/wp-content/uploads/2018/06/bao-da-ho-chieu-passport-handmade-mrluu-20-768x512.jpg",
    "https://bizweb.dktcdn.net/thumb/grande/100/059/374/products/img-0438.jpg?v=1684378860727",
    "https://bizweb.dktcdn.net/thumb/1024x1024/100/059/374/products/img-1246.jpg?v=1600416662443"

  ];

  //--------------------Briefcases
  const thatlung_titles = [
    "Dây lưng nam Zucian đầu khóa vàng kim",
    "Dây lưng nam cá sấu mặt nhám",
    "Dây lưng da nữ bản to khóa biểu tượng",
    "Dây lưng nữ dây da khóa kim bản nhỏ",
    "Dây Lưng Nam Da Thật Khóa Phối Màu Nâu",
    "Dây lưng nam đầu xoay - Manel Xanh",
    "Dây lưng da bò mill đen xỏ kim bản 3cm",
    "Dây lưng da bò mặt trượt da bò đen ",
    "Dây lưng da bò mặt xoay 360 dây da bò nâu đen",
    "Dây lưng Devon da bò Crossgrain cao cấp"
  ];

  const thatlung_imgs = [
    "https://shopdonghai.com/cdn/shop/files/that-lung-nam-zuciani-HZ14-den_31628d87-eaa4-43da-87cf-fc8213cf6e32_900x.jpg?v=1689138989",
    "https://shopdonghai.com/cdn/shop/products/CS1200_Den_1_75d23004-eb09-4fe2-96b7-e28a7a7e906c_900x.jpg?v=1623221824",
    "https://shopdonghai.com/cdn/shop/products/MT29_Den_900x.jpg?v=1651652062",
    "https://shopdonghai.com/cdn/shop/files/nit-TD02-nau-1_900x.jpg?v=1713153395",
    "https://shopdonghai.com/cdn/shop/files/that-lung-nam-zuciani-HZ14-den_31628d87-eaa4-43da-87cf-fc8213cf6e32_900x.jpg?v=1689138989",
    "https://lethnic.vn/cdn/shop/products/Lethnic-That-Lung-Day-Nit-Manel-N-Xanh-Nau_380x.jpg?v=1619768011",
    "https://static.ecosite.vn/734/product/2023/05/16/img-4116a-1684170890.jpg",
    "https://static.ecosite.vn/734/product/2022/09/25/img-144123-1664039153.jpg",
    "https://static.ecosite.vn/734/product/2022/09/24/img-2028a-1664037978.jpg",
    "https://www.leonardo.vn/cdn/shop/files/1_72ef06a7-6bc1-4af0-b2f5-d0e613fb5cba_900x.jpg?v=1684721288"
  ];

  //--------------------Mini Bags
  const strap_titles = [
    "Dây Đồng Hồ Da Cá Sấu Nhập Khẩu Pháp Màu Nâu",
    "Dây Đồng Hồ Da Cá Sấu Xanh Lá",
    "Dây Đồng Hồ Chopard Nữ Màu Đen",
    "Dây đồng hồ Grand Seiko da Cá Sấu",
    "Dây đồng hồ da Handmade Apple Watch",
    "Dây đồng hồ Tag Heuer da Cá Sấu Pháp",
    "Dây đồng hồ Rolex da Cá Sấu"
  ];
  const strap_imgs = [
    "https://product.hstatic.net/1000296863/product/day-dong-ho-da-ca-sau-nhap-khau_1b41691bebd449fc9a8e7d25e81618d6_master.jpg",
    "https://product.hstatic.net/1000296863/product/day-dong-ho-da-ca-sau_85ff116826e0477f80aec573545722b2_master.jpg",
    "https://strapwatch.vn/wp-content/uploads/2023/04/z4200291973686_fdaf22b334ca44c98af18015734c3d4e-768x1365.jpg",
    "https://sp-ao.shortpixel.ai/client/to_webp,q_lossless,ret_img,w_768/https://mrluu.vn/wp-content/uploads/2023/09/day-dong-ho-grand-seiko-da-ca-sau-handmade-mrluu-1-768x512.jpg",
    "https://sp-ao.shortpixel.ai/client/to_webp,q_lossless,ret_img,w_768/https://mrluu.vn/wp-content/uploads/2022/05/day-da-handmade-apple-watch-mrluu-1-768x426.jpg",
    "https://sp-ao.shortpixel.ai/client/to_webp,q_lossless,ret_img,w_768/https://mrluu.vn/wp-content/uploads/2022/05/day-dong-ho-tag-heuer-da-ca-sau-handamde-mrluu-5-768x512.jpg",
    "https://sp-ao.shortpixel.ai/client/to_webp,q_lossless,ret_img,w_768/https://mrluu.vn/wp-content/uploads/2022/05/day-dong-ho-rolex-da-ca-sau-handmade-mrluu-5-768x512.jpg",
  ];

  async function seedProducts(titlesArr, imgsArr, categStr) {
    try {
      const categ = await Category.findOne({ title: categStr });
      for (let i = 0; i < titlesArr.length; i++) {
        let prod = new Product({
          productCode: faker.helpers.replaceSymbolWithNumber("####-##########"),
          title: titlesArr[i],
          imagePath: imgsArr[i],
          description: faker.lorem.paragraph(),
          price: priceOptions[faker.random.number({ min: 0, max: priceOptions.length - 1 })],
          available: true,
          category: categ._id,
          rating: faker.random.number({min: 3, max: 5}),
        });
        await prod.save();
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function closeDB() {
    console.log("CLOSING CONNECTION");
    await mongoose.disconnect();
  }

  await seedProducts(tui_titles, tui_imgs, "Túi");
  await seedProducts(vida_titles, vida_imgs, "Ví da");
  await seedProducts(thatlung_titles, thatlung_imgs, "Thắt lưng");
  await seedProducts(strap_titles, strap_imgs, "Dây đeo đồng hồ");
  await closeDB();
}

seedDB();
