<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status} - Yohan Finelle</title>
</svelte:head>

<section class="error">
  <span class="caption">Erreur {page.status}</span>
  <h1>{page.error?.message ?? 'Une erreur est survenue.'}</h1>
  <p class="subtitle">
    {#if page.status === 404}
      Cette page n'existe pas.
      <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
      <a href="/">Retour à l'accueil</a>.
    {:else}
      Une erreur s'est produite côté serveur.
      <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
      <a href="/">Retour à l'accueil</a>.
    {/if}
  </p>
</section>

<style>
  .error {
    padding: var(--space-12) 0;
    display: grid;
    gap: var(--space-3);
  }
  h1 {
    font-size: var(--font-size-hero);
    color: var(--color-text);
  }
  a {
    color: var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
  }
</style>
