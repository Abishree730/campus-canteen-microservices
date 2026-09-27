import { useEffect, useState } from "react";
import "./App.css";

import { getMenuItems } from "./services/menuService";

import {
  createOrder,
  getOrdersByUserId,
} from "./services/orderService";

import {
  getNotifications,
} from "./services/notificationService";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("canteenUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [authPage, setAuthPage] =
    useState("login");

  const [menuItems, setMenuItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantities, setQuantities] =
    useState({});

  const [orderingItem, setOrderingItem] =
    useState(null);

  const [orderMessage, setOrderMessage] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState("menu");

  const [orders, setOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [ordersError, setOrdersError] =
    useState("");

  const [notifications, setNotifications] =
    useState([]);

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(false);

  const [
    notificationsError,
    setNotificationsError,
  ] = useState("");

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  /* =========================================
     LOAD MENU WHEN USER LOGS IN
     ========================================= */

  useEffect(() => {
    if (user) {
      loadMenuItems();
    }
  }, [user]);

  /* =========================================
     AUTOMATIC ORDER + NOTIFICATION REFRESH
     ========================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    loadNotifications();
    loadOrders();

    const notificationInterval =
      setInterval(() => {
        loadNotifications();
      }, 5000);

    const orderInterval =
      setInterval(() => {
        loadOrders();
      }, 5000);

    return () => {
      clearInterval(
        notificationInterval
      );

      clearInterval(orderInterval);
    };
  }, [user]);

  /* =========================================
     LOAD MENU ITEMS
     ========================================= */

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError("");

      const items =
        await getMenuItems();

      setMenuItems(items);

      const initialQuantities = {};

      items.forEach((item) => {
        initialQuantities[item.id] = 1;
      });

      setQuantities(
        initialQuantities
      );
    } catch (error) {
      console.error(
        "Error loading menu:",
        error
      );

      setError(
        "Unable to load menu. Please make sure Menu Service is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     QUANTITY CONTROLS
     ========================================= */

  const increaseQuantity = (
    itemId
  ) => {
    setQuantities((previous) => ({
      ...previous,

      [itemId]:
        (previous[itemId] || 1) + 1,
    }));
  };

  const decreaseQuantity = (
    itemId
  ) => {
    setQuantities((previous) => ({
      ...previous,

      [itemId]: Math.max(
        (previous[itemId] || 1) - 1,
        1
      ),
    }));
  };

  /* =========================================
     PLACE ORDER
     ========================================= */

  const handleOrder = async (
    item
  ) => {
    try {
      setOrderingItem(item.id);
      setOrderMessage("");

      const quantity =
        quantities[item.id] || 1;

      const order =
        await createOrder({
          userId: user.userId,
          foodItemId: item.id,
          quantity: quantity,
        });

      setOrderMessage(
        `Order #${order.id} placed successfully! Total: ₹${order.totalAmount}`
      );

      setQuantities((previous) => ({
        ...previous,

        [item.id]: 1,
      }));

      await loadOrders();

      setTimeout(() => {
        loadNotifications();
      }, 1000);

    } catch (error) {
      console.error(
        "Error creating order:",
        error
      );

      if (
        error.response?.data?.message
      ) {
        setOrderMessage(
          error.response.data.message
        );
      } else {
        setOrderMessage(
          "Unable to place order. Please make sure Order Service is running."
        );
      }
    } finally {
      setOrderingItem(null);
    }
  };

  /* =========================================
     LOAD CUSTOMER ORDERS
     ========================================= */

  const loadOrders = async () => {
    if (!user) {
      return;
    }

    try {
      setOrdersLoading(true);
      setOrdersError("");

      const userOrders =
        await getOrdersByUserId(
          user.userId
        );

      setOrders(userOrders);
    } catch (error) {
      console.error(
        "Error loading orders:",
        error
      );

      setOrdersError(
        "Unable to load your orders. Please make sure Order Service is running."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  /* =========================================
     LOAD NOTIFICATIONS
     ========================================= */

  const loadNotifications =
    async () => {
      if (!user) {
        return;
      }

      try {
        setNotificationsLoading(
          true
        );

        setNotificationsError("");

        const data =
          await getNotifications(
            user.userId
          );

        if (Array.isArray(data)) {
          setNotifications(data);

          setNotificationCount(
            data.length
          );
        } else {
          setNotifications([]);
          setNotificationCount(0);
        }
      } catch (error) {
        console.error(
          "Error loading notifications:",
          error
        );

        setNotificationsError(
          "Unable to load notifications. Please make sure Notification Service is running."
        );
      } finally {
        setNotificationsLoading(
          false
        );
      }
    };

  /* =========================================
     MY ORDERS PAGE
     ========================================= */

  const handleMyOrders =
    async () => {
      setCurrentPage("orders");

      await loadOrders();
    };

  /* =========================================
     NOTIFICATIONS PAGE
     ========================================= */

  const handleNotifications =
    async () => {
      setCurrentPage(
        "notifications"
      );

      await loadNotifications();

      setNotificationCount(0);
    };

  /* =========================================
     LOGIN
     ========================================= */

  const handleLogin = (
    loggedInUser
  ) => {
    localStorage.setItem(
      "canteenUser",
      JSON.stringify(
        loggedInUser
      )
    );

    setUser(loggedInUser);

    setCurrentPage("menu");
  };

  /* =========================================
     REGISTRATION SUCCESS
     ========================================= */

  const handleRegisterSuccess =
    () => {
      setAuthPage("login");
    };

  /* =========================================
     LOGOUT
     ========================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "canteenUser"
    );

    setUser(null);

    setMenuItems([]);
    setOrders([]);
    setNotifications([]);

    setNotificationCount(0);

    setOrderMessage("");

    setCurrentPage("menu");
    setAuthPage("login");
  };

  /* =========================================
     LOGIN / REGISTER SCREEN
     ========================================= */

  if (!user) {
    if (authPage === "register") {
      return (
        <Register
          onRegisterSuccess={
            handleRegisterSuccess
          }
          onGoToLogin={() =>
            setAuthPage("login")
          }
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onGoToRegister={() =>
          setAuthPage("register")
        }
      />
    );
  }

  /* =========================================
     MAIN APPLICATION
     ========================================= */

  return (
    <div className="app">

      {/* =====================================
          NAVBAR
          ===================================== */}

      <nav className="navbar">

        <div className="logo">
          🍴 Canteen
        </div>

        <div className="welcome-user">
          Hi, {user.name}!
        </div>

        <div className="nav-links">

          <button
            onClick={() => {
              setCurrentPage("menu");
              setOrderMessage("");
              loadMenuItems();
            }}
          >
            Menu
          </button>

          {/* CUSTOMER NAVIGATION */}

          {user.role !== "ADMIN" && (
            <button
              onClick={handleMyOrders}
            >
              My Orders
            </button>
          )}

          {user.role !== "ADMIN" && (
            <button
              className="notification-nav-button"
              onClick={
                handleNotifications
              }
            >
              🔔 Notifications

              {notificationCount >
                0 && (
                <span className="notification-badge">
                  {notificationCount}
                </span>
              )}
            </button>
          )}

          {/* ADMIN NAVIGATION */}

          {user.role === "ADMIN" && (
            <button
              onClick={() =>
                setCurrentPage(
                  "admin"
                )
              }
            >
              🛠️ Admin Dashboard
            </button>
          )}

          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =====================================
          CUSTOMER MENU PAGE
          ===================================== */}

      {currentPage === "menu" && (
        <main className="menu-page">

          <div className="menu-header">

            <h1>
              Today's Menu
            </h1>

            <p>
              Choose your favourite food
            </p>

          </div>

          {orderMessage && (
            <div className="order-message">
              {orderMessage}
            </div>
          )}

          {loading && (
            <p className="message">
              Loading menu...
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {!loading &&
            !error && (

              <div className="menu-grid">

                {menuItems.map(
                  (item) => (

                    <div
                      className="food-card"
                      key={item.id}
                    >

                      <div className="food-icon">
                        🍽️
                      </div>

                      <h2>
                        {item.name}
                      </h2>

                      <p className="description">
                        {
                          item.description
                        }
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
                          ? "Available"
                          : "Unavailable"}
                      </p>

                      {item.available && (
                        <>

                          <div className="quantity-control">

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                            >
                              −
                            </button>

                            <span>
                              {
                                quantities[
                                  item.id
                                ] || 1
                              }
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                          <button
                            className="order-button"
                            onClick={() =>
                              handleOrder(
                                item
                              )
                            }
                            disabled={
                              orderingItem ===
                              item.id
                            }
                          >
                            {orderingItem ===
                            item.id
                              ? "Placing Order..."
                              : "Order Now"}
                          </button>

                        </>
                      )}

                    </div>

                  )
                )}

              </div>

            )}

        </main>
      )}

      {/* =====================================
          MY ORDERS PAGE
          ===================================== */}

      {currentPage === "orders" && (
        <main className="orders-page">

          <div className="menu-header">

            <h1>
              My Orders
            </h1>

            <p>
              Track your canteen orders
            </p>

          </div>

          <div className="orders-actions">

            <button
              className="refresh-orders-button"
              onClick={loadOrders}
            >
              🔄 Refresh Orders
            </button>

          </div>

          {ordersLoading && (
            <p className="message">
              Loading your orders...
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
                You haven't placed any
                orders yet.
              </div>

            )}

          {!ordersLoading &&
            !ordersError &&
            orders.length > 0 && (

              <div className="orders-list">

                {orders.map(
                  (order) => {

                    const foodItem =
                      menuItems.find(
                        (item) =>
                          item.id ===
                          order.foodItemId
                      );

                    return (

                      <div
                        className="order-card"
                        key={order.id}
                      >

                        {/* ORDER DETAILS */}

                        <div className="order-details">

                          <div className="order-food-icon">
                            🍽️
                          </div>

                          <div>

                            <h2>
                              {foodItem
                                ? foodItem.name
                                : `Food Item #${order.foodItemId}`}
                            </h2>

                            {foodItem && (
                              <p className="order-description">
                                {
                                  foodItem.description
                                }
                              </p>
                            )}

                            <p>
                              <strong>
                                Order ID:
                              </strong>{" "}
                              #{order.id}
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
                              ₹
                              {
                                order.totalAmount
                              }
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

                        {/* ORDER STATUS */}

                        <div className="order-status-section">

                          <span className="order-status">
                            {order.status}
                          </span>

                          {/* NORMAL ORDER PROGRESS */}

                          {order.status !==
                            "CANCELLED" && (

                            <div className="order-progress">

                              <div
                                className={
                                  order.status ===
                                    "PLACED" ||
                                  order.status ===
                                    "PREPARING" ||
                                  order.status ===
                                    "READY" ||
                                  order.status ===
                                    "COMPLETED"
                                    ? "progress-step active"
                                    : "progress-step"
                                }
                              >
                                <span>
                                  1
                                </span>

                                <small>
                                  Placed
                                </small>
                              </div>

                              <div
                                className={
                                  order.status ===
                                    "PREPARING" ||
                                  order.status ===
                                    "READY" ||
                                  order.status ===
                                    "COMPLETED"
                                    ? "progress-step active"
                                    : "progress-step"
                                }
                              >
                                <span>
                                  2
                                </span>

                                <small>
                                  Preparing
                                </small>
                              </div>

                              <div
                                className={
                                  order.status ===
                                    "READY" ||
                                  order.status ===
                                    "COMPLETED"
                                    ? "progress-step active"
                                    : "progress-step"
                                }
                              >
                                <span>
                                  3
                                </span>

                                <small>
                                  Ready
                                </small>
                              </div>

                              <div
                                className={
                                  order.status ===
                                  "COMPLETED"
                                    ? "progress-step active"
                                    : "progress-step"
                                }
                              >
                                <span>
                                  4
                                </span>

                                <small>
                                  Completed
                                </small>
                              </div>

                            </div>

                          )}

                          {/* CANCELLED ORDER */}

                          {order.status ===
                            "CANCELLED" && (
                            <p className="cancelled-order">
                              ❌ This order
                              has been
                              cancelled.
                            </p>
                          )}

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

        </main>
      )}

      {/* =====================================
          NOTIFICATIONS PAGE
          ===================================== */}

      {currentPage ===
        "notifications" && (

        <main className="notifications-page">

          <div className="menu-header">

            <h1>
              🔔 Notifications
            </h1>

            <p>
              Stay updated with your orders
            </p>

          </div>

          <div className="notifications-actions">

            <button
              className="refresh-orders-button"
              onClick={
                loadNotifications
              }
            >
              🔄 Refresh Notifications
            </button>

          </div>

          {notificationsLoading && (
            <p className="message">
              Loading notifications...
            </p>
          )}

          {notificationsError && (
            <p className="error-message">
              {notificationsError}
            </p>
          )}

          {!notificationsLoading &&
            !notificationsError &&
            notifications.length === 0 && (

              <div className="order-message">
                You don't have any
                notifications yet.
              </div>

            )}

          {!notificationsLoading &&
            !notificationsError &&
            notifications.length > 0 && (

              <div className="notifications-list">

                {notifications.map(
                  (
                    notification,
                    index
                  ) => (

                    <div
                      className="notification-card"
                      key={
                        notification.id ||
                        index
                      }
                    >

                      <div className="notification-icon">
                        🔔
                      </div>

                      <div className="notification-content">

                        <h2>
                          Order Update
                        </h2>

                        <p>
                          {
                            notification.message
                          }
                        </p>

                        {notification.createdAt && (
                          <small>
                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </small>
                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </main>

      )}

      {/* =====================================
          ADMIN DASHBOARD
          ===================================== */}

      {currentPage === "admin" &&
        user.role === "ADMIN" && (

          <AdminDashboard
            onBackToMenu={() => {
              setCurrentPage(
                "menu"
              );

              loadMenuItems();
            }}
          />

        )}

    </div>
  );
}

export default App;