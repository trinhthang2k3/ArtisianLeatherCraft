const mongoose = require('mongoose');
const schedule = require('node-schedule');

const verificationCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  expiryTimestamp: {
    type: Date,
    required: true,
    default: () => Date.now() + 30000, // 30 seconds in milliseconds
  },
});

verificationCodeSchema.index({ expiryTimestamp: 1 }, { expireAfterSeconds: 0 });

verificationCodeSchema.statics.deleteCode = async function(code) {
  try {
    await this.deleteOne({ code });
    console.log('Verification code deleted successfully');
  } catch (error) {
    console.log('Error occurred while deleting verification code:', error);
    throw error;
  }
};
// Schedule a job to delete expired documents every 5 minutes
schedule.scheduleJob('*/5 * * * *', async () => {
  try {
    const currentTimestamp = new Date();
    await VerificationCode.deleteMany({ expiryTimestamp: { $lt: currentTimestamp } });
    console.log('Expired verification codes deleted successfully');
  } catch (error) {
    console.log('Error occurred while deleting expired verification codes:', error);
  }
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

module.exports = VerificationCode;
