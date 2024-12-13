document.addEventListener('DOMContentLoaded', updateNotificationBadge);


function updateNotificationBadge() {
    fetch('/remind_task/')
        .then(response => response.json())
        .then(data => {
            const reminders = data.reminders;

            // Показываем или скрываем бейджик
            const badge = document.getElementById('notificationBadge');
            if (reminders.length > 0) {
                badge.style.display = 'block';
                badge.textContent = reminders.length;
            } else {
                badge.style.display = 'none';
                badge.textContent = '';
            }
        })
        .catch(error => {
            console.error('Ошибка при получении напоминаний:', error);
        });
}


function toggleNotifications() {
    const popup = document.getElementById('notificationPopup');

    // Если уведомления уже видимы, скрываем их
    if (popup.style.display === 'block') {
        popup.style.display = 'none';
        return;
    }

    // Иначе получаем данные с сервера
    fetch('remind_task')
        .then(response => response.json())
        .then(data => {
            const reminders = data.reminders;
            const popupContent = reminders.map(reminder => `
                <div class="notification-popup">
                    <p><strong>${reminder.title}</strong></p>
                    <p>Дедлайн: ${new Date(reminder.deadline).toLocaleDateString()}</p>
                </div>
            `).join('');

            // Обновляем содержимое попапа
            popup.innerHTML = popupContent || '<p>Нет новых напоминаний</p>';
            popup.style.display = 'block';

            // Показываем бейджик, если есть уведомления
            const badge = document.getElementById('notificationBadge');
            if (reminders.length > 0) {
                badge.style.display = 'block';
                badge.textContent = reminders.length;
            } else {
                badge.style.display = 'none';
                badge.textContent = '';
            }
        })
        .catch(error => {
            console.error('Ошибка при получении напоминаний:', error);
        });
}
