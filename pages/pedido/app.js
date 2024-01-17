let orderCounter = 1;

function addOrder(items, customer, tipoEntrega) {
  const ordersList = document.getElementById(tipoEntrega);

  if (!ordersList) {
    console.error(`Elemento ${tipoEntrega} não encontrado.`);
    return;
  }

  const orderContainer = document.createElement("div");
  orderContainer.className = "order-container";

  orderContainer.innerHTML = `
        <p>
        <h2>Número do Pedido: <span>${orderCounter}</span></h2>
        <div class="order-status">Status do Pedido: <span class="orderStatus">Em andamento</span></div>

        <div class="progress-bar">
            <div class="progress-bar-inner">0%</div>
        </div>

        <div class="order-details" onclick="toggleVisibility(this)">
            <h3>Detalhes do Pedido</h3>
            <div class="hidden">
                <ul class="item-list">
                    ${items.map(item => `<li class="item">${item}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="customer-info" onclick="toggleVisibility(this)">
            <h3>Informações do Cliente</h3>
            <div class="hidden">
                <p><strong>Nome:</strong> ${customer.name}</p>
                <p><strong>Endereço:</strong> ${customer.address}</p>
                <p><strong>Telefone:</strong> ${formatPhoneNumber(customer.phone)}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
            </div>
        </div>

        <button onclick="updateOrderStatus(this)">Atualizar Status</button>
        <button onclick="removeOrder(this)">Remover Pedido</button>
        </p>
    `;

  ordersList.appendChild(orderContainer);
  orderCounter++;
}

function removeOrder(button) {
  const orderContainer = button.parentNode;
  const ordersList = orderContainer.parentNode;
  ordersList.removeChild(orderContainer);
}

function addNewOrder() {
  const items = document.getElementById("items").value.split(',').map(item => item.trim());
  // const total = parseFloat(document.getElementById("total").value);
  const customerName = document.getElementById("customerName").value;
  const customerAddress = document.getElementById("customerAddress").value;
  const customerPhone = document.getElementById("customerPhone").value;
  const customerEmail = document.getElementById("customerEmail").value;
  const tipoEntrega = document.getElementById("tipoEntrega").value;

  if (!items || items.length === 0 || !customerName || !customerAddress || !customerPhone || !customerEmail || !tipoEntrega) {
    alert("Por favor, preencha todos os campos do formulário.");
    return;
  }

  addOrder(items, {
    name: customerName,
    address: customerAddress,
    phone: customerPhone,
    email: customerEmail
  }, tipoEntrega);
}

// Restante do código...

function updateOrderStatus(button) {
  const orderContainer = button.closest(".order-container");
  const progressBar = orderContainer.querySelector(".progress-bar-inner");
  const orderStatus = orderContainer.querySelector(".orderStatus");

  let currentProgress = parseInt(progressBar.style.width) || 0;
  if (currentProgress < 100) {
    currentProgress += 25;
    progressBar.style.width = currentProgress + "%";
    progressBar.textContent = currentProgress + "%";
    if (currentProgress === 100) {
      orderStatus.textContent = "Concluído";
    } else {
      orderStatus.textContent = "Em andamento";
    }
  }
}

function toggleVisibility(element) {
  const hiddenElement = element.querySelector('.hidden');
  hiddenElement.classList.toggle('visible');

  // const detailsElement = element.querySelector('.hidden');
  // const isHidden = detailsElement.classList.contains('hidden');

  // if (isHidden) {
  //   detailsElement.classList.remove('hidden');
  // } else {
  //   detailsElement.classList.add('hidden');
  // }
}

function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return ''; // Tratar o caso em que o número de telefone é nulo ou indefinido

  // Ajuste o formato do número de telefone conforme necessário
  // Neste exemplo, estamos adicionando parênteses e hífens
  const formattedNumber = phoneNumber.toString().replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  return formattedNumber;
}


function emptyText() {
  document.getElementById('items').value = null
  document.getElementById('customerName').value = null
  document.getElementById('customerAddress').value = null
  document.getElementById('customerPhone').value = null
  document.getElementById('customerEmail').value = null
}

function toggleFormVisibility() {
  const formContainer = document.getElementById('newOrderForm');
  formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}
