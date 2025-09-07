// Function to save expenses in localStorage 
function saveExpenses() {
    try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (e) {
        console.error('Failed to save expenses to localStorage:', e);
    }
}

// Function to load expenses from localStorage
function loadExpenses() {
    let storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        initExpenseList(); // Re-render the list on load
    } else {
        expenses = []; // Initialize to an empty array if none found
    }
}

// Initialization on page load
document.addEventListener('DOMContentLoaded', loadExpenses);

// ... (previous existing event listeners and functions)

// Function to handle adding a new expense
function addExpense(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (formData.get('description') && 
        formData.get('category') && 
        formData.get('amount') && 
        formData.get('date')) {

        const newExpense = {
            description: formData.get('description'),
            category: formData.get('category'),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date'),
            timestamp: Date.now()
        };
        expenses.push(newExpense);
        saveExpenses();
        clearForm();
        initExpenseList();
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to handle updating an expense
function updateExpense(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    expenses = expenses.map(expense => 
        expense.timestamp === selectedExpenseId ? { ...formData.get('description'), category: formData.get('category'), amount: parseFloat(formData.get('amount')), date: formData.get('date'), timestamp: Date.now() } : expense
    );
    saveExpenses();
    clearForm();
    initExpenseList(); // Refresh the list post-update
}

// Function to initially render expense list
function initExpenseList() {
    const expensesList = document.getElementById('expenses');
    let expensesLocally = JSON.parse(localStorage.getItem('expenses')) || [];

    expensesList.innerHTML = ''; // Clear any existing list

    expensesLocally.forEach(expense => {
        renderExpense(expense);
    });

    if (expensesLocally.length === 0) {
        document.getElementById('expenses-list').insertAdjacentHTML('beforeend', '<p>No expenses recorded yet.</p>');
    }
}

// Render individual expense to the list
function renderExpense(expense) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>${expense.amount}</td>
        <td>${expense.date}</td>
        <td>
            <button class="edit-btn" data-id="${expense.timestamp}">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    row.querySelector('.delete-btn').addEventListener('click', () => deleteExpense(expense));
    row.querySelector('.edit-btn').addEventListener('click', () => handleEdit(row.querySelector('.edit-btn')));
    
    document.getElementById('expenses').appendChild(row);
}

// Function to delete an expense
function deleteExpense(expense) {
    expenses = expenses.filter(e => e.timestamp !== expense.timestamp);
    saveExpenses();
    initExpenseList();
}

// Form clearing function
function clearForm() {
    document.getElementById('add-expense-form').querySelectorAll('input, select').forEach(input => input.value = '');
    document.getElementById('add-expense-form').submit.textContent = 'Add Expense';
    document.getElementById('add-expense-form').classList.add('hidden');
}

// Load expenses on page initialization
loadExpenses();
