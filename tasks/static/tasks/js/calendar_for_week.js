let currentDate = new Date();

function updateWeekRange() {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const options = { day: 'numeric', month: 'short' };
    const startDate = startOfWeek.toLocaleDateString('RU', options);
    const endDate = endOfWeek.toLocaleDateString('RU', options);
    document.getElementById('weekRange').textContent = `${startDate} - ${endDate}`;
}

function changeDays(direction) {
    currentDate.setDate(currentDate.getDate() + direction);
    updateWeekRange();
}

document.addEventListener('DOMContentLoaded', updateWeekRange);