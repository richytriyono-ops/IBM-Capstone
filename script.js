// Function to initialize the expense list
function initExpenseList() {
    const expensesList = document.getElementById('expenses');
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    expenses.forEach((expense) => {
        renderExpense(expense);
    });

    document.getElementById('expenses-list').classList.remove('hidden');
}

// Function to render an individual expense
function renderExpense(expense) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>${expense.amount}</td>
        <td>${expense.date}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    row.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(expense));
    row.querySelector('.edit-btn').addEventListener('click', () => editExpense(expense));
    
    document.getElementById('expenses').appendChild(row);
}

// Function to add a new expense
document.getElementById('add-expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newExpense = {
        description: formData.get('description'),
        category: formData.get('category'),
        amount: parseFloat(formData.get('amount')),
        date: formData.get('date')
    };

    expenses.push(newExpense);
    saveExpenses();
    clearForm();
    
    initExpenseList();
});

// Function to clear the form fields
function clearForm() {
    document.getElementById('add-expense-form').querySelectorAll('input, select').forEach(input => input.value = '');
}

// Function to delete an expense
function deleteExpense(expense) {
    expenses = expenses.filter(e => e !== expense);
    saveExpenses();
    initExpenseList();
}

// Function to edit an expense
function editExpense(expense) {
    document.getElementById('add-expense-form').style.display = 'block';
    document.getElementById('add-expense-form').querySelectorAll('input, select').forEach(input => {
        if (input.id === 'description' && input.value === expense.description) {
            input.value = expense.description;
        }
        if (input.id === 'category' && input.value === expense.category) {
            input.value = expense.category;
        }
        if (input.id === 'amount' && input.value === expense.amount.toFixed(2)) {
            input.value = expense.amount.toFixed(2);
        }
        if (input.id === 'date' && input.value === expense.date) {
            input.value = expense.date;
        }
    });
    document.getElementById('add-expense-form').querySelector('button:last-child').textContent = 'Save Update';
    document.getElementById('add-expense-form').addEventListener('submit', updateExpense);
}

// Function to update an expense in localStorage
function updateExpense(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const index = expenses.findIndex(expense => 
        expense.description === form.description.value &&
        expense.category === form.category.value &&
        expense.amount === parseFloat(form.amount.value) &&
        expense.date === form.date.value
    );

    if (index !== -1) {
        expenses[index] = { ...data.get('description'), category: data.get('category'), amount: parseFloat(data.get('amount')), date: data.get('date') };
        saveExpenses();
        form.querySelector('button:last-child').textContent = 'Submit New';
        form.reset();
        initExpenseList();
    } else {
        alert('No matching expense found to update!');
    }
}

// Function to save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Initialize the expense list on page load
const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
initExpenseList();
