<script lang="ts">
  import Button from '$components/Button.svelte';
  import ProjectCard from '$components/ProjectCard.svelte';
  import StatusBadge from '$components/StatusBadge.svelte';
  import ContactInfo from '$components/ContactInfo.svelte';
  import SoftSkills from '$components/SoftSkills.svelte';
  let { data } = $props();
</script>

<svelte:head>
  <title>Yohan Finelle - Développeur, spécialité architecture logicielle</title>
  <meta
    name="description"
    content="Yohan Finelle, étudiant en BUT Informatique (Bac+3) à Dijon. Front, back, fullstack. Spécialisation architecture logicielle. Cherche une alternance pour 2026."
  />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="Yohan Finelle - Développeur, spécialité architecture logicielle"
  />
  <meta
    property="og:description"
    content="BUT Informatique (Bac+3). Front, back, fullstack. Spécialisation architecture logicielle. Cherche une alternance pour entrer en cycle ingénieur en 2026."
  />
  <meta property="og:locale" content="fr_FR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta
    name="twitter:title"
    content="Yohan Finelle - Développeur, spécialité architecture logicielle"
  />
  <meta
    name="twitter:description"
    content="BUT Informatique (Bac+3). Front, back, fullstack. Spécialisation architecture logicielle. Cherche une alternance pour entrer en cycle ingénieur en 2026."
  />
</svelte:head>

<section class="hero">
  <div class="hero-text">
    <StatusBadge label="Disponible - sept. 2026" />
    <p class="display" aria-hidden="true">Yohan Finelle.</p>
    <h1>Étudiant en développement logiciel - BUT Informatique, Bac+3.</h1>
    <p class="subtitle">
      Front, back, fullstack. Spécialisation architecture logicielle. Je cherche une alternance pour
      entrer en cycle ingénieur (Bac+5) à la rentrée 2026, avec l'idée de devenir architecte
      logiciel.
    </p>
    <div class="ctas">
      <Button href="/projets">Voir mes projets →</Button>
      <Button href="/cv.pdf" variant="secondary">Télécharger le CV</Button>
    </div>
  </div>
  <img class="hero-photo" src="/images/yohan.jpg" alt="Yohan Finelle" />
</section>

<section class="about" aria-labelledby="about-title">
  <h2 id="about-title">À propos</h2>
  <p>
    Je suis en BUT Informatique à Dijon, je développe des applications depuis le lycée - du front,
    du back, du fullstack. Ce qui me passionne vraiment, c'est l'architecture logicielle : comment
    un projet reste lisible, testable et maintenable quand il grossit.
  </p>
  <p>
    Je cherche une alternance qui me pousse sur ces sujets pour préparer mon cycle ingénieur en
    2026. À terme, je veux faire de l'architecture logicielle mon métier.
  </p>
</section>

<section>
  <h2>Projets phares</h2>
  <div class="grid">
    {#each data.featuredProjects as project (project.slug)}
      <ProjectCard {project} />
    {/each}
  </div>
</section>

{#if data.softSkills.length > 0}
  <section class="soft-skills">
    <h2>Comment je bosse</h2>
    <p class="subtitle">Au-delà des outils, ce qui me caractérise au quotidien.</p>
    <SoftSkills skills={data.softSkills} />
  </section>
{/if}

<section class="contact">
  <h2>Me contacter</h2>
  <p class="subtitle">Pour une alternance ou une question, voici comment me joindre.</p>
  <ContactInfo />
</section>

<style>
  .hero {
    padding: var(--space-12) 0 var(--space-16);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-8);
    align-items: start;
  }
  .hero-text {
    display: grid;
    gap: var(--space-4);
  }
  .hero-photo {
    width: 13rem;
    height: 17rem;
    border-radius: var(--radius-lg);
    object-fit: cover;
    border: 1px solid var(--color-border-subtle);
    background: var(--color-bg-elevated);
    justify-self: end;
  }
  @media (max-width: 40rem) {
    .hero {
      grid-template-columns: 1fr;
    }
    .hero-photo {
      order: -1;
      justify-self: start;
    }
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
  .about {
    display: grid;
    gap: var(--space-2);
    margin-bottom: var(--space-12);
  }
  .about h2 {
    margin: 0 0 var(--space-2);
  }
  .about p {
    color: var(--color-text-secondary);
  }
  .grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    margin-top: var(--space-4);
  }
  .soft-skills,
  .contact {
    margin-top: var(--space-16);
  }
  .soft-skills h2,
  .contact h2 {
    margin-bottom: var(--space-2);
  }
</style>
