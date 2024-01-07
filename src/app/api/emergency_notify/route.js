// File: D:/SeniorNextjs/jorpor-nextjs/src/app/api/emergency_notify/route.ts

export async function POST(request) {
  // Check if the request method is POST
  if (request.method === 'POST') {
    try {
      // Parse the JSON data from the request
      const res = await request.json();

      // Log the received data
      console.log('Received data from NodeMCU:', res);

      // Return a JSON response indicating success
      return new NextResponse.json({ success: true, message: 'Successfully received data' });
    } catch (error) {
      // Handle errors during processing
      console.error('Error processing the request:', error);

      // Return a JSON response indicating failure
      return new NextResponse.json({ success: false, error: 'Failed to process the request' });
    }
  } else {
    // Return a JSON response for the case of an invalid request method
    return new NextResponse.json('Method not allowed');
  }
}
