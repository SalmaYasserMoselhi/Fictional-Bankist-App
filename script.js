'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance-value');
const labelSumIn = document.querySelector('.summary-value--in');
const labelSumOut = document.querySelector('.summary-value--out');
const labelSumInterest = document.querySelector('.summary-value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login-btn');
const btnTransfer = document.querySelector('.transfer-btn');
const btnLoan = document.querySelector('.loan-btn');
const btnClose = document.querySelector('.close-btn');
const btnSort = document.querySelector('.sort-btn');

const inputLoginUsername = document.querySelector('.login-input--user');
const inputLoginPin = document.querySelector('.login-input--pin');
const inputTransferTo = document.querySelector('.form-input--to');
const inputTransferAmount = document.querySelector('.form-input--amount');
const inputLoanAmount = document.querySelector('.form-input--loan-amount');
const inputCloseUsername = document.querySelector('.form-input--user');
const inputClosePin = document.querySelector('.form-input--pin');

let currentAccount;

const displayMovements = function (account, sort = false) {
  // Clear the container from any elements
  containerMovements.innerHTML = ''; // innerHTML returns the whole html element not only the text as textContent

  // Sorting
  const movements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movements.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const htmlEL = `
        <div class="movements-row">
          <div class="movements-type movements-type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements-value">${movement}&euro;</div>
        </div>`;

    // To add Html element
    containerMovements.insertAdjacentHTML('afterbegin', htmlEL);
  });
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  account.balance = balance;
  // Displat balance
  labelBalance.textContent = `${balance}€`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (account) {
  // Display movements
  displayMovements(account);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
};

// Event handler

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting "reloading"
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    // Update UI
    updateUI(currentAccount);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  // Transfer
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  // Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
});

let sorted = false; // State variable
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
