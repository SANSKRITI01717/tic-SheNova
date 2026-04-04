// Highlight active nav link
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.href === window.location.href) link.style.color = '#C2185B';
});

// Auto-set today's date on date inputs if empty
document.querySelectorAll('input[type="date"]').forEach(input => {
  if (!input.value) {
    const today = new Date().toISOString().split('T')[0];
    input.max = today;
  }
});
const btn = document.getElementById('hamburger');
const nav = document.getElementById('nav-links');
btn.addEventListener('click', () => {
  btn.classList.toggle('open');
  nav.classList.toggle('open');
});