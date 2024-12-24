import React from "react";
import PropTypes from "prop-types";

Contact.propTypes = {};

function Contact(props) {
  return (
    <div>
      <div className="breadcrumb-area">
        <div className="container">
          <div className="breadcrumb-content">
            <ul>
              <li>
                <a href="index.html">Trang chủ</a>
              </li>
              <li className="active">Liên hệ</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="contact-main-page mt-60 mb-40 mb-md-40 mb-sm-40 mb-xs-40">
        <div className="container mb-60">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602324215048!2d106.66521371480079!3d10.776019492321794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752edba026cb75%3A0xb2a9aab49da1c58f!2zMTU1IFPGsCBW4bqhbiBI4bqhbmgsIFBoxrDhu51uZyAxMiwgUXXhuq1uIDEwLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1sen!2s!4v1616422635333!5m2!1sen!2s"
            width="600"
            height="450"
            style={{ border: "0" }}
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 offset-lg-1 col-md-12 order-1 order-lg-2">
              <div className="contact-page-side-content">
                <h3 className="contact-page-title">Liên hệ với chúng tôi</h3>
                <p className="contact-page-message mb-25">
                  Thành lập năm 2012, nhiều năm qua đã khẳng định chất lượng, uy
                  tín với khách hàng. Chúng tôi chuyên cung cấp mỹ phẩm hàn quốc
                  The Face Shop chính hãng. Tư vấn nhiệt tình, giao hàng siêu
                  tốc và thu tiền tận nơi trên toàn quốc.
                </p>
                <div className="single-contact-block">
                  <h4>
                    <i className="fa fa-fax"></i> Địa chỉ
                  </h4>
                  <p>
                    155 Sư Vạn Hạnh, Phường 12, Quận 10, Thành phố Hồ Chí Minh
                  </p>
                </div>
                <div className="single-contact-block">
                  <h4>
                    <i className="fa fa-phone"></i> Số điện thoại
                  </h4>
                  <p>Mobile: 0763557366</p>
                  <p>Hotline: 1900100 Biết</p>
                </div>
                <div className="single-contact-block last-child">
                  <h4>
                    <i className="fa fa-envelope-o"></i> Email
                  </h4>
                  <p>hongnmp@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 order-2 order-lg-1">
              <div className="contact-form-content pt-sm-55 pt-xs-55">
                <h3 className="contact-page-title">
                  Hãy cho chúng tôi biết tin nhắn của bạn
                </h3>
                <div className="contact-form">
                  <form
                    id="contact-form"
                    action="http://demo.hasthemes.com/limupa-v3/limupa/mail.php"
                    method="post"
                  >
                    <div className="form-group">
                      <label>
                        Họ và Tên <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        id="customername"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        id="customerEmail"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        name="contactSubject"
                        id="contactSubject"
                      />
                    </div>
                    <div className="form-group mb-30">
                      <label>Tin nhắn</label>
                      <textarea
                        name="contactMessage"
                        id="contactMessage"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <input
                        type="submit"
                        value="Gửi"
                        className="li-btn-3"
                        name="submit"
                      />
                    </div>
                  </form>
                </div>
                <p className="form-messege"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
