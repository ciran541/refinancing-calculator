// Currency formatting (aligned with BUC Calculator)
function formatMoney(amount) {
    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Calculate monthly installment (EMI)
function calculateEMI(principal, rate, tenure) {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    if (monthlyRate === 0) return principal / months;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
}

// Calculate loan balance after one year
function calculateLoanBalanceAfterYear(principal, rate, tenure, monthlyPayment) {
    const monthlyRate = rate / 12 / 100;
    let balance = principal;
    
    for (let i = 0; i < 12; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
    }
    
    return balance;
}

// Calculate total interest paid in the first year
function calculateTotalInterestFirstYear(principal, rate, tenure, monthlyPayment) {
    const monthlyRate = rate / 12 / 100;
    let balance = principal;
    let totalInterest = 0;
    
    for (let i = 0; i < 12; i++) {
        const interestPayment = balance * monthlyRate;
        totalInterest += interestPayment;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
    }
    
    return totalInterest;
}

// Validation functions (aligned with BUC Calculator)
function validateCurrentLoanAmount(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid loan amount";
    }
    if (value < 100000) {
        return "Current loan amount must be at least S$100,000";
    }
    return null;
}

function validateCurrentTenure(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid tenure";
    }
    if (value < 1) {
        return "Tenure must be at least 1 year";
    }
    if (value > 35) {
        return "Tenure cannot exceed 35 years";
    }
    return null;
}

function validateCurrentInterestRate(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid interest rate";
    }
    if (value < 0.1) {
        return "Interest rate must be at least 0.1%";
    }
    if (value > 10) {
        return "Interest rate cannot exceed 10%";
    }
    return null;
}

function validateNewLoanAmount(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid loan amount";
    }
    if (value < 50000) {
        return "New loan amount must be at least S$50,000";
    }
    return null;
}

function validateNewTenure(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid tenure";
    }
    if (value < 5) {
        return "New tenure must be at least 5 years";
    }
    if (value > 35) {
        return "New tenure cannot exceed 35 years";
    }
    return null;
}

function validateNewInterestRate(value) {
    if (!value || isNaN(value)) {
        return "Please enter a valid interest rate";
    }
    if (value < 0.1) {
        return "New interest rate must be at least 0.1%";
    }
    if (value > 10) {
        return "Interest rate cannot exceed 10%";
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    // SORA rates and spread (aligned with BUC Calculator)
    const threeMonthSORA = 2.3991; // Placeholder: Update with actual 3M SORA rate
    const spread = 0.28;
    const spreadRange = "0.28%-0.35%";
    const defaultInterest = (threeMonthSORA + spread).toFixed(2);

    // Set default interest rates
    const currentInterestInput = document.getElementById('currentInterestRate');
    const newInterestInput = document.getElementById('newInterestRate');
    currentInterestInput.value = defaultInterest;
    newInterestInput.value = defaultInterest;

    // Set interest rate notes
    document.getElementById('currentInterestNote').textContent = `Current 3M SORA: ${threeMonthSORA.toFixed(2)}%, Spread range: ${spreadRange}`;
    document.getElementById('newInterestNote').textContent = `Current 3M SORA: ${threeMonthSORA.toFixed(2)}%, Spread range: ${spreadRange}`;

    // Input elements
    const inputs = {
        currentLoanAmount: document.getElementById('currentLoanAmount'),
        currentTenure: document.getElementById('currentTenure'),
        currentInterestRate: currentInterestInput,
        newLoanAmount: document.getElementById('newLoanAmount'),
        newTenure: document.getElementById('newTenure'),
        newInterestRate: newInterestInput
    };

    // Error elements
    const errors = {
        currentLoanAmount: document.getElementById('currentLoanAmountError'),
        currentTenure: document.getElementById('currentTenureError'),
        currentInterestRate: document.getElementById('currentInterestRateError'),
        newLoanAmount: document.getElementById('newLoanAmountError'),
        newTenure: document.getElementById('newTenureError'),
        newInterestRate: document.getElementById('newInterestRateError')
    };

    // Label elements for error state
    const labels = {
        currentLoanAmount: document.querySelector('label[for="currentLoanAmount"]'),
        currentTenure: document.querySelector('label[for="currentTenure"]'),
        currentInterestRate: document.querySelector('label[for="currentInterestRate"]'),
        newLoanAmount: document.querySelector('label[for="newLoanAmount"]'),
        newTenure: document.querySelector('label[for="newTenure"]'),
        newInterestRate: document.querySelector('label[for="newInterestRate"]')
    };

    // Validation event listeners
    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', function() {
            const value = parseFloat(this.value);
            let error = null;

            switch (key) {
                case 'currentLoanAmount':
                    error = validateCurrentLoanAmount(value);
                    break;
                case 'currentTenure':
                    error = validateCurrentTenure(value);
                    break;
                case 'currentInterestRate':
                    error = validateCurrentInterestRate(value);
                    break;
                case 'newLoanAmount':
                    error = validateNewLoanAmount(value);
                    break;
                case 'newTenure':
                    error = validateNewTenure(value);
                    break;
                case 'newInterestRate':
                    error = validateNewInterestRate(value);
                    break;
            }

            if (error) {
                errors[key].textContent = error;
                errors[key].style.display = 'block';
                labels[key].classList.add('error');
            } else {
                errors[key].style.display = 'none';
                labels[key].classList.remove('error');
            }
        });

        inputs[key].addEventListener('blur', function() {
            if (!this.value) {
                errors[key].textContent = "This field is required";
                errors[key].style.display = 'block';
                labels[key].classList.add('error');
            }
        });
    });
});

function calculate() {
    const currentLoan = parseFloat(document.getElementById('currentLoanAmount').value);
    const currentTenure = parseFloat(document.getElementById('currentTenure').value);
    const currentInterest = parseFloat(document.getElementById('currentInterestRate').value);
    const newLoan = parseFloat(document.getElementById('newLoanAmount').value);
    const newTenure = parseFloat(document.getElementById('newTenure').value);
    const newInterest = parseFloat(document.getElementById('newInterestRate').value);
    const errorBox = document.getElementById('error');
    const results = document.getElementById('results');

    // Validate all inputs
    const errors = [
        validateCurrentLoanAmount(currentLoan),
        validateCurrentTenure(currentTenure),
        validateCurrentInterestRate(currentInterest),
        validateNewLoanAmount(newLoan),
        validateNewTenure(newTenure),
        validateNewInterestRate(newInterest)
    ].filter(error => error);

    if (errors.length > 0) {
        errorBox.style.display = 'block';
        errorBox.innerText = errors.join(' | ');
        return;
    }

    errorBox.style.display = 'none';
    results.innerHTML = "";
    
    // Create header with icon
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'results-header';
    
    const resultsIcon = document.createElement('div');
    resultsIcon.className = 'results-icon';
    resultsIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-5h-4v7h2zm-2-7h4V5h-4z"/>
        </svg>
    `;
    
    const resultsTitle = document.createElement('h2');
    resultsTitle.className = 'results-title';
    resultsTitle.textContent = 'Refinancing Results';
    
    resultsHeader.appendChild(resultsIcon);
    resultsHeader.appendChild(resultsTitle);
    results.appendChild(resultsHeader);

    // Calculate values
    const currentMonthlyPayment = calculateEMI(currentLoan, currentInterest, currentTenure);
    const newMonthlyPayment = calculateEMI(newLoan, newInterest, newTenure);
    const currentLoanAfterYear = calculateLoanBalanceAfterYear(currentLoan, currentInterest, currentTenure, currentMonthlyPayment);
    const newLoanAfterYear = calculateLoanBalanceAfterYear(newLoan, newInterest, newTenure, newMonthlyPayment);
    const currentYearInterest = calculateTotalInterestFirstYear(currentLoan, currentInterest, currentTenure, currentMonthlyPayment);
    const newYearInterest = calculateTotalInterestFirstYear(newLoan, newInterest, newTenure, newMonthlyPayment);

    // Calculate differences
    const interestDifference = newYearInterest - currentYearInterest;
    const principalDifference = newLoanAfterYear - currentLoanAfterYear;
    const monthlyInstalmentDifference = newMonthlyPayment - currentMonthlyPayment;
    const annualInstalmentDifference = monthlyInstalmentDifference * 12;

    // Comparison Container
    const comparisonContainer = document.createElement('div');
    comparisonContainer.className = 'comparison-container';
    comparisonContainer.innerHTML = `
        <h3 class="comparison-title">1 Year Comparison Summary</h3>
        <div class="comparison-row">
            <span class="comparison-label">
                <svg class="comparison-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M11 2v20c-5.5 0-10-4.5-10-10s4.5-10 10-10zm2 0c5.5 0 10 4.5 10 10s-4.5 10-10 10V2z"/>
                </svg>
                Interest Savings
            </span>
            <span class="comparison-value ${interestDifference < 0 ? 'positive' : 'negative'}">${formatMoney(Math.abs(interestDifference))}</span>
        </div>
        <div class="comparison-row">
            <span class="comparison-label">
                <svg class="comparison-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H3V6h14v8zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm13 0v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"/>
                </svg>
                Principal Difference
            </span>
            <span class="comparison-value ${principalDifference < 0 ? 'positive' : 'negative'}">${formatMoney(Math.abs(principalDifference))}</span>
        </div>
        <div class="comparison-row">
            <span class="comparison-label">
                <svg class="comparison-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                Monthly Payment Difference
            </span>
            <span class="comparison-value ${monthlyInstalmentDifference < 0 ? 'positive' : 'negative'}">${formatMoney(Math.abs(monthlyInstalmentDifference))}</span>
        </div>
        <div class="comparison-row">
            <span class="comparison-label">
                <svg class="comparison-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                Annual Payment Difference
            </span>
            <span class="comparison-value ${annualInstalmentDifference < 0 ? 'positive' : 'negative'}">${formatMoney(Math.abs(annualInstalmentDifference))}</span>
        </div>
    `;
    results.appendChild(comparisonContainer);

    // Impact After 1 Year Heading
    const impactHeading = document.createElement('h3');
    impactHeading.className = 'breakdown-title';
    impactHeading.textContent = 'Impact After 1 Year';
    results.appendChild(impactHeading);

    // Side-by-Side Breakdown
    const sideBySide = document.createElement('div');
    sideBySide.className = 'side-by-side';

    // Current Mortgage Breakdown
const currentBreakdown = document.createElement('div');
currentBreakdown.className = 'column';
const currentContainer = document.createElement('div');
currentContainer.className = 'breakdown-container current';
currentContainer.innerHTML = `
    <div class="breakdown-icon">
        <img src="https://loan-eligibility.vercel.app/image/TLC_Square.png" alt="TLC Logo" style="width: 100%; height: 100%;">
    </div>
    <h4 class="breakdown-subheading current">Current Mortgage</h4>
    <div class="breakdown-row">
        <span class="breakdown-label">Outstanding Loan</span>
        <span class="breakdown-value current">${formatMoney(currentLoan)}</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">Remaining Tenure</span>
        <span class="breakdown-value current">${currentTenure} years</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">Interest Rate</span>
        <span class="breakdown-value current">${currentInterest.toFixed(2)}%</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">Monthly Instalment</span>
        <span class="breakdown-value current">${formatMoney(currentMonthlyPayment)}</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">Total Interest paid</span>
        <span class="breakdown-value current">${formatMoney(currentYearInterest)}</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">Outstanding Loan</span>
        <span class="breakdown-value current">${formatMoney(currentLoanAfterYear)}</span>
    </div>
    <div class="breakdown-summary current">
        Monthly Payment: ${formatMoney(currentMonthlyPayment)}
    </div>
`;
currentBreakdown.appendChild(currentContainer);
sideBySide.appendChild(currentBreakdown);

// Refinanced Mortgage Breakdown
const newBreakdown = document.createElement('div');
newBreakdown.className = 'column';
const newContainer = document.createElement('div');
newContainer.className = 'breakdown-container refinanced';
newContainer.innerHTML = `
    <div class="breakdown-icon">
        <img src="https://loan-eligibility.vercel.app/image/TLC_Square.png" alt="TLC Logo" style="width: 100%; height: 100%;">
    </div>
    <h4 class="breakdown-subheading refinanced">Refinanced Mortgage</h4>
    <div class="breakdown-row">
        <span class="breakdown-label">New Loan Amount</span>
        <span class="breakdown-value refinanced">${formatMoney(newLoan)}</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">New Tenure</span>
        <span class="breakdown-value refinanced">${newTenure} years</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">New Interest Rate</span>
        <span class="breakdown-value refinanced">${newInterest.toFixed(2)}%</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">Monthly Instalment</span>
        <span class="breakdown-value refinanced">${formatMoney(newMonthlyPayment)}</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">Total Interest paid</span>
        <span class="breakdown-label refinanced">${formatMoney(newYearInterest)}</span>
    </div>
    <div class="breakdown-row">
        <span class="breakdown-label">Outstanding Loan</span>
        <span class="breakdown-value refinanced">${formatMoney(newLoanAfterYear)}</span>
    </div>
    <div class="breakdown-summary refinanced">
        Monthly Payment: ${formatMoney(newMonthlyPayment)}
    </div>
`;
newBreakdown.appendChild(newContainer);
sideBySide.appendChild(newBreakdown);

results.appendChild(sideBySide);
// Add Disclaimer
const disclaimer = document.createElement('div');
disclaimer.className = 'disclaimer';
disclaimer.textContent = 'Disclaimer from TLC: Figures provided on this page are for illustration purposes and do not constitute as a formal approval from a bank.';
results.appendChild(disclaimer);
}

