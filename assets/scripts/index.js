const billInput = document.querySelector("#bill");
const peopleInput = document.querySelector("#number__of__people");
const buttons = document.querySelectorAll("button.tip__option");
const customInput = document.querySelector("#custom__option");
const percentages = [0.05, 0.1, 0.15, 0.25, 0.5];
const billInputValidation = /^[^.0-9]+(?:\.[^.0-9]+)*$/;
const peopleInputValidation = /[^0-9]/;
const billIndicator = document.querySelector("#bill__indicator");
const customIndicator = document.querySelector("#custom__indicator");
const peopleIndicator = document.querySelector("#people__indicator");
const resetButton = document.querySelector("#reset__button");
const tipResult = document.querySelector("#tip__amount");
const totalResult = document.querySelector("#total__amount");

let bill = 0;
let people = 0;
let selectedButton;
let currentPercentage = 0;

const calculateTip = (totalBill, totalPeople, tipPercent) => {
  const tipAmountPerPerson = (totalBill * tipPercent) / totalPeople;
  const totalPerPerson = (totalBill + totalBill * tipPercent) / totalPeople;
  const roundedTipAmountPerPerson = Math.round(tipAmountPerPerson * 100) / 100;
  const roundedTotalPerPerson = Math.round(totalPerPerson * 100) / 100;

  return [roundedTipAmountPerPerson, roundedTotalPerPerson];
};

const showResults = () => {
  if (bill > 0 && people > 0 && currentPercentage > 0) {
    const [tipAmount, totalAmount] = calculateTip(
      bill,
      people,
      currentPercentage
    );
    tipResult.textContent = `$${tipAmount}`;
    totalResult.textContent = `$${totalAmount}`;
  }
};

const validateInput = (
  inputElement,
  indicatorElement,
  inputType,
  validationRegex,
  errorMessage
) => {
  const inputValue = parseFloat(inputElement.value);

  if (
    validationRegex.test(inputElement.value) ||
    inputValue <= 0 ||
    isNaN(inputValue)
  ) {
    inputElement.classList.add("invalid__input");
    indicatorElement.textContent = errorMessage;
    indicatorElement.classList.remove("hidden");
  } else {
    inputElement.value = inputValue;
    inputElement.classList.remove("invalid__input");
    indicatorElement.classList.add("hidden");
    switch (inputType) {
      case "bill":
        bill = inputValue;
        break;
      case "people":
        people = inputValue;
        break;
      case "percentage":
        currentPercentage = inputValue / 100;
        selectedButton?.classList.remove("selected");
        break;
    }
  }

  showResults();
};

const handleInput = (
  inputElement,
  indicatorElement,
  inputType,
  validationRegex,
  errorMessage
) => {
  inputElement.addEventListener("input", () => {
    validateInput(
      inputElement,
      indicatorElement,
      inputType,
      validationRegex,
      errorMessage
    );
  });
};

handleInput(
  billInput,
  billIndicator,
  "bill",
  billInputValidation,
  "Must be a valid number!"
);
handleInput(
  customInput,
  customIndicator,
  "percentage",
  billInputValidation,
  "Must be a number!"
);
handleInput(
  peopleInput,
  peopleIndicator,
  "people",
  peopleInputValidation,
  "Must be a valid number!"
);

const selectPercentage = (button) => {
  if (selectedButton !== buttons[button]) {
    selectedButton?.classList.remove("selected");
  }

  selectedButton = buttons[button];
  selectedButton.classList.add("selected");
  currentPercentage = percentages[button];

  customInput.value = "";
  customInput.classList.remove("invalid__input");
  customIndicator.classList.add("hidden");

  showResults();
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("tip__option")) {
    const buttonIndex = Array.from(buttons).indexOf(event.target);
    selectPercentage(buttonIndex);
  } else if (event.target === resetButton) {
    handleReset();
  }
});

const handleReset = () => {
  bill = 0;
  people = 0;
  if (selectedButton) {
    selectedButton.classList.remove("selected");
    selectedButton = null;
  }
  currentPercentage = 0;
  billInput.value = "";
  customInput.value = "";
  peopleInput.value = "";
  resetButton.blur();
  tipResult.textContent = "$0.00";
  totalResult.textContent = "$0.00";
  showResults();
};

resetButton.addEventListener("click", handleReset);
