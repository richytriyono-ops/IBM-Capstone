// --- STATE MANAGEMENT ---
// This is our single source of truth for all expenses.
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let currentlyEditingId = null;

// --- DOM ELEMENT SELECTORS ---
// Get all necessary elements from the DOM once.
const form = document.getElementById('add-expense-form');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const expensesTableBody = document.getElementById('expenses');
const submitButton = form.querySelector('button[type="submit"]');

// --- EVENT LISTENERS ---
// A single event listener to handle both adding and updating expenses.
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page from reloading on submit

    if (currentlyEditingId) {
        // If we are editing, update the existing expense.
        const index = expenses.findIndex(expense => expense.id === currentlyEditingId);
        if (index !== -1) {
            expenses[index] = {
                id: currentlyEditingId,
                description: descriptionInput.value,
                category: categoryInput.value,
                amount: parseFloat(amountInput.value),
                date: dateInput.value
            };
        }
    } else {
        // Otherwise, create a new expense.
        const newExpense = {
            id: Date.now(), // Use a timestamp as a unique ID
            description: descriptionInput.value,
            category: categoryInput.value,
            amount: parseFloat(amountInput.value),
            date: dateInput.value
        };
        expenses.push(newExpense);
    }

    saveExpenses();
    renderExpenses();
    resetForm();
});

// --- FUNCTIONS ---

/**
 * Renders all expenses to the table in the DOM.
 * It first clears the table, then adds each expense.
 */
function renderExpenses() {
    // Clear the existing table rows to prevent duplication
    expensesTableBody.innerHTML = '';

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.date}</td>
            <td>
                <button class="edit-btn" data-id="${expense.id}">Edit</button>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            </td>
        `;

        // Add event listeners for the new buttons
        row.querySelector('.edit-btn').addEventListener('click', handleEdit);
        row.querySelector('.delete-btn').addEventListener('click', handleDelete);

        expensesTableBody.appendChild(row);
    });
}

/**
 * Handles the click event for an 'Edit' button.
 * @param {Event} e The click event object.
 */
function handleEdit(e) {
    const id = parseInt(e.target.dataset.id);
    const expenseToEdit = expenses.find(expense => expense.id === id);

    if (expenseToEdit) {
        // Fill the form with the data of the expense to be edited
        descriptionInput.value = expenseToEdit.description;
        categoryInput.value = expenseToEdit.category;
        amountInput.value = expenseToEdit.amount;
        dateInput.value = expenseToEdit.date;
        
        // Set the state to "editing"
        currentlyEditingId = id;
        submitButton.textContent = 'Save Changes';
        form.classList.remove('hidden'); // Show the form if it was hidden
    }
}

/**
 * Handles the click event for a 'Delete' button.
 * @param {Event} e The click event object.
 */
function handleDelete(e) {
    const id = parseInt(e.target.dataset.id);
    // Filter out the expense with the matching ID
    expenses = expenses.filter(expense => expense.id !== id);

    saveExpenses();
    renderExpenses();
}

/**
 * Saves the current 'expenses' array to localStorage.
 */
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

/**
 * Resets the form to its initial state for adding a new expense.
 */
function resetForm() {
    form.reset(); // This clears all form inputs
    currentlyEditingId = null; // Exit "editing" mode
    submitButton.textContent = 'Add';
    // You might want to hide the form again after submission
    // form.classList.add('hidden'); 
}

// --- STATE MANAGEMENT ---
// ... (no changes here)

// --- DOM ELEMENT SELECTORS ---
const form = document.getElementById('add-expense-form');
const showFormButton = document.getElementById('show-form-btn'); // ADD THIS LINE
const descriptionInput = document.getElementById('description');
// ... (rest of the selectors are the same)
const submitButton = form.querySelector('button[type="submit"]');

// --- EVENT LISTENERS ---

// ADD THIS NEW EVENT LISTENER for the "Add New Expense" button
showFormButton.addEventListener('click', () => {
    resetForm(); // We call resetForm to make sure it's a blank "Add" form
    form.classList.remove('hidden'); // Show the form
});

// The existing form 'submit' listener stays exactly the same
form.addEventListener('submit', (e) => {
    // ... (no changes in this block)
});



 */
function resetForm() {
    form.reset(); 
    currentlyEditingId = null; 
    submitButton.textContent = 'Add';
    form.classList.add('hidden'); 
}

// --- INITIALIZATION ---
// Initial render of the expenses when the page loads.
renderExpenses();
