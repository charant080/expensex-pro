import { useEffect, useState } from "react";
import "./App.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [salary, setSalary] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [savingGoal, setSavingGoal] = useState("");

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("expensex-data");
    if (saved) {
      const data = JSON.parse(saved);
      setSalary(data.salary || "");
      setOtherIncome(data.otherIncome || "");
      setSavingGoal(data.savingGoal || "");
      setExpenses(data.expenses || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "expensex-data",
      JSON.stringify({ salary, otherIncome, savingGoal, expenses })
    );
  }, [salary, otherIncome, savingGoal, expenses]);

  const login = () => {
    if (username === "charant080" && password === "charan123") {
      setLoggedIn(true);
    } else {
      alert("Wrong username or password");
    }
  };

  const addExpense = () => {
    if (!expenseTitle || !expenseAmount || !expenseCategory) {
      alert("Please fill all expense details");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: expenseTitle,
      amount: Number(expenseAmount),
      category: expenseCategory,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([newExpense, ...expenses]);
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseCategory("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const totalIncome = Number(salary || 0) + Number(otherIncome || 0);
  const totalExpense = expenses.reduce((total, item) => total + item.amount, 0);
  const balance = totalIncome - totalExpense;

  const categories = ["Food", "Travel", "Shopping", "Bills", "Health", "Rent", "Others"];

  const chartData = categories
    .map((category) => ({
      name: category,
      value: expenses
        .filter((e) => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((item) => item.value > 0);

  const COLORS = ["#ec4899", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const aiSuggestion =
    totalIncome === 0
      ? "Enter your income to get smart suggestions."
      : totalExpense > totalIncome
      ? "Warning: Your expenses are higher than your income. Reduce non-essential spending."
      : totalExpense > totalIncome * 0.7
      ? "You are spending more than 70% of your income. Try to save more this month."
      : balance >= Number(savingGoal || 0)
      ? "Great! You are on track to reach your saving goal."
      : "Good start. Control expenses to reach your saving goal faster.";

  if (!loggedIn) {
    return (
      <div className="page">
        <div className="glow pink"></div>
        <div className="glow blue"></div>

        <div className="card">
          <h1>ExpenseX Pro</h1>
          <p>AI Smart Finance Dashboard</p>

          <input type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div>
          <h1>ExpenseX Pro</h1>
          <p>Advanced Smart Expense Tracker</p>
        </div>
        <button onClick={() => setLoggedIn(false)}>Logout</button>
      </nav>

      <div className="stats-grid">
        <div className="stat green"><h3>Total Income</h3><h2>₹{totalIncome}</h2></div>
        <div className="stat red"><h3>Total Expense</h3><h2>₹{totalExpense}</h2></div>
        <div className="stat blue"><h3>Balance</h3><h2>₹{balance}</h2></div>
        <div className="stat yellow"><h3>Saving Goal</h3><h2>₹{savingGoal || 0}</h2></div>
      </div>

      <div className="panel">
        <h2>Financial Details</h2>
        <div className="form-grid">
          <input type="number" placeholder="Monthly Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
          <input type="number" placeholder="Other Income" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} />
          <input type="number" placeholder="Saving Goal" value={savingGoal} onChange={(e) => setSavingGoal(e.target.value)} />
        </div>
      </div>

      <div className="panel">
        <h2>Add Expense</h2>
        <div className="form-grid four">
          <input type="text" placeholder="Expense Title" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} />
          <input type="number" placeholder="Expense Amount" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} />
          <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat}>{cat}</option>)}
          </select>
          <button onClick={addExpense}>Add Expense</button>
        </div>
      </div>

      <div className="panel">
        <h2>Expense Analytics</h2>
        {chartData.length === 0 ? (
          <p className="suggestion">Add expenses to view category chart.</p>
        ) : (
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={130} label>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="panel">
        <h2>AI Suggestion</h2>
        <p className="suggestion">{aiSuggestion}</p>
      </div>

      <div className="panel">
        <h2>Search & Filter</h2>
        <div className="form-grid">
          <input type="text" placeholder="Search expense" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option>All</option>
            {categories.map((cat) => <option key={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="panel">
        <h2>Expense History</h2>
        {filteredExpenses.length === 0 ? (
          <p className="suggestion">No expenses added yet.</p>
        ) : (
          <div className="expense-list">
            {filteredExpenses.map((item) => (
              <div className="expense-item" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.category} • {item.date}</p>
                </div>
                <div className="expense-actions">
                  <strong>₹{item.amount}</strong>
                  <button onClick={() => deleteExpense(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}