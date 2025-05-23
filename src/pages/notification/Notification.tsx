import Single from "../../components/single/Single";
import "./notification.scss";

const notificationData = {
  id: 1,
  user_id: 101,
  title: "High Temperature",
  message: "Temperature has exceeded the safe limit.",
  created_at: new Date("2025-05-22T08:00:00Z"),
  updated_at: new Date("2025-05-22T08:05:00Z"),
};

const Notification = () => {
  const info = [
    { label: "User ID", value: notificationData.user_id },
    { label: "Title", value: notificationData.title },
    { label: "Message", value: notificationData.message },
    { label: "Created At", value: notificationData.created_at.toLocaleString() },
    { label: "Updated At", value: notificationData.updated_at.toLocaleString() },
  ];

  return (
    <div className="notification">
      <Single
        id={notificationData.id}
        title="Notification Detail"
        info={info}
      />
    </div>
  );
};

export default Notification;
