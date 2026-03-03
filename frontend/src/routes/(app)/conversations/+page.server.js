import { redirect } from '@sveltejs/kit';
import { conversationsApi } from '$lib/api/conversations';
import { timeAgo } from '$lib/utils/timeAgo';

export async function load({ fetch, cookies, parent }) {
  const token = cookies.get('token');
  if (!token) throw redirect(302, '/login');

  const { user } = await parent();

  try {
    const conversations = await conversationsApi.getAll(fetch, token);

    const formatted = conversations.map((convo) => {
      return {
        id: convo.id,
        otherUser: convo.otherUser,
        preview: convo.preview || 'No messages yet',
        senderId: convo.senderId || null,
        time: convo.time ? timeAgo(convo.time) : null,
      };
    });

    return {
      conversations: formatted,
      currentUserId: user.id,
      token
    };
  } catch (err) {
    return {
      conversations: [],
      currentUserId: user?.id ?? null,
      token
    };
  }
}
