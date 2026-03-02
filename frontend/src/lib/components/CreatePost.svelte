<script>
  import { postsApi } from '$lib/api/posts';
  let { onPostCreated, token } = $props();

  let content = $state("");
  let fileInput = $state();

  async function handlePost() {
    const formData = new FormData();
    formData.append('content', content);
    if (fileInput.files[0]) formData.append('file', fileInput.files[0]);

    const res = await postsApi.create(window.fetch, formData, token);
    if (res.success) {
      onPostCreated(res.data);
      content = "";
      fileInput.value = "";
    }
  }
</script>

<div class="create-post">
  <textarea bind:value={content} placeholder="Say something..."></textarea>
  <input type="file" bind:this={fileInput} />
  <button onclick={handlePost} class='submit'>Post</button>
</div>

<style>
  .create-post {
    display: grid;
    grid-template-rows: 3fr 1fr 1fr;
    gap: 1em;
    padding: 1em;
    background: color-mix(in srgb, var(--bg-primary), black 10%);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    border-radius: 0.5em;

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }
  }

  .submit {
    background: color-mix(in srgb, var(--color-forest), white 20%);
    justify-self: end;

    @media (max-width: 768px) {
      align-self: end;
    }

    &:hover {
      background: var(--color-forest);
    }
  }
</style>
