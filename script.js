// Base URL for fetching the latest currencies rates API version 

const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

//Selecting the necessary DOM Elements 
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Adding currency options to the dropdown menus

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option"); // creating a new <option> element
    newOption.innerText = currCode;// Display the currency code
    newOption.value = currCode;// set value for the option

    // set default selections: USD for "from" and USD for"to"
    if (select.name == "from" && currCode == "USD") {
      newOption.selected = "selected";
    } else if (select.name == "to" && currCode == "NPR") {
      newOption.selected = "selected";
    }
    select.append(newOption); // add new option to dropdown
  }

//   Update flag when currency is changed
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Functon to fetch and update the exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Updated API URL format, Constructing the API request URL
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);// fetch exchange rate data
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    let data = await response.json(); // Convert API data into a JavaScript object

    //  Updated way to get the exchange rate
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let finalAmount = amtVal * rate;// Calculate the converted amount 

    // Diplay the converted amount 
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${
      toCurr.value
    }`;
  } catch (error) {
    console.error("Fetch error:", error);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  }
};

//  const updateExchangeRate= async()=>{
//     let amount = document.querySelector(".amount input");
//     let amtVal= amount.value;
//     console.log(amtVal);
//     if(amtVal ===""|| amtVal<1){
//         amtVal=1;
//         amount.value = "1";
//     }
//     // console.log(fromCurr.value, toCurr.value);

//     const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;// API works in lower case , not upper case
//     let response = await fetch(URL);
//     let data = await response.json();
//     let rate = data[toCurr.value.toLowerCase()];
//     // console.log(rate);

//     let finalAmount= amtVal*rate;
//     msg.innerText =`${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
//  };

//  Functio to update the flag image based on the selected currency 
const updateFlag = (element) => {
  // console.log(element);
  let currCode = element.value;
  // console.log(currCode);
  let countryCode = countryList[currCode]; // Get the country code
  let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;// Generate the flag image URL
  let img = element.parentElement.querySelector("img");
  img.src = newSrc; // Update the flag image
};

//  Add evnet listener for the button click to trigger the conversion
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); //Prevent form from refresting the page
  updateExchangeRate();// call the function to update exchange rate
});

// Automatically update the exchange rate when the page loads

window.addEventListener("load", () => {
  updateExchangeRate();
});
