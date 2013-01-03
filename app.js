var readline = require('readline');
var fs = require('fs');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var username  = process.env.USER; // get shell username
//var color     = ''; // Not implemented

// Variables for config file
var configData = [];
var configFile = __dirname + '/config.json';


var checkTask = function(task, path, symbol) {

  symbol = (symbol || 'M');

  for (var i = 0, j = configData.length; i < j; i++) {
    // Make search case-insensitive
    var taskQuery = task.toLowerCase();
    var taskInFile = configData[i].task.toLowerCase();
    var parent = configData[i].parent;

    // When the task is found
    if (taskInFile === taskQuery) {
      buildPath(configData[i].task, path, parent, symbol);
      return;
    }
  }
  processNewTask(task, path);
}

var processNewTask = function(task, path) {
  rl.question('Enter name of parent task: ', function(parent) {
    rl.prompt();
    parent = parent.trim();
    symbol = 'A';

    switch(parent) {
      case '':
        configData.push({ "task": task });
        saveConfig(configData);
        // No parent, 'A' indicates new tasks in log
        //path = task + (path || '');
        buildPath(task, path, parent, symbol); // parent is 'null'
        break;
      default:
        configData.push({ "task": task, "parent": parent });
        saveConfig(configData);
        // Parent defined, send task and path
        path = '/' + task + (path || '');
        checkTask(parent, path, symbol);
        break;
    }
  });
}

var buildPath = function(task, path, parent, symbol) {
  path = '/' + task + (path || '');
  if (parent) {
    checkTask(parent, path, symbol);
  } else {
    saveLog(path, symbol);
  }
}

var saveLog = function(path, symbol) {
  var timestamp = Math.round(+new Date / 1000); // Unix timestamp in seconds
  // Remove first slash (for proper log format)
  var path = path.replace(/^\//, '');
  // Append entry to log (NB: color is not implemented)
  var entry = timestamp + '|' + username + '|' + symbol + '|' + path + '\n';

  fs.appendFile(__dirname + '/gource.log', entry, encoding='utf8', function (err) {
    if (err) throw err;
  });
}

var saveConfig = function(configData) {

  fs.writeFile(configFile, JSON.stringify(configData, null, 4), encoding='utf8', function(err){
    if (err) throw err;
  });
}

var init = function() {
  // See if config file exists
  if (fs.existsSync(configFile)) {
    // read contents of config file
    configData = JSON.parse(fs.readFileSync(configFile), encoding='utf8');
    console.log('Loaded config.\n');
  } else {
    // or initialize new config file
    saveConfig(configData);
    console.log('Initialized a new config:\n', configFile, '\n');
  }
}();

rl.setPrompt('Task > ');

console.log('Hello, ' + username + '.');
console.log('Enter task name: ');
rl.prompt();

rl.on('line', function (task) {
  task = task.trim();
  switch(task) {
    case '':
      break;
    default:
      checkTask(task);
      break;
  }
  rl.prompt();
}).on('close', function() {
  console.log('\nHave a great day!');
  process.exit(0);
});