// Import required modules
import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import Cors from 'micro-cors';
const cors = Cors({
  allowMethods: ['POST'],
  allowHeaders: ['Content-Type'],
  origin: '*',
});

// Define the API route handler
export async function POST(request) {
  // Check if the request method is POST
  if (request.method === 'POST') {
    try {
      // Parse the JSON data from the request
      const res = await request.json();

      // Log the received data
      console.log('Received data from NodeMCU:', res);

      // Return a JSON response indicating success
      return NextResponse.json({ success: true, message: 'Successfully received data' });
    } catch (error) {
      // Handle errors during processing
      console.error('Error processing the request:', error);

      // Return a JSON response indicating failure
      return NextResponse.json({ success: false, error: 'Failed to process the request' });
    }
  } else {
    // Return a JSON response for the case of an invalid request method
    return NextResponse.json('Method not allowed');
  }
}
export default cors(POST);
