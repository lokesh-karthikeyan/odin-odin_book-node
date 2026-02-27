<script>
  let {
    label = '',
    type = 'text',
    name = '',
    placeholder = '',
    value = $bindable(''),
    error = '',
    ...rest
  } = $props();
</script>

<div class="field">
  <label for={name}>{label}</label>

  <input
    id={name}
    {type}
    {name}
    {placeholder}
    bind:value={value}
    class:input-error={error}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? `${name}-error` : undefined}
    {...rest}
  />

  {#if error}
    <p id={`${name}-error`} class="error-message">
      {error}
    </p>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4em;
  }
</style>
