let point = new Date();

const prev = document.querySelector('.prev-month');
const next = document.querySelector('.next-month');
prev.addEventListener('click', prevMonth);
next.addEventListener('click', nextMonth);

function renderCalendar(point) {
  // 달력의 월/년이 지정일에 따라 설정되도록
  const monthYear = document.querySelector('.month-year');
  monthYear.innerText = `${point
    .toString()
    .substr(4, 3)
    .toUpperCase()} ${point.getFullYear()}`;

  // 달력에 필요한 변수 선언
  const startMonth = new Date(point.getFullYear(), point.getMonth());
  const endMonth = new Date(point.getFullYear(), point.getMonth() + 1);
  endMonth.setDate(endMonth.getDate() - 1);
  const startDate = new Date(
    startMonth.valueOf() - 1000 * 60 * 60 * 24 * startMonth.getDay(),
  );
  const endDate = new Date(
    endMonth.valueOf() + 1000 * 60 * 60 * 24 * (6 - endMonth.getDay()),
  );

  // 달력 구조
  const days = document.createElement('div');
  days.classList.add('cal-wrapper');
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

      // date 정보를 남기기 위해
      const dateInfo = document.createElement('div');
      dateInfo.classList.add('date-info');
      dateInfo.innerText = thisDate.toDateString();
      dateInfo.style.cssText = 'text-indent:-9999px';
      day.appendChild(dateInfo);

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

function prevMonth() {
  const prevMonth = new Date(document.querySelector('.month-year').innerText);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  const days = document.querySelector('.days');
  days.innerHTML = '';
  days.appendChild(renderCalendar(prevMonth));
}
function nextMonth() {
  const nextMonth = new Date(document.querySelector('.month-year').innerText);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const days = document.querySelector('.days');
  days.innerHTML = '';
  days.appendChild(renderCalendar(nextMonth));
}
