<script>
  import MessageCard from '$lib/components/MessageCard.svelte';
  import NewConversationPopover from '$lib/components/NewConversationPopover.svelte';

  const props = $props();
  const conversations = props.data.conversations ?? [];
  const token = props.data.token;
  const currentUserId = props.data.currentUserId;
</script>

<div class="conversations-container">
  {#if conversations.length === 0}
    <h3 class="empty">No conversations yet.</h3>
  {:else}
    {#each conversations as conversation (conversation.id)}
      <MessageCard {conversation} {currentUserId} />
    {/each}
  {/if}
</div>

<NewConversationPopover {currentUserId} {token} />

<style>
  .conversations-container {
    height: 100%;
    anchor-name: --convo-anchor;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .conversations-container:has(.empty) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
