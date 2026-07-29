'use strict';

const STORAGE_KEY = 'war-companion-v1-state';
const APP_VERSION = '1.1.0';
const MAX_UNDO = 30;

const PHASES = [
  {
    id: 'command', title: 'Command', icon: 'assets/icons/phase-command.png',
    subtitle: 'Gain strategic resources, resolve abilities, then test Battle-shock.',
    checklist: [
      ['gain-cp', 'Both players gain 1 Command Point. Track your CP below.'],
      ['command-rules', 'Resolve start-of-Command-phase and other Command phase rules.'],
      ['mission-score', 'Resolve mission scoring or objective rules that occur now.'],
      ['half-strength', 'Identify units on the battlefield that are Below Half-strength.'],
      ['battle-shock', 'Take required Battle-shock tests and apply Battle-shocked effects.']
    ]
  },
  {
    id: 'movement', title: 'Movement', icon: 'assets/icons/phase-move.png',
    subtitle: 'Move units, resolve transports, then bring in Reinforcements.',
    checklist: [
      ['move-units', 'Resolve Normal Moves, Advances, Fall Back moves or Remain Stationary.'],
      ['escape', 'Take Desperate Escape tests when required.'],
      ['coherency', 'Confirm every moved unit ends in Unit Coherency.'],
      ['transports', 'Resolve Embark and Disembark actions.'],
      ['reinforcements', 'Set up eligible Reinforcements or Strategic Reserves.'],
      ['movement-end', 'Resolve end-of-Movement-phase abilities and reactions.']
    ]
  },
  {
    id: 'shooting', title: 'Shooting', icon: 'assets/icons/phase-shoot.png',
    subtitle: 'Select eligible units, declare targets, and resolve ranged attacks.',
    checklist: [
      ['shoot-abilities', 'Resolve start-of-Shooting-phase abilities.'],
      ['eligible-shooters', 'Select an eligible unit and declare all weapon targets before rolling.'],
      ['attack-sequence', 'Resolve Hit → Wound → Allocate → Save → Damage.'],
      ['weapon-rules', 'Apply weapon abilities, cover, visibility and modifiers.'],
      ['hazardous', 'After each unit finishes, resolve Hazardous tests if required.'],
      ['shooting-end', 'Resolve destroyed-model and end-of-Shooting-phase effects.']
    ]
  },
  {
    id: 'charge', title: 'Charge', icon: 'assets/icons/phase-charge.png',
    subtitle: 'Declare targets, roll charges, and move into Engagement Range.',
    checklist: [
      ['charge-abilities', 'Resolve start-of-Charge-phase abilities.'],
      ['charge-targets', 'For each eligible unit, declare every intended charge target.'],
      ['charge-roll', 'Roll 2D6 and complete a legal Charge move if successful.'],
      ['reactions', 'Check Fire Overwatch and other charge reactions at the correct timing.'],
      ['charge-coherency', 'Confirm Engagement Range, model placement and Unit Coherency.'],
      ['charge-end', 'Resolve end-of-Charge-phase effects.']
    ]
  },
  {
    id: 'fight', title: 'Fight', icon: 'assets/icons/phase-fight.png',
    subtitle: 'Resolve Fights First, then alternate through remaining combats.',
    checklist: [
      ['fights-first', 'Resolve Fights First units, beginning with the player whose turn is not taking place.'],
      ['remaining-combats', 'Resolve Remaining Combats, again beginning with the player whose turn is not taking place.'],
      ['fight-sequence', 'For each unit: Pile In → select targets → melee attacks → Consolidate.'],
      ['fight-tracking', 'Confirm each eligible unit has fought no more than once this phase.'],
      ['end-coherency', 'At end of turn, remove models from any unit that is not coherent until it is coherent.'],
      ['end-turn-effects', 'Resolve end-of-Fight-phase and end-of-turn rules.']
    ]
  }
];

const defaultState = () => ({
  appVersion: APP_VERSION,
  game: null,
  reminders: [],
  archives: [],
  undoStack: [],
  preferences: { autoCommandCP: true }
});

function normalizeArchive(item) {
  if (!item || typeof item !== 'object') return null;
  return {
    id: item.id || uid('archive'),
    mission: item.mission || 'Custom Mission',
    playerName: item.playerName || item.player?.name || item.players?.[0]?.name || 'Player',
    opponentName: item.opponentName || item.opponent?.name || item.players?.[1]?.name || 'Opponent',
    score: Number(item.score ?? item.totals?.[0] ?? 0),
    rounds: Number(item.rounds || 0),
    duration: Number(item.duration || 0),
    completedAt: Number(item.completedAt || Date.now())
  };
}

function normalizeGame(game) {
  if (!game || typeof game !== 'object') return null;
  const oldPlayers = Array.isArray(game.players) ? game.players : [];
  const playerSource = game.player || oldPlayers[0] || {};
  const opponentSource = game.opponent || oldPlayers[1] || {};
  const firstTurn = Number(game.firstTurn ?? game.firstPlayer ?? 0) === 1 ? 1 : 0;
  const activeTurn = Number(game.activeTurn ?? game.activePlayer ?? firstTurn) === 1 ? 1 : 0;
  const scoreEvents = Array.isArray(game.scoreEvents)
    ? game.scoreEvents
        .filter(event => event.player === undefined || Number(event.player) === 0)
        .map(event => ({ ...event, player: undefined, amount: Number(event.amount || 0) }))
    : [];
  const cpEvents = Array.isArray(game.cpEvents)
    ? game.cpEvents
        .filter(event => event.player === undefined || Number(event.player) === 0)
        .map(event => ({ ...event, player: undefined, amount: Number(event.amount || 0) }))
    : [];
  const objectives = Array.isArray(game.objectives) && game.objectives.length
    ? game.objectives.map((objective, index) => ({
        id: objective.id || index + 1,
        label: objective.label || `Objective ${index + 1}`,
        status: objective.status === 'p0' ? 'mine' : objective.status === 'p1' ? 'opponent' : objective.status || 'neutral'
      }))
    : Array.from({ length: 5 }, (_, index) => ({ id: index + 1, label: `Objective ${index + 1}`, status: 'neutral' }));

  return {
    id: game.id || uid('game'),
    status: game.status === 'complete' ? 'complete' : 'active',
    createdAt: Number(game.createdAt || Date.now()),
    completedAt: game.completedAt ? Number(game.completedAt) : null,
    mission: String(game.mission || 'Custom Mission'),
    maxRounds: Math.min(10, Math.max(1, Number(game.maxRounds || 5))),
    firstTurn,
    activeTurn,
    round: Math.max(1, Number(game.round || 1)),
    phaseIndex: Math.min(PHASES.length - 1, Math.max(0, Number(game.phaseIndex || 0))),
    player: {
      name: String(playerSource.name || 'Player'),
      army: String(playerSource.army || ''),
      cp: Math.max(0, Number(playerSource.cp || 0))
    },
    opponent: {
      name: String(opponentSource.name || game.opponentName || 'Opponent'),
      army: String(opponentSource.army || game.opponentArmy || '')
    },
    objectives,
    scoreEvents,
    cpEvents,
    cpGrants: Array.isArray(game.cpGrants) ? game.cpGrants.map(String) : [],
    phaseChecks: game.phaseChecks && typeof game.phaseChecks === 'object' ? game.phaseChecks : {},
    reminderChecks: game.reminderChecks && typeof game.reminderChecks === 'object' ? game.reminderChecks : {},
    roundReminderChecks: game.roundReminderChecks && typeof game.roundReminderChecks === 'object' ? game.roundReminderChecks : {},
    dismissedRoundPopups: Array.isArray(game.dismissedRoundPopups) ? game.dismissedRoundPopups.map(Number) : [],
    timer: {
      elapsed: Math.max(0, Number(game.timer?.elapsed || 0)),
      running: Boolean(game.timer?.running),
      startedAt: game.timer?.startedAt ? Number(game.timer.startedAt) : null
    }
  };
}

function normalizeState(parsed) {
  const base = defaultState();
  if (!parsed || typeof parsed !== 'object') return base;
  return {
    ...base,
    ...parsed,
    appVersion: APP_VERSION,
    game: normalizeGame(parsed.game),
    reminders: Array.isArray(parsed.reminders) ? parsed.reminders.map(reminder => ({
      id: reminder.id || uid('reminder'),
      title: String(reminder.title || 'Reminder'),
      note: String(reminder.note || ''),
      phase: String(reminder.phase || 'Any'),
      scope: ['mine', 'opponent', 'any'].includes(reminder.scope) ? reminder.scope : 'any',
      round: Math.max(0, Number(reminder.round || 0)),
      enabled: reminder.enabled !== false
    })) : [],
    archives: Array.isArray(parsed.archives) ? parsed.archives.map(normalizeArchive).filter(Boolean) : [],
    undoStack: [],
    preferences: { ...base.preferences, ...(parsed.preferences || {}) }
  };
}

let state = loadState();
let ui = {
  tab: state.game && state.game.status === 'active' ? 'battle' : 'setup',
  rulesQuery: '',
  rulesCategory: 'All',
  woundStrength: 4,
  woundToughness: 4,
  woundResult: 'S4 vs T4: wound on 4+',
  diceResult: 'Roll when needed.'
};
let toastTimer = null;

const app = document.getElementById('app');
const toastEl = document.getElementById('toast');

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return normalizeState(parsed);
  } catch (error) {
    console.warn('Could not load saved Warhammer Companion state.', error);
    return defaultState();
  }
}

function saveState() {
  try {
    state.appVersion = APP_VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Could not save Warhammer Companion state.', error);
    showToast('Could not save locally. Storage may be full.');
  }
}

function snapshotGame() {
  if (!state.game) return;
  state.undoStack.push(JSON.stringify(state.game));
  if (state.undoStack.length > MAX_UNDO) state.undoStack.shift();
}

function mutateGame(mutator, { snapshot = true, rerender = true } = {}) {
  if (!state.game) return;
  if (snapshot) snapshotGame();
  mutator(state.game);
  saveState();
  if (rerender) render();
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

function getTotal(game = state.game) {
  if (!game) return 0;
  return (game.scoreEvents || []).reduce((sum, event) => sum + Number(event.amount || 0), 0);
}

function elapsedSeconds(game = state.game) {
  if (!game) return 0;
  const timer = game.timer || { elapsed: 0, running: false, startedAt: null };
  const live = timer.running && timer.startedAt ? Math.floor((Date.now() - timer.startedAt) / 1000) : 0;
  return Math.max(0, Number(timer.elapsed || 0) + live);
}

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function phaseKey(game = state.game) {
  return `${game.round}-${game.activeTurn}-${game.phaseIndex}`;
}

function commandGrantKey(game = state.game) {
  return `${game.round}-${game.activeTurn}`;
}

function turnLabel(turn, game = state.game) {
  return Number(turn) === 0 ? 'Your Turn' : `${game?.opponent?.name || 'Opponent'}’s Turn`;
}

function grantCommandCP(game, announce = true) {
  if (!state.preferences.autoCommandCP || game.phaseIndex !== 0) return false;
  const key = commandGrantKey(game);
  game.cpGrants ||= [];
  if (game.cpGrants.includes(key)) return false;
  game.player.cp = Math.max(0, Number(game.player.cp || 0) + 1);
  game.cpEvents.push({
    id: uid('cp'), amount: 1, round: game.round, phase: 'Command',
    turn: game.activeTurn, reason: `Start of ${turnLabel(game.activeTurn, game)}`, ts: Date.now()
  });
  game.cpGrants.push(key);
  game.phaseChecks ||= {};
  game.phaseChecks[phaseKey(game)] ||= {};
  game.phaseChecks[phaseKey(game)]['gain-cp'] = true;
  if (announce) setTimeout(() => showToast('Command phase: your CP increased by 1.'), 30);
  return true;
}

function createGame(form) {
  const data = new FormData(form);
  const playerName = String(data.get('playerName') || 'Player').trim() || 'Player';
  const opponentName = String(data.get('opponentName') || 'Opponent').trim() || 'Opponent';
  const firstTurn = Number(data.get('firstTurn') || 0) === 1 ? 1 : 0;
  const startingCP = Math.max(0, Number(data.get('startingCP') || 0));
  const maxRounds = Math.min(10, Math.max(1, Number(data.get('maxRounds') || 5)));
  const objectiveCount = Math.min(9, Math.max(1, Number(data.get('objectiveCount') || 5)));

  state.game = {
    id: uid('game'),
    status: 'active',
    createdAt: Date.now(),
    completedAt: null,
    mission: String(data.get('mission') || 'Custom Mission').trim() || 'Custom Mission',
    maxRounds,
    firstTurn,
    activeTurn: firstTurn,
    round: 1,
    phaseIndex: 0,
    player: {
      name: playerName,
      army: String(data.get('playerArmy') || '').trim(),
      cp: startingCP
    },
    opponent: {
      name: opponentName,
      army: String(data.get('opponentArmy') || '').trim()
    },
    objectives: Array.from({ length: objectiveCount }, (_, index) => ({ id: index + 1, label: `Objective ${index + 1}`, status: 'neutral' })),
    scoreEvents: [],
    cpEvents: [],
    cpGrants: [],
    phaseChecks: {},
    reminderChecks: {},
    roundReminderChecks: {},
    dismissedRoundPopups: [],
    timer: { elapsed: 0, running: false, startedAt: null }
  };
  state.undoStack = [];
  ui.tab = 'battle';
  grantCommandCP(state.game, false);
  saveState();
  render();
  showToast('Battle created. Progress is saved automatically.');
}

function advancePhase() {
  const game = state.game;
  if (!game || game.status !== 'active') return;
  mutateGame(current => {
    if (current.phaseIndex < PHASES.length - 1) {
      current.phaseIndex += 1;
    } else if (current.activeTurn === current.firstTurn) {
      current.activeTurn = 1 - current.firstTurn;
      current.phaseIndex = 0;
    } else {
      current.round += 1;
      current.activeTurn = current.firstTurn;
      current.phaseIndex = 0;
    }
    grantCommandCP(current, true);
  });
}

function isFinalTurnPhase(game = state.game) {
  return game && game.round >= game.maxRounds && game.phaseIndex === PHASES.length - 1 && game.activeTurn !== game.firstTurn;
}

function finishGame() {
  if (!state.game) return;
  snapshotGame();
  const game = state.game;
  if (game.timer.running && game.timer.startedAt) {
    game.timer.elapsed = elapsedSeconds(game);
    game.timer.running = false;
    game.timer.startedAt = null;
  }
  game.status = 'complete';
  game.completedAt = Date.now();
  const archive = {
    id: game.id,
    mission: game.mission,
    playerName: game.player.name,
    opponentName: game.opponent.name,
    score: getTotal(game),
    rounds: game.round,
    duration: elapsedSeconds(game),
    completedAt: game.completedAt
  };
  state.archives = [archive, ...state.archives.filter(item => item.id !== game.id)].slice(0, 20);
  saveState();
  render();
}

function addScore(amount, category = 'Adjustment', note = '') {
  const numericAmount = Number(amount);
  if (!state.game || !Number.isFinite(numericAmount) || numericAmount === 0) return;
  mutateGame(game => {
    game.scoreEvents.push({
      id: uid('score'), amount: numericAmount,
      category: category || 'Adjustment', note: note || '', round: game.round,
      phase: PHASES[game.phaseIndex].title, turn: game.activeTurn, ts: Date.now()
    });
  });
}

function adjustCP(amount, reason = 'Manual adjustment') {
  if (!state.game) return;
  const current = Number(state.game.player.cp || 0);
  const next = current + Number(amount);
  if (next < 0) {
    showToast('You do not have enough CP.');
    return;
  }
  mutateGame(game => {
    game.player.cp = next;
    game.cpEvents.push({
      id: uid('cp'), amount: Number(amount), round: game.round,
      phase: PHASES[game.phaseIndex].title, turn: game.activeTurn, reason, ts: Date.now()
    });
  });
}

function cycleObjective(index) {
  const order = ['neutral', 'mine', 'opponent', 'contested'];
  mutateGame(game => {
    const objective = game.objectives[index];
    objective.status = order[(order.indexOf(objective.status) + 1) % order.length];
  });
}

function matchingReminders(game = state.game) {
  if (!game) return [];
  const phase = PHASES[game.phaseIndex].title;
  return state.reminders.filter(reminder => {
    if (!reminder.enabled) return false;
    if (reminder.phase !== 'Any' && reminder.phase !== phase) return false;
    if (Number(reminder.round || 0) > 0 && Number(reminder.round) !== game.round) return false;
    if (reminder.scope === 'mine' && game.activeTurn !== 0) return false;
    if (reminder.scope === 'opponent' && game.activeTurn !== 1) return false;
    return true;
  });
}

function roundReminders(game = state.game) {
  if (!game) return [];
  return state.reminders.filter(reminder => reminder.enabled && (Number(reminder.round || 0) === 0 || Number(reminder.round) === game.round));
}

function shouldShowRoundPopup(game = state.game) {
  if (!game || game.status !== 'active') return false;
  return !game.dismissedRoundPopups.includes(game.round) && roundReminders(game).length > 0;
}

const SEARCH_STOP_WORDS = new Set(['a','able','after','an','and','are','at','before','can','could','do','does','during','ever','for','from','how','i','if','in','is','it','my','of','on','or','the','this','to','unit','units','what','when','where','while','with','work','works']);
const SEARCH_ALIASES = {
  'battleshock': 'battle-shock', 'battleshocked': 'battle-shock', 'fallback': 'fall', 'fell': 'fall',
  'falling': 'fall', 'shooting': 'shoot', 'shooter': 'shoot', 'shot': 'shoot', 'charging': 'charge',
  'charged': 'charge', 'charges': 'charge', 'advancing': 'advance', 'advanced': 'advance',
  'objectives': 'objective', 'models': 'model', 'reroll': 're-roll', 'rerolls': 're-roll',
  'reserves': 'reserve', 'stratagems': 'stratagem', 'weapons': 'weapon', 'wounds': 'wound'
};

function searchTokens(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+\-\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(token => SEARCH_ALIASES[token] || token)
    .map(token => token.length > 5 && token.endsWith('ing') ? token.slice(0, -3) : token)
    .filter(token => !SEARCH_STOP_WORDS.has(token));
}

function render() {
  if (!state.game) {
    app.innerHTML = renderSetup();
    return;
  }
  if (state.game.status === 'complete') {
    app.innerHTML = renderComplete();
    return;
  }

  const screenClass = ui.tab === 'rules' ? 'screen-rules' : ui.tab === 'score' ? 'screen-score' : ui.tab === 'reminders' ? 'screen-reminders' : ui.tab === 'more' ? 'screen-more' : 'screen-battle';
  app.innerHTML = `
    <div class="app-shell ${screenClass}">
      ${renderTopbar()}
      <main class="content">${renderActiveTab()}</main>
      ${renderBottomNav()}
      ${shouldShowRoundPopup() ? renderRoundReminderModal() : ''}
    </div>`;
  updateLiveTimer();
}

function renderSetup() {
  return `
    <main class="hero-setup">
      <img class="setup-brand" src="assets/brand-logo.webp" alt="Warhammer Companion">
      <section class="setup-panel">
        <div class="setup-panel-head">
          <h1>Begin a New Battle</h1>
          <p>Track your gameplay without replacing the official army app.</p>
        </div>
        <form id="new-game-form" class="setup-form stack">
          <div class="grid-2 mobile-stack">
            <div class="field"><label for="playerName">Your name</label><input id="playerName" name="playerName" value="Player" maxlength="40" required></div>
            <div class="field"><label for="opponentName">Opponent</label><input id="opponentName" name="opponentName" value="Opponent" maxlength="40"></div>
          </div>
          <div class="grid-2 mobile-stack">
            <div class="field"><label for="playerArmy">Your army <span class="help">(optional)</span></label><input id="playerArmy" name="playerArmy" placeholder="e.g., Space Marines" maxlength="60"></div>
            <div class="field"><label for="opponentArmy">Opponent army <span class="help">(optional)</span></label><input id="opponentArmy" name="opponentArmy" placeholder="e.g., Orks" maxlength="60"></div>
          </div>
          <div class="field"><label for="mission">Mission</label><input id="mission" name="mission" value="Only War / Custom Mission" maxlength="80"></div>
          <div class="grid-3">
            <div class="field"><label for="firstTurn">First turn</label><select id="firstTurn" name="firstTurn"><option value="0">You</option><option value="1">Opponent</option></select></div>
            <div class="field"><label for="startingCP">Your starting CP</label><input id="startingCP" name="startingCP" type="number" min="0" max="99" value="0" inputmode="numeric"></div>
            <div class="field"><label for="maxRounds">Rounds</label><input id="maxRounds" name="maxRounds" type="number" min="1" max="10" value="5" inputmode="numeric"></div>
          </div>
          <div class="field"><label for="objectiveCount">Objective markers</label><input id="objectiveCount" name="objectiveCount" type="number" min="1" max="9" value="5" inputmode="numeric"></div>
          <button class="btn primary block" type="submit">Start Battle</button>
          <p class="help">Only your VP and CP are tracked. Your opponent can use their own copy of the app.</p>
        </form>
      </section>
    </main>`;
}

function renderTopbar() {
  const game = state.game;
  return `
    <header class="topbar">
      <div class="topbar-brand">
        <img class="topbar-logo" src="assets/brand-logo.webp" alt="Warhammer Companion">
        <div class="topbar-title">
          <strong>${esc(game.mission)}</strong>
          <span>${esc(game.player.name)} vs ${esc(game.opponent.name)}</span>
        </div>
      </div>
      <button class="status-pill" type="button" data-action="undo" ${state.undoStack.length ? '' : 'disabled'}>Undo</button>
    </header>`;
}

function renderActiveTab() {
  if (ui.tab === 'score') return renderScore();
  if (ui.tab === 'rules') return renderRules();
  if (ui.tab === 'reminders') return renderReminders();
  if (ui.tab === 'more') return renderMore();
  return renderBattle();
}

function renderBattle() {
  const game = state.game;
  const phase = PHASES[game.phaseIndex];
  const total = getTotal(game);
  const checks = game.phaseChecks?.[phaseKey(game)] || {};
  const reminders = matchingReminders(game);
  const reminderChecks = game.reminderChecks?.[phaseKey(game)] || {};
  const allRoundReminders = roundReminders(game);
  const roundChecks = game.roundReminderChecks?.[game.round] || {};
  const nextLabel = isFinalTurnPhase(game)
    ? 'Finish Battle'
    : game.phaseIndex < PHASES.length - 1
      ? `Next: ${PHASES[game.phaseIndex + 1].title} Phase`
      : game.activeTurn === game.firstTurn
        ? `End Turn: ${turnLabel(1 - game.firstTurn, game)}`
        : `End Round ${game.round}`;

  return `
    <section class="battle-status">
      <div class="round-badge">
        <img src="assets/icons/round.png" alt="">
        <div><span class="small">Battle Round</span><span class="big">${game.round} / ${game.maxRounds}</span></div>
      </div>
      <button class="turn-chip" type="button" data-action="switch-turn" title="Tap to correct the active turn">
        Active Turn<strong>${esc(turnLabel(game.activeTurn, game))}</strong>
      </button>
      <button class="timer-badge" type="button" data-action="toggle-timer" aria-label="Start or pause game timer">
        <img src="assets/icons/timer.png" alt="">
        <div><span class="small">${game.timer.running ? 'Running' : 'Game Timer'}</span><span class="big" data-live-timer>${formatTime(elapsedSeconds(game))}</span></div>
      </button>
    </section>

    <section class="player-grid single-player-grid">
      ${renderPlayerCard(game.player, total)}
    </section>

    <section class="panel phase-panel gold">
      <div class="phase-header">
        <img src="${phase.icon}" alt="">
        <div><h2>${phase.title} Phase</h2><p>${phase.subtitle}</p></div>
      </div>
      <div class="phase-strip" aria-label="Battle phases">
        ${PHASES.map((item, index) => `
          <button class="phase-tab ${index === game.phaseIndex ? 'current' : ''} ${index < game.phaseIndex ? 'done' : ''}" type="button" data-action="set-phase" data-index="${index}">
            <img src="${item.icon}" alt=""><span>${item.title}</span>
          </button>`).join('')}
      </div>
      <div class="checklist">
        ${phase.checklist.map(([id, text]) => `
          <label class="check-item ${checks[id] ? 'checked' : ''}">
            <input type="checkbox" data-action="phase-check" data-id="${id}" ${checks[id] ? 'checked' : ''}>
            <span>${esc(text)}</span>
          </label>`).join('')}
      </div>
      ${reminders.length ? `
        <div class="reminder-callout">
          <strong>Current reminders</strong>
          ${reminders.map(reminder => `
            <label class="check-item ${reminderChecks[reminder.id] ? 'checked' : ''}" style="margin-top:7px">
              <input type="checkbox" data-action="battle-reminder-check" data-id="${reminder.id}" ${reminderChecks[reminder.id] ? 'checked' : ''}>
              <span>${esc(reminder.title)}${reminder.note ? `<br><small>${esc(reminder.note)}</small>` : ''}</span>
            </label>`).join('')}
        </div>` : ''}
      <button class="btn primary block next-phase" type="button" data-action="next-phase">${esc(nextLabel)}</button>
    </section>

    ${allRoundReminders.length ? `
      <section class="panel blue">
        <h2 class="section-title"><span>Round ${game.round} Reminders</span><small>${allRoundReminders.length}</small></h2>
        <div class="checklist">
          ${allRoundReminders.map(reminder => `
            <label class="check-item ${roundChecks[reminder.id] ? 'checked' : ''}">
              <input type="checkbox" data-action="round-reminder-check" data-id="${reminder.id}" ${roundChecks[reminder.id] ? 'checked' : ''}>
              <span><strong>${esc(reminder.title)}</strong><br><small>${esc(reminder.phase)} · ${reminder.scope === 'mine' ? 'Your turn' : reminder.scope === 'opponent' ? 'Opponent turn' : 'Either turn'}${reminder.note ? ` · ${esc(reminder.note)}` : ''}</small></span>
            </label>`).join('')}
        </div>
      </section>` : ''}

    <section class="panel blue">
      <h2 class="section-title"><span>Objectives</span><small>Tap to cycle control</small></h2>
      <div class="objectives">
        ${game.objectives.map((objective, index) => renderObjective(objective, index)).join('')}
      </div>
    </section>

    <section class="tools-grid battle-tools">
      <article class="panel tool-card">
        <h2 class="section-title"><span>Wound Roll</span></h2>
        <div class="grid-2">
          <div class="field"><label for="strength">Strength</label><input id="strength" type="number" min="1" max="99" value="${ui.woundStrength}" inputmode="numeric"></div>
          <div class="field"><label for="toughness">Toughness</label><input id="toughness" type="number" min="1" max="99" value="${ui.woundToughness}" inputmode="numeric"></div>
        </div>
        <button class="btn secondary block small" type="button" data-action="calculate-wound" style="margin-top:8px">Calculate</button>
        <div class="tool-result" id="wound-result">${esc(ui.woundResult)}</div>
      </article>
      <article class="panel tool-card">
        <h2 class="section-title"><span>Dice</span></h2>
        <div class="dice-buttons">
          <button class="btn secondary small" type="button" data-action="roll-dice" data-dice="d3">D3</button>
          <button class="btn secondary small" type="button" data-action="roll-dice" data-dice="d6">D6</button>
          <button class="btn secondary small" type="button" data-action="roll-dice" data-dice="2d6">2D6</button>
        </div>
        <div class="tool-result">${esc(ui.diceResult)}</div>
      </article>
    </section>

    <section class="panel">
      <h2 class="section-title"><span>Quick Rules</span><img class="section-icon" src="assets/icons/search.png" alt=""></h2>
      <div class="btn-row">
        <button class="btn secondary" type="button" data-action="open-rules" data-query="wound roll">Wound Rules</button>
        <button class="btn secondary" type="button" data-action="open-rules" data-query="battle-shock">Battle-shock</button>
        <button class="btn secondary" type="button" data-action="open-rules" data-query="core stratagem">Core Stratagems</button>
        <button class="btn secondary" type="button" data-action="open-rules" data-query="objective control">Objective Control</button>
      </div>
    </section>`;
}

function renderPlayerCard(player, total) {
  return `
    <article class="player-card active single-player-card">
      <div class="player-head"><strong>${esc(player.name)}</strong><span>${esc(player.army || 'Your army')}</span></div>
      <div class="resource-grid">
        <div class="resource">
          <div class="resource-label"><img src="assets/icons/vp.png" alt="">Your VP</div>
          <div class="resource-value">${total}</div>
          <div class="counter-row two-buttons">
            <button class="counter-btn minus" type="button" data-action="quick-score" data-amount="-1">−1</button>
            <button class="counter-btn plus" type="button" data-action="quick-score" data-amount="1">+1</button>
          </div>
        </div>
        <div class="resource cp">
          <div class="resource-label"><img src="assets/icons/cp.png" alt="">Your CP</div>
          <div class="resource-value">${Number(player.cp || 0)}</div>
          <div class="counter-row">
            <button class="counter-btn minus" type="button" data-action="quick-cp" data-amount="-1">−1</button>
            <button class="counter-btn plus" type="button" data-action="quick-cp" data-amount="1">+1</button>
            <button class="counter-btn plus" type="button" data-action="quick-cp" data-amount="2">+2</button>
          </div>
        </div>
      </div>
    </article>`;
}

function renderObjective(objective, index) {
  const game = state.game;
  const statusText = objective.status === 'mine' ? 'You' : objective.status === 'opponent' ? game.opponent.name : objective.status === 'contested' ? 'Contested' : 'Uncontrolled';
  return `
    <button class="objective-btn ${objective.status}" type="button" data-action="cycle-objective" data-index="${index}">
      <img src="assets/icons/objective.png" alt=""><strong>OBJ ${objective.id}</strong><span>${esc(statusText)}</span>
    </button>`;
}

function renderScore() {
  const game = state.game;
  const total = getTotal(game);
  const rounds = Array.from({ length: game.maxRounds }, (_, index) => index + 1);
  const roundTotal = round => game.scoreEvents.filter(event => event.round === round).reduce((sum, event) => sum + Number(event.amount || 0), 0);
  const events = [...game.scoreEvents].reverse();

  return `
    <section class="score-summary single-score-summary">
      <article class="panel score-total"><strong>${esc(game.player.name)}</strong><span class="value">${total}</span><small>Your Victory Points</small></article>
    </section>

    <section class="panel gold">
      <h2 class="section-title"><span>Add Scoring Entry</span><img class="section-icon" src="assets/icons/vp.png" alt=""></h2>
      <form id="score-form" class="stack">
        <div class="grid-2 mobile-stack">
          <div class="field"><label for="scoreCategory">Category</label><select id="scoreCategory" name="category"><option>Primary</option><option>Secondary</option><option>Bonus</option><option>Battle Ready</option><option>Adjustment</option></select></div>
          <div class="field"><label for="scoreAmount">VP amount</label><input id="scoreAmount" name="amount" type="number" value="1" min="-100" max="100" required inputmode="numeric"></div>
        </div>
        <div class="field"><label for="scoreNote">Note <span class="help">(optional)</span></label><input id="scoreNote" name="note" maxlength="100" placeholder="e.g., Hold two objectives"></div>
        <button class="btn primary block" type="submit">Add to Round ${game.round}</button>
      </form>
    </section>

    <section class="panel">
      <h2 class="section-title"><span>Round Breakdown</span><small>${esc(game.mission)}</small></h2>
      <table class="breakdown-table">
        <thead><tr><th>Round</th><th>Your VP</th></tr></thead>
        <tbody>${rounds.map(round => `<tr><td>Round ${round}</td><td>${roundTotal(round)}</td></tr>`).join('')}</tbody>
        <tfoot><tr><th>Total</th><th>${total}</th></tr></tfoot>
      </table>
    </section>

    <section class="panel">
      <h2 class="section-title"><span>Scoring History</span><small>${events.length} entries</small></h2>
      ${events.length ? `<div class="event-list">${events.map(event => `
        <div class="event-item">
          <div class="event-main"><strong>${esc(event.category)}</strong><span>Round ${event.round}, ${esc(event.phase)} · ${esc(turnLabel(event.turn ?? 0, game))}${event.note ? ` · ${esc(event.note)}` : ''}</span></div>
          <div style="display:flex;align-items:center;gap:6px"><span class="event-amount ${event.amount < 0 ? 'negative' : ''}">${event.amount > 0 ? '+' : ''}${event.amount}</span><button class="icon-delete" type="button" data-action="delete-score" data-id="${event.id}" aria-label="Delete scoring entry">✕</button></div>
        </div>`).join('')}</div>` : `<div class="empty-state"><img src="assets/icons/vp.png" alt=""><p>No scoring entries yet.</p></div>`}
    </section>`;
}

function renderRules() {
  const words = searchTokens(ui.rulesQuery);
  const rules = (window.RULES_DATA || []).filter(rule => {
    if (ui.rulesCategory !== 'All' && rule.category !== ui.rulesCategory) return false;
    if (!words.length) return true;
    const haystackTokens = searchTokens(`${rule.title} ${rule.category} ${rule.summary} ${rule.details} ${(rule.tags || []).join(' ')}`);
    const haystack = haystackTokens.join(' ');
    return words.every(word => haystack.includes(word));
  });

  return `
    <section class="panel gold">
      <h2 class="section-title"><span>Rules Search</span><small>${esc(window.RULES_VERSION || '')}</small></h2>
      <div class="search-wrap"><img src="assets/icons/search.png" alt=""><input id="rules-search" class="search-input" type="search" placeholder="Search: fall back, cover, overwatch…" value="${esc(ui.rulesQuery)}" autocomplete="off"></div>
      <div class="chips">${(window.RULE_CATEGORIES || ['All']).map(category => `<button class="chip ${ui.rulesCategory === category ? 'active' : ''}" type="button" data-action="rule-category" data-category="${esc(category)}">${esc(category)}</button>`).join('')}</div>
    </section>

    <section class="panel blue">
      <h2 class="section-title"><span>Reference Results</span><small>${rules.length} rules</small></h2>
      ${rules.length ? `<div class="rule-list">${rules.map(renderRuleCard).join('')}</div>` : `<div class="empty-state"><img src="assets/icons/search.png" alt=""><p>No matching rule summary was found.</p></div>`}
      <p class="rule-note">Concise play-aid summaries based on the uploaded Core Rules 24.09. Consult the complete official rule and current updates when exact wording matters.</p>
    </section>`;
}

function renderRuleCard(rule) {
  return `
    <details class="rule-card">
      <summary>
        <div class="rule-top"><div><div class="rule-title">${esc(rule.title)}</div><div class="rule-category">${esc(rule.category)}</div></div><span class="rule-page">PG ${rule.page}</span></div>
        <div class="rule-summary">${esc(rule.summary)}</div>
      </summary>
      <div class="rule-detail">${esc(rule.details)}<div class="rule-note">Core Rules reference page ${rule.page} · ${esc(window.RULES_VERSION || '')}</div></div>
    </details>`;
}

function renderReminders() {
  const phaseOptions = ['Any', ...PHASES.map(phase => phase.title)];
  return `
    <section class="panel gold">
      <h2 class="section-title"><span>Add Custom Reminder</span><img class="section-icon" src="assets/icons/objective.png" alt=""></h2>
      <form id="reminder-form" class="stack">
        <div class="field"><label for="reminderTitle">Reminder</label><input id="reminderTitle" name="title" maxlength="100" placeholder="e.g., Select Oath of Moment target" required></div>
        <div class="field"><label for="reminderNote">Details <span class="help">(optional)</span></label><textarea id="reminderNote" name="note" maxlength="300" placeholder="Add a brief note or timing condition."></textarea></div>
        <div class="grid-3">
          <div class="field"><label for="reminderPhase">Phase</label><select id="reminderPhase" name="phase">${phaseOptions.map(option => `<option>${option}</option>`).join('')}</select></div>
          <div class="field"><label for="reminderScope">Turn</label><select id="reminderScope" name="scope"><option value="any">Either</option><option value="mine">My turn</option><option value="opponent">Opponent turn</option></select></div>
          <div class="field"><label for="reminderRound">Round</label><input id="reminderRound" name="round" type="number" min="0" max="10" value="0" inputmode="numeric"><span class="help">0 = every round</span></div>
        </div>
        <button class="btn primary block" type="submit">Save Reminder</button>
      </form>
    </section>

    <section class="panel">
      <h2 class="section-title"><span>Saved Reminders</span><small>${state.reminders.length}</small></h2>
      ${state.reminders.length ? `<div class="stack">${state.reminders.map(reminder => `
        <div class="reminder-item">
          <input type="checkbox" data-action="toggle-reminder" data-id="${reminder.id}" ${reminder.enabled ? 'checked' : ''} aria-label="Enable reminder">
          <div><strong>${esc(reminder.title)}</strong><span>${esc(reminder.phase)} · ${reminder.scope === 'mine' ? 'My turn' : reminder.scope === 'opponent' ? 'Opponent turn' : 'Either turn'} · ${Number(reminder.round) ? `Round ${reminder.round}` : 'Every round'}${reminder.note ? ` · ${esc(reminder.note)}` : ''}</span></div>
          <button class="icon-delete" type="button" data-action="delete-reminder" data-id="${reminder.id}" aria-label="Delete reminder">✕</button>
        </div>`).join('')}</div>` : `<div class="empty-state"><img src="assets/icons/objective.png" alt=""><p>No custom reminders yet.</p></div>`}
    </section>`;
}

function renderMore() {
  const game = state.game;
  const cpEvents = [...game.cpEvents].reverse().slice(0, 12);
  return `
    <section class="panel gold">
      <h2 class="section-title"><span>Battle Controls</span></h2>
      <div class="btn-row">
        <button class="btn secondary" type="button" data-action="toggle-timer">${game.timer.running ? 'Pause Timer' : 'Start Timer'}</button>
        <button class="btn secondary" type="button" data-action="reset-timer">Reset Timer</button>
        <button class="btn success" type="button" data-action="finish-game">Finish Battle</button>
      </div>
    </section>

    <section class="panel">
      <h2 class="section-title"><span>Game Information</span></h2>
      <div class="info-list">
        <div class="info-row"><span>Mission</span><strong>${esc(game.mission)}</strong></div>
        <div class="info-row"><span>Opponent</span><strong>${esc(game.opponent.name)}</strong></div>
        <div class="info-row"><span>First turn each round</span><strong>${esc(turnLabel(game.firstTurn, game))}</strong></div>
        <div class="info-row"><span>Current position</span><strong>Round ${game.round}, ${esc(PHASES[game.phaseIndex].title)}</strong></div>
        <div class="info-row"><span>Elapsed time</span><strong data-live-timer>${formatTime(elapsedSeconds(game))}</strong></div>
        <div class="info-row"><span>Rules library</span><strong>${esc(window.RULES_VERSION || '')}</strong></div>
      </div>
    </section>

    <section class="panel blue">
      <h2 class="section-title"><span>Settings</span></h2>
      <label class="reminder-item">
        <input type="checkbox" data-action="toggle-auto-cp" ${state.preferences.autoCommandCP ? 'checked' : ''}>
        <div><strong>Automatic Command phase CP</strong><span>Add 1 CP to your total once at the start of each player’s Command phase.</span></div>
        <span></span>
      </label>
    </section>

    <section class="panel">
      <h2 class="section-title"><span>Backup and Restore</span></h2>
      <div class="btn-row">
        <button class="btn secondary" type="button" data-action="export-data">Export Backup</button>
        <label class="btn secondary" style="text-align:center;cursor:pointer">Import Backup<input id="import-file" class="sr-only" type="file" accept="application/json"></label>
      </div>
      <p class="help">Backups include the active game, reminders, preferences and completed-game summaries.</p>
    </section>

    <section class="panel">
      <h2 class="section-title"><span>Recent CP History</span><small>${game.cpEvents.length} entries</small></h2>
      ${cpEvents.length ? `<div class="event-list">${cpEvents.map(event => `
        <div class="event-item"><div class="event-main"><strong>${esc(event.reason)}</strong><span>Round ${event.round}, ${esc(event.phase)} · ${esc(turnLabel(event.turn ?? 0, game))}</span></div><span class="event-amount ${event.amount < 0 ? 'negative' : ''}">${event.amount > 0 ? '+' : ''}${event.amount}</span></div>`).join('')}</div>` : `<p class="help">No CP changes recorded.</p>`}
    </section>

    <section class="panel">
      <h2 class="section-title"><span>Completed Battles</span><small>${state.archives.length}</small></h2>
      ${state.archives.length ? `<div class="stack">${state.archives.map(item => `<div class="archive-item"><strong>${esc(item.playerName)} · ${item.score} VP</strong><span>vs ${esc(item.opponentName)} · ${esc(item.mission)} · ${new Date(item.completedAt).toLocaleDateString()} · ${formatTime(item.duration)}</span></div>`).join('')}</div>` : `<p class="help">Completed battles will appear here.</p>`}
    </section>

    <section class="panel">
      <div class="btn-row"><button class="btn danger" type="button" data-action="new-game">Start a Different Battle</button><button class="btn danger" type="button" data-action="clear-all">Erase All Local Data</button></div>
      <p class="disclaimer">Warhammer Companion v${APP_VERSION} is an unofficial fan-made gameplay aid. It is not affiliated with or endorsed by Games Workshop. It does not include datasheets, army construction or unit cards. Rules summaries reflect the uploaded Core Rules 24.09 and may be superseded by later official updates, commentary, mission packs or balance documents.</p>
    </section>`;
}

function renderBottomNav() {
  const tabs = [
    ['battle', 'Battle', 'assets/icons/phase-command.png'],
    ['score', 'Score', 'assets/icons/vp.png'],
    ['rules', 'Rules', 'assets/icons/search.png'],
    ['reminders', 'Reminders', 'assets/icons/objective.png'],
    ['more', 'More', 'assets/icons/timer.png']
  ];
  return `<nav class="bottom-nav" aria-label="Primary navigation">${tabs.map(([id,label,icon]) => `<button class="nav-btn ${ui.tab === id ? 'active' : ''}" type="button" data-action="tab" data-tab="${id}"><img src="${icon}" alt=""><span>${label}</span></button>`).join('')}</nav>`;
}

function renderRoundReminderModal() {
  const game = state.game;
  const reminders = roundReminders(game);
  return `
    <div class="modal-backdrop" role="presentation">
      <section class="reminder-modal" role="dialog" aria-modal="true" aria-labelledby="round-reminder-title">
        <div class="modal-header">
          <div>
            <span class="modal-kicker">Battle Round ${game.round}</span>
            <h2 id="round-reminder-title">Round Reminders</h2>
          </div>
          <button class="modal-close" type="button" data-action="dismiss-round-reminders" aria-label="Dismiss round reminders">✕</button>
        </div>
        <div class="modal-reminder-list">
          ${reminders.map(reminder => `
            <article class="modal-reminder-item">
              <strong>${esc(reminder.title)}</strong>
              <span>${esc(reminder.phase)} · ${reminder.scope === 'mine' ? 'Your turn' : reminder.scope === 'opponent' ? 'Opponent turn' : 'Either turn'}${Number(reminder.round) ? ` · Round ${reminder.round}` : ' · Every round'}</span>
              ${reminder.note ? `<p>${esc(reminder.note)}</p>` : ''}
            </article>`).join('')}
        </div>
        <button class="btn primary block" type="button" data-action="dismiss-round-reminders">Continue Battle</button>
      </section>
    </div>`;
}

function renderComplete() {
  const game = state.game;
  const total = getTotal(game);
  return `
    <div class="app-shell screen-complete" style="padding-bottom:0">
      <main class="complete-hero">
        <section class="complete-card">
          <h1>Battle Complete</h1>
          <div class="winner">${esc(game.player.name)} vs ${esc(game.opponent.name)}</div>
          <div class="single-complete-score">
            <span>Your Final Score</span>
            <strong>${total}</strong>
            <small>Victory Points</small>
          </div>
          <p class="help">${esc(game.mission)} · ${formatTime(elapsedSeconds(game))}</p>
          <div class="btn-row" style="margin-top:14px">
            <button class="btn secondary" type="button" data-action="review-complete">Review Score</button>
            <button class="btn primary" type="button" data-action="new-game-after-complete">New Battle</button>
          </div>
        </section>
      </main>
    </div>`;
}

function undoLast() {
  const snapshot = state.undoStack.pop();
  if (!snapshot) {
    showToast('Nothing to undo.');
    return;
  }
  try {
    state.game = normalizeGame(JSON.parse(snapshot));
    saveState();
    render();
    showToast('Last game action undone.');
  } catch (error) {
    console.error(error);
    showToast('Could not restore the previous state.');
  }
}

function updateLiveTimer() {
  if (!state.game) return;
  document.querySelectorAll('[data-live-timer]').forEach(element => {
    element.textContent = formatTime(elapsedSeconds(state.game));
  });
}

app.addEventListener('submit', event => {
  if (event.target.id === 'new-game-form') {
    event.preventDefault();
    createGame(event.target);
  }
  if (event.target.id === 'score-form') {
    event.preventDefault();
    const data = new FormData(event.target);
    addScore(Number(data.get('amount')), String(data.get('category')), String(data.get('note') || '').trim());
    showToast('Scoring entry added.');
  }
  if (event.target.id === 'reminder-form') {
    event.preventDefault();
    const data = new FormData(event.target);
    state.reminders.push({
      id: uid('reminder'), title: String(data.get('title') || '').trim(), note: String(data.get('note') || '').trim(),
      phase: String(data.get('phase') || 'Any'), scope: String(data.get('scope') || 'any'),
      round: Math.max(0, Number(data.get('round') || 0)), enabled: true
    });
    saveState();
    render();
    showToast('Reminder saved.');
  }
});

app.addEventListener('input', event => {
  if (event.target.id === 'rules-search') {
    const cursor = event.target.selectionStart;
    ui.rulesQuery = event.target.value;
    render();
    requestAnimationFrame(() => {
      const input = document.getElementById('rules-search');
      if (input) { input.focus(); input.setSelectionRange(cursor, cursor); }
    });
  }
});

app.addEventListener('change', event => {
  const target = event.target;
  const action = target.dataset.action;
  if (action === 'phase-check') {
    const id = target.dataset.id;
    mutateGame(game => {
      game.phaseChecks[phaseKey(game)] ||= {};
      game.phaseChecks[phaseKey(game)][id] = target.checked;
    });
  }
  if (action === 'battle-reminder-check') {
    const id = target.dataset.id;
    mutateGame(game => {
      game.reminderChecks[phaseKey(game)] ||= {};
      game.reminderChecks[phaseKey(game)][id] = target.checked;
    });
  }
  if (action === 'round-reminder-check') {
    const id = target.dataset.id;
    mutateGame(game => {
      game.roundReminderChecks[game.round] ||= {};
      game.roundReminderChecks[game.round][id] = target.checked;
    });
  }
  if (action === 'toggle-reminder') {
    const reminder = state.reminders.find(item => item.id === target.dataset.id);
    if (reminder) reminder.enabled = target.checked;
    saveState();
    render();
  }
  if (action === 'toggle-auto-cp') {
    state.preferences.autoCommandCP = target.checked;
    saveState();
    if (target.checked && state.game?.phaseIndex === 0) {
      snapshotGame();
      grantCommandCP(state.game, true);
      saveState();
    }
    render();
  }
  if (target.id === 'import-file' && target.files?.[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        if (!imported || typeof imported !== 'object') throw new Error('Invalid backup');
        state = normalizeState(imported);
        saveState();
        ui.tab = state.game?.status === 'active' ? 'battle' : 'setup';
        render();
        showToast('Backup imported.');
      } catch (error) {
        console.error(error);
        showToast('That file is not a valid Warhammer Companion backup.');
      }
    };
    reader.readAsText(target.files[0]);
  }
});

app.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'tab') { ui.tab = button.dataset.tab; render(); return; }
  if (action === 'undo') { undoLast(); return; }
  if (action === 'quick-score') { addScore(Number(button.dataset.amount), 'Quick'); return; }
  if (action === 'quick-cp') { adjustCP(Number(button.dataset.amount)); return; }
  if (action === 'cycle-objective') { cycleObjective(Number(button.dataset.index)); return; }
  if (action === 'set-phase') {
    mutateGame(game => { game.phaseIndex = Number(button.dataset.index); grantCommandCP(game, true); });
    return;
  }
  if (action === 'next-phase') {
    if (isFinalTurnPhase()) {
      if (confirm('End the battle and record your final score?')) finishGame();
    } else {
      advancePhase();
    }
    return;
  }
  if (action === 'switch-turn') {
    if (confirm('Switch between Your Turn and Opponent Turn without advancing the phase? Use this only to correct the tracker.')) {
      mutateGame(game => { game.activeTurn = 1 - game.activeTurn; grantCommandCP(game, true); });
    }
    return;
  }
  if (action === 'dismiss-round-reminders') {
    mutateGame(game => {
      if (!game.dismissedRoundPopups.includes(game.round)) game.dismissedRoundPopups.push(game.round);
    }, { snapshot: false });
    return;
  }
  if (action === 'toggle-timer') {
    mutateGame(game => {
      if (game.timer.running) {
        game.timer.elapsed = elapsedSeconds(game);
        game.timer.running = false;
        game.timer.startedAt = null;
      } else {
        game.timer.running = true;
        game.timer.startedAt = Date.now();
      }
    });
    return;
  }
  if (action === 'reset-timer') {
    if (confirm('Reset the game timer to zero?')) mutateGame(game => { game.timer = { elapsed: 0, running: false, startedAt: null }; });
    return;
  }
  if (action === 'open-rules') {
    ui.tab = 'rules';
    ui.rulesCategory = 'All';
    ui.rulesQuery = button.dataset.query || '';
    render();
    requestAnimationFrame(() => document.getElementById('rules-search')?.focus());
    return;
  }
  if (action === 'rule-category') { ui.rulesCategory = button.dataset.category; render(); return; }
  if (action === 'calculate-wound') {
    const strength = Math.max(1, Number(document.getElementById('strength')?.value || 1));
    const toughness = Math.max(1, Number(document.getElementById('toughness')?.value || 1));
    let needed;
    if (strength >= toughness * 2) needed = '2+';
    else if (strength > toughness) needed = '3+';
    else if (strength === toughness) needed = '4+';
    else if (strength * 2 <= toughness) needed = '6+';
    else needed = '5+';
    ui.woundStrength = strength;
    ui.woundToughness = toughness;
    ui.woundResult = `S${strength} vs T${toughness}: wound on ${needed}`;
    render();
    return;
  }
  if (action === 'roll-dice') {
    const die = button.dataset.dice;
    if (die === 'd3') {
      const d6 = Math.floor(Math.random() * 6) + 1;
      ui.diceResult = `D3: ${Math.ceil(d6 / 2)} (D6 rolled ${d6})`;
    } else if (die === '2d6') {
      const a = Math.floor(Math.random() * 6) + 1;
      const b = Math.floor(Math.random() * 6) + 1;
      ui.diceResult = `2D6: ${a + b} (${a} + ${b})`;
    } else {
      ui.diceResult = `D6: ${Math.floor(Math.random() * 6) + 1}`;
    }
    render();
    return;
  }
  if (action === 'delete-score') {
    if (confirm('Delete this scoring entry?')) mutateGame(game => { game.scoreEvents = game.scoreEvents.filter(entry => entry.id !== button.dataset.id); });
    return;
  }
  if (action === 'delete-reminder') {
    if (confirm('Delete this reminder?')) {
      state.reminders = state.reminders.filter(item => item.id !== button.dataset.id);
      saveState();
      render();
    }
    return;
  }
  if (action === 'finish-game') {
    if (confirm('Finish this battle and record your current score?')) finishGame();
    return;
  }
  if (action === 'export-data') {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `warhammer-companion-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Backup exported.');
    return;
  }
  if (action === 'new-game') {
    if (confirm('Start a different battle? The current battle will be replaced. Export a backup first if needed.')) {
      state.game = null;
      state.undoStack = [];
      ui.tab = 'setup';
      saveState();
      render();
    }
    return;
  }
  if (action === 'clear-all') {
    if (confirm('Erase the active game, reminders, archives and settings from this device?')) {
      state = defaultState();
      ui.tab = 'setup';
      saveState();
      render();
    }
    return;
  }
  if (action === 'review-complete') {
    state.game.status = 'active';
    ui.tab = 'score';
    saveState();
    render();
    showToast('Battle reopened for review. Finish it again when done.');
    return;
  }
  if (action === 'new-game-after-complete') {
    state.game = null;
    state.undoStack = [];
    ui.tab = 'setup';
    saveState();
    render();
  }
});

setInterval(updateLiveTimer, 1000);
window.addEventListener('beforeunload', () => {
  if (state.game?.timer?.running) saveState();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(error => console.warn('Service worker registration failed.', error));
  });
}

render();
