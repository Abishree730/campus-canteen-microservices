import axios from "axios";

const MENU_SERVICE_URL = "http://localhost:8082";

export const getMenuItems = async () => {
  const response = await axios.get(
    `${MENU_SERVICE_URL}/api/menu/items`
  );

  return response.data;
};

export const createMenuItem = async (foodItem) => {
  const response = await axios.post(
    `${MENU_SERVICE_URL}/api/menu/items`,
    foodItem
  );

  return response.data;
};

export const updateMenuItem = async (
  foodItemId,
  foodItem
) => {
  const response = await axios.put(
    `${MENU_SERVICE_URL}/api/menu/items/${foodItemId}`,
    foodItem
  );

  return response.data;
};

export const deleteMenuItem = async (foodItemId) => {
  await axios.delete(
    `${MENU_SERVICE_URL}/api/menu/items/${foodItemId}`
  );
};