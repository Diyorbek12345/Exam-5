const loading = document.querySelector(".loader");

const loadingDuration = 6000; // 2s

setTimeout(() => {
  loading.classList.add('loading-none');
}, loadingDuration);