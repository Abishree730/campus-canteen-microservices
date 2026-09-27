import { useEffect, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../services/adminService";

import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService";

function AdminDashboard({ onBackToMenu }) {
  /* =========================
     ORDER MANAGEMENT
     ========================= */

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] =
    useState(true);
  const [ordersError, setOrdersError] =
    useState("");
  const [updatingOrder, setUpdatingOrder] =
    useState(null);

  /* =========================
     MENU MANAGEMENT
     ========================= */

  const [menuItems, setMenuItems] =
    useState([]);

  const [menuLoading, setMenuLoading] =
    useState(true);

  const [menuError, setMenuError] =
    useState("");

  const [menuSuccess, setMenuSuccess] =
    useState("");

  const [editingItem, setEditingItem] =
    useState(null);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [savingMenuItem, setSavingMenuItem] =
    useState(false);

  const [deletingItem, setDeletingItem] =
    useState(null);

  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
  });

  /* =========================
     LOAD ORDERS
     ========================= */

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError("");

      const data = await getAllOrders();

      setOrders(data);
    } catch (error) {
      console.error(
        "Error loading orders:",
        error
      );

      setOrdersError(
        "Unable to load orders. Please make sure Order Service is running."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  /* =========================
     LOAD MENU
     ========================= */

  const loadMenuItems = async () => {
    try {
      setMenuLoading(true);
      setMenuError("");

      const data = await getMenuItems();

      setMenuItems(data);
    } catch (error) {
      console.error(
        "Error loading menu:",
        error
      );

      setMenuError(
        "Unable to load menu. Please make sure Menu Service is running."
      );
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadMenuItems();
  }, []);

  /* =========================
     UPDATE ORDER STATUS
     ========================= */

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrder(orderId);
      setOrdersError("");

      const updatedOrder =
        await updateOrderStatus(
          orderId,
          status
        );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order
        )
      );
    } catch (error) {
      console.error(
        "Error updating order status:",
        error
      );

      if (error.response?.data?.message) {
        setOrdersError(
          error.response.data.message
        );
      } else {
        setOrdersError(
          "Unable to update order status."
        );
      }
    } finally {
      setUpdatingOrder(null);
    }
  };

  /* =========================
     FORM HANDLING
     ========================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setMenuForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (
    event
  ) => {
    setMenuForm((previous) => ({
      ...previous,
      available:
        event.target.value === "true",
    }));
  };

  /* =========================
     RESET FORM
     ========================= */

  const resetMenuForm = () => {
    setMenuForm({
      name: "",
      description: "",
      price: "",
      available: true,
    });

    setEditingItem(null);
    setShowAddForm(false);
  };

  /* =========================
     START ADD
     ========================= */

  const handleAddFood = () => {
    setMenuSuccess("");
    setMenuError("");

    setMenuForm({
      name: "",
      description: "",
      price: "",
      available: true,
    });

    setEditingItem(null);
    setShowAddForm(true);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  /* =========================
     START EDIT
     ========================= */

  const handleEditFood = (item) => {
    setMenuSuccess("");
    setMenuError("");

    setEditingItem(item);
    setShowAddForm(false);

    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      available: item.available,
    });

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  /* =========================
     SAVE FOOD
     ========================= */

  const handleSaveFood = async (event) => {
    event.preventDefault();

    try {
      setSavingMenuItem(true);
      setMenuError("");
      setMenuSuccess("");

      const foodItem = {
        name: menuForm.name.trim(),
        description:
          menuForm.description.trim(),
        price: Number(menuForm.price),
        available: menuForm.available,
      };

      if (!foodItem.name) {
        setMenuError(
          "Food name is required."
        );
        return;
      }

      if (!foodItem.description) {
        setMenuError(
          "Food description is required."
        );
        return;
      }

      if (
        !foodItem.price ||
        foodItem.price < 1
      ) {
        setMenuError(
          "Price must be at least ₹1."
        );
        return;
      }

      if (editingItem) {
        const updatedItem =
          await updateMenuItem(
            editingItem.id,
            foodItem
          );

        setMenuItems((previous) =>
          previous.map((item) =>
            item.id === updatedItem.id
              ? updatedItem
              : item
          )
        );

        setMenuSuccess(
          `${updatedItem.name} updated successfully.`
        );
      } else {
        const newItem =
          await createMenuItem(
            foodItem
          );

        setMenuItems((previous) => [
          ...previous,
          newItem,
        ]);

        setMenuSuccess(
          `${newItem.name} added successfully.`
        );
      }

      resetMenuForm();
    } catch (error) {
      console.error(
        "Error saving menu item:",
        error
      );

      if (error.response?.data?.message) {
        setMenuError(
          error.response.data.message
        );
      } else {
        setMenuError(
          "Unable to save food item. Please make sure Menu Service is running."
        );
      }
    } finally {
      setSavingMenuItem(false);
    }
  };

  /* =========================
     TOGGLE AVAILABILITY
     ========================= */

  const handleToggleAvailability = async (
    item
  ) => {
    try {
      setMenuError("");
      setMenuSuccess("");

      const updatedItem = {
        name: item.name,
        description: item.description,
        price: item.price,
        available: !item.available,
      };

      const response =
        await updateMenuItem(
          item.id,
          updatedItem
        );

      setMenuItems((previous) =>
        previous.map((menuItem) =>
          menuItem.id === response.id
            ? response
            : menuItem
        )
      );

      setMenuSuccess(
        `${response.name} is now ${
          response.available
            ? "available"
            : "unavailable"
        }.`
      );
    } catch (error) {
      console.error(
        "Error updating availability:",
        error
      );

      setMenuError(
        "Unable to update food availability."
      );
    }
  };

  /* =========================
     DELETE FOOD
     ========================= */

  const handleDeleteFood = async (
    item
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingItem(item.id);
      setMenuError("");
      setMenuSuccess("");

      await deleteMenuItem(item.id);

      setMenuItems((previous) =>
        previous.filter(
          (menuItem) =>
            menuItem.id !== item.id
        )
      );

      setMenuSuccess(
        `${item.name} deleted successfully.`
      );
    } catch (error) {
      console.error(
        "Error deleting food:",
        error
      );

      if (error.response?.data?.message) {
        setMenuError(
          error.response.data.message
        );
      } else {
        setMenuError(
          "Unable to delete food item."
        );
      }
    } finally {
      setDeletingItem(null);
    }
  };

  return (
    <main className="admin-page">

      {/* =========================
          ADMIN HEADER
          ========================= */}

      <div className="admin-header">

        <div>
          <h1>
            🛠️ Admin Dashboard
          </h1>

          <p>
            Manage customer orders and menu
          </p>
        </div>

        <button
          className="refresh-orders-button"
          onClick={() => {
            loadOrders();
            loadMenuItems();
          }}
        >
          🔄 Refresh
        </button>

      </div>

      {/* =========================
          ORDER MANAGEMENT
          ========================= */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>
            <h2>
              📦 Order Management
            </h2>

            <p>
              View and update customer orders
            </p>
          </div>

          <button
            className="refresh-orders-button"
            onClick={loadOrders}
          >
            🔄 Refresh Orders
          </button>

        </div>

        {ordersLoading && (
          <p className="message">
            Loading orders...
          </p>
        )}

        {ordersError && (
          <p className="error-message">
            {ordersError}
          </p>
        )}

        {!ordersLoading &&
          !ordersError &&
          orders.length === 0 && (
            <div className="order-message">
              No orders available.
            </div>
          )}

        {!ordersLoading &&
          !ordersError &&
          orders.length > 0 && (

            <div className="admin-orders-list">

              {orders.map((order) => (

                <div
                  className="admin-order-card"
                  key={order.id}
                >

                  <div className="admin-order-info">

                    <div className="order-food-icon">
                      🍽️
                    </div>

                    <div>

                      <h2>
                        Order #{order.id}
                      </h2>

                      <p>
                        <strong>
                          User ID:
                        </strong>{" "}
                        {order.userId}
                      </p>

                      <p>
                        <strong>
                          Food Item:
                        </strong>{" "}
                        #{order.foodItemId}
                      </p>

                      <p>
                        <strong>
                          Quantity:
                        </strong>{" "}
                        {order.quantity}
                      </p>

                      <p>
                        <strong>
                          Total:
                        </strong>{" "}
                        ₹{order.totalAmount}
                      </p>

                      <p>
                        <strong>
                          Ordered At:
                        </strong>{" "}
                        {order.orderedAt
                          ? new Date(
                              order.orderedAt
                            ).toLocaleString()
                          : "N/A"}
                      </p>

                    </div>

                  </div>

                  <div className="admin-status-section">

                    <span className="order-status">
                      {order.status}
                    </span>

                    <label>
                      Update Status
                    </label>

                    <select
                      value={order.status}
                      disabled={
                        updatingOrder ===
                        order.id
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                    >
                      <option value="PLACED">
                        PLACED
                      </option>

                      <option value="PREPARING">
                        PREPARING
                      </option>

                      <option value="READY">
                        READY
                      </option>

                      <option value="COMPLETED">
                        COMPLETED
                      </option>

                      <option value="CANCELLED">
                        CANCELLED
                      </option>

                    </select>

                    {updatingOrder ===
                      order.id && (
                      <small>
                        Updating...
                      </small>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

      </section>

      {/* =========================
          MENU MANAGEMENT
          ========================= */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>
            <h2>
              🍽️ Menu Management
            </h2>

            <p>
              Add, edit and manage canteen
              food items
            </p>
          </div>

          <button
            className="add-food-button"
            onClick={handleAddFood}
          >
            ➕ Add New Food
          </button>

        </div>

        {menuError && (
          <p className="error-message">
            {menuError}
          </p>
        )}

        {menuSuccess && (
          <div className="order-message">
            {menuSuccess}
          </div>
        )}

        {menuLoading && (
          <p className="message">
            Loading menu...
          </p>
        )}

        {!menuLoading &&
          menuItems.length === 0 && (
            <div className="order-message">
              No food items found.
              Add your first food item!
            </div>
          )}

        {!menuLoading &&
          menuItems.length > 0 && (

            <div className="admin-menu-grid">

              {menuItems.map((item) => (

                <div
                  className="admin-menu-card"
                  key={item.id}
                >

                  <div className="admin-menu-icon">
                    🍽️
                  </div>

                  <div className="admin-menu-details">

                    <h2>
                      {item.name}
                    </h2>

                    <p className="description">
                      {item.description}
                    </p>

                    <p className="price">
                      ₹{item.price}
                    </p>

                    <p
                      className={
                        item.available
                          ? "available"
                          : "unavailable"
                      }
                    >
                      {item.available
                        ? "🟢 Available"
                        : "🔴 Unavailable"}
                    </p>

                  </div>

                  <div className="admin-menu-actions">

                    <button
                      className="edit-food-button"
                      onClick={() =>
                        handleEditFood(item)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="availability-button"
                      onClick={() =>
                        handleToggleAvailability(
                          item
                        )
                      }
                    >
                      {item.available
                        ? "🔴 Make Unavailable"
                        : "🟢 Make Available"}
                    </button>

                    <button
                      className="delete-food-button"
                      onClick={() =>
                        handleDeleteFood(item)
                      }
                      disabled={
                        deletingItem ===
                        item.id
                      }
                    >
                      {deletingItem ===
                      item.id
                        ? "Deleting..."
                        : "🗑️ Delete"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </section>

      {/* =========================
          ADD / EDIT FOOD FORM
          ========================= */}

      {(showAddForm || editingItem) && (

        <section className="admin-section menu-form-section">

          <div className="admin-section-header">

            <div>

              <h2>
                {editingItem
                  ? "✏️ Edit Food"
                  : "➕ Add New Food"}
              </h2>

              <p>
                {editingItem
                  ? "Update the food item details"
                  : "Add a new item to today's menu"}
              </p>

            </div>

            <button
              className="refresh-orders-button"
              onClick={resetMenuForm}
            >
              ✕ Cancel
            </button>

          </div>

          <form
            className="menu-form"
            onSubmit={handleSaveFood}
          >

            <div className="form-group">

              <label>
                Food Name
              </label>

              <input
                type="text"
                name="name"
                value={menuForm.name}
                onChange={handleFormChange}
                placeholder="Example: Dosa"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  menuForm.description
                }
                onChange={handleFormChange}
                placeholder="Example: Crispy South Indian dosa"
                rows="3"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={menuForm.price}
                onChange={handleFormChange}
                placeholder="Example: 40"
                min="1"
                step="0.01"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Availability
              </label>

              <select
                value={
                  menuForm.available
                    ? "true"
                    : "false"
                }
                onChange={
                  handleAvailabilityChange
                }
              >
                <option value="true">
                  Available
                </option>

                <option value="false">
                  Unavailable
                </option>

              </select>

            </div>

            <button
              type="submit"
              className="save-food-button"
              disabled={savingMenuItem}
            >
              {savingMenuItem
                ? "Saving..."
                : editingItem
                ? "💾 Update Food"
                : "➕ Add Food"}
            </button>

          </form>

        </section>

      )}

      {/* =========================
          BACK TO MENU
          ========================= */}

      <div className="admin-bottom-actions">

        <button
          className="refresh-orders-button"
          onClick={onBackToMenu}
        >
          ← Back to Menu
        </button>

      </div>

    </main>
  );
}

export default AdminDashboard;