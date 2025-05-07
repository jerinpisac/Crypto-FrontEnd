import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

const Chatform = ({chathistory, setchathistory, generatebotresponse}) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();

        if(!userMessage) return;

        inputRef.current.value = "";

        setchathistory(history => [...history, {role: "user", text: userMessage}]);

        setTimeout(() => {
            setchathistory(history => [...history, {role: "model", text: "Thinking..."}]);
            generatebotresponse([...chathistory, {role: "user", text: userMessage}]);
            }
        , 600);

        
    }

  return (
    <form action="#" className='chat-form' onSubmit={handleFormSubmit}>
        <input ref={inputRef} type='text' placeholder='Message...' className='message-input' required />
        <button className='material-symbols-rounded'><FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon></button>
    </form>
  )
}

export default Chatform