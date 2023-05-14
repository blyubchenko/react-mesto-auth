import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { CurrentUserContext } from "../blocks/contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ActionConfirmationPopup from "./ActionConfirmationPopup";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRouteElement from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip ";
import * as Auth from "../utils/auth.js";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardToDelete, setCardToDelete] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [isSuccessRegister, setSuccessRegister] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditConfirmationPopupOpen, setEditConfirmationPopupOpen] =
    useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    api
      .getAllData()
      .then((res) => {
        const [cardsData, userData] = res;
        setCards(cardsData);
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    tokenCheck();
  }, []);

  function register(email, password) {
    Auth.register(email, password)
      .then((res) => {
        console.log(res);
        setSuccessRegister(true);
        openInfoTooltips();
        navigate("/sign-in");
      })
      .catch((err) => {
        console.log(err);
        setSuccessRegister(false);
        openInfoTooltips();
      });
  }

  function tokenCheck() {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        Auth.getContent(jwt).then((res) => {
          if (res) {
            const emailData = res.data.email;
            setEmail(emailData);
            setLoggedIn(true);
            navigate("/", { replace: true });
          }
        });
      }
    }
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleDeleteCardClick(cardId) {
    setEditConfirmationPopupOpen(!isEditConfirmationPopupOpen);
    setCardToDelete(cardId);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function openInfoTooltips() {
    setInfoTooltipOpen(!isInfoTooltipOpen);
  }

  function handleCardDelete(card) {
    api
      .cardDelete(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => card._id !== item._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(userInfo) {
    setLoading(true);
    api
      .editUserInfo(userInfo)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  function handleUpdateAvatar(dataAvatar) {
    setLoading(true);
    api
      .replaceAvatar(dataAvatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  function handleAddPlaceSubmit(cardData) {
    setLoading(true);
    api
      .createNewCard(cardData)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setEditConfirmationPopupOpen(false);
    setSelectedCard({});
    setInfoTooltipOpen(false);
  }

  function handleLogin(e) {
    e.preventDefault();
    setLoggedIn(true);
  }

  function signOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    navigate("/sign-in");
  }

  function loginNavigate() {
    navigate("/sign-up");
  }

  function registerNavigate() {
    navigate("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="*"
            element={
              <>
                <Header
                  text="Выйти"
                  email={email}
                  loggedIn={loggedIn}
                  onClick={signOut}
                />
                <ProtectedRouteElement
                  element={Main}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDeleteCardClick}
                  cards={cards}
                  loggedIn={loggedIn}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="/sign-in"
            element={
              <>
                <Header text="Регистрация" onClick={loginNavigate} />
                <Login handleLogin={handleLogin} />
              </>
            }
          />
          <Route
            path="/sign-up"
            element={
              <>
                <Header text="Войти" onClick={registerNavigate} />
                <Register onRegister={register} />
              </>
            }
          />
        </Routes>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={loading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={loading}
          inputValue=""
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={loading}
        />

        <ActionConfirmationPopup
          isOpen={isEditConfirmationPopupOpen}
          onClose={closeAllPopups}
          onDeleteCard={handleCardDelete}
          card={cardToDelete}
        />

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccess={isSuccessRegister}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
