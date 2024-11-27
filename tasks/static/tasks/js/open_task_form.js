document.addEventListener("DOMContentLoaded", function() {
    const addTaskButtons = document.querySelectorAll(".add-task-btn");
    const TaskForm = document.getElementById("TaskForm");
    const SaveTask = document.getElementById("SaveTask");
    const titleInput = document.getElementById("taskName");
    const fullTextInput = document.getElementById("taskFullText");
    const deadlineInput = document.getElementById("taskDate"); // Поле для даты дедлайна
    //const folderInput = document.getElementById("taskFolder"); // Поле для папки
    const priorityInput = document.getElementById("taskPriority"); // Поле для приоритета
    const completedInput = document.getElementById("taskCompleted"); // Выполнена ли задача

    // Функция для открытия формы
    function openForm(date) {
        TaskForm.style.display = 'flex';
         selectedDate = date; // Сохраняем выбранную дату
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


    // Обработчик события для кнопок "Добавить задачу"
    document.querySelectorAll(".add-task-btn").forEach(button => {
        button.addEventListener("click", function() {
            const dateElement = this.closest('.day').querySelector('.date');
            const date = dateElement.getAttribute('data-day'); // Получаем дату из атрибута
            openForm(date); // Открываем форму с выбранной датой
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
            //folder: folderInput.value, // ID папки
            priority: parseInt(priorityInput.value) || 2,
            is_completed: completedInput.checked // Используйте checked для checkbox
        };

        console.log("Отправка данных на сервер:", taskData); // Отладочное сообщение

        fetch('add_task', {
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
            // Здесь можно добавить логику для обновления UI, если необходимо
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });

    // Закрытие формы при клике за пределами формы
    document.addEventListener("click", function(event) {
        if (!TaskForm.contains(event.target) && !event.target.classList.contains("add-task-btn")) {
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


});
