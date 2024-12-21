import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import "./Checkout.css";
import OrderAPI from "../API/OrderAPI";
import { changeCount } from "../Redux/Action/ActionCount";
import { useDispatch, useSelector } from "react-redux";
import NoteAPI from "../API/NoteAPI";
import Detail_OrderAPI from "../API/Detail_OrderAPI";
import CouponAPI from "../API/CouponAPI";
import { Controller, useForm } from "react-hook-form";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND"
});

const socket = io("https://cosmetics-be.onrender.com/", {
  transports: ["websocket"],
  jsonp: false
});
socket.connect();

Checkout.propTypes = {};

function Checkout(props) {
  const [total_price, set_total_price] = useState(0);
  const [show_success, set_success] = useState(false);

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

  const form = useForm();
  const { register, handleSubmit } = form;

  const count_change = useSelector((state) => state.Count.isLoad);

  const dispatch = useDispatch();

  // Hàm này dùng để thanh toán offline
  const onSubmit = async (data) => {
    if (VND.format(total_price) === 0) {
      return;
    }
    if (localStorage.getItem("id_coupon")) {
      await CouponAPI.updateCoupon(localStorage.getItem("id_coupon"));
    }

    // data Delivery
    const data_delivery = {
      // id_delivery:  Math.random.toString(),
      fullname: data.fullname,
      phone: data.phone
    };

    // Xứ lý API Delivery
    const response_delivery = await NoteAPI.post_note(data_delivery);

    // data Order
    const data_order = {
      id_user: sessionStorage.getItem("id_user"),
      address: data.address,
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
    set_success(true);
    setTimeout(() => {
      set_success(false);
    }, 1000);

    window.location.replace("/");
  };

  // Kiểm tra xem khách hàng đã nhập chỉ nhận hàng hay chưa
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
              Bạn Đã Thêm Hàng Thành Công!
            </h4>
          </div>
        </div>
      )}
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
            <form
              onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
              className="mt-10"
            >
              <div className="name">
                <div>
                  <label htmlFor="f-name">Tên đầy đủ</label>
                  <input
                    name="fullname"
                    ref={register({ required: "Vui lòng nhập tên đầy đủ" })}
                  />
                  {form.errors.fullname && (
                    <p className="text-danger">
                      {form.errors.fullname.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="l-name">Địa chỉ</label>
                  <input
                    name="address"
                    ref={register({ required: "Vui lòng nhập địa chỉ đầy đủ" })}
                    type="text"
                    className="form-control"
                  />
                  {form.errors.address && (
                    <p className="text-danger">{form.errors.address.message}</p>
                  )}
                </div>
              </div>
              <div className="street">
                <label htmlFor="name">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  ref={register({
                    required: "Vui lòng nhập số điện thoại đầy đủ"
                  })}
                  className="form-control"
                />
                {form.errors.phone && (
                  <p className="text-danger">{form.errors.phone.message}</p>
                )}
              </div>
              <div className="address-info">
                <div>
                  <label htmlFor="city">Email</label>
                  <input
                    type="text"
                    name="email"
                    ref={register({
                      required: "Vui lòng nhập email đầy đủ"
                    })}
                    className="form-control"
                  />
                  {form.errors.email && (
                    <p className="text-danger">{form.errors.email.message}</p>
                  )}
                </div>
              </div>
              <div>Tổng giá tiền : {VND.format(total_price)}</div>
              <div className="mt-2">
                Phương thức thanh toán: Thanh toán khi nhận hàng
              </div>

              <div className="btns mt-10">
                <button className="btn btn-primary" type="submit">
                  Thanh toán
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
