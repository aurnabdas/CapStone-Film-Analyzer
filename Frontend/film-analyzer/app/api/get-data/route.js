import clientPromise from './mongodb'; // Adjust the path based on where mongodb.js is located

export async function GET(req) {
  try {
    // Wait for the MongoDB client connection
    const client = await clientPromise;
    
    // Select the correct database (replace 'Movie-Database' with your actual database name)
    const db = client.db('Movie-Database');

    // Replace 'yourCollection' with the name of your collection
    const data = await db.collection('Accounts').find({}).toArray();

    // Return the fetched data as a JSON response
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching data:', error);
    
    // Return an error response
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}
