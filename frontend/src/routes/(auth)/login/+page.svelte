<script>
  import { Input } from '$lib/components';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { loginSchema } from '$lib/schemas';

  let { data } = $props();

  const { form, errors, message, enhance, delayed } = superForm((() => data.form)(), {
    validators: zodClient(loginSchema),
    resetForm: false,
    constraints: false
  });
</script>

<form method="POST" use:enhance class='form'>
  <h2 class='header'>Login</h2>

  <Input
    label="Email"
    name="email"
    type="email"
    placeholder="john-doe@example.com"
    bind:value={$form.email}
    error={$errors.email}
  />

  <Input
    label="Password"
    name="password"
    type="password"
    placeholder="********"
    bind:value={$form.password}
    error={$errors.password}
  />

  {#if $message}
    <div class="alert">{$message}</div>
  {/if}

  <button type="submit" disabled={$delayed} class='submit'>
    {$delayed ? 'Loggin in...' : 'Log in'}
  </button>

  <p class="switch">
    Don't have an account?
    <a data-sveltekit-preload-data="tap" class='link' href="/register">Create one</a>
  </p>
</form>
