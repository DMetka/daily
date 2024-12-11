function loadTasks() {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1); // Начало недели (понедельник)

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Конец недели (воскресенье)

    // Форматируем даты для передачи на сервер
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    // Отправляем запрос с параметрами
    fetch(`/get_now_week/?start_date=${startDate}`)
        .then(response => response.json())
        .then(data => {
            const tasksList = document.querySelector('.list_of_tasks');
            tasksList.innerHTML = '';

            if (data.tasks.length === 0) {
                tasksList.innerHTML = '<p>Нет задач на эту неделю</p>';
            } else {
                data.tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.innerHTML = `
                        <h3 class="list_of_task">${task.title}</h3>
                        <small class="list_of_task">Дедлайн: ${task.deadline}</small>
                    `;
                    tasksList.appendChild(taskElement);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки задач:', error);
        });
}


function changeDays(direction) {
    currentDate.setDate(currentDate.getDate() + direction); // Обновляем текущую дату
    updateWeekRange(); // Обновляем диапазон недели
    loadTasks(); // Загружаем задачи для обновлённой недели
}

document.addEventListener('DOMContentLoaded', () => {
    updateWeekRange(); // Инициализируем диапазон недели
    loadTasks(); // Загружаем задачи при загрузке страницы
});