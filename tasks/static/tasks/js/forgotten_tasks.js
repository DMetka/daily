function get_forgotten_tasks() {
    const remindersContainer = document.querySelector('.list_of_forgotten_tasks');

    // Если контейнер уже виден, скрыть его и выйти
    if (remindersContainer.style.display === 'block') {
        remindersContainer.style.display = 'none';
        return;
    }

    // Если контейнер скрыт, показываем его и загружаем задачи
    remindersContainer.style.display = 'block';

    fetch(`/forgotten_task/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке забытых задач');
            }
            return response.json();
        })
        .then(data => {
            remindersContainer.innerHTML = ''; // Очищаем содержимое

            if (data.reminders.length === 0) {
                remindersContainer.innerHTML = '<p>Нет забытых задач!</p>';
            } else {
                data.reminders.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.innerHTML = `
                        <h3>${task.title}</h3>
                        <small>Дедлайн истек!: ${new Date(task.deadline).toLocaleDateString('ru-RU')}</small>
                    `;
                    remindersContainer.appendChild(taskElement);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            remindersContainer.innerHTML = '<p>Ошибка при загрузке забытых задач!</p>';
        });
}