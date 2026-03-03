<script>
  const { conversation, currentUserId } = $props();
  import { getAvatarUrl } from '$lib/utils';

  const isMine = conversation?.senderId === currentUserId;
  const otherUser = conversation?.otherUser;
</script>

<a href={`/conversations/${conversation.id}`} class="message-card">
  <div class='col-left'>
    {#if otherUser}
      <img
        src={getAvatarUrl({ picture: otherUser.picture, fullName: otherUser.fullName })}
        alt={otherUser.fullName}
        class="avatar"
      />
    {:else}
      <div class="avatar placeholder"></div>
    {/if}

    <div class="top">
      <strong>{otherUser?.fullName ?? 'Unknown User'}</strong>
      <span class="preview">
        {#if isMine}
          You: {conversation.preview}
        {:else}
          {otherUser?.fullName ?? ''}: {conversation.preview}
        {/if}
      </span>
    </div>
  </div>
  <div class="col-right">
    {#if conversation.time}
      <span class="time">{conversation.time}</span>
    {/if}
  </div>
</a>

<style>
  .message-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: color-mix(in srgb, var(--color-leather), white 50%);
    border-radius: 0.5em;
    text-decoration: none;
    color: var(--text-primary);
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: contain;
  }

  .avatar.placeholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--bg-primary);
  }

  .col-left {
    display: flex;
    gap: 1em;
  }

  .top {
    display: flex;
    flex-direction: column;
  }

  .preview {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-style: italic;
    min-width: 20ch;
  }

  .col-right {
    align-self: end;
  }

  .time {
    font-size: 12px;
  }
</style>
