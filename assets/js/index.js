
"use strict";
let addBtn = document.querySelector(".add-btn");
let overlay = document.querySelector(".overlay");
let container = document.querySelector(".tasks");
let editBox = document.querySelector(".edit-box");
let clear = document.querySelector(".clear");
let tasks = (JSON.parse(localStorage.getItem("tasks")) || []);

showTasks()
addBtn.addEventListener("click", () => {
  let input = document.querySelector(".input-field");
  const text = input.value.trim();
  if (text) {
    const id = createId(text);

    const found = tasks.find((el) => el.id == id);
    if (!found) {
      tasks.push({ text, id });
      input.value = "";
    }
    showTasks();
    saveToStorage();
    input.focus()

  }
});
addBtn.previousElementSibling.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    addBtn.click()
  }
})

function showTasks() {

  if (!tasks) return;
  // emptying elements from page to start with existing ones in array
  [...container.children].forEach((el) => el.remove())
  tasks.forEach((task) => {

    let box = createBox(task);
    container.prepend(box);

  })

  saveToStorage()

}

function deleteTask(item) {
  let task = item.closest(".task");
  const index = tasks.findIndex(el => el.id == task.id);
  // removing from array 
  // let confirm = window.confirm("are you sure you want to delete this task");

  // if (confirm) {
  tasks.splice(index, 1);
  task.remove();
  saveToStorage()
  // }
  // update  array  in local storage
}

function saveToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));

}

function showBox(type = true) {
  editBox.classList.add("show");
  overlay.classList.add("show");
  overlay.onclick = () => showBox(false);
  if (!type) {

    overlay.classList.remove("show");
    editBox.classList.remove("show");
  }

}

function editTask(item) {
  const task = item.closest(".task");
  const taskId = task.id;
  const taskTitleElement = task.firstElementChild;
  const taskText = taskTitleElement.textContent;

  // Show the edit box with the current task text
  showBox();
  const editInput = editBox.querySelector("input");
  editInput.value = taskText;
  editInput.focus();
  // Handle save button click to update the task
  const saveBtn = editBox.querySelector(".save");
  saveBtn.onclick = () => {
    const text = editInput.value.trim();
    if (text) {
      const id = createId(text);
      if (!tasks.some((el) => el.id === id)) {
        const index = tasks.findIndex(el => el.id === taskId);
        if (index !== -1) {
          // updating in array
          tasks[index].text = text;
          tasks[index].id = id;
          // updating textContent in task 
          taskTitleElement.textContent = text;
          //updating changes to localstorage
          saveToStorage();
          showBox(false);
        }
      }
      else showBox(false);

    }
  };
}


function createId(text) {
  return text.split(" ").join("") + `-${text.split(" ").join("").length}`;
}

function createBox(task) {
  // Create the main container div
  const box = document.createElement('div');
  box.classList.add('task');
  box.setAttribute('id', task.id);

  // Create the task title h1 element
  const taskTitle = document.createElement('h1');
  taskTitle.classList.add('task-title');
  taskTitle.textContent = task.text;

  // Create the options div
  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('options');

  // Create the edit button
  const editButton = document.createElement('button');
  editButton.classList.add('edit');
  editButton.onclick = function () {
    editTask(this);
  };

  // Create the edit icon
  const editIcon = document.createElement('i');
  editIcon.classList.add('fas', 'fa-edit');

  // Append the edit icon to the edit button
  editButton.appendChild(editIcon);

  // Create the delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.onclick = function () {
    deleteTask(this);
  };

  // Create the delete icon
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash');

  // Append the delete icon to the delete button
  deleteButton.appendChild(deleteIcon);

  // Append the edit and delete buttons to the options div
  optionsDiv.appendChild(editButton);
  optionsDiv.appendChild(deleteButton);

  // Append the task title and options div to the main container div
  box.appendChild(taskTitle);
  box.appendChild(optionsDiv);
  return box;
}