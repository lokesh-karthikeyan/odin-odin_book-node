<script>
  import { Input } from '$lib/components';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { registerSchema } from '$lib/schemas';

  let { data } = $props();

  const { form, errors, message, enhance, delayed } = superForm((() => data.form)(), {
    validators: zodClient(registerSchema),
    resetForm: false,
    constraints: false
  });
</script>

<form method="POST" use:enhance class='form'>
  <h2 class='header'>Register</h2>

  <Input
    label="Full Name"
    name="fullName"
    type="text"
    placeholder="John Doe"
    bind:value={$form.fullName}
    error={$errors.fullName}
  />

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

  <Input
    label="Confirm Password"
    name="confirmPassword"
    type="password"
    placeholder="********"
    bind:value={$form.confirmPassword}
    error={$errors.confirmPassword}
  />

  {#if $message}
    <div class="alert">{$message}</div>
  {/if}

  <button type="submit" disabled={$delayed} class='submit'>
    {$delayed ? 'Processing...' : 'Register'}
  </button>

  <p class="switch">
    Already have an account?
    <a href="/login" data-sveltekit-preload-data="tap" class='link' >Log in</a>
  </p>
</form>
