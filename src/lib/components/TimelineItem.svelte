<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    title,
    subtitle,
    dateLabel,
    children,
  }: {
    title: string;
    subtitle: string;
    dateLabel: string;
    children: Snippet;
  } = $props();
</script>

<li class="item">
  <div class="dot" aria-hidden="true"></div>
  <header>
    <span class="caption">{dateLabel}</span>
    <h3>{title}</h3>
    <span class="subtitle">{subtitle}</span>
  </header>
  <div class="body">{@render children()}</div>
</li>

<style>
  .item {
    position: relative;
    padding-left: 2rem;
    padding-bottom: var(--space-8);
  }
  .dot {
    position: absolute;
    left: 0.25rem;
    top: 0.4rem;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--color-accent);
  }
  h3 {
    font-size: var(--font-size-h2);
    margin: var(--space-1) 0;
  }
  .subtitle {
    color: var(--color-text-secondary);
  }
  .body {
    margin-top: var(--space-3);
    color: var(--color-text-secondary);
  }
</style>
