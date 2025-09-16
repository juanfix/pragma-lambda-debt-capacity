const { calculateMaximumCapacity, calculateCuota } = require('./formulas');

exports.calculateDebtCapacity = ({ totalIncome, activeLoans, newLoan }) => {
  // 1. Capacidad máxima
  const maximumCapacity = calculateMaximumCapacity(totalIncome);

  // 2. Deuda mensual actual
  const currentMonthlyDebt = activeLoans
    .map((loan) =>
      calculateCuota(loan.amount, loan.loanType.interestRate, loan.term)
    )
    .reduce((a, b) => a + b, 0);

  // 3. Capacidad disponible
  const availableCapacity = maximumCapacity - currentMonthlyDebt;

  // 4. Cuota del nuevo préstamo
  const cuotaNewLoan = calculateCuota(
    newLoan.amount,
    newLoan.interestRate,
    newLoan.term
  );

  // 5. Calcular la decisión
  let decision = 'RECHAZADO';
  if (cuotaNewLoan <= availableCapacity) {
    decision = 'APROBADO';
    if (newLoan.amount > totalIncome * 5) {
      decision = 'REVISIÓN MANUAL';
    }
  }

  // 6. Plan de pagos (detalle de cuotas)
  const paymentPlan = [];
  let balance = newLoan.amount;
  const decimalRate = newLoan.interestRate / 100;
  for (let month = 1; month <= newLoan.term; month++) {
    const interestPayment = balance * decimalRate;
    const capitalPayment = cuotaNewLoan - interestPayment;
    balance -= capitalPayment;
    paymentPlan.push({
      month,
      cuota: cuotaNewLoan.toFixed(2),
      interestPayment: interestPayment.toFixed(2),
      capitalPayment: capitalPayment.toFixed(2),
      remainingBalance: balance.toFixed(2),
    });
  }

  return {
    maximumCapacity,
    currentMonthlyDebt,
    availableCapacity,
    cuotaNewLoan,
    decision,
    paymentPlan,
  };
};
