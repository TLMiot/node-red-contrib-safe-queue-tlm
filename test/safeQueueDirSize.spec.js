const {
  expect
} = require('chai');

const os = require('os');
var fs = require('fs');
var path = require('path');
var FileSystem = require('../red/FileSystem.js');

function getDirBase() {
  var dirBase = path.join(os.tmpdir(), (Math.random() * (9999999 - 1) + 1).toString());
  return dirBase;
}

function destroyerDirBase(callback) {

  fileSystem.close();

  fileSystem.deleteQueue((err) => {
    if (!err) {
      fileSystem.deleteDone((err) => {
        if (!err) {
          fileSystem.deleteError((err) => {
            if (!err) {
              fs.rmdir(dirError, (err) => {
                if (!err) {
                  fs.rmdir(dirDone, (err) => {
                    if (!err) {
                      fs.rmdir(dirQueue, (err) => {
                        if (!err) {
                          fs.rmdir(pathBase, (err) => {
                            if (!err) {
                              callback(err);
                            } else {
                              callback(err);
                            }
                          });
                        } else {
                          callback(err);
                        }
                      });
                    } else {
                      callback(err);
                    }
                  });
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
}

var pathBase = getDirBase();
var fileSystem = new FileSystem(pathBase);
var dirQueue = path.join(pathBase, 'queue');
var dirError = path.join(pathBase, 'error');
var dirDone = path.join(pathBase, 'done');

describe("#SafeQueue Directory Size", () => {

  var obj1 = {};
  obj1._msgid = "123456";
  obj1.payload = "File Data";

  var obj2 = {};
  obj2._msgid = "654321";
  obj2.payload = "File Data";


  var obj3 = {};
  obj3._msgid = "456789";
  obj3.payload = "File Data";

  it('#Queue size', (done) => {

    fileSystem.init((err) => {
      if (!err) {
        fileSystem.saveMessage(obj3, (err, results) => {
          if (!err) {
            fileSystem.getQueueSize(function (err, results) {
              if (!err) {
                expect(1).to.equal(results);
                done();
              }
            });
          }
        });
      }
    });

  });


  it('#Done size', (done) => {

    fileSystem.saveMessage(obj1, (err, results) => {
      {
        if (!err) {
          fileSystem.doneMessage(obj1._msgid, (err, results) => {
            if (!err) {
              fileSystem.getDoneSize(function (err, results) {
                if (!err) {
                  expect(1).to.equal(results);
                  done();
                }
              });
            }
          });
        }
      }
    });
  });

  it('#Error size', (done) => {

    fileSystem.saveMessage(obj2, (err, results) => {
      {
        if (!err) {
          fileSystem.errorMessage(obj2._msgid, (err, results) => {
            if (!err) {
              fileSystem.getErrorSize(function (err, results) {
                if (!err) {
                  expect(1).to.equal(results);
                  done();
                }
              });
            }
          });
        }
      }
    });
  });

  it('#Cleaning after the test', (done) => {

    destroyerDirBase((err) => {
      if (!err) {
        done();
      }
    });

  });


});