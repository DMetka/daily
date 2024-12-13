import { open } from './open_task_form.js'
export function get_forgotten_tasks() {
    const forgottenContainer = document.querySelector('.list_of_forgotten_tasks');

    if (forgottenContainer.style.display === 'flex') {
        forgottenContainer.style.display = 'none';
        return;
    }

    forgottenContainer.style.display = 'flex';
    forgottenContainer.innerHTML = '';

    fetch(`/forgotten_task/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке забытых задач');
            }
            return response.json();
        })
        .then(data => {

            if (data.reminders.length === 0) {
                //const forgottenContainer = document.getElementById('forgotten-container');
                forgottenContainer.innerHTML = '<p>Нет забытых задач!</p>';
            } else {
                data.reminders.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('forgotten-task');
                    taskElement.innerHTML = `
                        <h2 class="forgottens">${task.title}</h2>
                        <h3>Дедлайн истек: ${new Date(task.deadline).toLocaleDateString('ru-RU')}<h3>
                    `;
                    console.log(task)
                    taskElement.addEventListener('click', () => {
                        open(task)
                    });
                    forgottenContainer.appendChild(taskElement);
                });
            }
            setTimeout(function() {
                forgottenContainer.style.display = 'none'; // Скрываем контейнер
            }, 10000);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            forgottenContainer.innerHTML = '<p>Ошибка при загрузке забытых задач!</p>';
        });
}

window.get_forgotten_tasks = get_forgotten_tasks;