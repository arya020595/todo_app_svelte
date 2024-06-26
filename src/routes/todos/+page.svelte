<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { z } from 'zod';

	interface Todo {
		_id: string;
		title: string;
		completed: boolean;
	}

	const todos = writable<Todo[]>([]);
	const error = writable<string | null>(null);

	const loadTodos = async () => {
		const res = await fetch('/api/todos');
		todos.set(await res.json());
	};

	onMount(loadTodos);

	const schema = z.object({
		title: z.string().min(1, { message: 'Title is required' }),
		completed: z.boolean()
	});

	let title = '';
	let completed = false;

	const addTodo = async () => {
		const result = schema.safeParse({ title, completed });
		if (!result.success) {
			error.set(result.error.errors[0].message);
			setTimeout(() => error.set(null), 2000); // Clear error message after 2 seconds
			return;
		}
		const res = await fetch('/api/todos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, completed })
		});
		if (res.ok) {
			title = '';
			completed = false;
			error.set(null);
			loadTodos();
		}
	};

	const updateTodo = async (id: string, newTitle: string) => {
		const result = schema.safeParse({ title: newTitle, completed });
		if (!result.success) {
			error.set(result.error.errors[0].message);
			setTimeout(() => error.set(null), 2000); // Clear error message after 2 seconds
			return;
		}
		const res = await fetch(`/api/todos/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title: newTitle })
		});
		if (res.ok) {
			loadTodos();
		}
	};

	const completeTodo = async (id: string, newCompleted: boolean) => {
		const res = await fetch(`/api/todos/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ completed: newCompleted })
		});
		if (res.ok) {
			loadTodos();
		}
	};

	const deleteTodo = async (id: string) => {
		const res = await fetch(`/api/todos/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (res.ok) {
			loadTodos();
		}
	};

	// Type guard to ensure the target is not null and is an HTMLInputElement
	function isInputElement(target: EventTarget | null): target is HTMLInputElement {
		return target !== null && (target as HTMLInputElement).value !== undefined;
	}
</script>

<main class="p-4">
	<h1 class="text-2xl mb-4 text-center">Welcome to Todos App!</h1>
	<div class="text-center">
		<input bind:value={title} type="text" placeholder="Please Insert Todo.." class="border p-2" />
		<button on:click={addTodo} class="bg-blue-500 text-white p-2 m-2 rounded hover:rounded-lg"
			>Add</button
		>
		{#if $error}
			<p class="text-red-500 mt-2">{$error}</p>
		{/if}
	</div>
	<ul class="mt-4 w-full sm:w-auto">
		{#each $todos as todo (todo._id)}
			<li class="border p-2 mb-2 flex items-center">
				<input
					type="text"
					value={todo.title}
					on:blur={(e) => {
						if (isInputElement(e.target)) {
							updateTodo(todo._id, e.target.value);
						}
					}}
					class="flex-grow border p-1 mr-2"
				/>
				<input
					type="checkbox"
					bind:checked={todo.completed}
					on:change={(e) => {
						if (isInputElement(e.target)) {
							completeTodo(todo._id, e.target.checked);
						}
					}}
					class="ml-2"
				/>
				<button on:click={() => deleteTodo(todo._id)} class="bg-red-500 text-white p-2 ml-2"
					>Delete</button
				>
			</li>
		{/each}
	</ul>
</main>
