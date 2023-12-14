import { json } from 'next/remote';

export async function POST(request) {
  if (request.method === 'POST') {
    try {
      // Use request.body instead of request.json
      const res = await request.body();
      console.log('Received data from ESP8266:', res);

      return json({ success: true, message: 'successfully' });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งอีเมล์:', error);
      return json({ success: false, error: 'fail' });
    }
  } else {
    return json({ success: false, error: 'Method not allowed' });
  }
}
