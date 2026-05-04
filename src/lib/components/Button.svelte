<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'primary' | 'secondary' | 'ghost';
  let {
    href = undefined,
    type = 'button',
    variant = 'primary',
    disabled = false,
    children,
    ...rest
  }: {
    href?: string | undefined;
    type?: 'button' | 'submit';
    variant?: Variant;
    disabled?: boolean;
    children: Snippet;
  } = $props();
</script>

{#if href}
  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
  <a class="btn btn--{variant}" {href} {...rest}>{@render children()}</a>
{:else}
  <button class="btn btn--{variant}" {type} {disabled} {...rest}>{@render children()}</button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    border-radius: var(--radius-md);
    font-size: var(--font-size-body);
    font-weight: 500;
    transition:
      background 120ms ease,
      border-color 120ms ease;
    border: 1px solid transparent;
  }
  .btn--primary {
    background: var(--color-accent);
    color: #0a0e0a;
  }
  .btn--primary:hover {
    background: var(--color-accent-strong);
  }
  .btn--secondary {
    background: transparent;
    border-color: var(--color-border);
    color: var(--color-text);
  }
  .btn--secondary:hover {
    border-color: var(--color-accent);
  }
  .btn--ghost {
    background: transparent;
    color: var(--color-text-secondary);
  }
  .btn--ghost:hover {
    color: var(--color-text);
  }
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
