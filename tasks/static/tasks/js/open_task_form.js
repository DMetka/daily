let selectedDate = null

function Main(task = null) {
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

    if (task) {
        openForm()
    }

     function openForm(date) {
        TaskForm.style.display = 'flex';
        selectedDate = date
        requestAnimationFrame(() => {
            TaskForm.style.transform = 'translateX(0)';
        });
    }

    // Функция для закрытия формы
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

    // Обработчик события для кнопок "Добавить задачу"
    document.querySelectorAll(".btn-add-task").forEach(button => {
        button.addEventListener("click", function() {
            const dateElement = this.closest('.day').querySelector('.date');
            const date = dateElement.textContent
            openForm(date);
        });
    });

    // Обработчик события для кнопки "Сохранить"
    SaveTask.addEventListener("click", function() {
        // Проверка на заполненность полей
        if (!titleInput.value || !fullTextInput.value || !deadlineInput.value) {
            alert("Пожалуйста, заполните все обязательные поля.");
            return; // Выход из функции, если поля не заполнены
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

        console.log("Отправка данных на сервер:", taskData); // Отладочное сообщение

        fetch('add_task/', {
            method: 'POST',
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
        if (!TaskForm.contains(event.target) && !event.target.classList.contains("btn-add-task")) {
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

document.addEventListener("DOMContentLoaded", Main);

export default Main;