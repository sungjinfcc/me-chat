import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../authContext";

function Chatroom() {
  const { chatroom_id } = useParams();
  const { token } = useAuth();
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigator = useNavigate();

  const api = process.env.REACT_APP_API_BASE_URL;

  const validateForm = () => {
    const updatedErrors = {
      message: message.trim() === "",
    };

    return Object.values(updatedErrors).every((error) => !error);
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

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className="chatroom">
      <h1 className="title">Room title</h1>
      <button onClick={goBack}>Go back</button>
      <div className="messages">
        {messages.map((m) => {
          return (
            <div className="message">
              <p className="name">{m.user.username}</p>
              <p className="content">{m.message}</p>
              <p className="timestamp">{m.timestamp}</p>
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
        <button onClick={handleSubmit}>Submit</button>
      </form>
      {error && <p className="error-message">{error}</p>}{" "}
    </div>
  );
}

export default Chatroom;
