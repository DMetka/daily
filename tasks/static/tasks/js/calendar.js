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
    }
}

function changeDays(direction) {
    currentDate.setDate(currentDate.getDate() + direction); // Изменяем текущую дату на 4 дня
    updateCalendar(); // Обновляем календарь
}

// Вызываем функцию для обновления календаря при загрузке страницы
updateCalendar();