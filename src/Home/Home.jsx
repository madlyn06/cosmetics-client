/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Home_Category from "./Component/Home_Category";
import Home_Product from "./Component/Home_Product";
import Product from "../API/Product";
import { changeCount } from "../Redux/Action/ActionCount";
import { useDispatch, useSelector } from "react-redux";
import CartsLocal from "../Share/CartsLocal";
import slder from "../Image/slider_3.jpg";
import right1 from "../Image/right_banner_1.jpg";
import right2 from "../Image/right_banner_2.jpg";
Home.propTypes = {};

function Home(props) {
  // state dùng để thay đổi và hiển thị modal
  const [id_modal, set_id_modal] = useState("");

  const [product_detail, set_product_detail] = useState([]);

  const dispatch = useDispatch();

  const [priceSale, setPriceSale] = useState(0);
  const [category, setCategory] = useState([]);
  const GET_id_modal = (value, price) => {
    set_id_modal(value);

    setPriceSale(price);
  };

  useEffect(() => {
    if (id_modal !== "") {
      const fetchData = async () => {
        const response = await Product.Get_Detail_Product(id_modal);

        set_product_detail(response);
      };

      fetchData();
    }
  }, [id_modal]);

  // Get count từ redux khi user chưa đăng nhập
  const count_change = useSelector((state) => state.Count.isLoad);

  // Hàm này dùng để thêm vào giỏ hàng
  const handler_addcart = (e) => {
    e.preventDefault();

    const data = {
      id_cart: Math.random().toString(),
      id_product: id_modal,
      name_product: product_detail.name_product,
      price_product: product_detail.price_product,
      count: 1,
      image: product_detail.image,
      size: "S"
    };

    CartsLocal.addProduct(data);

    const action_count_change = changeCount(count_change);
    dispatch(action_count_change);
  };

  return (
    <div className="container">
      <div className="slider-with-banner">
        <div className="row">
          <div className="col-lg-8 col-md-8">
            <div style={{ height: "100%" }}>
              <div style={{ height: "100%" }} className="carousel-inner">
                <div
                  className="single-slide align-center-left animation-style-01 bg-1"
                  style={{
                    backgroundImage: `url(${slder})`,
                    height: "100%"
                  }}
                >
                  <div className="slider-progress"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 text-center pt-xs-30">
            <div className="li-banner">
              <a href="#">
                <img src={right1} alt="" />
              </a>
            </div>
            <div className="li-banner mt-15 mt-sm-30 mt-xs-30">
              <a href="#">
                <img src={right2} alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Home_Category GET_id_modal={GET_id_modal} />

      <div className="li-static-banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4 text-center">
              <div className="single-banner">
                <a href="#">
                  <img
                    src="https://product.hstatic.net/1000006063/product/w_-_thumb_-_1200x1200px_240f3d34e95f4a7382e1cdca31f8cea6_1024x1024.png"
                    alt="Li's Static Banner"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 text-center pt-xs-30">
              <div className="single-banner">
                <a href="#">
                  <img
                    src="https://product.hstatic.net/1000006063/product/3_copy_78f267cef9fe45f9a3b6222ad4842a33_grande.png"
                    alt="Li's Static Banner"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 text-center pt-xs-30">
              <div className="single-banner">
                <a href="#">
                  <img
                    src="https://product.hstatic.net/1000006063/product/1200_x_1200_0e7eb68fd1c141819de226b02ba5ef42_grande.png"
                    alt="Li's Static Banner"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Home_Product
        gender={`1`}
        name={"Tất cả sản phẩm"}
        category={"all"}
        GET_id_modal={GET_id_modal}
      />

      <div className="modal fade modal-wrapper" id={id_modal}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="modal-inner-area row">
                <div className="col-lg-5 col-md-6 col-sm-6">
                  <div className="product-details-left">
                    <div className="product-details-images slider-navigation-1">
                      <div className="lg-image">
                        <img src={product_detail.image} alt="product image" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7 col-md-6 col-sm-6">
                  <div className="product-details-view-content pt-60">
                    <div className="product-info">
                      <h2>{product_detail.name_product}</h2>
                      <div className="rating-box pt-20">
                        <ul className="rating rating-with-review-item">
                          <li>
                            <i className="fa fa-star-o"></i>
                          </li>
                          <li>
                            <i className="fa fa-star-o"></i>
                          </li>
                          <li>
                            <i className="fa fa-star-o"></i>
                          </li>
                          <li className="no-star">
                            <i className="fa fa-star-o"></i>
                          </li>
                          <li className="no-star">
                            <i className="fa fa-star-o"></i>
                          </li>
                        </ul>
                      </div>
                      <div className="price-box pt-20">
                        {priceSale ? (
                          <del
                            className="new-price new-price-2"
                            style={{ color: "#525252" }}
                          >
                            {new Intl.NumberFormat("vi-VN", {
                              style: "decimal",
                              decimal: "VND"
                            }).format(product_detail.price_product) + " VNĐ"}
                          </del>
                        ) : (
                          <span className="new-price new-price-2">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "decimal",
                              decimal: "VND"
                            }).format(product_detail.price_product) + " VNĐ"}
                          </span>
                        )}
                        <br />
                        {priceSale && (
                          <span className="new-price new-price-2">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "decimal",
                              decimal: "VND"
                            }).format(priceSale) + " VNĐ"}
                          </span>
                        )}
                      </div>
                      <div className="product-desc">
                        <p>
                          <span>{product_detail.describe}</span>
                        </p>
                      </div>
                      <div className="single-add-to-cart">
                        <form
                          onSubmit={handler_addcart}
                          className="cart-quantity"
                        >
                          <button className="add-to-cart" type="submit">
                            Thêm vào giỏ hàng
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
