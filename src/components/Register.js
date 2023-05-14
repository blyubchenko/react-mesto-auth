import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = formValue;
    props.onRegister(email, password);
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
      <h3 className="login__title">Регистрация</h3>
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
          Зарегистрироваться
        </button>
      </form>
      <Link to={"/sign-in"} className="login__link">
        Уже зарегистрированы? Войти
      </Link>
    </div>
  );
}

export default Register;
