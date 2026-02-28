<script>
  let { children } = $props();
</script>

<main class='main-content'>
  {@render children()}
</main>

<style>
  .main-content {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    height: 100%;
  }

  .main-content :global(.form) {
    width: min(85%, 600px);
    display: grid;
    gap: 1em;
    background: color-mix(in srgb, var(--bg-primary), black 3%);
    padding: 2em;
    border-radius: 0.5em;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  }

  .main-content :global(.header) {
    border-bottom: solid 0.1em var(--text-primary);
    padding-bottom: 0.2em;
  }

  .main-content :global(.alert) {
    color: var(--color-sand);
    background: var(--color-crimson);
    padding: 1em;
    border-radius: 0.4em;
    margin-block: 1rem;
  }

  .main-content :global(.submit) {
    justify-self: end;
  }

  .main-content :global(.link) {
    font-weight: 600;
  }
</style>
