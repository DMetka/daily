let currentDate = new Date();

function updateMonthRange() {

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('RU', { month: 'long', year: 'numeric' });
    document.getElementById('monthRange').textContent = monthName;
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const calendarDays = document.getElementById('calendarDays');
    console.log({firstDayOfMonth})
}
/*function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateMonthRange();
}*/

document.addEventListener('DOMContentLoaded', updateMonthRange);