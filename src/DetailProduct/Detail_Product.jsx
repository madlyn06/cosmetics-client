import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useParams } from "react-router";
import Product from "../API/Product";
import { useDispatch, useSelector } from "react-redux";
import { changeCount } from "../Redux/Action/ActionCount";
import { Link } from "react-router-dom";
import CommentAPI from "../API/CommentAPI";
import CartsLocal from "../Share/CartsLocal";
import SaleAPI from "../API/SaleAPI";
import ProductSuggest from "../Home/Component/ProductSuggest";

Detail_Product.propTypes = {};

function Detail_Product(props) {
  const { id } = useParams();

  const [product, set_product] = useState({});

  const dispatch = useDispatch();

  //id_user được lấy từ redux
  const id_user = useSelector((state) => state.Cart.id_user);

  // Get count từ redux khi user chưa đăng nhập
  const count_change = useSelector((state) => state.Count.isLoad);

  const [sale, setSale] = useState();

  // Hàm này dùng để gọi API hiển thị sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      const response = await Product.Get_Detail_Product(id);

      set_product(response);
      console.log(response, "response");
      const resDetail = await SaleAPI.checkSale(id);

      if (resDetail.msg === "Thanh Cong") {
        setSale(resDetail.sale);
      }
    };

    fetchData();
  }, [id]);

  const [count, set_count] = useState(1);

  const [show_success, set_show_success] = useState(false);
  const [message, set_message] = useState("Bạn Đã Thêm Hàng Thành Công!");
  const [size, set_size] = useState("S");

  // Hàm này dùng để thêm vào giỏ hàng
  const handler_addcart = (e) => {
    e.preventDefault();
    console.log(count);
    if (count < 1) {
      set_message("Số lượng hàng phải lớn hơn 0");
      set_show_success(true);
      setTimeout(() => {
        set_show_success(false);
      }, 1000);
      return;
    }

    if (product?.amount === 0 || product?.amount < count) {
      set_message("Số lượng hàng không đủ!");
      set_show_success(true);
      setTimeout(() => {
        set_show_success(false);
      }, 1000);
      return;
    }

    const data = {
      id_cart: Math.random().toString(),
      id_product: id,
      name_product: product.name_product,
      price_product: sale
        ? parseInt(sale.id_product.price_product) -
          (parseInt(sale.id_product.price_product) * parseInt(sale.promotion)) /
            100
        : product.price_product,
      count: count,
      image: product.image,
      size: size
    };

    CartsLocal.addProduct(data);

    const action_count_change = changeCount(count_change);
    dispatch(action_count_change);

    set_show_success(true);

    set_message("Bạn Đã Thêm Hàng Thành Công!");

    setTimeout(() => {
      set_show_success(false);
    }, 1000);
  };

  // Hàm này dùng để giảm số lượng
  const downCount = () => {
    if (count === 1) {
      return;
    }

    if (count < 1) {
      set_count(1);
      return null;
    }

    set_count(count - 1);
  };

  const upCount = () => {
    set_count(count + 1);
  };

  // State dùng để mở modal
  const [modal, set_modal] = useState(false);

  // State thông báo lỗi comment
  const [error_comment, set_error_comment] = useState(false);

  const [star, set_star] = useState(1);

  const [comment, set_comment] = useState("");

  const [validation_comment, set_validation_comment] = useState(false);

  // state load comment
  const [load_comment, set_load_comment] = useState(true);

  // State list_comment
  const [list_comment, set_list_comment] = useState([]);

  // Hàm này dùng để gọi API post comment sản phẩm của user
  const handler_Comment = () => {
    if (!sessionStorage.getItem("id_user")) {
      // Khi khách hàng chưa đăng nhập

      set_error_comment(true);
    } else {
      // Khi khách hàng đã đăng nhập

      if (!comment) {
        set_validation_comment(true);
        return;
      }

      const data = {
        id_user: sessionStorage.getItem("id_user"),
        content: comment,
        star: star
      };

      const post_data = async () => {
        const response = await CommentAPI.post_comment(data, id);

        console.log(response);

        set_load_comment(true);

        set_comment("");

        set_modal(false);
      };

      post_data();
    }

    setTimeout(() => {
      set_error_comment(false);
    }, 1500);
  };

  // Hàm này dùng để GET API load ra những comment của sản phẩm
  useEffect(() => {
    if (load_comment) {
      const fetchData = async () => {
        const response = await CommentAPI.get_comment(id);

        set_list_comment(response);
      };

      fetchData();

      set_load_comment(false);
    }
  }, [load_comment]);

  return (
    <div>
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
              {message}
            </h4>
          </div>
        </div>
      )}
      {error_comment && (
        <div className="modal_success">
          <div className="group_model_success pt-3">
            <div className="text-center p-2">
              <i
                className="fa fa-bell fix_icon_bell"
                style={{
                  fontSize: "40px",
                  color: "#fff",
                  backgroundColor: "#f84545"
                }}
              ></i>
            </div>
            <h4 className="text-center p-3" style={{ color: "#fff" }}>
              Vui Lòng Kiểm Tra Lại Đăng Nhập!
            </h4>
          </div>
        </div>
      )}
      <div className="breadcrumb-area">
        <div className="container">
          <div className="breadcrumb-content">
            <ul>
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="active">Chi tiết</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-wraper">
        <div className="container">
          <div className="row single-product-area">
            <div className="col-lg-5 col-md-6">
              <div className="product-details-left">
                <div className="product-details-images slider-navigation-1">
                  <div className="lg-image">
                    <img src={product.image} alt="product image" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7 col-md-6">
              <div className="product-details-view-content pt-60">
                <div className="product-info">
                  <h2>{product.name_product}</h2>
                  <div className="price-box pt-20">
                    {sale ? (
                      <del
                        className="new-price new-price-2"
                        style={{ color: "#525252" }}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "decimal",
                          decimal: "VND"
                        }).format(product.price_product) + " VNĐ"}
                      </del>
                    ) : (
                      <span className="new-price new-price-2">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "decimal",
                          decimal: "VND"
                        }).format(product.price_product) + " VNĐ"}
                      </span>
                    )}
                    <br />
                    {sale && (
                      <span className="new-price new-price-2">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "decimal",
                          decimal: "VND"
                        }).format(
                          parseInt(sale.id_product.price_product) -
                            (parseInt(sale.id_product.price_product) *
                              parseInt(sale.promotion)) /
                              100
                        ) + " VNĐ"}
                      </span>
                    )}
                  </div>
                  <div className="product-desc">
                    <p>
                      <span>{product?.describe}</span>
                    </p>
                  </div>
                  <div>
                    Số hàng trong kho: <span>{product?.amount || 0}</span>
                  </div>
                  <div className="single-add-to-cart">
                    <form action="#" className="cart-quantity">
                      <div className="quantity">
                        <label>Số lượng</label>
                        <div className="cart-plus-minus">
                          <input
                            className="cart-plus-minus-box"
                            value={count}
                            type="number"
                            onChange={(e) => set_count(e.target.value)}
                          />
                          <div className="dec qtybutton" onClick={downCount}>
                            <i className="fa fa-angle-down"></i>
                          </div>
                          <div className="inc qtybutton" onClick={upCount}>
                            <i className="fa fa-angle-up"></i>
                          </div>
                        </div>
                      </div>
                      <a
                        href="#"
                        className="add-to-cart"
                        type="submit"
                        onClick={handler_addcart}
                      >
                        Thêm vào giỏ hàng
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product-area pt-35">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="li-product-tab">
                <ul className="nav li-product-menu">
                  <li>
                    <a className="active" data-toggle="tab" href="#description">
                      <span>Mô tả sản phẩm</span>
                    </a>
                  </li>
                  <li>
                    <a data-toggle="tab" href="#reviews">
                      <span>Đánh giá</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="tab-content">
            <div
              id="description"
              className="tab-pane active show"
              role="tabpanel"
            >
              <div className="product-description">
                <span>{product?.describe}</span>
              </div>
            </div>
            <div id="reviews" className="tab-pane" role="tabpanel">
              <div className="product-reviews">
                <div className="product-details-comment-block">
                  <div style={{ overflow: "auto", height: "10rem" }}>
                    {list_comment &&
                      list_comment.map((value) => (
                        <div
                          className="comment-author-infos pt-25"
                          key={value._id}
                        >
                          <span>
                            {value?.id_user?.fullname}
                            <div style={{ fontWeight: "400" }}>
                              {value.content}
                            </div>
                          </span>
                          <ul className="rating">
                            <li>
                              <i
                                className={
                                  value.star > 0 ? "fa fa-star" : "fa fa-star-o"
                                }
                              ></i>
                            </li>
                            <li>
                              <i
                                className={
                                  value.star > 1 ? "fa fa-star" : "fa fa-star-o"
                                }
                              ></i>
                            </li>
                            <li>
                              <i
                                className={
                                  value.star > 2 ? "fa fa-star" : "fa fa-star-o"
                                }
                              ></i>
                            </li>
                            <li>
                              <i
                                className={
                                  value.star > 3 ? "fa fa-star" : "fa fa-star-o"
                                }
                              ></i>
                            </li>
                            <li>
                              <i
                                className={
                                  value.star > 4 ? "fa fa-star" : "fa fa-star-o"
                                }
                              ></i>
                            </li>
                          </ul>
                        </div>
                      ))}
                  </div>

                  <div className="review-btn" style={{ marginTop: "2rem" }}>
                    <a
                      className="review-links"
                      style={{ cursor: "pointer", color: "#fff" }}
                      onClick={() => set_modal(true)}
                    >
                      Đánh giá sản phẩm!
                    </a>
                  </div>
                  <Modal
                    onHide={() => set_modal(false)}
                    show={modal}
                    className="modal fade modal-wrapper"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-body">
                          <h3 className="review-page-title">Đánh giá</h3>
                          <div className="modal-inner-area row">
                            <div className="col-lg-6">
                              <div className="li-review-product">
                                <img
                                  src={product.image}
                                  alt="Li's Product"
                                  style={{ width: "20rem" }}
                                />
                                <div className="li-review-product-desc">
                                  <p className="li-product-name">
                                    {product.name_product}
                                  </p>
                                  <p>
                                    <span>{product.describe}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="li-review-content">
                                <div className="feedback-area">
                                  <div className="feedback">
                                    <h3 className="feedback-title">Phản hồi</h3>
                                    <form action="#">
                                      <p className="your-opinion">
                                        <label>Số điểm</label>
                                        <span>
                                          <select
                                            className="star-rating"
                                            onChange={(e) =>
                                              set_star(e.target.value)
                                            }
                                          >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                          </select>
                                        </span>
                                      </p>
                                      <p className="feedback-form">
                                        <label htmlFor="feedback">
                                          Bình luận
                                        </label>
                                        <textarea
                                          id="feedback"
                                          name="comment"
                                          cols="45"
                                          rows="8"
                                          aria-required="true"
                                          onChange={(e) =>
                                            set_comment(e.target.value)
                                          }
                                        ></textarea>
                                        {validation_comment && (
                                          <span style={{ color: "red" }}>
                                            * This is required!
                                          </span>
                                        )}
                                      </p>
                                      <div className="feedback-input">
                                        <div className="feedback-btn pb-15">
                                          <a
                                            className="close"
                                            onClick={() => set_modal(false)}
                                          >
                                            Hủy
                                          </a>
                                          <a
                                            style={{ cursor: "pointer" }}
                                            onClick={handler_Comment}
                                          >
                                            Đánh giá
                                          </a>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sản phẩm liên quan */}
      <ProductSuggest id_category={product.id_category} />
    </div>
  );
}

export default Detail_Product;
