import axios from "axios";

const NOTIFICATION_SERVICE_URL =
  "http://localhost:8084";

export const getNotifications = async (userId) => {
  const response = await axios.get(
    `${NOTIFICATION_SERVICE_URL}/api/notifications/${userId}`
  );

  return response.data;
};