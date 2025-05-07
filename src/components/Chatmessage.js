import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

const Chatmessage = ({ chat }) => {
  return (
    !chat.hideInChat && (
      <div
        className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
          chat.isError ? "error" : ""
        }`}
      >
        {chat.role === "model" && (
          <label>
            <FontAwesomeIcon icon={faRobot}></FontAwesomeIcon>
          </label>
        )}
        <p className="message-text">{chat.text}</p>
      </div>
    )
  );
};

export default Chatmessage;
