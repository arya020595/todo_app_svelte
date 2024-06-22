import Todo from '$lib/models/Todo';
import connectToDatabase from '$lib/mongoose';
import type { RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request }) => {
	await connectToDatabase();
	const data = await request.json();

	const todo = await Todo.findById(params.id);
	if (!todo) {
		return new Response(JSON.stringify({ error: 'Todo not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	todo.title = data.title ?? todo.title;
	todo.completed = data.completed ?? todo.completed;
	await todo.save();

	return new Response(JSON.stringify(todo), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({ params }) => {
	await connectToDatabase();

	try {
		const deletedTodo = await Todo.findByIdAndDelete(params.id);

		if (!deletedTodo) {
			return new Response(JSON.stringify({ error: 'Todo not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ message: 'Todo deleted successfully' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
