import Todo from '$lib/models/Todo';
import connectToDatabase from '$lib/mongoose';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	await connectToDatabase();
	const todos = await Todo.find();
	return new Response(JSON.stringify(todos), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const POST: RequestHandler = async ({ request }) => {
	await connectToDatabase();
	const data = await request.json();
	const todo = new Todo({
		title: data.title,
		completed: data.completed
	});
	await todo.save();
	return new Response(JSON.stringify(todo), {
		headers: { 'Content-Type': 'application/json' }
	});
};
