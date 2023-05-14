import React from "react";
import logoTrue from "../images/logo/true.svg";
import logoFalse from "../images/logo/false.svg";
function InfoTooltip(props) {
  return (
    <div className={`popup  ${props.isOpen ? "popup_opened" : ""} `}>
      <div className="popup__container">
        <button
          className="popup__button-close"
          type="button"
          aria-label="Закрыть окно"
          onClick={props.onClose}
        ></button>
        <img
          src={props.isSuccess ? logoTrue : logoFalse}
          alt={props.isSuccess ? "Успешная регистрация" : "Ошибка регистрации"}
          className="popup__icon"
        />
        <p className="popup__subtitle">
          {props.isSuccess
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}
        </p>
      </div>
    </div>
  );
}
export default InfoTooltip;
