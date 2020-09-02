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
  .route('/todo/:yyyy/:mm/:dd')
  .get(async (req, res) => {
    const result = { success: true };
    const yyyy = req.params.yyyy;
    const mm = req.params.mm;
    const dd = req.params.dd;
    try {
      const data = await db.getData();
      result.date = req.url.substr(6);
      result.todo = data[yyyy + mm + dd];
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  })
  .post(async (req, res) => {
    const result = { success: true };
    const yyyy = req.params.yyyy;
    const mm = req.params.mm;
    const dd = req.params.dd;
    const newTodo = req.body[yyyy + mm + dd];
    try {
      const data = await db.getData();
      let point = data[yyyy + mm + dd];
      if (point) {
        point.count += 1;
        point.todos.push(newTodo);
      } else {
        point = {
          count: 1,
          todos: [newTodo],
        };
      }
      data[yyyy + mm + dd] = point;
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
