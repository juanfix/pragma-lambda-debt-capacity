const { calculateDebtCapacity } = require('./helpers/functions');
const { sendToSqsEmailSender } = require('./sqs/sqsEmailSenderConfig');
const { sendToSqsDebtCapacity } = require('./sqs/sqsDebtCapacityConfig');
const { sendToSqsUpdateReport } = require('./sqs/sqsUpdateReportConfig');
const { errorResponse, successResponse } = require('./config/responseHandler');
const { logInfo, logError } = require('./config/logHandler');

exports.debtCapacity = async (event) => {
  try {
    logInfo('Request recibido', { body: event.body });

    const body =
      typeof event.body === 'string'
        ? JSON.parse(event.body)
        : event.body || {};

    const email = body.email;

    const jsonResult = calculateDebtCapacity({
      totalIncome: body.totalIncome,
      activeLoans: body.activeLoans || [],
      newLoan: body.newLoan,
    });
    jsonResult;
    logInfo('Resultado calculado', jsonResult);

    let cuotaList = '';
    jsonResult.paymentPlan.forEach((payment) => {
      cuotaList += `Cuota #${payment.month} pagarias $${payment.cuota} con un pago de intereses de ${payment.interestPayment}, abonarias al capital $${payment.capitalPayment} para tener un saldo pendiente de ${payment.remainingBalance}\n`;
    });

    await sendToSqsDebtCapacity(body.newLoan.id, jsonResult.decision);

    await sendToSqsEmailSender(
      email,
      'Validación automática',
      `El resultado de la validacion automatica es ${jsonResult.decision} con el plan de pago: \n${cuotaList}`
    );

    await sendToSqsUpdateReport(body.newLoan.amount, jsonResult.decision);

    return successResponse(jsonResult);
  } catch (error) {
    logError('debtCapacity error', error);
    return errorResponse(error);
  }
};
