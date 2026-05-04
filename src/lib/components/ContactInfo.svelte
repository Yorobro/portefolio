<script lang="ts">
  // Static contact data — kept here (not in env) because it's intentionally
  // public and rarely changes. If it ever does, edit this file.
  const phone = '07 69 25 40 52';
  const phoneHref = 'tel:+33769254052';
  const email = 'yohan.finelle@gmail.com';
  const emailHref = 'mailto:yohan.finelle@gmail.com';
  const city = '21000 Dijon';
</script>

<address class="contact">
  <a class="item" href={phoneHref} aria-label="Numéro de téléphone">
    <span class="caption">Téléphone</span>
    <span class="value">{phone}</span>
  </a>

  <a class="item" href={emailHref} aria-label="Adresse email">
    <span class="caption">Email</span>
    <span class="value">{email}</span>
  </a>

  <span class="item">
    <span class="caption">Localisation</span>
    <span class="value">{city}</span>
  </span>
</address>

<style>
  .contact {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: var(--space-4);
    margin-top: var(--space-6);
    font-style: normal; /* override <address> default italic */
  }
  .item {
    display: grid;
    gap: var(--space-1);
    padding: var(--space-4);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--radius-lg);
    transition:
      border-color 120ms ease,
      transform 120ms ease;
  }
  a.item:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
  }
  .caption {
    font-size: var(--font-size-caption);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }
  .value {
    font-size: var(--font-size-body);
    color: var(--color-text);
  }
  a.item .value {
    color: var(--color-accent);
  }
</style>
