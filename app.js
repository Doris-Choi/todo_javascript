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
  .route('/api/date')
  .get(async (req, res) => {
    const result = { success: true };
    try {
      const json = await db.getData();
      result.data = json.date;
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  })
  .post(async (req, res) => {
    const result = { success: true };
    const date = req.body.date;
    try {
      const json = await db.getData();
      json.date = date;
      await db.setData(json);
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  });

// task
app
  .route('api/task/:parent')
  .get(async (req, res) => {
    const result = { success: true };
    const parent = req.params.parent;
    try {
      const json = await db.getData();
      list = [];
      json.task.forEach((task, idx) => {
        if (task.parent === parent) {
          task.idx = idx;
          list.push(task);
        }
      });
      result.data = list;
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  })
  .post(async (req, res) => {
    const result = { success: true };
    const task = req.body.task;
    const parent = req.params.parent;
    try {
      const json = await db.getData();
      task.parent = parent;
      json.task.push(task);
      await db.setData(json);
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  })
  .put(async (req, res) => {
    const result = { success: true };
    const task = req.body.task;
    const idx = req.params.parent;
    try {
      const json = await db.getData();
      json.task[idx] = task;
      await db.setData(json);
    } catch (err) {
      result.success = false;
      result.err = err;
    }
    res.json(result);
  });

// port
port = 4567;
app.listen(port);
