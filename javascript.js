
// ========================================
// HTML INTEGRATION - LOAD MEMBER FILES
// ========================================


// Load Priyanshu's Navbar and Hero
fetch("member-code/priyanshu-navbar-hero.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-hero").innerHTML = data;
    })
    .catch(error => console.log("Navbar loading error:", error));


// Load Ritik's Search and Footer
fetch("member-code/ritik-search-footer.html")
    .then(response => response.text())
    .then(data => {

        let parts = data.split("<!-- FOOTER START -->");

        // Load Search Section
        document.getElementById("search-section").innerHTML = parts[0];

        // Load Footer Section
        if (parts[1]) {
            document.getElementById("footer-section").innerHTML = parts[1];
        }

    })
    .catch(error => console.log("Search and Footer loading error:", error));


// Load Pushpendra's Properties, About and Contact
fetch("member-code/pushpendra-properties-about-contact.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("properties-about-contact").innerHTML = data;
    })
    .catch(error => console.log("Properties section loading error:", error));


// ========================================
// ORIGINAL JAVASCRIPT FUNCTIONS
// ========================================


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
