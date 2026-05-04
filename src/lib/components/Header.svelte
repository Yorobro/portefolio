<script lang="ts">
  import StatusBadge from './StatusBadge.svelte';
  import { page } from '$app/state';
  const nav = [
    { href: '/', label: 'Accueil' },
    { href: '/projets', label: 'Projets' },
    { href: '/parcours', label: 'Parcours' },
    { href: '/competences', label: 'Compétences' },
  ];
</script>

<header>
  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
  <a class="brand" href="/">Yohan Finelle</a>
  <nav aria-label="Navigation principale">
    <ul>
      {#each nav as item (item.href)}
        <li>
          <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
          <a href={item.href} aria-current={page.url.pathname === item.href ? 'page' : null}>
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
  <StatusBadge label="Disponible · sept. 2026" />
</header>

<style>
  /* Three-column grid: brand on the left, nav centered, status on the right */
  header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--space-6);
    padding: var(--space-4) var(--space-6);
    border-bottom: 1px solid var(--color-border-subtle);
  }
  .brand {
    font-weight: 600;
    letter-spacing: -0.01em;
    justify-self: start;
  }
  nav {
    justify-self: center;
  }
  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: var(--space-6);
  }
  nav a {
    color: var(--color-text-secondary);
  }
  nav a:hover,
  nav a[aria-current='page'] {
    color: var(--color-accent);
  }
  header > :last-child {
    justify-self: end;
  }
</style>
