import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../authContext";

function Chatroom() {
  const { chatroom_id, receiver_id } = useParams();
  const { user, token } = useAuth();
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatWith, setChatWith] = useState("");
  const navigator = useNavigate();
  const location = useLocation();

  const api = process.env.REACT_APP_API_BASE_URL;

  const validateForm = () => {
    const updatedErrors = {
      message: message.trim() === "",
    };

    return Object.values(updatedErrors).every((error) => !error);
  };
  const getNameFromId = async (id) => {
    try {
      const response = await fetch(`${api}/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      const data = await response.json();
      setChatWith(data.username);
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      return null;
    }
  };

  const getMessages = async () => {
    try {
      const response = await fetch(`${api}/chatroom/${chatroom_id}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }
    try {
      const response = await fetch(
        `${api}/chatroom/${chatroom_id}/message/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }
      setMessage("");
      getMessages();
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const goBack = () => {
    navigator("/main");
  };
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}${ampm}`;
  }

  useEffect(() => {
    getMessages();
    getNameFromId(receiver_id);
  }, []);

  return (
    <div className="chatroom">
      <header>
        <h1 className="title">Chat with {chatWith}</h1>
        <button onClick={goBack}>back</button>
      </header>
      <div className="messages">
        {messages.map((m) => {
          const decodedMessage = m.message.replace(/&#x27;/g, "'");
          const isMine = m.user.username === user?.username;
          return isMine ? (
            <div className="message mine">
              <div className="content">
                <p className="name">{m.user.username}</p>
                <p className="content">{decodedMessage}</p>
              </div>
              <p className="timestamp">{formatDate(m.timestamp)}</p>
            </div>
          ) : (
            <div className="message">
              <div className="content">
                <p className="name">{m.user.username}</p>
                <p className="content">{decodedMessage}</p>
              </div>
              <p className="timestamp">{formatDate(m.timestamp)}</p>
            </div>
          );
        })}
      </div>
      <form className="message-form">
        <input
          id="message"
          type="text"
          placeholder="Type here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSubmit}>Send</button>
      </form>
      {error && <p className="error-message">{error}</p>}{" "}
    </div>
  );
}

export default Chatroom;
