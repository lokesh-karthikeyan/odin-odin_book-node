<script>
  import { conversationsApi } from '$lib/api/conversations';
  import { browser } from '$app/environment';
  import { tick } from 'svelte';

  let { data } = $props();

  let messages = $state(data.messages || []);
  let newMessage = $state('');
  let file = $state(null);
  let scrollContainer = $state(null);

  const { currentUserId, conversationId, token } = data;

  const scrollToBottom = async () => {
    await tick();
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  $effect(() => {
    if (!browser) return;
    scrollToBottom();

    const unsubscribe = conversationsApi.subscribe(token, (payload) => {
      if (payload.conversationId === conversationId) {
        messages.push(payload);
        scrollToBottom();
      }
    });

    return unsubscribe;
  });

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    if (newMessage) formData.append('content', newMessage);
    if (file) formData.append('image', file);

    try {
      const sentMsg = await conversationsApi.sendMessage(fetch, token, conversationId, formData);
      messages.push(sentMsg);
      newMessage = '';
      file = null;
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send:', err);
    }
  }
</script>

<div class="chat-scroller" bind:this={scrollContainer}>
  <div class="message-list">
    {#each messages as msg (msg.id)}
      <div class="message-wrapper {msg.senderId === currentUserId ? 'sent' : 'received'}">
        <div class="message-bubble">
          {#if msg.image}
            <img src={msg.image} alt="Uploaded attachment" class="chat-img" />
          {/if}
          {#if msg.content}
            <p>{msg.content}</p>
          {/if}
          <span class="timestamp">{msg.time || 'now'}</span>
        </div>
      </div>
    {:else}
      <div class="empty-state">No messages yet. Start the conversation!</div>
    {/each}
  </div>
</div>

<footer class="input-container">
  <form onsubmit={handleSendMessage} class="input-form">
    <div class='col'>
      <label class="file-btn" class:active={file}>
        <input type="file" onchange={(e) => file = e.target.files[0]} hidden />
        📎
      </label>

      <input
        type="text"
        bind:value={newMessage}
        placeholder="Write a message..."
      />
    </div>

    <button type="submit" disabled={!newMessage && !file}>
      Send
    </button>
  </form>
</footer>

<style>
  .chat-scroller {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    max-height: 85vh;
    background: color-mix(in srgb, var(--bg-primary), black 10%);
    border-radius: 0.5em 0.5em 0 0;

    @media (max-width: 768px) {
      max-height: 72vh;
    }
  }

  .message-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .message-wrapper {
    display: flex;
    width: 100%;
  }

  .sent { justify-content: flex-end; }
  .received { justify-content: flex-start; }

  .message-bubble {
    max-width: 65%;
    padding: 10px 14px;
    border-radius: 18px;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .sent .message-bubble {
    background-color: #007bff;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .received .message-bubble {
    background-color: #e9ecef;
    color: #212529;
    border-bottom-left-radius: 4px;
  }

  .chat-img {
    border-radius: 12px;
    display: block;
    margin-bottom: 6px;
    width: 150px;
  }

  .timestamp {
    font-size: 0.7rem;
    display: block;
    margin-top: 4px;
    opacity: 0.8;
  }

  .input-container {
    padding: 1rem;
    border-top: 1px solid #dee2e6;
    background: color-mix(in srgb, var(--bg-primary), black 10%);
    border-radius: 0 0 0.5em 0.5em;
  }

  .input-form {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 1000px;
    margin: 0 auto;

    @media (max-width: 768px) {
      flex-wrap: wrap;
    }
  }

  .input-form .col {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 1em;
  }

  input[type="text"] {
    flex: 1;
    padding: 12px 18px;
    border: 1px solid #ced4da;
    border-radius: 25px;
    background: #f1f3f5;
    outline: none;
  }

  .file-btn {
    font-size: 1.4rem;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .file-btn.active { color: #007bff; }

  button {
    background: color-mix(in srgb, var(--color-forest), white 20%);
    font-weight: 600;
    cursor: pointer;
    border-radius: 1em;

    @media (max-width: 768px) {
      width: 100%;
    }

    &:hover {
      background: var(--color-forest)
    }
  }

  button:disabled {
    background: #adb5bd;
    cursor: not-allowed;
  }

  .empty-state {
    text-align: center;
    color: #868e96;
    margin-top: 2rem;
  }
</style>
