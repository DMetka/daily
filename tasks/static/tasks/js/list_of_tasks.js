import { open } from './open_task_form.js'

function loadTasks() {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    console.log({currentMonth})
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startDate = `${startOfMonth.getFullYear()}-${(startOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${startOfMonth.getDate().toString().padStart(2, '0')}`;
    console.log({startDate})
    fetch(`/get_now_month/?start_date=${startDate}`)
        .then(response => response.json())
        .then(data => {
            const tasksList = document.querySelector('.list_of_tasks');
            tasksList.innerHTML = '';

            if (data.tasks.length === 0) {
                tasksList.innerHTML = '<p>Нет задач на этот месяц</p>';
            } else {
                data.tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('list_task');
                    taskElement.innerHTML = `
                        <h2 class="list_of_task">${task.title}</h2>
                        <h3>Дедлайн: ${task.deadline}</h3>
                    `;
                    taskElement.addEventListener('click', () => {
                        open(task)
                    });
                    tasksList.appendChild(taskElement);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки задач:', error);
        });
}



function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateMonthRange();
    loadTasks();
}


window.changeMonth = changeMonth;


document.addEventListener('DOMContentLoaded', () => {
    updateMonthRange();
    loadTasks();
});