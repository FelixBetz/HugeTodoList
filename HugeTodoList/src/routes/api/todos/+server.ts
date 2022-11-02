import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import prisma from '$lib/prisma';
import type { TodoItem } from '@prisma/client';

export const GET: RequestHandler = async () => {
	const todos: TodoItem[] = await prisma.todoItem.findMany({
		//orderBy: { posted: 'desc' }
	});

	// we can shape the data however we want
	// so our user doesn't have to pay the cost for it
	/*
	const tweets = data.map((tweet) => {
		return {
			id: tweet.id,
			content: tweet.content,
			likes: tweet.likes,
			posted: timePosted(tweet.posted),
			url: tweet.url,
			avatar: tweet.user.avatar,
			handle: tweet.user.handle,
			name: tweet.user.name,
			liked: likedTweets.includes(tweet.id)
		}
	})*/

	return json({
		todos
	});
};
