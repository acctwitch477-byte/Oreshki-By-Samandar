let order = {
  oreshki: 0,
  choco: 0,
  straw: 0
};

let orders = [];
let archive = [];

function openPage(pageId) {
  document.querySelectorAll('.container > div').forEach(div => {
    if (div.id !== 'mainMenu') div.classList.add('hidden');
  });
  document.getElementById(pageId).classList.remove('hidden');
}

function changeCount(type, value) {
  if (order[type] + value >= 0) {
    order[type] += value;
    document.getElementById(type + "Count").innerText = order[type];
  }
}

function makeOrder() {
  if (order.oreshki === 0 && order.choco === 0 && order.straw === 0) {
    alert("Выберите хотя бы один продукт!");
    return;
  }
  const newOrder = { ...order, date: new Date().toLocaleString("ru-RU") };
  orders.push(newOrder);
  updateOrders();
  order = { oreshki: 0, choco: 0, straw: 0 };
  document.getElementById("oreshkiCount").innerText = 0;
  document.getElementById("chocoCount").innerText = 0;
  document.getElementById("strawCount").innerText = 0;
  openPage('orders');
}

function updateOrders() {
  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = "";
  orders.forEach((o, index) => {
    let card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <p><b>Дата:</b> ${o.date}</p>
      <p>Oreshki: ${o.oreshki}</p>
      <p>Шоколадный: ${o.choco}</p>
      <p>Клубничный: ${o.straw}</p>
      <button onclick="deliverOrder(${index})">Доставлено</button>
    `;
    ordersList.appendChild(card);
  });
}

function deliverOrder(index) {
  const delivered = orders.splice(index, 1)[0];
  archive.push(delivered);
  updateOrders();
  updateArchive();
}

function updateArchive() {
  const archiveList = document.getElementById("archiveList");
  archiveList.innerHTML = "";
  archive.forEach(a => {
    let card = document.createElement("div");
    card.className = "archive-card";
    card.innerHTML = `
      <p><b>Дата:</b> ${a.date}</p>
      <p>Oreshki: ${a.oreshki}</p>
      <p>Шоколадный: ${a.choco}</p>
      <p>Клубничный: ${a.straw}</p>
    `;
    archiveList.appendChild(card);
  });
}
