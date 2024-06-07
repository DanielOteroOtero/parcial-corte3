import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const AlertMessage = ({ message, type, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (show) {
    return (
      <Alert variant={type} onClose={() => setShow(false)} dismissible>
        {message}
      </Alert>
    );
  }
  return null;
};

export default AlertMessage;
