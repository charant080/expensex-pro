import { useEffect, useState } from "react";
import "./App.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  LayoutDashboard,
  PieChartIcon,
  ReceiptText,
  FileText,
  Settings,
  User,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState("light");

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
  const [editId, setEditId] = useState(null);

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Rent",
    "Others",
  ];

  const COLORS = [
    "#ec4899",
    "#8b5cf6",
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("expensex-data");

    if (saved) {
      const data = JSON.parse(saved);

      setSalary(data.salary || "");
      setOtherIncome(data.otherIncome || "");
      setSavingGoal(data.savingGoal || "");
      setExpenses(data.expenses || []);
      setTheme(data.theme || "light");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "expensex-data",
      JSON.stringify({
        salary,
        otherIncome,
        savingGoal,
        expenses,
        theme,
      })
    );
  }, [salary, otherIncome, savingGoal, expenses, theme]);

  const login = () => {
    if (
      username === "charant080" &&
      password === "charan123"
    ) {
      setLoggedIn(true);
    } else {
      alert("Wrong username or password");
    }
  };

  const totalIncome =
    Number(salary || 0) +
    Number(otherIncome || 0);

  const totalExpense = expenses.reduce(
    (total, item) => total + item.amount,
    0
  );

  const balance =
    totalIncome - totalExpense;

  const savingProgress =
    Number(savingGoal || 0) === 0
      ? 0
      : Math.min(
          (balance / Number(savingGoal)) *
            100,
          100
        );

  const chartData = categories
    .map((category) => ({
      name: category,
      value: expenses
        .filter(
          (e) => e.category === category
        )
        .reduce(
          (sum, e) => sum + e.amount,
          0
        ),
    }))
    .filter((item) => item.value > 0);

  const topCategory =
    chartData.length === 0
      ? "No expenses yet"
      : chartData.reduce((max, item) =>
          item.value > max.value
            ? item
            : max
        ).name;

  const filteredExpenses =
    expenses.filter((item) => {
      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        filterCategory === "All" ||
        item.category ===
          filterCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  const aiSuggestion =
    totalIncome === 0
      ? "Enter your income to get smart suggestions."
      : totalExpense >
        totalIncome
      ? "Warning: Your expenses are higher than your income."
      : totalExpense >
        totalIncome * 0.7
      ? "You are spending more than 70% of your income."
      : balance >=
        Number(savingGoal || 0)
      ? "Great! You are on track to reach your saving goal."
      : "Control expenses to reach your saving goal faster.";

  const addExpense = () => {
    if (
      !expenseTitle ||
      !expenseAmount ||
      !expenseCategory
    ) {
      alert(
        "Please fill all expense details"
      );
      return;
    }

    if (editId) {
      setExpenses(
        expenses.map((item) =>
          item.id === editId
            ? {
                ...item,
                title:
                  expenseTitle,
                amount: Number(
                  expenseAmount
                ),
                category:
                  expenseCategory,
              }
            : item
        )
      );

      setEditId(null);
    } else {
      const newExpense = {
        id: Date.now(),
        title: expenseTitle,
        amount: Number(
          expenseAmount
        ),
        category:
          expenseCategory,
        date: new Date().toLocaleDateString(),
      };

      setExpenses([
        newExpense,
        ...expenses,
      ]);
    }

    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseCategory("");
  };

  const editExpense = (item) => {
    setEditId(item.id);

    setExpenseTitle(item.title);

    setExpenseAmount(item.amount);

    setExpenseCategory(item.category);
  };

  const deleteExpense = (id) => {
    setExpenses(
      expenses.filter(
        (item) => item.id !== id
      )
    );
  };

  const clearAllExpenses = () => {
    if (
      confirm(
        "Clear all expenses?"
      )
    ) {
      setExpenses([]);
    }
  };

  const resetFinancialData = () => {
    if (
      confirm(
        "Reset all financial data?"
      )
    ) {
      setSalary("");
      setOtherIncome("");
      setSavingGoal("");
    }
  };

  const downloadCSV = () => {
    if (expenses.length === 0) {
      alert(
        "No expenses to download"
      );
      return;
    }

    const header =
      "Title,Amount,Category,Date\n";

    const rows = expenses
      .map(
        (item) =>
          `${item.title},${item.amount},${item.category},${item.date}`
      )
      .join("\n");

    const blob = new Blob(
      [header + rows],
      {
        type: "text/csv",
      }
    );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      "expensex-report.csv";

    link.click();
  };

  if (!loggedIn) {
    return (
      <div className="page">
        <div className="glow pink"></div>

        <div className="glow blue"></div>

        <div className="card">
          <h1>ExpenseX Pro</h1>

          <p>
            AI Smart Finance Dashboard
          </p>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button onClick={login}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`app-layout ${theme}`}
    >
      <aside className="sidebar">
        <h2>ExpenseX</h2>

        <a href="#dashboard">
          <LayoutDashboard size={20} />
          Dashboard
        </a>

        <a href="#analytics">
          <PieChartIcon size={20} />
          Analytics
        </a>

        <a href="#expenses">
          <ReceiptText size={20} />
          Expenses
        </a>

        <a href="#reports">
          <FileText size={20} />
          Reports
        </a>

        <a href="#profile">
          <User size={20} />
          Profile
        </a>

        <a href="#settings">
          <Settings size={20} />
          Settings
        </a>
      </aside>

      <main
        className={`dashboard ${theme}`}
      >
        <nav
          className="navbar"
          id="dashboard"
        >
          <div>
            <h1>ExpenseX Pro</h1>

            <p>
              Advanced Smart Expense
              Tracker
            </p>
          </div>

          <div className="nav-actions">
            <button
              onClick={() =>
                setTheme(
                  theme === "light"
                    ? "dark"
                    : "light"
                )
              }
            >
              {theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}

              {theme === "light"
                ? "Dark"
                : "Light"}
            </button>

            <button
              className="logout"
              onClick={() =>
                setLoggedIn(false)
              }
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>

        <section className="hero-banner">
          <div className="hero-content">
            <span className="hero-badge">
              AI Powered Finance Dashboard
            </span>

            <h2>
              Track Your Money Smarter
              With AI
            </h2>

            <p>
              Manage income, expenses,
              savings, analytics and
              smart financial insights
              in one beautiful premium
              dashboard experience.
            </p>

            <div className="hero-buttons">
              <button>
                Get Started
              </button>

              <button className="secondary-btn">
                View Analytics
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <h3>10K+</h3>
                <p>Transactions</p>
              </div>

              <div>
                <h3>98%</h3>
                <p>Accuracy</p>
              </div>

              <div>
                <h3>24/7</h3>
                <p>AI Insights</p>
              </div>
            </div>
          </div>

          <div className="hero-image-box">
            <img
              src="/images/finance-hero.png"
              alt="Finance Dashboard"
              className="hero-image"
            />
          </div>
        </section>

        <div className="profile-report">
          <div className="profile-card">
            <div className="avatar">
              C
            </div>

            <div>
              <h2>Charan</h2>

              <p>
                Premium Finance User
              </p>
            </div>
          </div>

          <div className="report-card">
            <h3>
              Top Spending Category
            </h3>

            <h2>{topCategory}</h2>
          </div>

          <div className="report-card">
            <h3>
              Total Transactions
            </h3>

            <h2>
              {expenses.length}
            </h2>
          </div>
        </div>

        <section className="quick-actions">
          <div className="quick-card">
            <h3>Quick Transfer</h3>
            <p>
              Send money instantly
            </p>
          </div>

          <div className="quick-card">
            <h3>Monthly Budget</h3>
            <p>
              Track monthly limits
            </p>
          </div>

          <div className="quick-card">
            <h3>Investment Tips</h3>
            <p>
              AI finance insights
            </p>
          </div>

          <div className="quick-card">
            <h3>Smart Reports</h3>
            <p>
              Download analytics
            </p>
          </div>
        </section>

        <div className="stats-grid">
          <div className="stat green">
            <Wallet size={30} />
            <h3>Total Income</h3>
            <h2>
              ₹{totalIncome}
            </h2>
          </div>

          <div className="stat red">
            <TrendingDown size={30} />
            <h3>Total Expense</h3>
            <h2>
              ₹{totalExpense}
            </h2>
          </div>

          <div className="stat blue">
            <TrendingUp size={30} />
            <h3>Balance</h3>
            <h2>₹{balance}</h2>
          </div>

          <div className="stat yellow">
            <Target size={30} />
            <h3>Saving Goal</h3>
            <h2>
              ₹{savingGoal || 0}
            </h2>
          </div>
        </div>

        <div className="panel">
          <h2>Budget Progress</h2>

          <p className="progress-text">
            Savings progress:
            {savingProgress.toFixed(
              0
            )}
            %
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${savingProgress}%`,
              }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}