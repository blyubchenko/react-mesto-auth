import React from "react";
import * as Auth from "../utils/auth.js";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();
  const [formValue, setFormValue] = React.useState({
    email: "",
    password: "",
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (!formValue.email || !formValue.password) {
      return;
    }
    Auth.login(formValue.email, formValue.password)
      .then((data) => {
        console.log(data);
        if (data.token) {
          setFormValue({ email: "", password: "" });
          props.handleLogin(e);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => console.log(err));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  }
  return (
    <div className="login">
      <h3 className="login__title">Вход</h3>
      <form onSubmit={handleSubmit} className="login__form">
        <div className="login__inputs">
          <input
            required
            id="email"
            name="email"
            type="text"
            value={formValue.email}
            onChange={handleChange}
            className="login__input"
            placeholder="Email"
          />
          <input
            required
            id="password"
            name="password"
            type="password"
            value={formValue.password}
            onChange={handleChange}
            className="login__input"
            placeholder="Пароль"
          />
        </div>
        <button type="submit" className="login__button">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
