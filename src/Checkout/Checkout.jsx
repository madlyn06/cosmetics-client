import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import "./Checkout.css";
import OrderAPI from "../API/OrderAPI";
import { changeCount } from "../Redux/Action/ActionCount";
import { useDispatch, useSelector } from "react-redux";
import NoteAPI from "../API/NoteAPI";
import Detail_OrderAPI from "../API/Detail_OrderAPI";
import CouponAPI from "../API/CouponAPI";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND"
});

const socket = io("http://localhost:8000/", {
  transports: ["websocket"],
  jsonp: false
});
socket.connect();

Checkout.propTypes = {};

function Checkout(props) {
  const [total_price, set_total_price] = useState(0);
  const [methodCheckout, setMethodCheckout] = useState(
    "Phương thức thanh toán"
  );

  useEffect(() => {
    const carts = JSON.parse(localStorage.getItem("carts"));
    Sum_Price(carts, 0);
  }, []);

  function Sum_Price(carts, sum_price) {
    carts.map((value) => {
      return (sum_price += Number(value.count) * Number(value.price_product));
    });

    const total = Number(sum_price);

    if (localStorage.getItem("coupon")) {
      // GET localStorage
      const coupon = JSON.parse(localStorage.getItem("coupon"));

      // set_discount((total * parseInt(coupon.promotion)) / 100);

      const newTotal = total - (total * parseInt(coupon.promotion)) / 100;

      localStorage.setItem("total_price", newTotal);

      set_total_price(newTotal);
    } else {
      localStorage.setItem("total_price", total);

      set_total_price(total);
    }
  }

  const [information, set_information] = useState({
    fullname: "",
    phone: "",
    address: "",
    email: ""
  });

  const count_change = useSelector((state) => state.Count.isLoad);

  const dispatch = useDispatch();

  // Hàm này dùng để thanh toán offline
  const handler_Checkout = async () => {
    if (localStorage.getItem("id_coupon")) {
      await CouponAPI.updateCoupon(localStorage.getItem("id_coupon"));
    }

    // data Delivery
    const data_delivery = {
      // id_delivery:  Math.random.toString(),
      fullname: information.fullname,
      phone: information.phone
    };

    // Xứ lý API Delivery
    const response_delivery = await NoteAPI.post_note(data_delivery);

    // data Order
    const data_order = {
      id_user: sessionStorage.getItem("id_user"),
      address: information.address,
      total: total_price,
      status: "1",
      pay: false,
      id_payment: "6086709cdc52ab1ae999e882",
      id_note: response_delivery._id,
      feeship: 0,
      id_coupon: localStorage.getItem("id_coupon")
        ? localStorage.getItem("id_coupon")
        : "",
      create_time: `${new Date().getDate()}/${
        parseInt(new Date().getMonth()) + 1
      }/${new Date().getFullYear()}`
    };

    // Xứ lý API Order
    const response_order = await OrderAPI.post_order(data_order);

    // data carts
    const data_carts = JSON.parse(localStorage.getItem("carts"));

    // Xử lý API Detail_Order
    for (let i = 0; i < data_carts.length; i++) {
      const data_detail_order = {
        id_order: response_order._id,
        id_product: data_carts[i].id_product,
        name_product: data_carts[i].name_product,
        price_product: data_carts[i].price_product,
        count: data_carts[i].count,
        size: data_carts[i].size
      };

      await Detail_OrderAPI.post_detail_order(data_detail_order);
    }

    // Gửi socket lên server
    socket.emit("send_order", "Có người vừa đặt hàng");
    // Xử lý API Send Mail

    // const send_mail = await OrderAPI.post_email(data_email)
    // console.log(send_mail)

    localStorage.removeItem("information");
    localStorage.removeItem("total_price");
    localStorage.removeItem("price");
    localStorage.removeItem("id_coupon");
    localStorage.removeItem("coupon");
    localStorage.setItem("carts", JSON.stringify([]));

    // Hàm này dùng để load lại phần header bằng Redux
    const action_count_change = changeCount(count_change);
    dispatch(action_count_change);
  };

  // Kiểm tra xem khách hàng đã nhập chỉ nhận hàng hay chưa

  return (
    <div>
      <div className="breadcrumb-area">
        <div className="container">
          <div className="breadcrumb-content">
            <ul>
              <li>
                <a href="index.html">Trang chủ</a>
              </li>
              <li className="active">Thanh toán</li>
            </ul>
          </div>
        </div>
        <div className="wrapper">
          <div className="container">
            <form action className="mt-10">
              <div className="name">
                <div>
                  <label htmlFor="f-name">Tên đầy đủ</label>
                  <input
                    onChange={(e) =>
                      set_information({
                        ...information,
                        fullname: e.target.value
                      })
                    }
                    type="text"
                    name="f-name"
                    className="form-control"
                  />
                </div>
                <div>
                  <label htmlFor="l-name">Địa chỉ</label>
                  <input
                    onChange={(e) =>
                      set_information({
                        ...information,
                        address: e.target.value
                      })
                    }
                    type="text"
                    name="l-name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="street">
                <label htmlFor="name">Số điện thoại</label>
                <input
                  type="text"
                  onChange={(e) =>
                    set_information({ ...information, phone: e.target.value })
                  }
                  name="address"
                  className="form-control"
                />
              </div>
              <div className="address-info">
                <div>
                  <label htmlFor="city">Email</label>
                  <input
                    type="text"
                    onChange={(e) =>
                      set_information({ ...information, email: e.target.value })
                    }
                    name="city"
                    className="form-control"
                  />
                </div>
              </div>
              <div>Tổng giá tiền : {VND.format(total_price)}</div>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {methodCheckout}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div
                    style={{
                      cursor: "pointer"
                    }}
                    className="dropdown-item"
                    onClick={() =>
                      setMethodCheckout("Thanh toán khi nhận hàng")
                    }
                  >
                    Thanh toán khi nhận hàng
                  </div>
                </div>
              </div>

              <div className="btns mt-10">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handler_Checkout}
                >
                  Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
