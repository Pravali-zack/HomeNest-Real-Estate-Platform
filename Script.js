// Function for Buy Property
function buyProperty() {
    alert("You selected Buy Property!");
}

// Function for Rent Property
function rentProperty() {
    alert("You selected Rent Property!");
}

// Function for Search Property
function searchProperty() {

    let location = document.getElementById("location").value;
    let propertyType = document.getElementById("propertyType").value;
    let budget = document.getElementById("budget").value;

    if (location == "" || propertyType == "Select Property" || budget == "Select Budget") {

        alert("Please fill all search details!");

    } else {

        alert("Searching Property in " + location +
              "\nProperty Type: " + propertyType +
              "\nBudget: " + budget);
    }
}

// Function for View Details
function viewDetails(propertyName) {
    alert("You selected: " + propertyName);
}

// Function for Post Property
function postProperty() {
    alert("Welcome! You can post your property here.");
}