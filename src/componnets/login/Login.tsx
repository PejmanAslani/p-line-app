import "./Login.css";
import "../../App.css";
import Avatar from "../../images/user.png";
import PlineTools, { TypeMessage } from "../services/PlineTools";
import React, { useCallback, useState } from 'react';
import Captcha from 'react-captcha-code';
import CheckboxCustom from "../reuseables/CheckboxCustom";
import { Col, Row } from "react-bootstrap";
interface LoginProps {
  LoginAction: Function;
}

function Login(props: LoginProps) {

  const handleChange = useCallback((captcha: any) => {
    setCapth({ ...captcha, image: captcha })
  }, []);

  const [state, setState] = useState({
    username: "",
    password: "",
    RememberMe: false,
  });
  const [captcha, setCapth] = useState({
    input: "",
    image: ""
  });

  const Login = (e: any) => {
    e.preventDefault();
    if (captcha.image === captcha.input) {
      PlineTools.postRequest("/users/login", state).then((result) => {
        if (result.data.hasError === false) {
          // PlineTools.dialogMessage("Login Successfully");
          props.LoginAction(result.data);
        } else {
          result.data.messages.forEach((v: string) => {
            PlineTools.dialogMessage(v, "Error", TypeMessage.ERROR);
          });
        }
      });
    } else {

      PlineTools.dialogMessage('Wrong Captcha ,Try Again...', 'Captcha Error')
    }
  };

  return (
    <>
      <div className="demo-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-12 mx-auto">
              <div className="text-center image-size-small position-relative">
                <img src={Avatar} className="rounded-circle p-2 bg-white" />
                <div className="icon-camera">
                  <a href="" className="text-primary"><i className="lni lni-camera"></i></a>
                </div>
              </div>
              <div className="p-5 login-body bg-white rounded shadow-lg">
                {/* <div className="checkbox-wrapper-6">
                  <input className="tgl tgl-light" id="cb1-6" type="checkbox" />
                  <label className="tgl-btn" htmlFor="cb1-6" />
                </div> */}
                <h3 className="mb-2 text-center pt-5">KAJ</h3>
                <form onSubmit={Login}>
                <label htmlFor="inp" className="inp">
                    <input type="text" onChange={(e) => { state.username = e.target.value }} id="inp" placeholder="&nbsp;" />
                    <span className="label">username</span>
                    <span className="focus-bg"></span>
                  </label>
                  <label htmlFor="inp" className="inp">
                    <input type="password"  onChange={(e) => { state.password = e.target.value }} id="inp" placeholder="&nbsp;" />
                    <span className="label">password</span>
                    <span className="focus-bg"></span>
                  </label>
                  <br />
                  <br />

                  <Row>

                    <br />
                    <CheckboxCustom
                      name="rememberMe"
                      label="Remmeber Me"
                      setState={setState}
                    />
                    <Col style={{ margin: "30px" }}>
                     
                    </Col>
                  </Row>
                  <div className="text-center">
                  <button className="button">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div classNameName="demo-container">
        <div classNameName="container">
          <div classNameName="row">
            <div classNameName="col-lg-6 col-12 mx-auto">
              <div classNameName="text-center pb-5"> <img classNameName="avatar" src={Avatar} alt="Avatar" /></div>
              <div classNameName="p-5 rounded shadow-lg" style={{ background: "#efeff0" }}>
                <h2 classNameName="mb-2 text-center">Login</h2>
                <form onSubmit={Login}>
                  <label classNameName="font-500">UserName</label>
                  <input name="" onChange={(e) => {
                    state.username = e.target.value;

                  }} classNameName="form-control form-control-lg mb-3 custom" type="text" autoComplete="off" />
                  <label classNameName="font-500">Password</label>
                  <input name="" onChange={(e) => {
                    state.password = e.target.value
                  }} classNameName="form-control form-control-lg custom" type="password" autoComplete="off" />
                  <br />
                  <CheckboxCustom
                    name="rememberMe"
                    label="Remmeber Me"
                    setState={setState}

                  />


                  <button classNameName="btn btn-success btn-login w-100 shadow-lg" type="submit">Login</button>
                </form>
                <div classNameName="text-center pt-4">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default Login;
      /* <div classNameNameName="login my-center">
<div classNameNameName="card card-container">
<img
id="profile-img"
classNameNameName="profile-img-card"
src={Avatar}
alt="Avatar"
/>
<p id="profile-name" classNameNameName="profile-name-card"></p>
<form onSubmit={Login} classNameNameName="form-signin">
<span id="reauth-email" classNameNameName="reauth-email"></span>
<div classNameNameName="form__group field">
<input type="input" classNameNameName="form__field"
defaultValue={state.username}
autoComplete="off"
onChange={(e) => {
state.username = e.target.value;
}}
placeholder="userName" name="name" id='name' required />
<label htmlFor="name" classNameNameName="form__label">UserName</label>
</div>
<br />
 
<div classNameNameName="form__group field">
<input style={{ width: "280px", textAlign: "left" }} classNameNameName="form__field"
autoComplete="off"
type="password"
defaultValue={state.password}
onChange={(e) => {
state.password = e.target.value;
}}
placeholder="Password" name="password" id='password' required />
<label htmlFor="password" classNameNameName="form__label">Password</label>
</div>
<div classNameNameName="form__group field">
<Captcha height={60} bgColor="#FFFFFF" width={280} fontSize={30} charNum={4} onChange={handleChange} />
</div>
<div classNameNameName="form__group field">
<input autoCapitalize="false" autoComplete="false" classNameNameName="form__field"
name="captcha" id='captcha' placeholder="Captcha" required
onChange={(e) => {
setCapth({ ...captcha, input: e.target.value });
}} />
<label classNameNameName="form__label">Captcha</label>
</div>
 

<button classNameNameName="btn-login " type="submit">
Login
</button>
</form>
{/* <a href="#" classNameNameName="forgot-password">
Forgot the password?
</a> 
</div>
</div> */