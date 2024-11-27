let currentDate = new Date(); // Текущая дата

function updateCalendar() {
    const daysElements = document.getElementById('calendar').getElementsByClassName('day');
    for (let i = 0; i < 4; i++) {
        const dayElement = daysElements[i];
        const dayNameElement = dayElement.getElementsByClassName('day-name')[0];
        const dateElement = dayElement.getElementsByClassName('date')[0];

        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() + i);

        const dayString = day.toLocaleDateString('ru-RU', { weekday: 'long' });
        const formattedDate = day.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

        dayNameElement.textContent = dayString.charAt(0).toUpperCase() + dayString.slice(1); // Первая буква заглавная
        dateElement.textContent = formattedDate;
         dateElement.setAttribute('data-day', day.toISOString()); // Устанавливаем data-day
    }
}

function changeDays(direction) {
    currentDate.setDate(currentDate.getDate() + direction); // Изменяем текущую дату на 4 дня
    updateCalendar(); // Обновляем календарь
    fetchTasksForCurrentDate(); // Загружаем задачи для новых дат
}

function fetchTasksForCurrentDate() {
    const offset = Math.floor((currentDate - new Date()) / (1000 * 60 * 60 * 24)); // Количество дней от сегодня

    fetch(`/get_now_four_days?offset=${offset}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Сеть не в порядке: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Полученные задачи:', data.tasks); // Проверяем, что мы получили
            const tasks = data.tasks;
            const calendar = document.getElementById('calendar');
            const days = calendar.getElementsByClassName('day');

            // Очищаем предыдущие задачи
            for (let day of days) {
                const tasksContainer = day.querySelector('.tasks-container');
                tasksContainer.innerHTML = ''; // Очищаем контейнер задач
            }

            // Обновляем заголовки дней и отображаем задачи
            for (let i = 0; i < days.length; i++) {
                const dayElement = days[i];
                const date = new Date(currentDate);
                date.setDate(currentDate.getDate() + i); // Устанавливаем дату

                // Фильтруем задачи по дате добавления (data_add)
                const tasksForDay = tasks.filter(task => {
                    const taskDate = new Date(task.data_add); // Убедитесь, что data_add правильно возвращает дату
                    return taskDate.toDateString() === date.toDateString();
                });

                // Отображаем задачи
                const tasksContainer = dayElement.querySelector('.tasks-container');
                tasksForDay.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.textContent = task.title; // Предполагается, что у задачи есть поле title
                    tasksContainer.appendChild(taskElement);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при получении задач:', error);
        });
}
// Вызываем функцию для обновления календаря при загрузке страницы
updateCalendar();
fetchTasksForCurrentDate();