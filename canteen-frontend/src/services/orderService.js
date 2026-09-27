import axios from "axios";

const ORDER_SERVICE_URL = "http://localhost:8083";

export const createOrder = async (orderData) => {
  const response = await axios.post(
    `${ORDER_SERVICE_URL}/api/orders`,
    orderData
  );

  return response.data;
};

export const getOrdersByUserId = async (userId) => {
  const response = await axios.get(
    `${ORDER_SERVICE_URL}/api/orders/user/${userId}`
  );

  return response.data;
};