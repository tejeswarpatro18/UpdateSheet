// Fetch names with due amounts greater than 0 when dropdown is clicked
document.getElementById("customerDropdown").addEventListener("click", fetchNamesWithDue);

function fetchNamesWithDue() {
    fetch("https://script.google.com/macros/s/AKfycbzPs0KbbUzpaGY7FyJykflFaDFK7J5KvOgdaPPj6EKipHFA2qXwfxuUPKVPoWcUnxU/exec")
    .then(response => response.json())
    .then(data => {
        let dropdown = document.getElementById("customerDropdown");
        dropdown.innerHTML = '<option value="">Select Name</option>'; // Reset dropdown

        // Populate dropdown with customer names with due amount > 0
        data.names.forEach(customer => {
            let option = document.createElement("option");
            option.value = customer.name;
            option.textContent = `${customer.name} (Due: ₹${customer.dueAmount})`;
            dropdown.appendChild(option);
        });
    })
    .catch(error => console.error("Error fetching due names:", error));
}

// Update due amount when a name is selected
document.getElementById("customerDropdown").addEventListener("change", updateDueAmount);

function updateDueAmount() {
    let selectedName = document.getElementById("customerDropdown").value;
    if (selectedName) {
        fetch(`https://script.google.com/macros/s/AKfycbzPs0KbbUzpaGY7FyJykflFaDFK7J5KvOgdaPPj6EKipHFA2qXwfxuUPKVPoWcUnxU/exec?name=${selectedName}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("dueAmount").value = data.dueAmount || "0";
        })
        .catch(error => console.error("Error fetching due amount:", error));
    }
}

// Handle form submission to update due amount after payment
document.getElementById("paymentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let selectedName = document.getElementById("customerDropdown").value;
    let amountPaid = parseFloat(document.getElementById("amountPaid").value);
    let dueAmount = parseFloat(document.getElementById("dueAmount").value);

    if (!selectedName || !amountPaid || isNaN(dueAmount)) {
        alert("Please select a customer and enter the amount paid.");
        return;
    }

    // Calculate new due amount after payment
    let newDueAmount = dueAmount - amountPaid;

    // Send the updated data to the Google Apps Script
    let data = {
        name: selectedName,
        amountPaid: amountPaid,
        newDueAmount: newDueAmount
    };

    fetch("https://script.google.com/macros/s/AKfycbzPs0KbbUzpaGY7FyJykflFaDFK7J5KvOgdaPPj6EKipHFA2qXwfxuUPKVPoWcUnxU/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === "success") {
            alert("Payment updated successfully.");
            document.getElementById("amountPaid").value = "";
            updateDueAmount();  // Re-fetch the updated due amount
        } else {
            alert("Error updating payment. Please try again.");
        }
    })
    .catch(error => console.error("Error updating payment:", error));
});
