// Function to initialize the expense list
// ... (previous existing code)

let selectedExpenseId;

// Event listener for 'Edit' buttons
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => handleEdit(button));
});

// Handle editing an expense
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

// Populate the form with an expense's details
function populateForm(expense) {
    document.getElementById('description').value = expense.description;
    document.getElementById('category').value = expense.category;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('date').value = expense.date;
}

// Adjusted form submission listener for add/update
document.getElementById('add-expense-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedExpenseId) {
        updateExpense(e);
    } else {
        addExpense(e);
    }
});

// Function to update an expense in localStorage
function updateExpense(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    expenses = expenses.map(expense => 
        expense.timestamp === selectedExpenseId ? { ...formData.get('description'), category: formData.get('category'), amount: parseFloat(formData.get('amount')), date: formData.get('date'), timestamp: Date.now() } : expense
    );
    saveExpenses();
    clearForm();
    initExpenseList(); // Refresh expense list
}

// Function to clear and reset form fields
function clearForm() {
    document.getElementById('add-expense-form').querySelectorAll('input, select').forEach(input => input.value = '');
    document.getElementById('add-expense-form').submit.textContent = 'Add Expense';
    document.getElementById('add-expense-form').classList.add('hidden');
}

// ... (existing addExpense and saveExpenses functions remain unchanged)

// Initialize expense list when page loads or after modifications
initExpenseList();

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
const expenseForm = document.getElementById('expense-form');
console.log('Expense form element:', expenseForm); // If this logs "null", the ID is wrong or the script ran too early.

// This will cause an error if expenseForm is null:
expenseForm.addEventListener('submit', function(e) { 
    // ...
});
// Initialize the expense list on page load
const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
initExpenseList();
