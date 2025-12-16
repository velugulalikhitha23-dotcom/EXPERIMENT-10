let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
const errorMsg = document.getElementById("errorMsg");

/* ----------------------------
   Save & Load from LocalStorage
----------------------------- */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ----------------------------
   Display Tasks
----------------------------- */
function displayTasks(filterType = "all") {
  taskList.innerHTML = "";

  tasks
    .filter(task => {
      if (filterType === "completed") return task.completed;
      if (filterType === "pending") return !task.completed;
      return true;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";

      li.innerHTML = `
        ${task.text}
        <button onclick="toggleTask(${index})">✔</button>
      `;

      taskList.appendChild(li);
    });
}

/* ----------------------------
   Add Task
----------------------------- */
document.getElementById("addTaskBtn").addEventListener("click", () => {
  if (taskInput.value === "") return;

  tasks.push({ text: taskInput.value, completed: false });
  taskInput.value = "";

  saveTasks();
  displayTasks(filter.value);
});

/* ----------------------------
   Toggle Task Status
----------------------------- */
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  displayTasks(filter.value);
}

/* ----------------------------
   Filter Tasks
----------------------------- */
filter.addEventListener("change", () => {
  localStorage.setItem("filter", filter.value);
  displayTasks(filter.value);
});

/* ----------------------------
   Fetch External API Data
----------------------------- */
document.getElementById("loadDataBtn").addEventListener("click", async () => {
  const apiData = document.getElementById("apiData");
  apiData.innerHTML = "";
  errorMsg.textContent = "";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const users = await response.json();

    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = user.name;
      apiData.appendChild(li);
    });

  } catch (error) {
    errorMsg.textContent = "Error loading data. Please try again.";
    console.error(error);
  }
});

/* ----------------------------
   Initial Load
----------------------------- */
filter.value = localStorage.getItem("filter") || "all";
displayTasks(filter.value);
