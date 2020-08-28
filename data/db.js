// 우선 file system을 이용하여 데이터 관리
const fs = require('fs');
const path = require('path');

// data.json
const file = path.join(__dirname, 'data.json');
const getData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      err ? reject(err) : resolve(JSON.parse(data || null));
    });
  });
};
const setData = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, JSON.stringify(data), 'utf-8', (err) => {
      err ? reject(err) : resolve();
    });
  });
};
module.exports = { getData, setData };
