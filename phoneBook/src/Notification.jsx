const Notification = ({ message, classN }) => {
  if (message === null) {
    return null;
  }

  return <div className={classN}>{message}</div>;
};

export default Notification;
