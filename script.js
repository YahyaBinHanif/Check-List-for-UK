// Initial References
const newTaskInput = document.querySelector("#task-name");
const taskQuantityInput = document.querySelector("#task-quantity");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

// Function on window load
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

// Function to Display The Tasks
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  // Clear the tasks
  tasksDiv.innerHTML = "";

  // Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let classValue = "";

    // Get all values
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    let taskData = JSON.parse(value);

    taskInnerDiv.innerHTML = `
      <input type="checkbox" class="checkbox" ${taskData.completed ? 'checked' : ''} />
      <span id="taskname">${key.split("_")[1]} (Qty: ${taskData.quantity})</span>
    `;

    // If the task is completed, strike through the task text and change the background color
    if (taskData.completed) {
      taskInnerDiv.classList.add("completed");
    }

    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }

  // Task completion (Checkbox click event)
  const checkboxes = document.querySelectorAll(".checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("click", (e) => {
      const taskId = e.target.closest('.task').id.split("_")[0];
      const taskName = e.target.closest('.task').querySelector("#taskname").innerText.split(" (Qty:")[0];
      const taskData = JSON.parse(localStorage.getItem(e.target.closest('.task').id));
      updateStorage(taskId, taskName, e.target.checked, taskData.quantity);
    });
  });

  // Edit Tasks
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      // Disable other edit buttons when one task is being edited
      disableButtons(true);
      let parent = element.parentElement;
      const taskData = JSON.parse(localStorage.getItem(parent.id));
      newTaskInput.value = parent.querySelector("#taskname").innerText.split(" (Qty:")[0];
      taskQuantityInput.value = taskData.quantity;
      updateNote = parent.id;
      parent.remove();
    });
  });

  // Delete Tasks
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};

// Disable Edit Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Remove Task from localStorage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

// Update tasks in localStorage
const updateStorage = (index, taskValue, completed, quantity) => {
  const taskData = { completed: completed, quantity: quantity };
  localStorage.setItem(`${index}_${taskValue}`, JSON.stringify(taskData));
  displayTasks();
};

// Function to Add New Task
document.querySelector("#push").addEventListener("click", () => {
  disableButtons(false);
  if (newTaskInput.value.length == 0 || taskQuantityInput.value <= 0) {
    alert("Please enter a valid task and quantity!");
  } else {
    if (updateNote == "") {
      updateStorage(count, newTaskInput.value, false, taskQuantityInput.value);
    } else {
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false, taskQuantityInput.value);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
    taskQuantityInput.value = "";
  }
});
