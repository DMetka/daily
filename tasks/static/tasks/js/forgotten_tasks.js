function get_forgotten_tasks(){
    fetch(`/forgotten_task/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке забытых задач');
            }
            return response.json();
        })
        .then(data => {
            const remindersContainer = document.querySelector('.list_of_forgotten_tasks');
            remindersContainer.innerHTML = '';

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
            document.querySelector('.list_of_forgotten_tasks').innerHTML = '<p>Ошибка при загрузке забытых задач!</p>';
        });
}
