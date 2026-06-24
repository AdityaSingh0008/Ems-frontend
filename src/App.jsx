import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const [editingId, setEditingId] = useState(null);

  const API_URL = "https://ems-34rq.onrender.com/employees";

  // Fetch Employees
  const getEmployees = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add or Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    setFormData({
      name: "",
      department: "",
      salary: "",
    });

    getEmployees();
  };

  // Delete Employee
  const deleteEmployee = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    getEmployees();
  };

  // Edit Employee
  const editEmployee = (employee) => {
    setEditingId(employee.id);

    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  };

  // Filter + Search
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDepartment =
      departmentFilter === "" ||
      employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const departments = [
    ...new Set(employees.map((emp) => emp.department)),
  ];

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="top-bar">
        <h1>Employee Management System</h1>

        <button
          className="dark-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      <h2>Total Employees: {filteredEmployees.length}</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      <div className="controls">
        <input
          type="text"
          placeholder="Search Employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>

          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="employee-grid">
        {filteredEmployees.map((employee) => (
         
    <div key={employee.id} className="card">
  <h3>{employee.name}</h3>

  <p>Department: {employee.department}</p>

  <p>Salary: ₹{employee.salary}</p>

  <button
    className="edit-btn"
    onClick={() => editEmployee(employee)}
  >
    ✏️ Edit Employee
  </button>

  <button
    className="delete-btn"
    onClick={() => deleteEmployee(employee.id)}
  >
    🗑️ Delete Employee
  </button>
</div>
        ))}
      </div>
    </div>
  );
}

export default App;