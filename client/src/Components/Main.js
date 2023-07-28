import React, { useEffect, useState } from "react";
import { useAuth } from "../authContext";
import { Link, useNavigate } from "react-router-dom";
import _ from "lodash";

function Main() {
  const { user, token, login, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [name, setName] = useState("");
  const navigator = useNavigate();

  const api = process.env.REACT_APP_API_BASE_URL;

  const getRooms = async () => {
    try {
      const response = await fetch(`${api}/chatrooms`, {
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
      const filteredRooms = data.filter((room) =>
        room.users.includes(user._id)
      );

      setRooms(filteredRooms);
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const getFriends = async () => {
    try {
      const response = await fetch(`${api}/users`, {
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
      const filteredFriends = data.filter(
        (friend) => friend.username !== user.username
      );
      setFriends(filteredFriends);
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const startChat = async (receiver) => {
    try {
      const response = await fetch(`${api}/chatroom/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiver: receiver }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }
      const data = await response.json();
      navigator(`/chatroom/${data.id}`);
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const endChat = async (roomId) => {
    try {
      const response = await fetch(`${api}/chatroom/${roomId}/delete`, {
        method: "DELETE",
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
      getRooms();
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };
  const validateForm = () => {
    const updatedErrors = {
      name: name.trim() === "",
    };

    return Object.values(updatedErrors).every((error) => !error);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isFormValid = validateForm();

    if (!isFormValid) {
      return;
    }
    try {
      const response = await fetch(`${api}/user/${user._id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: name }),
      });
      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }
      const data = await response.json();
      login(token, data.user);
      setOnEdit(false);
      setName("");
      setError(null);
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const signout = () => {
    logout();
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    getRooms();
    getFriends();
  }, []);

  return (
    <div className="main">
      {error && <p className="error-message">{error}</p>}
      <h1>Welcome {user?.username}</h1>
      {onEdit ? (
        <div className="modal">
          <form className="name-form">
            <label htmlFor="name">Enter new name</label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
          </form>
        </div>
      ) : (
        <button onClick={() => setOnEdit(true)}>Edit</button>
      )}
      <button onClick={signout}>Logout</button>
      <h2>Friends</h2>
      <div className="friends">
        {friends.map((friend) => {
          return (
            <div className="friend">
              <div className="friend-name">{friend.username}</div>
              <button onClick={() => startChat(friend._id)}>Start chat</button>
            </div>
          );
        })}
      </div>
      <h2>Rooms</h2>
      <div className="rooms">
        {rooms.map((room) => {
          return (
            <div className="room">
              <Link to={`/chatroom/${room._id}`}>
                <div className="room-title">{room.title}</div>
              </Link>
              <button onClick={() => endChat(room._id)}>Exit</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Main;