import { eq, and, inArray, ne, not, desc } from "drizzle-orm";
import { conversations, conversationParticipants, messages, users, follows, profiles } from "../../core/db/schema/index.js";

export default function ConversationsRepository(db) {
  return {
    async findUserConversations(userId) {
      const participantRows = await db.select({
          conversationId: conversationParticipants.conversationId
        })
        .from(conversationParticipants)
        .where(eq(conversationParticipants.userId, userId));

      const conversationIds = participantRows.map(p => p.conversationId);
      if (!conversationIds.length) return [];

      const conversationsData = await Promise.all(
        conversationIds.map(async (convId) => {
          const otherUserRow = await db.select({
              id: users.id,
              fullName: users.fullName,
              picture: profiles.picture
            })
            .from(conversationParticipants)
            .leftJoin(users, eq(users.id, conversationParticipants.userId))
            .leftJoin(profiles, eq(profiles.userId, users.id))
            .where(
              and(
                eq(conversationParticipants.conversationId, convId),
                not(eq(conversationParticipants.userId, userId))
              )
            )
            .limit(1);

          const lastMessage = await db.select({
              content: messages.content,
              senderId: messages.senderId,
              createdAt: messages.createdAt
            })
            .from(messages)
            .where(eq(messages.conversationId, convId))
            .orderBy(desc(messages.createdAt))
            .limit(1);

          return {
            id: convId,
            otherUser: otherUserRow[0] || null,
            preview: lastMessage[0]?.content || 'No messages yet',
            senderId: lastMessage[0]?.senderId || null,
            time: lastMessage[0]?.createdAt || null
          };
        })
      );

      return conversationsData;
    },

    async findParticipants(conversationId) {
      return db.select()
        .from(conversationParticipants)
        .where(eq(conversationParticipants.conversationId, conversationId));
    },

    async findMessages(conversationId) {
      return db.select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.createdAt);
    },

    async createConversation() {
      const [conversation] = await db.insert(conversations)
        .values({})
        .returning();

      return conversation;
    },

    async addParticipants(conversationId, userIds) {
      return db.insert(conversationParticipants).values(
        userIds.map(userId => ({
          conversationId,
          userId,
        }))
      );
    },

    async createMessage(data) {
      const [message] = await db.insert(messages)
        .values(data)
        .returning();

      return message;
    },

    async getSuggestedUsers(userId) {
      const followers = await db
        .select({
          id: users.id,
          fullName: users.fullName,
        })
        .from(follows)
        .innerJoin(users, eq(follows.followerId, users.id))
        .where(eq(follows.followeeId, userId));

      const following = await db
        .select({
          id: users.id,
          fullName: users.fullName,
        })
        .from(follows)
        .innerJoin(users, eq(follows.followeeId, users.id))
        .where(eq(follows.followerId, userId));

      const usersMap = {};

      followers.forEach(u => {
        if (u.id !== userId) usersMap[u.id] = u;
      });

      following.forEach(u => {
        if (u.id !== userId) usersMap[u.id] = u;
      });

      return Object.values(usersMap);
    },

    async findConversationById(conversationId) {
      return db
        .select({
          id: conversations.id,
          created_at: conversations.createdAt,
        })
        .from(conversations)
        .where(eq(conversations.id, conversationId))
        .limit(1)
        .then(rows => rows[0] || null);
    },
  }
}
