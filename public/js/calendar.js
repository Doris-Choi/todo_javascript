const point = new Date();

const monthYear = document.querySelector('.month-year');
monthYear.innerText = `${point
  .toString()
  .substr(4, 3)
  .toUpperCase()} ${point.getFullYear()}`;

function renderCalendar(point) {
  const startMonth = new Date(point.getFullYear(), point.getMonth());
  const endMonth = new Date(point.getFullYear(), point.getMonth() + 1);
  endMonth.setDate(endMonth.getDate() - 1);
  const startDate = new Date(
    startMonth.valueOf() - 1000 * 60 * 60 * 24 * startMonth.getDay(),
  );
  const endDate = new Date(
    endMonth.valueOf() + 1000 * 60 * 60 * 24 * (6 - endMonth.getDay()),
  );

  const days = document.createElement('div');
  days.getAttribute('class', 'cal-wrapper');

  const thisDate = new Date(startDate);
  for (let i = 0; i < (endDate - startDate) / 24 / 60 / 60 / 1000 / 7; i++) {
    const weekBox = document.createElement('div');
    weekBox.setAttribute('class', 'week-box');

    for (let j = 0; j < 7; j++) {
      const day = document.createElement('div');
      day.innerText = thisDate.getDate();
      day.classList.add('day');
      day.classList.toggle(
        'other',
        thisDate < startMonth || thisDate > endMonth,
      );
      day.classList.toggle(
        'today',
        thisDate.toDateString() === new Date().toDateString(),
      );
      day.classList.toggle('sun', thisDate.getDay() === 0);
      day.classList.toggle('sat', thisDate.getDay() === 6);

      weekBox.appendChild(day);

      thisDate.setDate(thisDate.getDate() + 1);
    }

    days.appendChild(weekBox);
  }
  return days;
}

window.onload = () => {
  const days = document.querySelector('.days');
  days.appendChild(renderCalendar(new Date()));
};

function prevMonth() {}
function nextMonth() {}
