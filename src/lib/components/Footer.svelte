<footer>
  <p>© {new Date().getFullYear()} Yohan Finelle</p>
  <ul>
    <li><a href="https://github.com/yohanfinelle" rel="me">GitHub</a></li>
    <li><a href="mailto:yohan.finelle@gmail.com">Email</a></li>
  </ul>
</footer>

<style>
  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-6);
    margin-top: var(--space-16);
    border-top: 1px solid var(--color-border-subtle);
    color: var(--color-text-muted);
    font-size: var(--font-size-small);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: var(--space-4);
  }
  a:hover {
    color: var(--color-accent);
  }
</style>
