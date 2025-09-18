const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const sqsClient = new SQSClient({ region: process.env.REGION });

module.exports.sendToSqsUpdateReport = async (amount, decision) => {
  try {
    if (decision === 'APROBADO') {
      const params = {
        QueueUrl: process.env.QUEUE_UPDATE_REPORT_URL,
        MessageBody: JSON.stringify({
          id: 'anyId',
          countToAdd: 1,
          totalAmountToAdd: amount,
        }),
      };

      console.log('Sending message to SQS:', params.QueueUrl);

      const command = new SendMessageCommand(params);
      const response = await sqsClient.send(command);

      console.log('✅ SQS response:', JSON.stringify(response, null, 2));

      if (response.MessageId) {
        console.log('📩 Message sent with ID:', response.MessageId);
      } else {
        console.warn('⚠️ No MessageId in response');
      }

      return response;
    }
  } catch (err) {
    console.error('❌ Error sending message to SQS:', err);
    throw err;
  }
};
