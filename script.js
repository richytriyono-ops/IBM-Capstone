document.getElementById('add-expense-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission action
    addExpense(e); // Explicitly call addExpense function
});

function addExpense(e) {
    console.log('addExpense function triggered');
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
        initExpenseList(); // Refresh the list after adding
    } else {
        alert('Please fill in all fields.');
    }
}
// Load expenses on page load
document.addEventListener('DOMContentLoaded', (event) => {
    loadExpenses();
    initExpenseList(); // Initialize list immediately
});

// Function to save expenses in localStorage 
function saveExpenses() {
    try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
        console.error('Failed to save expenses to localStorage:', error);
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
        initExpenseList(); // Refresh the list after adding
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to handle editing an expense
function handleEdit(button) {
    const expenseId = button.dataset.id;
    const expenseIndex = expenses.findIndex(expense => expense.timestamp === parseInt(expenseId));

    if (expenseIndex !== -1) {
        const expenseToEdit = expenses[expenseIndex];
        populateForm(expenseToEdit);
        document.getElementById('add-expense-form').submit.textContent = 'Save Changes';
        selectedExpenseId = expenseId;
        document.getElementById('add-expense-form').classList.remove('hidden');
    } else {
        alert('Expense not found for editing!');
    }
}

// Function to populate the form with an expense's details
function populateForm(expense) {
    document.getElementById('description').value = expense.description;
    document.getElementById('category').value = expense.category;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('date').value = expense.date;
}

// Function to update an expense in localStorage
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

// Function to delete an expense
function deleteExpense(expense) {
    expenses = expenses.filter(e => e.timestamp !== expense.timestamp);
    saveExpenses();
    initExpenseList();
}

// Function to initialize and render the expense list
function initExpenseList() {
    const expensesList = document.getElementById('expenses');
    let expensesLocally = JSON.parse(localStorage.getItem('expenses')) || [];
    
    expensesList.innerHTML = ''; // Clear any existing list

    expensesLocally.forEach(expense => {
        renderExpense(expense);
    });

    if (expensesLocally.length === 0) {
        document.getElementById('expenses-table').insertAdjacentHTML('beforeend', '<p>No expenses recorded yet.</p>');
    }
}

// Render an individual expense to the list
function renderExpense(expense) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>${expense.amount}</td>
        <td>${expense.date}</td>
        <td>
            <button class="edit-btn" data-id="${expense.timestamp}">Edit
