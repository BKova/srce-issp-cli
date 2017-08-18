#! /usr/bin/env node
const inquirer = require('inquirer');
const whilePromise = require('while-promise')(Promise);
const Client = require('srce-issp-client');
const { printSudent, printReceipts, printDetails } = require('./printer');

const client = new Client();

const toNumber = str => (!isNaN(str) ? Number(str) : null);

(function initCommand() {
  const questions = [
    { type: 'input', name: 'username', message: 'Please enter your username:' },
    { type: 'password', name: 'password', message: 'Please enter your password:', mask: '*' },
  ];
  const limitInput = {
    type: 'input',
    name: 'limit',
    message: 'Please enter maximum age of receipts (in days):',
    validate: input => !!toNumber(input) || 'Please input a number!',
  };

  inquirer.prompt(questions)
    .then(({ username, password }) => client.login(username, password))
    .then(client => console.log(printSudent(client.user)))
    .then(() => inquirer.prompt(limitInput))
    .then(({ limit }) => Number(limit))
    .then(limit => client.getReceipts(limit))
    .then((receipts) => {
      console.log(printReceipts(receipts));
      return receipts;
    })
    .then(receipts => showDetails(receipts));
}());

function showDetails(receipts) {
  const question = {
    type: 'input',
    name: 'index',
    message: 'Enter No. of receipt (or type "exit" to quit):',
    validate(input) {
      if (input === 'exit') process.exit();
      const number = toNumber(input);
      return (typeof number !== 'number')
        ? 'Please input a number!'
        : true;
    },
  };

  return whilePromise(
    () => true,
    () => inquirer.prompt(question)
      .then(({ index }) => toNumber(index))
      .then(index => client.getReceiptDetails(receipts[index]))
      .then(receipt => console.log(printDetails(receipt))),
  );
}
