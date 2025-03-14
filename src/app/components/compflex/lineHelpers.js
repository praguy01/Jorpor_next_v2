import axios from 'axios';
import line from '@line/bot-sdk';
import 'dotenv/config';

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.SECRETCODE
};

// ฟังก์ชันส่ง FlexMessage ไป Line
export async function sendFlexMessageToLine(flexMessage, userId) {
  const lineApiUrl = "https://api.line.me/v2/bot/message/push";

  const messagePayload = {
    to: userId,  // LINE User ID ที่จะส่งข้อความถึง
    messages: [flexMessage]
  };

  try {
    await axios.post(lineApiUrl, messagePayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.channelAccessToken}`
      }
    });
    console.log('Flex Message ส่งสำเร็จ!');
  } catch (error) {
    console.error('Error sending message to LINE:', error.message);
  }
}

async function startLoadingAnimation(chatId) {
  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/chat/loading/start',
      {
        chatId: chatId,
        loadingSeconds: 10,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.channelAccessToken}`,
        },
      }
    );
    console.log('Loading started:', response.data);
  } catch (error) {
    console.error('Error starting loading:', error.response?.data || error.message);
  }
}

// ฟังก์ชันสำหรับหยุด Loading Indicator
async function stopLoadingAnimation(chatId) {
  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/chat/loading/stop',
      {
        chatId: chatId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.channelAccessToken}`,
        },
      }
    );
    console.log('Loading stopped:', response.data);
  } catch (error) {
    console.error('Error stopping loading:', error.response?.data || error.message);
  }
}

