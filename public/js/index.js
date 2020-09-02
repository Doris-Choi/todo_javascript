const calendar = (function func() {
  let pointDate = new Date();

  // 엘리먼트 변수 접근
  const title = document.querySelector('h1');
  const prev = document.querySelector('.prev-month');
  const next = document.querySelector('.next-month');
  const monthYear = document.querySelector('.month-year');
  const days = document.querySelector('.days');
  const todo = document.getElementById('todo');
  todo.style.display = 'none';
  // todo.addEventListener('click', () => {
  //   todo.style.display = 'none';
  // });
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
    addEvent('.day', 'dblclick', (e) => {
      const d = getDate(e);
      getTodo(
        `/todo/${d.getFullYear()}/${
          d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)
        }/${d.getDate() > 9 ? d.getDate() : '0' + d.getDate()}`,
      );
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
    renderTodo(result);
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
  // postTodo('/todo/200901', {
  //   200901: { id: 0, name: 'FETCH 적용하기', done: false },
  // });
  // getTodo('/todo/200901');

  // ----- TODO Render
  function renderTodo(result) {
    todo.innerHTML = '';

    const todoWrap = document.createElement('div');
    todoWrap.classList.add('todo-wrapper');
    todoWrap.appendChild(renderTodoHead(result));
    todoWrap.appendChild(renderTodoBody(result.todo));
    todoWrap.appendChild(renderTodoAdd());

    todo.appendChild(todoWrap);
    todo.style.display = 'block';
  }
  function renderTodoHead(result) {
    const [yy, mm, dd] = result.date.split('/');
    const todoHead = document.createElement('div');
    const exitTodo = document.createElement('div');
    const todoDate = document.createElement('h2');
    const countDoing = document.createElement('div');
    todoHead.classList.add('todo-head');
    exitTodo.classList.add('exit-todo');
    todoDate.innerText = `${yy}년 ${parseInt(mm)}월 ${parseInt(dd)}일`;
    todoHead.appendChild(exitTodo);
    todoHead.appendChild(todoDate);
    todoHead.appendChild(countDoing);

    exitTodo.addEventListener('click', (e) => {
      todo.style.display = 'none';
    });
    const todoData = result.todo || null;
    console.log(todoData);
    if (todoData) {
      const { count, todos } = todoData;
      countDoing.innerText = `할 일 ${count}개 중 ${
        todos.filter((ele) => !ele.done).length
      }개 남음`;
    }
    return todoHead;
  }
  function renderTodoBody(todo) {
    const todoBody = document.createElement('div');
    todoBody.classList.add('todo-body');
    if (!todo) return todoBody;
    const { count, todos } = todo;

    for (let i = 0; i < count; i++) {
      const todoBox = document.createElement('div');
      const todoCheck = document.createElement('div');
      const todoContent = document.createElement('div');
      const todoDelete = document.createElement('div');
      todoBox.classList.add('todo-box');
      todoCheck.classList.add('todo-check');
      todoContent.classList.add('todo-content');
      todoDelete.classList.add('todo-delete');

      if (todos[i].done) {
        todoCheck.classList.add('done');
        todoContent.classList.add('done');
      }
      todoCheck.addEventListener('click', (e) => {
        todoCheck.classList.toggle('done');
        todoContent.classList.toggle('done');
        console.log(todoCheck);
        console.log(todoContent);
      });
      todoContent.innerText = todos[i].name;
      todoDelete.addEventListener('click', (e) => {
        if (confirm('정말로 지우시겠습니까?')) {
          console.log(todos[i].id);
        }
      });

      todoBox.appendChild(todoCheck);
      todoBox.appendChild(todoContent);
      todoBox.appendChild(todoDelete);
      todoBody.appendChild(todoBox);
    }
    return todoBody;
  }
  function renderTodoAdd() {
    const todoAdd = document.createElement('div');
    const todoInput = document.createElement('input');
    const btnAdd = document.createElement('button');
    todoAdd.classList.add('todo-add');
    todoInput.placeholder = '할 일을 입력하세요!';
    btnAdd.innerText = '할 일 추가';

    btnAdd.addEventListener('click', (e) => {
      console.log(todoInput.value);
    });

    todoAdd.appendChild(todoInput);
    todoAdd.appendChild(btnAdd);
    return todoAdd;
  }
})();
