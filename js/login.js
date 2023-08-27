const loading = document.querySelector(".loader");

const loadingDuration = 3000; // 2s

setTimeout(() => {
  loading.classList.add('loading-none');
}, loadingDuration);