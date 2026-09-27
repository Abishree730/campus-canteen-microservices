import axios from "axios";

const ORDER_SERVICE_URL = "http://localhost:8083";

export const getAllOrders = async () => {
  const response = await axios.get(
    `${ORDER_SERVICE_URL}/api/orders`
  );

  return response.data;
};

export const updateOrderStatus = async (
  orderId,
  status
) => {
  const response = await axios.put(
    `${ORDER_SERVICE_URL}/api/orders/${orderId}/status`,
    null,
    {
      params: {
        status: status,
      },
    }
  );

  return response.data;
};