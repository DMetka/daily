let selectedDate = null
let currentTaskId = null
let isFormOpen = false;

export function Main(task) {
    const addTaskButtons = document.querySelectorAll(".add-task-btn");
    const TaskForm = document.getElementById("TaskForm");
    const SaveTask = document.getElementById("SaveTask");
    const titleInput = document.getElementById("taskName");
    const fullTextInput = document.getElementById("taskFullText");
    const deadlineInput = document.getElementById("taskDate");
    const folderInput = document.getElementById("taskFolder");
    const priorityInput = document.getElementById("taskPriority");
    const completedInput = document.getElementById("taskCompleted");
    const chooseFolderBtn = document.getElementById("chooseFolderBtn");
    const foldersList = document.getElementById("foldersList");




    function closeForm() {
        TaskForm.style.transform = 'translateX(100%)';
        setTimeout(() => {
            TaskForm.style.display = 'none';
            isFormOpen = false;
        }, 300);
    }

    chooseFolderBtn.addEventListener("click", function() {
        if (foldersList.style.display === "none") {
            foldersList.style.display = "block";
            loadFolders();
        } else {
            foldersList.style.display = "none";
        }
    });

    function loadFolders() {
        fetch('get_all_folders/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                folderInput.innerHTML = '<option value="">Выберите папку</option>';

                data.folders.forEach((folder) => {
                    const option = document.createElement("option");
                    option.value = folder.id;
                    option.textContent = folder.title;
                    folderInput.appendChild(option);
                });

                foldersList.innerHTML = "";
                data.folders.forEach((folder) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = folder.title;
                    listItem.dataset.id = folder.id;
                    listItem.addEventListener("click", function () {
                        folderInput.value = folder.id;
                        chooseFolderBtn.textContent = `Выбрана папка: ${folder.title}`;
                        foldersList.style.display = "none";
                    });
                    foldersList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error("Ошибка загрузки папок:", error);
            });
    }

    document.querySelectorAll(".btn-add-task").forEach(button => {
        button.addEventListener("click", function() {
            const dateElement = this.closest('.day').querySelector('.date');
            const date = dateElement.textContent
            open(task, date);
        });
    });

    SaveTask.addEventListener("click", function() {
        if (!titleInput.value || !fullTextInput.value || !deadlineInput.value) {
            alert("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        console.log(selectedDate)

        const months = {
            "января": "01", "февраля": "02", "марта": "03", "апреля": "04",
            "мая": "05", "июня": "06", "июля": "07", "августа": "08",
            "сентября": "09", "октября": "10", "ноября": "11", "декабря": "12"
        };
        if (selectedDate !== null){
        const parts = selectedDate.split(" ");

        const day = parts[0];  // "16"
        const month = months[parts[1]];  // "декабря" => "12"
        const year = parts[2];  // "2024"

        const formattedDate = `${day}.${month}.${year}`;
        const taskData = {
            title: titleInput.value,
            full_text: fullTextInput.value,
            data_create: new Date().toISOString(),
            data_complete: null,
            data_add: formattedDate,
            deadline: formatDate1(deadlineInput.value),
            folder: folderInput.value,
            priority: parseInt(priorityInput.value) || 2,
            is_completed: completedInput.checked
        };
        }
        const taskData = {
            title: titleInput.value,
            full_text: fullTextInput.value,
            data_create: new Date().toISOString(),
            data_complete: null,
            data_add: selectedDate,
            deadline: formatDate1(deadlineInput.value),
            folder: folderInput.value,
            priority: parseInt(priorityInput.value) || 2,
            is_completed: completedInput.checked
        };

        let url = currentTaskId ? `/edit_task/${currentTaskId}/` : '/add_task/';
        let method = currentTaskId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(taskData)
        })
        .then(response => {
            if (!response.ok) {
                console.error('Ошибка сети:', response.statusText);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        //.then(data => {
        //    console.log(data.message);
        //    closeForm();
        //})
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });

    // Преобразование названия месяца в номер (1-12)
    function getMonthNumber(monthName) {
        const months = {
            "января": "01",
            "февраля": "02",
            "марта": "03",
            "апреля": "04",
            "мая": "05",
            "июня": "06",
            "июля": "07",
            "августа": "08",
            "сентября": "09",
            "октября": "10",
            "ноября": "11",
            "декабря": "12"
        };
        return months[monthName.toLowerCase()];
    }


    document.addEventListener("click", function(event) {
         if (isFormOpen && !TaskForm.contains(event.target) &&
            !event.target.closest('.btn-add-task') &&
            !event.target.closest('.my_task_area') &&
            !event.target.closest('.list_task') &&
            !event.target.closest('.forgotten-task')) {
            console.log("click");
            closeForm();
        }
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

export function open(task = null, date = null) {
    const TaskForm = document.getElementById("TaskForm");
    const titleInput = document.getElementById("taskName");
    const fullTextInput = document.getElementById("taskFullText");
    const deadlineInput = document.getElementById("taskDate");
    const folderInput = document.getElementById("taskFolder");
    const priorityInput = document.getElementById("taskPriority");
    const completedInput = document.getElementById("taskCompleted");
    TaskForm.style.display = 'flex';

    if (date) {
        selectedDate = date;
    }

    requestAnimationFrame(() => {
        TaskForm.style.transform = 'translateX(0)';
    });

    if (task.id) {
        currentTaskId = task.id;
        titleInput.value = task.title;
        fullTextInput.value = task.full_text;
        deadlineInput.value = task.deadline;
        folderInput.value = task.folder;
        priorityInput.value = task.priority;
        completedInput.checked = task.is_completed;
        console.log('Opening task with data:', task);
    } else {
        currentTaskId = null;
        titleInput.value = '';
        fullTextInput.value = '';
        deadlineInput.value = '';
        folderInput.value = '';
        priorityInput.value = '';
        completedInput.checked = false;
    }
    isFormOpen = true;
}

document.addEventListener("DOMContentLoaded", Main);



function formatDate1(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}


