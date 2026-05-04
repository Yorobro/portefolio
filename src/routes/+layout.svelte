<script lang="ts">
  import '@fontsource-variable/inter/index.css';
  import '@fontsource/jetbrains-mono/index.css';
  import '$styles/reset.css';
  import '$styles/tokens.css';
  import '$styles/typography.css';
  import Header from '$components/Header.svelte';
  import Footer from '$components/Footer.svelte';
  let { children } = $props();
</script>

<a class="skip-link" href="#main">Aller au contenu</a>
<Header />
<main id="main">
  {@render children()}
</main>
<Footer />

<style>
  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    padding: var(--space-2) var(--space-4);
    background: var(--color-accent);
    color: #0a0e0a;
  }
  .skip-link:focus {
    left: var(--space-2);
    top: var(--space-2);
    z-index: 100;
  }
  main {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: var(--space-8) var(--space-6);
  }
</style>
