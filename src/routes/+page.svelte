<script lang="ts">
  import Button from '$components/Button.svelte';
  import ProjectCard from '$components/ProjectCard.svelte';
  import StatusBadge from '$components/StatusBadge.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>Yohan Finelle — Étudiant ingénieur fullstack</title>
  <meta
    name="description"
    content="Portfolio de Yohan Finelle, étudiant en BUT Informatique. Spring Boot, Angular, Clean Architecture. En recherche d'alternance pour la rentrée 2026."
  />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Yohan Finelle — Étudiant ingénieur fullstack" />
  <meta
    property="og:description"
    content="Portfolio d'un étudiant fullstack en recherche d'alternance pour cycle ingénieur 2026-2029."
  />
  <meta property="og:locale" content="fr_FR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Yohan Finelle — Étudiant ingénieur fullstack" />
  <meta
    name="twitter:description"
    content="Portfolio d'un étudiant fullstack en recherche d'alternance pour cycle ingénieur 2026-2029."
  />
</svelte:head>

<section class="hero">
  <StatusBadge label="Disponible · sept. 2026" />
  <h1>Étudiant ingénieur logiciel fullstack.</h1>
  <p class="subtitle">
    BUT Informatique. Spring Boot, Angular, Clean Architecture. En recherche d'alternance pour
    intégrer un cycle ingénieur 2026–2029.
  </p>
  <div class="ctas">
    <Button href="/projets">Voir mes projets →</Button>
    <Button href="/cv.pdf" variant="secondary">Télécharger le CV</Button>
  </div>
</section>

<section>
  <h2>Projets phares</h2>
  <div class="grid">
    {#each data.featuredProjects as project (project.slug)}
      <ProjectCard {project} />
    {/each}
  </div>
</section>

<style>
  .hero {
    padding: var(--space-12) 0 var(--space-16);
    display: grid;
    gap: var(--space-4);
  }
  .hero h1 {
    font-size: var(--font-size-hero);
    letter-spacing: -0.02em;
  }
  .ctas {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }
  .grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    margin-top: var(--space-4);
  }
</style>
