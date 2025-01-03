import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Product from "../../API/Product";
import queryString from "query-string";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ProductSuggest.propTypes = {
  gender: PropTypes.string,
  category: PropTypes.string,
  GET_id_modal: PropTypes.func
};

ProductSuggest.defaultProps = {
  gender: "",
  category: "",
  GET_id_modal: null
};

function ProductSuggest({ id_category }) {
  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const [products, set_products] = useState([]);
  // Hàm này dùng gọi API trả lại dữ liệu product category
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: "1",
        count: "9",
        search: "",
        category: id_category
      };
      console.log(id_category, "id_category");
      const query = "?" + queryString.stringify(params);

      const response = await Product.Get_Pagination(query);

      set_products(response);
    };

    fetchData();
  }, [id_category]);

  return (
    // col-lg-3 col-md-4 col-sm-6 mt-40 col_product
    <section className="product-area li-laptop-product pt-60 pb-45">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="li-section-title">
              <h2>
                <span>Sản phẩm liên quan</span>
              </h2>
            </div>
            <Slider {...settings}>
              {products &&
                products.map((value) => (
                  <div
                    className="col-lg-12 col_product"
                    style={{
                      zIndex: "999",
                      height: "30rem",
                      position: "relative"
                    }}
                    key={value._id}
                  >
                    <div className="single-product-wrap">
                      <div className="product-image">
                        <Link to={`/detail/${value._id}`}>
                          <img src={value.image} alt="Li's Product Image" />
                        </Link>
                        <span className="sticker">New</span>
                      </div>
                      <div className="product_desc">
                        <div className="product_desc_info">
                          <div className="product-review">
                            <h5 className="manufacturer">
                              <div style={{ cursor: "pointer" }}>
                                {value.name_product}
                              </div>
                            </h5>
                            <div className="rating-box">
                              <ul className="rating">
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
                          </div>
                          <div className="price-box">
                            <span className="new-price">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "decimal",
                                decimal: "VND"
                              }).format(value.price_product) + " VNĐ"}
                            </span>
                          </div>
                        </div>
                        {/* <div className="add_actions">
                                                    <ul className="add-actions-link">                                                      
                                                        <li><a href="#" title="quick view"
                                                            className="links-details"
                                                            data-toggle="modal"
                                                            data-target={`#${value._id}`}
                                                            onClick={() => GET_id_modal(`${value._id}`)}><i className="fa fa-eye"></i></a></li>
                                                    </ul>
                                                </div> */}
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductSuggest;
