export default function ConversationsService(repo, fastify) {
  return {
    async getMyConversations(userId) {
      return repo.findUserConversations(userId);
    },

    async createOrGetDM(currentUserId, targetUserId) {
      const myConversations =
        await repo.findUserConversations(currentUserId);

      for (const convo of myConversations) {
        const participants = await repo.findParticipants(convo.id);
        const userIds = participants.map(p => p.userId);

        if (
          userIds.length === 2 &&
          userIds.includes(currentUserId) &&
          userIds.includes(targetUserId)
        ) {
          return convo;
        }
      }

      const conversation = await repo.createConversation();

      await repo.addParticipants(conversation.id, [
        currentUserId,
        targetUserId,
      ]);

      return conversation;
    },

    async getConversationWithMessages(conversationId) {
      const messages = await repo.findMessages(conversationId);
      return { messages };
    },

    async sendMessage({
      conversationId,
      senderId,
      content,
      imageUrl,
    }) {
      if (!content && !imageUrl) {
        throw new Error("Message must contain content or image");
      }

      if (!conversationId) throw new Error("Conversation ID is required.");

      const conversation = await repo.findConversationById(conversationId);
      if (!conversation) {
        throw new Error("Conversation does not exist");
      }

      const message = await repo.createMessage({
        conversationId,
        senderId,
        content,
        imageUrl,
      });

      const participants =
        await repo.findParticipants(conversationId);

      participants
        .filter(p => p.userId !== senderId)
        .forEach(p => {
          const sockets = fastify.wsClients.get(p.userId);
          if (!sockets) return;

          for (const socket of sockets) {
            socket.send(
              JSON.stringify({
                type: "NEW_MESSAGE",
                payload: message,
              })
            );
          }
        });

      return message;
    },

    async getSuggestedUsers(userId) {
      return repo.getSuggestedUsers(userId);
    },
  };
}
