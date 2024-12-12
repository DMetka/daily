let selectedDate = null
let currentTaskId = null

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

    // Функция для загрузки списка папок
    function loadFolders() {
    fetch('get_all_folders', {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
        .then((response) => response.json())
        .then((data) => {
            // Очистка <select> перед добавлением новых опций
            folderInput.innerHTML = '<option value="">Выберите папку</option>';

            // Добавление папок в <select>
            data.folders.forEach((folder) => {
                const option = document.createElement("option");
                option.value = folder.id;
                option.textContent = folder.title;
                folderInput.appendChild(option);
            });

            // Заполнение списка папок (для выбора из dropdown)
            foldersList.innerHTML = "";
            data.folders.forEach((folder) => {
                const listItem = document.createElement("li");
                listItem.textContent = folder.title;
                listItem.dataset.id = folder.id;
                listItem.addEventListener("click", function () {
                    folderInput.value = folder.id; // Устанавливаем значение
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
        const taskData = {
            title: titleInput.value,
            full_text: fullTextInput.value,
            data_create: new Date().toISOString(),
            data_complete: null,
            data_add: selectedDate, // Используем выбранную дату
            deadline: deadlineInput.value,
            folder: folderInput.value, // Папка будет установлена через поле ввода
            priority: parseInt(priorityInput.value) || 2,
            is_completed: completedInput.checked // Используйте checked для checkbox
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
                console.error('Ошибка сети:', response.statusText); // Отладочное сообщение
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            closeForm(); // Закрываем форму только после успешного сохранения
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });

    // Закрытие формы при клике за пределами формы
    document.addEventListener("click", function(event) {
        if (!TaskForm.contains(event.target) && !event.target.classList.contains("btn-add-task") && !event.target.classList.contains('list_task')) {
            closeForm();
        }
    });

    // Функция для получения CSRF токена
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Проверяем, начинается ли cookie с нужного имени
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
    } else {
        currentTaskId = null;
        titleInput.value = '';
        fullTextInput.value = '';
        deadlineInput.value = '';
        folderInput.value = '';
        priorityInput.value = '';
        completedInput.checked = false;
    }
}

document.addEventListener("DOMContentLoaded", Main);

