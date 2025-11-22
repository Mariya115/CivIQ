const axios = require('axios');
require('dotenv').config();

// It's highly recommended to store your API key in an environment variable
const API_KEY = process.env.FAST2SMS_API_KEY;

/**
 * Sends an OTP to a given phone number using Fast2SMS.
 * @param {string} phoneNumber - The recipient's phone number.
 * @param {string} otp - The One-Time Password to send.
 * @returns {Promise<boolean>} - True if the OTP was sent successfully, false otherwise.
 */
const sendOtp = async (phoneNumber, otp) => {
  if (!API_KEY) {
    console.error('❌ Fast2SMS API key is not configured. Please set FAST2SMS_API_KEY in your .env file.');
    return false;
  }

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        variables_values: otp, // The OTP value
        route: 'otp',          // The route for sending OTPs
        numbers: phoneNumber   // The recipient's number
      },
      {
        headers: {
          'Authorization': API_KEY
        }
      }
    );

    console.log('✅ OTP sent successfully via Fast2SMS:', response.data);
    return response.data.return === true;
  } catch (error) {
    console.error('❌ Error sending OTP via Fast2SMS:', error.response ? error.response.data : error.message);
    return false;
  }
};

module.exports = { sendOtp };