document.addEventListener("DOMContentLoaded", () => {
  const ordersButton = document.getElementById("getOrders");

  ordersButton.addEventListener("click", async () => {
    const response = await fetch("http://localhost:3001/orders");
    const data = await response.json();

    const ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = "";

    data.orders.forEach(order => {
      const li = document.createElement("li");
      li.textContent = `Order ${order.id}: ${order.item} - $${order.amount}`;
      ordersList.appendChild(li);
    });
  });
});
document.querySelector(".login-button").addEventListener("click", () => {
  alert("Redirecting to login page...");
});

