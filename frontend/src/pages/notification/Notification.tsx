import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Single from "../../components/single/Single";
import "./notification.scss";

interface NotificationData {
  id: number;
  user_id: number;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const Notification = () => {
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<NotificationData | null>(null);

  useEffect(() => {
    if (!id) {
      alert("Notification ID is missing from the URL.");
      return;
    }
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/notifications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotification(data.notification);
        } else {
          alert("Notification not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching notification:", err);
        alert("Failed to load notification.");
      });
  }, [id]);

  if (!notification) return <div>Loading...</div>;

  const info = [
    { label: "User ID", value: notification.user_id },
    { label: "Title", value: notification.title },
    { label: "Message", value: notification.message },
    { label: "Created At", value: new Date(notification.created_at).toLocaleString() },
    { label: "Updated At", value: new Date(notification.updated_at).toLocaleString() },
  ];

  return (
    <div className="notification">
      <Single
        id={notification.id}
        title="Notification Detail"
        info={info}
      />
    </div>
  );
};

export default Notification;
