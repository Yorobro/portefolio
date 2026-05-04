<script lang="ts">
  import Button from '$components/Button.svelte';
  import ProjectCard from '$components/ProjectCard.svelte';
  import StatusBadge from '$components/StatusBadge.svelte';
  import ContactInfo from '$components/ContactInfo.svelte';
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
  <p class="display" aria-hidden="true">Yohan Finelle.</p>
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

<section class="contact">
  <h2>Me contacter</h2>
  <p class="subtitle">
    Pour une alternance, une question, ou simplement échanger — voici comment me joindre.
  </p>
  <ContactInfo />
</section>

<style>
  .hero {
    padding: var(--space-12) 0 var(--space-16);
    display: grid;
    gap: var(--space-4);
  }
  .display {
    font-size: clamp(2.75rem, 6vw, 4.5rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--color-text);
    margin: var(--space-2) 0 0;
  }
  .hero h1 {
    font-size: var(--font-size-hero);
    letter-spacing: -0.02em;
    color: var(--color-text-secondary);
    font-weight: 500;
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
  .contact {
    margin-top: var(--space-16);
  }
  .contact h2 {
    margin-bottom: var(--space-2);
  }
</style>
