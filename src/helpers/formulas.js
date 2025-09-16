// Fórmula de capacidad maxima
exports.calculateMaximumCapacity = (ingresosTotales) => {
  return ingresosTotales * 0.35;
};

// Fórmula de cuota de amortización
// P = monto, i = tasa mensual mensual (ej. 0.1), n =  plazo en meses
exports.calculateCuota = (P, i, n) => {
  // Validaciones
  if (P <= 0 || i <= 0 || n <= 0) {
    throw new Error('All values must be greater than zero');
  }
  if (i > 100) {
    throw new Error('The rate must be less than 100');
  }

  if (i === 0) return P / n;

  const decimalRate = i / 100;
  const base = 1 + decimalRate;
  const potencia = Math.pow(base, n);
  return (P * (decimalRate * potencia)) / (potencia - 1);
};
