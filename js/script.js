

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];




const form = document.getElementById("transactionForm");

const itemNameInput =
    document.getElementById("itemName");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const transactionList =
    document.getElementById("transactionList");

const totalBalance =
    document.getElementById("totalBalance");

const pieChart =
    document.getElementById("pieChart");

const chartLegend =
    document.getElementById("chartLegend");




function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}




function formatCurrency(amount) {

    return "$" + amount.toFixed(2);
}




form.addEventListener("submit", function(event) {

    event.preventDefault();

    const itemName =
        itemNameInput.value.trim();

    const amount =
        Number(amountInput.value);

    const category =
        categoryInput.value;

    if (!itemName || amount <= 0) {
        return;
    }

    const transaction = {

        id: Date.now(),

        itemName: itemName,

        amount: amount,

        category: category
    };

    transactions.push(transaction);

    saveData();

    form.reset();

    render();
});





function deleteTransaction(id) {

    transactions = transactions.filter(
        transaction =>
            transaction.id !== id
    );

    saveData();

    render();
}




function renderTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <div class="empty-message">
                No transactions yet.
            </div>
        `;

        return;
    }

    transactions.forEach(transaction => {

        const transactionElement =
            document.createElement("div");

        transactionElement.className =
            "transaction";

        transactionElement.innerHTML = `
            <div class="transaction-info">

                <span class="transaction-name">
                    ${transaction.itemName}
                </span>

                <span class="transaction-amount">
                    ${formatCurrency(transaction.amount)}
                </span>

                <span class="transaction-category">
                    ${transaction.category}
                </span>

            </div>

            <button
                class="delete-btn"
                onclick="deleteTransaction(${transaction.id})"
            >
                Delete
            </button>
        `;

        transactionList.appendChild(
            transactionElement
        );
    });
}




function updateBalance() {

    let total = 0;

    transactions.forEach(transaction => {

        total += transaction.amount;

    });

    totalBalance.textContent =
        formatCurrency(total);
}




function getCategoryData() {

    const categoryData = {};

    transactions.forEach(transaction => {

        const category =
            transaction.category;

        if (!categoryData[category]) {

            categoryData[category] = 0;
        }

        categoryData[category] +=
            transaction.amount;
    });

    return categoryData;
}




function updateChart() {

    const categoryData =
        getCategoryData();

    const categories =
        Object.keys(categoryData);

    chartLegend.innerHTML = "";

    if (categories.length === 0) {

        pieChart.style.background =
            "#e0e0e0";

        return;
    }

    const colors = [
        "#2ecc71",
        "#e67e22",
        "#3498db",
        "#9b59b6",
        "#f1c40f",
        "#e74c3c"
    ];

    let total = 0;

    categories.forEach(category => {

        total += categoryData[category];

    });


   

    let currentAngle = 0;

    const gradients = [];

    categories.forEach((category, index) => {

        const value =
            categoryData[category];

        const percentage =
            (value / total) * 100;

        const angle =
            percentage * 3.6;

        const start =
            currentAngle;

        const end =
            currentAngle + angle;

        const color =
            colors[index % colors.length];

        gradients.push(
            `${color} ${start}deg ${end}deg`
        );

        currentAngle = end;


      

        const legendItem =
            document.createElement("div");

        legendItem.className =
            "legend-item";

        legendItem.innerHTML = `
            <span
                class="legend-color"
                style="background:${color}"
            ></span>

            <span>
                ${category}
            </span>
        `;

        chartLegend.appendChild(
            legendItem
        );
    });


    pieChart.style.background =
        `conic-gradient(${gradients.join(", ")})`;
}




function render() {

    renderTransactions();

    updateBalance();

    updateChart();
}




render();