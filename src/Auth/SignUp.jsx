import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import User from "../API/User";
import { useForm } from "react-hook-form";

SignUp.propTypes = {};

function SignUp(props) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const [fullname, set_fullname] = useState("");
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [confirm, set_confirm] = useState("");
  const [email, set_email] = useState("");

  const [show_success, set_show_success] = useState(false);

  const [errorEmail, setEmailError] = useState(false);
  const [errorFullname, setFullnameError] = useState(false);
  const [errorUsername, setUsernameError] = useState(false);
  const [errorPassword, setPasswordError] = useState(false);
  const [errorConfirm, setConfirmError] = useState(false);
  const [errorCheckPass, setCheckPass] = useState(false);

  const [username_exist, set_username_exist] = useState(false);

  const handler_signup = (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    if (!fullname) {
      setFullnameError(true);
      setUsernameError(false);
      setPasswordError(false);
      setConfirmError(false);
      return;
    } else {
      setFullnameError(false);
      setUsernameError(false);
      setPasswordError(false);
      setConfirmError(false);

      if (!username) {
        setFullnameError(false);
        setUsernameError(true);
        setPasswordError(false);
        setConfirmError(false);
        return;
      } else {
        setFullnameError(false);
        setUsernameError(false);
        setPasswordError(false);
        setConfirmError(false);

        if (!password) {
          setFullnameError(false);
          setUsernameError(false);
          setPasswordError(true);
          setConfirmError(false);
          return;
        } else {
          setFullnameError(false);
          setUsernameError(false);
          setPasswordError(false);
          setConfirmError(false);

          if (!confirm) {
            setFullnameError(false);
            setUsernameError(false);
            setPasswordError(false);
            setConfirmError(true);
            return;
          } else {
            setFullnameError(false);
            setUsernameError(false);
            setPasswordError(false);
            setConfirmError(false);

            if (password !== confirm) {
              setFullnameError(false);
              setUsernameError(false);
              setPasswordError(false);
              setConfirmError(false);
              setCheckPass(true);
              return;
            } else {
              setConfirmError(false);
              setCheckPass(false);

              const fetchData = async () => {
                const data = {
                  email: email,
                  username: username,
                  password: password,
                  fullname: fullname,
                  id_permission: "6087dcb5f269113b3460fce4"
                };

                const response = await User.Post_User(data);

                console.log(response);

                if (response === "User Da Ton Tai") {
                  set_username_exist(true);
                } else {
                  set_show_success(true);
                }
              };

              fetchData();

              set_fullname("");
              set_username("");
              set_password("");
              set_fullname("");
              set_confirm("");
            }
          }
        }
      }
    }

    setTimeout(() => {
      set_show_success(false);
    }, 1500);
  };

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
              Bạn Đã Đăng Ký Thành Công!
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
              <li className="active">Đăng ký</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="page-section mb-60">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-6 col-xs-12 mr_signin">
              <form action="#">
                <div className="login-form">
                  <h4 className="login-title">Đăng ký</h4>
                  <div className="row">
                    <div className="col-md-12 mb-20">
                      <label>Email *</label>
                      <input
                        className="mb-0"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => set_email(e.target.value)}
                      />
                      {errorEmail && (
                        <span style={{ color: "red" }}>
                          * Email là bắt buộc!
                        </span>
                      )}
                    </div>
                    <div className="col-md-12 mb-20">
                      <label>Họ và Tên *</label>
                      <input
                        className="mb-0"
                        type="text"
                        placeholder="First Name"
                        value={fullname}
                        onChange={(e) => set_fullname(e.target.value)}
                      />
                      {errorFullname && (
                        <span style={{ color: "red" }}>
                          * Họ và tên là bắt buộc!
                        </span>
                      )}
                    </div>
                    <div className="col-md-12 mb-20">
                      <label>Tên tài khoản *</label>
                      <input
                        className="mb-0"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => set_username(e.target.value)}
                      />
                      {errorUsername && (
                        <span style={{ color: "red" }}>
                          * Tên tài khoản là bắt buộc!
                        </span>
                      )}
                      {username_exist && (
                        <span style={{ color: "red" }}>
                          * Tên tài khoản đã tồn tại!
                        </span>
                      )}
                    </div>
                    <div className="col-md-6 mb-20">
                      <label>Mật khẩu *</label>
                      <input
                        className="mb-0"
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => set_password(e.target.value)}
                      />
                      {errorPassword && (
                        <span style={{ color: "red" }}>
                          * Mật khẩu là bắt buộc!
                        </span>
                      )}
                    </div>
                    <div className="col-md-6 mb-20">
                      <label>Nhập lại mật khẩu *</label>
                      <input
                        className="mb-0"
                        type="password"
                        placeholder="Mật khẩu"
                        value={confirm}
                        onChange={(e) => set_confirm(e.target.value)}
                      />
                      {errorConfirm && (
                        <span style={{ color: "red" }}>
                          * Nhập lại mật khẩu là bắt buộc!
                        </span>
                      )}
                      {errorCheckPass && (
                        <span style={{ color: "red" }}>
                          * Mật khẩu không khớp!
                        </span>
                      )}
                    </div>
                    <div className="col-md-12 mb-20">
                      <div className="d-flex justify-content-end">
                        <Link to="/signin">Bạn đã có tài khoản?</Link>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="register-button mt-0"
                        style={{ cursor: "pointer" }}
                        onClick={handler_signup}
                      >
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
