const selectOne = (ele) => {
  return document.querySelector(ele);
};
const selectAll = (ele) => {
  return document.querySelectorAll(ele);
};

const create = (name, attr) => {
  const ele = document.createElement(name);
  for (const key in attr) {
    const val = attr[key];
    switch (key) {
      case 'html':
        ele.innerHTML = val;
        break;
      case 'event':
        for (const e in val) {
          ele.addEventListener(e, val[e]);
        }
        break;
      default:
        ele.setAttribute(key, val);
        break;
    }
  }
  return ele;
};

// variable
const dateInput = selectOne('.date-input');
const dateList = selectOne('.date-list');
const taskList = selectOne('.task-list');
const dataList = [];

// func
const taskChildRender = (task) => {
  return create('li', {
    html: task.name,
    style: task.state ? 'color: #4928a9' : '',
    event: {
      click: (e) => {
        e.target.style.color = (task.state = !task.state) ? '#4928a9' : '';
      },
    },
  });
};

const taskRender = (data) => {
  return (e) => {
    const title = create('h3', { html: data.name });
    const ul = create('ul');
    const input = create('input', {
      class: 'task-input',
      placeholder: 'todo를 입력해주세요',
      event: {
        keyup: (inputEvent) => {
          if (inputEvent.keyCode === 13 && inputEvent.target.value.length > 0) {
            data.child.push({ name: inputEvent.target.value, state: false });
            e.target.click();
            inputEvent.target.focus();
          }
        },
      },
    });
    const close = create('input', {
      type: 'button',
      value: '닫기',
      event: {
        click: (e) => {
          taskList.innerHTML = '';
        },
      },
    });
    data.child.forEach((ele) => {
      ul.appendChild(taskChildRender(ele));
    });
    taskList.innerHTML = '';
    for (const ele of [title, input, ul, close]) {
      taskList.appendChild(ele);
    }
  };
};

const dateRender = () => {
  dateList.innerHTML = '';
  const ul = create('ul');
  dataList.forEach((d) => {
    ul.appendChild(
      create('li', { html: d.name, event: { click: taskRender(d) } }),
    );
  });
  dateList.appendChild(ul);
};

const addDate = (e) => {
  if (e.keyCode === 13 && e.target.value.length > 0) {
    // enter를 치면
    dataList.push({ name: e.target.value, child: [] });
    e.target.value = '';
    e.target.focus;
    dateRender();
  }
};

window.onload = () => {
  dateInput.onkeyup = addDate;
  dateRender();
};
