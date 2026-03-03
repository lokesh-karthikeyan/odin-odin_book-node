import { redirect } from '@sveltejs/kit';
import { conversationsApi } from '$lib/api/conversations';
import { timeAgo } from '$lib/utils/timeAgo';
import { PUBLIC_API_URL } from '$env/static/public';

export async function load({ params, fetch, cookies, parent }) {
  const token = cookies.get('token');
  if (!token) throw redirect(302, '/login');

  const { user } = await parent();
  const conversationId = params.conversationId;

  try {
    const result = await conversationsApi.getById(fetch, token, conversationId);

    const formatted = result.messages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      content: msg.content || null,
      image: msg.imageUrl ? `${PUBLIC_API_URL}${msg.imageUrl}` : null,
      time: msg.createdAt ? timeAgo(msg.createdAt) : null
    }));

    return {
      conversationId,
      messages: formatted,
      currentUserId: user.id,
      token
    };
  } catch (err) {
    console.error('Failed to load conversation', err);
    return {
      conversationId,
      messages: [],
      currentUserId: user.id,
      token
    };
  }
}
