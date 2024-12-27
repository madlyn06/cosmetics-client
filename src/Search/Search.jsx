/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import queryString from "query-string";
import Product from "../API/Product";
import "./Search.css";
import { Link } from "react-router-dom";
import CartsLocal from "../Share/CartsLocal";
import { changeCount } from "../Redux/Action/ActionCount";
import { useDispatch, useSelector } from "react-redux";

Search.propTypes = {};

function Search(props) {
  const [products, set_products] = useState([]);
  const [page, set_page] = useState(1);
  const [show_success, set_show_success] = useState(false);
  const [amount, setAmount] = useState(1);
  const [show_load, set_show_load] = useState(true);
  const count_change = useSelector((state) => state.Count.isLoad);
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      const fetchData = async () => {
        const params = {
          page: page,
          count: "6",
          search: sessionStorage.getItem("search")
        };

        const query = "?" + queryString.stringify(params);

        const response = await Product.get_search_list(query);

        if (response.length < 1) {
          set_show_load(false);
        }

        set_products((prev) => [...prev, ...response]);
      };

      fetchData();
    }, 2500);
  }, [page]);

  return (
    <div className="content-wraper pt-60 pb-60">
      {show_success && (
        <div className="modal_success">
          <div className="group_model_success pt-3">
            <div className="text-center p-2">
              <i
                className="fa fa-bell fix_icon_bell"
                style={{ fontSize: "40px", color: "#fff" }}
              ></i>
            </div>
            <h4 className="text-center p-3" style={{ color: "#fff" }}>
              Không đủ số lượng sản phẩm!
            </h4>
          </div>
        </div>
      )}
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="shop-products-wrapper">
              <div className="row">
                <div className="col">
                  <InfiniteScroll
                    style={{ overflow: "none" }}
                    dataLength={products.length}
                    next={() => set_page(page + 1)}
                    hasMore={true}
                    loader={
                      show_load ? (
                        <div className="lds-roller">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        <h4
                          className="text-center"
                          style={{ paddingTop: "3rem", color: "#FED700" }}
                        >
                          Đúng! Bạn đã nhìn thấy tất cả
                        </h4>
                      )
                    }
                  >
                    {products &&
                      products.map((value) => (
                        <div
                          className="row product-layout-list"
                          key={value._id}
                        >
                          <div className="col-lg-3 col-md-5 ">
                            <div className="product-image">
                              <Link to={`/detail/${value._id}`}>
                                <img
                                  src={value.image}
                                  alt="Li's Product Image"
                                />
                              </Link>
                              <span className="sticker">Mới</span>
                            </div>
                          </div>
                          <div className="col-lg-5 col-md-7">
                            <div className="product_desc">
                              <div className="product_desc_info">
                                <div className="product-review">
                                  <h5 className="manufacturer">
                                    <a href="product-details.html">
                                      {value.name_product}
                                    </a>
                                  </h5>
                                  <div className="rating-box">
                                    <ul className="rating">
                                      <li>
                                        <i className="fa fa-star" />
                                      </li>
                                      <li>
                                        <i className="fa fa-star" />
                                      </li>
                                      <li>
                                        <i className="fa fa-star" />
                                      </li>
                                      <li>
                                        <i className="fa fa-star" />
                                      </li>
                                      <li>
                                        <i className="fa fa-star" />
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <h4>
                                  <a
                                    className="product_name"
                                    href="product-details.html"
                                  >
                                    {value.name_product}
                                  </a>
                                </h4>
                                <div className="price-box">
                                  <span className="new-price">
                                    {value.price_product}₫
                                  </span>
                                </div>
                                <p>{value.describe}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="shop-add-action mb-xs-30">
                              <ul className="add-actions-link">
                                <li className="add-cart">
                                  <a
                                    href="#"
                                    onClick={() => {
                                      const data = {
                                        id_cart: Math.random().toString(),
                                        id_product: value._id,
                                        name_product: value.name_product,
                                        price_product: value.price_product,
                                        count: 1,
                                        image: value.image,
                                        size: "S"
                                      };

                                      CartsLocal.addProduct(data);

                                      const action_count_change =
                                        changeCount(count_change);
                                      dispatch(action_count_change);
                                    }}
                                  >
                                    Thêm vào giỏ hàng
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className="quick-view"
                                    data-toggle="modal"
                                    data-target={`#${value._id}`}
                                    href="#"
                                  >
                                    <i className="fa fa-eye" />
                                    Xem chi tiết
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </div>
        </div>

        {products &&
          products.map((value) => (
            <div
              className="modal fade modal-wrapper"
              key={value._id}
              id={value._id}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
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
                              <img src={value.image} alt="product image" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-7 col-md-6 col-sm-6">
                        <div className="product-details-view-content pt-60">
                          <div className="product-info">
                            <h2>{value.name_product}</h2>
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
                              <span className="new-price new-price-2">
                                {value.price_product}₫
                              </span>
                            </div>
                            <div className="product-desc">
                              <p>
                                <span>{value.describe}</span>
                              </p>
                            </div>
                            <div className="single-add-to-cart">
                              <form action="#" className="cart-quantity">
                                <div className="quantity">
                                  <label>Số lượng</label>
                                  <div className="cart-plus-minus">
                                    <input
                                      className="cart-plus-minus-box"
                                      value={amount}
                                      type="text"
                                    />
                                    <div
                                      className="dec qtybutton"
                                      onClick={() => {
                                        if (amount <= 1) {
                                          return;
                                        }
                                        setAmount(amount - 1);
                                      }}
                                    >
                                      <i className="fa fa-angle-down"></i>
                                    </div>
                                    <div
                                      className="inc qtybutton"
                                      onClick={() => {
                                        setAmount(amount + 1);
                                      }}
                                    >
                                      <i className="fa fa-angle-up"></i>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  className="add-to-cart"
                                  onClick={() => {
                                    if (amount > value.amount) {
                                      set_show_success(true);
                                      setTimeout(() => {
                                        set_show_success(false);
                                      }, 1000);
                                      return;
                                    }
                                    const data = {
                                      id_cart: Math.random().toString(),
                                      id_product: value._id,
                                      name_product: value.name_product,
                                      price_product: value.price_product,
                                      count: amount,
                                      image: value.image,
                                      size: "S"
                                    };

                                    CartsLocal.addProduct(data);

                                    const action_count_change =
                                      changeCount(count_change);
                                    dispatch(action_count_change);
                                  }}
                                  type="button"
                                >
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
          ))}
      </div>
    </div>
  );
}

export default Search;
