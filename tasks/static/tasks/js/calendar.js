let currentDate = new Date(); // Текущая дата

function updateCalendar() {
    const daysElements = document.getElementById('calendar').getElementsByClassName('day');
    for (let i = 0; i < 4; i++) {
        const dayElement = daysElements[i];
        const dayNameElement = dayElement.getElementsByClassName('day-name')[0];
        const dateElement = dayElement.getElementsByClassName('date')[0];
        const addTaskButton = dayElement.getElementsByClassName('add-task-btn')[0];

        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() + i);

        const dayString = day.toLocaleDateString('ru-RU', { weekday: 'long' });
        const formattedDate = day.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

        dayNameElement.textContent = dayString.charAt(0).toUpperCase() + dayString.slice(1); // Первая буква заглавная
        dateElement.textContent = formattedDate;
        dateElement.setAttribute('data-day', day.toISOString().split('T')[0]); // Сохраняем дату для использования в форме
        //Обработчик события для добавления задачи
        addTaskButton.onclick = function() {
            openForm(day.toISOString().split('T')[0]);
            }
    }
    // Загружаем задачи для текущих 4 дней
    loadTasks(currentDate.toISOString().split('T')[0]);
}

function changeDays(direction) {
    currentDate.setDate(currentDate.getDate() + direction); // Изменяем текущую дату на 4 дня
    updateCalendar(); // Обновляем календарь
}

// Вызываем функцию для обновления календаря при загрузке страницы
updateCalendar();


function fetchTaskData(task_id) {
    return fetch(`get_task/${task_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            return data.task; // Возвращаем объект задачи
        })
        .catch(error => {
            console.error('Error fetching task data:', error);
            return null; // Возвращаем null в случае ошибки
        });
}

// Функция для открытия формы редактирования задачи
function openFormForEditing(task_id) {
    fetchTaskData(task_id) // Запрос данных задачи по ID
        .then(task => {
            if (task) {
                // Заполняем поля формы данными задачи
                document.getElementById('taskName').value = task.title || ''; // Название задачи
                document.getElementById('taskDate').value = task.deadline || ''; // Крайний срок выполнения задачи
                document.getElementById('taskFullText').value = task.full_text || ''; // Описание задачи
                document.getElementById('taskPriority').value = task.priority || 3; // Приоритет задачи
                document.getElementById('taskCompleted').checked = task.is_completed || false; // Статус выполнения
                document.getElementById('taskFolder').value = task.folder || ''; // Папка задачи
                document.getElementById('taskDataCreate').value = task.data_create || ''; // Дата создания
                document.getElementById('taskDataComplete').value = task.data_complete || ''; // Дата завершения
                document.getElementById('taskDataAdd').value = task.data_add || ''; // Дата добавления
                document.getElementById('taskUser ').value = task.user || ''; // Пользователь задачи

                // Открываем форму
                TaskForm.style.display = 'flex';
                requestAnimationFrame(() => {
                    TaskForm.style.transform = 'translateX(0)';
                });
            }
        })
        .catch(error => {
            console.error('Error opening form for editing:', error);
            alert('Не удалось загрузить данные задачи. Пожалуйста, попробуйте еще раз.'); // Уведомляем пользователя об ошибке
        });
}


function loadTasks(startDate) {
    // Преобразуем startDate в формат YYYY-MM-DD
    const start = new Date(startDate);
    const tasksPromises = [];

    // Загружаем задачи для каждого из 4 дней
    for (let i = 0; i < 4; i++) {
        const currentDay = new Date(start);
        currentDay.setDate(start.getDate() + i);
        const formattedDate = currentDay.toISOString().split('T')[0];

        // Создаем промис для каждой даты
        tasksPromises.push(
            fetch(`/get_now_four_days?start_date=${formattedDate}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error(data.error);
                        return [];
                    }
                    return data.tasks; // Возвращаем задачи для текущего дня
                })
                .catch(error => {
                    console.error('Error fetching tasks:', error);
                    return [];
                })
        );
    }

    // Когда все промисы завершены, обрабатываем результаты
    Promise.all(tasksPromises).then(results => {
        const days = document.querySelectorAll('.day');

        days.forEach((day, index) => {
            const tasksContainer = day.querySelector('.tasks-container');
            tasksContainer.innerHTML = ''; // Очистить контейнер перед добавлением новых задач

            const tasksForDay = results[index] || []; // Получаем задачи для текущего дня

             // Добавляем задачи в контейнер в виде карточек
            tasksForDay.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task-card'; // Добавляем класс для стилизации
                taskElement.innerText = task.title; // Предполагаем, что у задачи есть поле title


                // Добавляем обработчик события для открытия формы редактирования
                  taskElement.addEventListener('click', function() {
                    openFormForEditing(task.id); // Открываем форму для редактирования
                });

                tasksContainer.appendChild(taskElement);
            });
        });
    });
}