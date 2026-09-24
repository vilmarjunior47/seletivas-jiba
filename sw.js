// Service worker simples do Bloco 1: apenas guarda em cache o "esqueleto"
// do app para permitir abrir o PWA mesmo com conexão instável.
// No Bloco 2, quando o Supabase entrar, os dados continuam vindo sempre
// da rede - este cache cobre só os arquivos estáticos (HTML/CSS/JS/ícones).

const CACHE = 'jiba-v1';
const ARQUIVOS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((resposta) => resposta || fetch(evento.request))
  );
});
