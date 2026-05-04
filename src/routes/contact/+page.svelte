<script lang="ts">
  import Button from '$components/Button.svelte';
  let { form } = $props();
  // Helper to safely read a string field from form.values
  function getValue(field: string): string {
    if (!form?.values) return '';
    const v = form.values[field];
    return typeof v === 'string' ? v : '';
  }
</script>

<svelte:head><title>Contact — Yohan Finelle</title></svelte:head>

<h1>Contact</h1>
<p class="subtitle">Pour une alternance, une question, ou simplement échanger.</p>

{#if form?.success}
  <p class="success">Merci, ton message est bien arrivé.</p>
{:else}
  <form method="POST" novalidate>
    <label>
      Nom
      <input name="name" required maxlength="120" value={getValue('name')} />
    </label>
    <label>
      Email
      <input type="email" name="email" required maxlength="320" value={getValue('email')} />
    </label>
    <label>
      Sujet
      <input name="subject" required maxlength="200" value={getValue('subject')} />
    </label>
    <label>
      Message
      <textarea name="message" required maxlength="5000" rows="6">{getValue('message')}</textarea>
    </label>
    <!-- Honeypot — hidden from real users -->
    <label class="hp" aria-hidden="true">
      Site web
      <input name="website" tabindex="-1" autocomplete="off" />
    </label>
    {#if form?.error}<p class="error">{form.error}</p>{/if}
    <Button type="submit">Envoyer</Button>
  </form>
{/if}

<style>
  form {
    display: grid;
    gap: var(--space-4);
    max-width: var(--container-narrow);
    margin-top: var(--space-8);
  }
  label {
    display: grid;
    gap: var(--space-1);
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);
  }
  input,
  textarea {
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-body);
  }
  input:focus,
  textarea:focus {
    border-color: var(--color-accent);
    outline: none;
  }
  .hp {
    position: absolute;
    left: -9999px;
  }
  .error {
    color: var(--color-danger);
  }
  .success {
    color: var(--color-accent);
    margin-top: var(--space-4);
  }
</style>
