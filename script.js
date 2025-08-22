let orders = JSON.parse(localStorage.getItem('orders')) || [];
let archive = JSON.parse(localStorage.getItem('archive')) || [];

function saveData() {
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.setItem('archive', JSON.stringify(archive));
}

function openPage(page) {
  let content = document.getElementById('content');
  if (page === 'order') {
    content.innerHTML = `
      <div class="content-box">
        <h2>Выберите орешки</h2>
        ${renderCounter('Классический')}
        ${renderCounter('Шоколадный')}
        ${renderCounter('Клубничный')}
        <button onclick="placeOrder()">Заказать</button>
      </div>
    `;
  } else if (page === 'orders') {
    content.innerHTML = '<div class="content-box"><h2>Текущие заказы</h2>' +
      orders.map((o,i)=>`<p>${o.type}: ${o.count} шт <button onclick="deliver(${i})">Доставлено</button></p>`).join('') +
      '</div>';
  } else if (page === 'archive') {
    content.innerHTML = '<div class="content-box"><h2>Архив</h2>' +
      archive.map(o=>`<p>${o.date}: ${o.type} - ${o.count} шт</p>`).join('') +
      '</div>';
  } else if (page === 'calculator') {
    content.innerHTML = `
      <div class="content-box">
        <h2>Калькулятор ингредиентов</h2>
        ${renderCounter('Классический', true)}
        ${renderCounter('Шоколадный', true)}
        ${renderCounter('Клубничный', true)}
        <button onclick="calculate()">Рассчитать</button>
        <div id="calcResult"></div>
      </div>
    `;
  }
}

let counters = {};

function renderCounter(type, calc=false) {
  counters[type] = 0;
  return `
    <div>
      <h3>${type}</h3>
      <div class="counter">
        <button onclick="decrease('${type}')">-</button>
        <span id="${type}Count">0</span>
        <button onclick="increase('${type}')">+</button>
      </div>
    </div>
  `;
}

function increase(type) {
  counters[type]++;
  document.getElementById(type+'Count').innerText = counters[type];
}
function decrease(type) {
  if (counters[type]>0) counters[type]--;
  document.getElementById(type+'Count').innerText = counters[type];
}

function placeOrder() {
  for (let type in counters) {
    if (counters[type]>0) {
      orders.push({type, count:counters[type]});
    }
  }
  saveData();
  counters = {};
  openPage('orders');
}

function deliver(index) {
  let o = orders[index];
  archive.push({ ...o, date: new Date().toLocaleString("ru-RU", { timeZone: "Asia/Samarkand" }) });
  orders.splice(index,1);
  saveData();
  openPage('orders');
}

function calculate() {
  let resultDiv = document.getElementById('calcResult');
  let text = '';
  for (let type in counters) {
    if (counters[type]>0) {
      text += `<h4>${type} (${counters[type]} шт)</h4>`;
      if (type === 'Классический') {
        text += listIngredients(counters[type], {Мука:113, Яйцо:0.5, Сахар:25, Маргарин:50, Сгущенка:100});
      } else if (type === 'Шоколадный') {
        text += listIngredients(counters[type], {Мука:113, Яйцо:0.5, Сахар:25, Маргарин:50, "Шоколадный крем":100, Какао:10});
      } else if (type === 'Клубничный') {
        text += listIngredients(counters[type], {Мука:113, Яйцо:0.5, Сахар:25, Маргарин:50, "Клубничный джем":100});
      }
    }
  }
  resultDiv.innerHTML = text;
}

function listIngredients(count, ing) {
  let res = '<ul>';
  for (let k in ing) {
    res += `<li>${k}: ${ing[k]*count}</li>`;
  }
  res += '</ul>';
  return res;
}

window.onload = () => {
  if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.body.classList.add("dark");
  } else {
    document.body.classList.add("light");
  }
};
