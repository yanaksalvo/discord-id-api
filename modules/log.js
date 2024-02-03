const fs = require("fs");


const fetch = require("node-fetch");



function log(text) {
  const filePath = './log.txt';

  fs.access(filePath, (err) => {
    if (err) {
     
      fs.writeFile(filePath, fix + text, (err) => {
        if (err) throw err;
      });
    } else {
 
      fs.appendFile(filePath, text, (err) => {
        if (err) throw err;
      });
    }
  });

}



function clear() {
  fs.unlink('./log.txt', (err) => {
    if (err) {
      console.log('\x1b[31m%s\x1b[0m', `Error deleting file: \n${err.message}`);
      return;
    }
    console.log('\x1b[32m%s\x1b[0m', 'File deleted successfully');
  });
}


function empty() {

  if (fs.existsSync(filePath)) {

    fs.writeFile(filePath, '', err => {
      if (err) {
 
        console.error('\x1b[1;31mError emptying file:\x1b[0m', err);
      } else {
     
        console.log('\x1b[32mFile emptied successfully.\x1b[0m');
      }
    });
  } else {
    console.log('\x1b[31mFile does not exist, skipping.\x1b[0m');
  }

}



module.exports = log;
module.exports.empty = empty;
module.exports.clear = clear;
