function get_forgotten_tasks() {
    const remindersContainer = document.querySelector('.list_of_forgotten_tasks');

    if (remindersContainer.style.display === 'block') {
        remindersContainer.style.display = 'none';
        return;
    }

    remindersContainer.style.display = 'block';

    fetch(`/forgotten_task/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке забытых задач');
            }
            return response.json();
        })
        .then(data => {
            remindersContainer.innerHTML = '';

            if (data.reminders.length === 0) {
                const remindersContainer = document.getElementById('forgotten-container');
                remindersContainer.innerHTML = '<p>Нет забытых задач!</p>';
            } else {
                data.reminders.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('forgotten-task');
                    taskElement.innerHTML = `
                        <h3 class="forgottens">${task.title}</h3>
                        <small class="forgottens">Дедлайн истек: ${new Date(task.deadline).toLocaleDateString('ru-RU')}</small>
                    `;
                    const remindersContainer = document.getElementById('forgotten-container');
                    remindersContainer.appendChild(taskElement);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            remindersContainer.innerHTML = '<p>Ошибка при загрузке забытых задач!</p>';
        });

    setTimeout(function() {
     remindersContainer.style.display = 'none';
    }, 5000);
}