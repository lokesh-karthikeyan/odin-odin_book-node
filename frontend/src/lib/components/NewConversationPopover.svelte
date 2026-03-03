<script>
  import { conversationsApi } from '$lib/api/conversations';
  import { goto } from '$app/navigation';

  const props = $props();
  const token = props.token;

  let users = $state([]);
  let filteredUsers = $state([]);
  let selectedUser = $state(null);
  let message = $state('');
  let file = $state(null);

  let popoverEl;

  async function openPopover() {
    users = await conversationsApi.getSuggestedUsers(fetch, token);
    filteredUsers = users;
    popoverEl.showPopover();
  }

  function closePopover() {
    popoverEl.hidePopover();
    selectedUser = null;
    message = '';
    file = null;
  }

  function filterUsers(q) {
    const search = q.toLowerCase();
    filteredUsers = users.filter(u =>
      u.fullName.toLowerCase().includes(search)
    );
  }

  async function sendMessage() {
    if (!selectedUser || (!message && !file)) return;

    const convo = await conversationsApi.createOrGet(fetch, token, selectedUser.id);

    if (!convo?.id) {
      console.error('Failed to get conversation ID');
      return;
    }

    const formData = new FormData();
    if (message) formData.append('content', message);
    if (file) formData.append('image', file);
    if (convo.id) formData.append('conversationId', convo.id);

    await conversationsApi.sendMessage(fetch, token, convo.id, formData);

    closePopover();
    goto(`/conversations/${convo.id}`);
  }
</script>

<button class="fab" onclick={openPopover}>+</button>

<div popover bind:this={popoverEl}>
  <div class="popover-modal">
    {#if !selectedUser}
      <h3>New Message</h3>

      <input
        placeholder="Search user..."
        oninput={(e) => filterUsers(e.target.value)}
      />

      <div class="user-list">
        {#each filteredUsers as user}
          <button
            type="button"
            class="user"
            onclick={() => selectedUser = user}
          >
            {user.fullName}
          </button>
        {/each}
      </div>

    {:else}
      <div class="selected-user">
        To: {selectedUser.fullName}
      </div>

      <textarea
        placeholder="Type a message..."
        bind:value={message}
      ></textarea>

      <input
        type="file"
        onchange={(e) => file = e.target.files[0]}
      />

      <div class='form-action-btns'>
        <button type="button" onclick={sendMessage} class='submit-btn'>
          Send
        </button>

        <button type="button" onclick={closePopover}>
          Cancel
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .fab {
    position: absolute;
    bottom: 24px;
    right: anchor(right);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    font-size: 28px;
    cursor: pointer;
    background: var(--text-primary);
    color: var(--color-gold);
    position-anchor: --convo-anchor;
    padding: 0;

    @media (max-width: 768px) {
      bottom: 80px;
    }
  }

  .fab:hover {
    background: var(--color-gold);
    color: var(--text-primary);
  }

  [popover] {
    width: 60%;
    padding: 0;
    background: transparent;
    border: none;
    margin: auto;
  }

  .popover-modal {
    background: color-mix(in srgb, var(--color-leather), white 50%);
    padding: 2rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: solid 1px var(--color-leather);
  }

  [popover]::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }

  .user-list {
    max-height: 200px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 4px;
  }

  .user, .submit-btn {
    background: color-mix(in srgb, var(--color-forest), white 20%);

    &:hover {
      background: color(--forest-green);
    }
  }

  .selected-user {
    font-weight: bold;
    margin-bottom: 8px;
  }

  .form-action-btns {
    margin-left: auto;
  }
</style>
