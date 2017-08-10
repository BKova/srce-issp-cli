const inquirer = require('inquirer');
const Client = require('srce-issp-client');
const { table } = require('table');

const client = new Client();

const map = (col, fn) => [].map.call(col, fn);
const checkLenght = text => ((text.length < 50) ? text : 'Value is too long');
const createQuestion = (type, name, message) => ({ type, name, message });
const getKeys = Object.keys;

(function initCommand() {
  inquirer.prompt(
    [createQuestion('input', 'username', 'Please enter your username:'),
      createQuestion('password', 'password', 'Please enter you password:')])
    .then(({ username, password }) => client.login(username, password))
    .then(client => outputSudentInfo(client.user))
    .then(() => inquirer.prompt(createQuestion('input', 'daysLimit', 'What is maximum age of recipes (in days):')))
    .then(Number)
    .then(dayLimit => client.getRecipes(dayLimit))
    .then(recipes => outputRecipes(recipes));
}());

function outputSudentInfo(userData) {
  const userTable = map(getKeys(userData), key => [key, checkLenght(userData[key])]);
  console.log(table(userTable));
}

function outputRecipes(recipes) {
  eval(require('locus'));
}
