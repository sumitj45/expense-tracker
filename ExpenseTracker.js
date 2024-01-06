import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ExpenseTracker.css';

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Fetch existing expenses from the server
    axios.get('http://localhost:3001/expenses')
      .then((response) => {
        setExpenses(response.data);
        updateTotalAmount(response.data);
      })
      .catch((error) => console.error('Error fetching expenses:', error));
  }, []);

  useEffect(() => {
    // Update total amount whenever expenses change
    updateTotalAmount(expenses);
  }, [expenses]);

  const updateTotalAmount = (expensesArray) => {
    const total = expensesArray.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    setTotalAmount(total);
  };

  const handleAddExpense = () => {
    if (newExpense.description.trim() !== '' && newExpense.amount.trim() !== '') {
      axios.post('http://localhost:3001/expenses', newExpense)
        .then((response) => {
          setExpenses((prevExpenses) => [...prevExpenses, response.data]);
          setNewExpense({ description: '', amount: '' });
        })
        .catch((error) => console.error('Error adding expense:', error));
    }
  };

  const handleDeleteExpense = (id) => {
    axios.delete(`http://localhost:3001/expenses/${id}`)
      .then(() => setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id)))
      .catch((error) => console.error('Error deleting expense:', error));
  };

  return (
    <div className="expense-tracker-container">
      <h1>Expense Tracker</h1>
      <div className="expense-input-container">
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
        <button className="add-expense-button" onClick={handleAddExpense}>Add Expense</button>
      </div>
      <div className="expenses-list-container">
        <h2>Expenses</h2>
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              {expense.description} - Rs{expense.amount}
              <button className="delete-button" onClick={() => handleDeleteExpense(expense._id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="total-amount-container">
        <h2>Total Amount</h2>
        <p>Rs{totalAmount}</p>
      </div>
    </div>
  );
}

export default ExpenseTracker;
