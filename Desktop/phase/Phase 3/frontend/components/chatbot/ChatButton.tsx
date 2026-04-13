"use client";

import React, { useState } from 'react';
import { useChatContext } from './ChatProvider';
import styles from './ChatButton.module.css';

const ChatButton: React.FC = () => {
  const { toggleChat } = useChatContext();
  const [isPulsing, setIsPulsing] = useState(true);

  // Stop pulsing animation after initial render
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000); // Stop pulsing after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      className={`${styles.chatButton} ${isPulsing ? styles.pulse : ''}`}
      onClick={toggleChat}
      aria-label="Open chatbot"
    >
      <div className={styles.icon}>🤖</div>
    </button>
  );
};

export default ChatButton;