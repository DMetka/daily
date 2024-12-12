function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function loadTasks() {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 2));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

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
                    taskElement.classList.add('list_task');
                    taskElement.dataset.taskId = task.id; // Сохраняем ID задачи
                    taskElement.innerHTML = `
                        <h3 class="list_of_task">${task.title}</h3>
                        <small class="list_of_task">Дедлайн: ${task.deadline}</small>
                    `;
                    taskElement.addEventListener('click', () => {
                        console.log(task);
                        openForm(task.deadline, task);
                    });
                    tasksList.appendChild(taskElement);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки задач:', error);
        });
}



function changeDays(direction) {
    currentDate.setDate(currentDate.getDate() + direction);
    updateWeekRange();
    loadTasks();
}


document.addEventListener('DOMContentLoaded', () => {
    updateWeekRange();
    loadTasks();
});