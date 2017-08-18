const fecha = require('fecha');
const chalk = require('chalk');
const { table } = require('table');

const toArray = (obj, keys = []) => keys.map(key => obj[key]);
const map = (coll, fn) => [].map.call(coll, it => fn(it));
const toCurrency = (ammount, currency = 'HRK') => `${ammount} ${currency}`;

module.exports = {
  printSudent,
  printDetails,
  printRecipes,
};

function printSudent(userData) {
  userData = formatStudent(userData);
  const columns = { 3: { alignment: 'right' } };
  const header = map(['Name', 'Surname', 'OIB', 'Balance'], chalk.bold.red);
  const row = toArray(userData, ['name', 'lastname', 'oib', 'balance']);
  return table([header, row], { columns });
}

function printRecipes(recipes) {
  recipes = recipes.map((recipe, i) => formatRecipe(recipe, i));
  const columns = {
    0: { alignment: 'right' },
    3: { alignment: 'right' },
    4: { alignment: 'right' },
  };
  const header = map(['No.', 'Restaurant name', 'Time', 'Subvention', 'Price'], chalk.red.bold);
  const rows = recipes.map(recipe => toArray(recipe, ['tableId', 'restaurant', 'time', 'subvention', 'price']));
  return table([header, ...rows], { columns });
}

function printDetails(recipe) {
  const items = formatItems(recipe);
  recipe = formatRecipe(recipe);

  let columns = {
    2: { alignment: 'right' },
    3: { alignment: 'right' },
  };
  let header = map(['Restaurant name', 'Time', 'Subvention', 'Price'], chalk.red.bold);
  const row = toArray(recipe, ['restaurant', 'time', 'subvention', 'price']);
  let output = table([header, row], { columns });

  columns = {
    1: { alignment: 'right' },
    2: { alignment: 'right' },
    3: { alignment: 'right' },
    4: { alignment: 'right' },
  };
  header = map(['Dish name', 'Quantity', 'Price', 'Subvention', 'Full price'], chalk.red.bold);
  const rows = items.map(dish => toArray(dish, ['name', 'quantity', 'price', 'subvention', 'totalPrice']));
  output += table([header, ...rows], { columns });

  return output;
}

function formatStudent(userData) {
  const balance = toCurrency(userData.balance);

  return {
    name: chalk.white.bold(userData.name),
    lastname: chalk.green.bold(userData.lastname),
    oib: chalk.magenta.bold(userData.oib),
    balance: chalk.blue.bold(balance),
  };
}

function formatRecipe(recipe, index = 0) {
  const time = fecha.format(recipe.time, 'DD/MM/YYYY');
  const subvention = toCurrency(recipe.subvention);
  const price = toCurrency(recipe.price);

  return {
    id: recipe.id,
    tableId: chalk.yellow.bold(index),
    time: chalk.magenta.bold(time),
    subvention: chalk.blue.bold(subvention),
    price: chalk.green.bold(price),
    restaurant: chalk.white.bold(recipe.restaurant),
  };
}

function formatItems(recipe) {
  return recipe.items.map((dish) => {
    const price = toCurrency(dish.price);
    const totalPrice = toCurrency(dish.totalPrice);
    const subvention = toCurrency(dish.subvention);

    return {
      name: chalk.white.bold(dish.name),
      quantity: chalk.cyan.bold(dish.quantity),
      price: chalk.blue.bold(price),
      totalPrice: chalk.magenta.bold(totalPrice),
      subvention: chalk.green.bold(subvention),
    };
  });
}
