<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<span class="status">
  <span class="dot" aria-hidden="true"></span>
  {label}
</span>

<style>
  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);
  }
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--color-accent);
    box-shadow: 0 0 0 4px var(--color-accent-soft);
  }
</style>
