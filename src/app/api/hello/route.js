
export async function GET(request) {
    return new Response(JSON.stringify({ message: 'Hello, World!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
export async function POST(request) {
    const { message } = await request.json();
    return new Response(JSON.stringify({ message: 'Hello, World!', your_message: message }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
export async function PUT(request) {
    const { message } = await request.json();
    return new Response(JSON.stringify({ message: 'Hello, World!', your_message: message }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
