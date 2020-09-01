const calendar = (function func() {
  let pointDate = new Date();

  // 엘리먼트 변수 접근
  const title = document.querySelector('h1');
  const prev = document.querySelector('.prev-month');
  const next = document.querySelector('.next-month');
  const monthYear = document.querySelector('.month-year');
  const days = document.querySelector('.days');

  // 초기 화면 렌더링
  renderCalendar(pointDate);

  // 이벤트 추가
  title.addEventListener('click', () => {
    pointDate = new Date();
    renderCalendar(pointDate);
  });
  prev.addEventListener('click', prevMonth);
  next.addEventListener('click', nextMonth);

  // ----- 함수 ------------------------------
  // 달력 렌더링 함수
  function renderCalendar(point) {
    // days 내용 초기화
    days.innerHTML = '';

    // 달력의 월/년이 지정일에 따라 설정되도록
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
    const dayWrap = document.createElement('div');
    dayWrap.classList.add('day-wrapper');

    const thisDate = new Date(startDate);
    for (let i = 0; i < (endDate - startDate) / 24 / 60 / 60 / 1000 / 7; i++) {
      const weekBox = document.createElement('div');
      weekBox.classList.add('week-box');

      for (let j = 0; j < 7; j++) {
        const day = document.createElement('div');
        day.innerText = thisDate.getDate();
        day.classList.add(
          'day',
          `${thisDate < startMonth || thisDate > endMonth ? 'other' : 'curr'}`,
        );
        day.classList.toggle(
          'point',
          thisDate.toDateString() === pointDate.toDateString(),
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
        dateInfo.style.visibility = 'hidden';
        day.appendChild(dateInfo);

        weekBox.appendChild(day);
        thisDate.setDate(thisDate.getDate() + 1);
      }
      dayWrap.appendChild(weekBox);
    }
    days.appendChild(dayWrap);
    addEvent('.day', 'click', (e) => {
      pointDate = getDate(e);
      renderCalendar(pointDate);
    });
  }
  // 이벤트 추가 함수
  function addEvent(ele, event, callback) {
    const eles = document.querySelectorAll(ele);
    [].forEach.call(eles, (ele) => {
      ele.addEventListener(event, (e) => {
        callback(e);
      });
    });
  }
  // 날짜 불러 오기
  const getDate = (e) => {
    const target = e.target.children[0];
    return new Date(target.innerHTML);
  };
  // 이전 달 달력 렌더링
  function prevMonth() {
    const prevMonth = new Date(monthYear.innerText);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    renderCalendar(prevMonth);
  }
  // 다음 달 달력 렌더링
  function nextMonth() {
    const nextMonth = new Date(monthYear.innerText);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    renderCalendar(nextMonth);
  }

  // ----- AJAX ------------------------------
  async function getTodo(url) {
    const res = await fetch(url);
    const result = await res.json();
    if (!result.success) throw result.err;
    console.log(result);
    return result;
  }
  async function postTodo(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!result.success) throw result.err;
    return result.data;
  }
  postTodo('/todo/200901', {
    200901: { id: 0, name: 'FETCH 적용하기', done: false },
  });
  getTodo('/todo/200901');
})();
