(function () {
  var experiences = document.getElementById('experience-grid');
  if (experiences) {
    experiences.innerHTML = Array.from({ length: 6 }, function (_, index) {
      var n = index + 1;
      return '<article class="experience-card"><img loading="lazy" src="/assets/roblox/world-' + n + '.svg" alt="Custom block-world artwork for editable experience ' + n + '"><div class="experience-body"><span class="category">CATEGORY • EDITABLE</span><h3>EXPERIENCE #' + n + '</h3><p>Add a short experience description here.</p><p><b>Why I like it:</b> Spyros can add his own reason here.</p><div class="rating-row"><span>FUN<b>🔥🔥🔥🔥🔥</b></span><span>DIFFICULTY<b>⚡⚡⚡</b></span><span>SPYROS SCORE<b class="score">— / 10</b></span></div><button class="more" type="button">SEE MORE</button></div></article>';
    }).join('');
  }

  var gallery = document.getElementById('gallery-grid');
  var labels = ['Sky Platform', 'Avatar Quest', 'Neon Obby', 'Fantasy World', 'Speed Run', 'Block City', 'Sports Arena', 'Build Mode', 'Adventure Map', 'Secret Island'];
  if (gallery) gallery.innerHTML = labels.map(function (label, i) {
    return '<figure><img loading="lazy" src="/assets/roblox/world-' + (i + 1) + '.svg" alt="Custom ' + label.toLowerCase() + ' block-world illustration"><figcaption>' + label + '</figcaption></figure>';
  }).join('');

  var questions = [
    { q: 'Ποιο εργαλείο χρησιμοποιούν οι creators για να φτιάχνουν experiences;', a: ['Roblox Studio', 'Avatar Shop', 'Explorer App'], c: 0 },
    { q: 'Ποια γλώσσα προγραμματισμού χρησιμοποιείται στο Roblox Studio;', a: ['Python', 'Luau', 'Java'], c: 1 },
    { q: 'Τι σημαίνει συνήθως “obby”;', a: ['Obstacle course', 'Avatar outfit', 'Private server'], c: 0 },
    { q: 'Ποια είναι η πιο ασφαλής επιλογή αν κάτι σε κάνει να νιώθεις άβολα;', a: ['Το κρατάω μυστικό', 'Το αναφέρω και μιλάω σε ενήλικα', 'Δίνω στοιχεία μου'], c: 1 },
    { q: 'Τι μπορεί να αλλάξει το look ενός avatar;', a: ['Μόνο το όνομα', 'Ρούχα και αξεσουάρ', 'Το Wi-Fi'], c: 1 }
  ];
  var current = 0, score = 0, box = document.getElementById('quiz-box');
  function showQuestion() {
    var item = questions[current];
    box.innerHTML = '<span class="progress">QUESTION ' + (current + 1) + ' / 5</span><h3>' + item.q + '</h3><div class="options">' + item.a.map(function (answer, i) { return '<button class="option" data-answer="' + i + '">' + answer + '</button>'; }).join('') + '</div>';
    box.querySelectorAll('.option').forEach(function (button) { button.addEventListener('click', function () { if (+button.dataset.answer === item.c) score++; current++; current < questions.length ? showQuestion() : showResult(); }); });
  }
  function unlock(name) { var el = document.querySelector('[data-achievement="' + name + '"]'); if (el) el.classList.add('unlocked'); }
  function showResult() {
    var rank = score <= 1 ? ['NOOB 😄', 'Training time!'] : score <= 3 ? ['PLAYER 🎮', 'Καλή αρχή!'] : score === 4 ? ['PRO 🔥', 'Ξέρεις το Roblox πολύ καλά!'] : ['ROBLOX LEGEND 🏆', 'LEVEL MAX!'];
    box.innerHTML = '<div class="quiz-result"><span class="progress">FINAL SCORE ' + score + ' / 5</span><strong>' + rank[0] + '</strong><p>«' + rank[1] + '»</p><button id="play-again" class="rb-btn primary">PLAY AGAIN</button></div>';
    unlock('brain'); document.getElementById('play-again').addEventListener('click', function () { current = score = 0; showQuestion(); });
  }
  if (box) showQuestion();

  var challenge = document.getElementById('challenge-btn');
  if (challenge) challenge.addEventListener('click', function () { challenge.textContent = 'MISSION ACCEPTED 🔥'; challenge.classList.add('accepted'); challenge.disabled = true; unlock('challenger'); });
  var versus = document.getElementById('versus-grid');
  [['OBBY', 'RACING'], ['ADVENTURE', 'SIMULATOR'], ['BUILD', 'EXPLORE'], ['SOLO', 'MULTIPLAYER'], ['FAST', 'SMART']].forEach(function (pair) {
    var row = document.createElement('div'); row.className = 'versus-row'; row.innerHTML = '<button>' + pair[0] + '</button><b>VS</b><button>' + pair[1] + '</button>';
    row.querySelectorAll('button').forEach(function (button) { button.addEventListener('click', function () { row.querySelectorAll('button').forEach(function (b) { b.classList.remove('selected'); }); button.classList.add('selected'); }); }); versus.appendChild(row);
  });
  unlock('explorer');
  var basketball = document.getElementById('basketball-link'); if (basketball) basketball.addEventListener('click', function () { try { localStorage.setItem('rb-crossover', '1'); } catch (_) {} });
  try { if (localStorage.getItem('rb-crossover')) unlock('crossover'); } catch (_) {}
  var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('visible'); if (entry.target.classList.contains('final-cta')) unlock('super'); } }); }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
})();
