import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500
}) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingDelay, setTypingDelay] = useState(typingSpeed);

  useEffect(() => {
    const word = words[loopNum % words.length];
    
    const tick = () => {
      let newText = isDeleting
        ? word.substring(0, text.length - 1)
        : word.substring(0, text.length + 1);
      
      setText(newText);

      if (isDeleting) {
        setTypingDelay(deletingSpeed);
      } else {
        setTypingDelay(typingSpeed);
      }

      if (!isDeleting && newText === word) {
        // Start deleting after pause
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && newText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(tick, typingDelay);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingDelay, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="typing-animation">
      {text}<span className="cursor">|</span>
    </span>
  );
};

export default TypingAnimation;