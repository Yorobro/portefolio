<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, variant = 'soft' }: { children: Snippet; variant?: 'soft' | 'outline' } =
    $props();
</script>

<span class="tag tag--{variant}">{@render children()}</span>

<style>
  .tag {
    display: inline-block;
    padding: 0.15rem 0.55rem;
    font-size: var(--font-size-small);
    border-radius: var(--radius-sm);
    line-height: 1.4;
  }
  .tag--soft {
    background: var(--color-accent-soft);
    color: var(--color-accent);
  }
  .tag--outline {
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
  }
</style>
