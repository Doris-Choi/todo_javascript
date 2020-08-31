// 외부 모듈 import
const express = require('express');
const db = require('./data/db.js');
const app = express();

// middle ware 등록
app.use(express.json());
app.use(express.static('public'));

// index page
app.get('/', (req, res) => {
  res.render('index');
});

// date
app
  .route('/todo/:date')
  .get(async (req, res) => {
    const result = { success: true };
    const date = req.params.date;
    try {
      const data = await db.getData();
      result.date = date;
      result.todo = data[date];
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  })
  .post(async (req, res) => {
    const result = { success: true };
    const date = req.params.date;
    const newTodo = req.body[date];
    try {
      const data = await db.getData();
      let point = data[date];
      if (point) {
        point.count += 1;
        point.todos.push(newTodo);
      } else {
        point = {
          count: 1,
          todos: [newTodo],
        };
      }
      data[date] = point;
      await db.setData(data);
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  });

// port
port = 4567;
app.listen(port);
