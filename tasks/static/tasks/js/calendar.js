let currentDate = new Date(); // Текущая дата

function updateCalendar() {
    const daysElements = document.getElementById('calendar').getElementsByClassName('day');
    for (let i = 0; i < 7; i++) {
        const dayElement = daysElements[i];
        const dayNameElement = dayElement.getElementsByClassName('day-name')[0];
        const dateElement = dayElement.getElementsByClassName('date')[0];

        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() + i -1);

        const dayString = day.toLocaleDateString('ru-RU', { weekday: 'long' });
        const formattedDate = day.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

        dayNameElement.textContent = dayString.charAt(0).toUpperCase() + dayString.slice(1);
        dateElement.textContent = formattedDate;
        dateElement.setAttribute('data-day', day.toISOString()); // Устанавливаем data-day
    }
}

function changeDays(direction) {
    currentDate.setDate(currentDate.getDate() + direction);
    updateCalendar();

    const taskContainers = document.querySelectorAll('.tasks-container')
    if (taskContainers) {
        taskContainers.forEach(taskContainer => {
            taskContainer.innerHTML = ''
        })

        const date = document.querySelector('.date').textContent

        fetch('task_date/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
                dateStart: date
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data);

            // тут нужно вставить код, который будет вставлять таски по местам
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });


    }
}

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