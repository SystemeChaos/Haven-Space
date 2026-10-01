/**
 * nativeReminders.ts — Haven Space
 *
 * Rappels PROGRAMMÉS nativement (Android/iOS via Capacitor LocalNotifications) pour tout ce qui est
 * prévisible à l'avance : Planning, Traitements, Hydratation, Sauvegarde. Une fois programmés, c'est
 * le système (AlarmManager) qui les déclenche : ils sonnent même app fermée depuis des jours, ce
 * qu'un setInterval JavaScript ne peut pas faire (le JS ne tourne plus quand l'app est fermée).
 *
 * Principe : `buildReminders` (pure, testable) calcule la liste COMPLÈTE de ce qui doit être
 * programmé à partir des données ; `syncNativeReminders` remplace l'ancien programme par le
 * nouveau (annule nos rappels, reprogramme). On resynchronise à chaque changement : pas d'état
 * à garder à jour, pas de rappel orphelin.
 *
 * Sur le web/PWA, rien de tout ça ne s'applique (isNativeApp() = false) : l'ancien mécanisme à
 * base de setInterval reste en place dans App.tsx.
 */

export type ReminderTarget = 'planning' | 'health' | 'hydration' | 'backup';
export type ReminderChannel = 'planning' | 'meds' | 'hydration' | 'backup';
type Lang = 'fr' | 'en';

export const isNativeApp = (): boolean => {
  try {
    const cap = (window as any).Capacitor;
    return !!cap && !!cap.isNativePlatform?.();
  } catch {
    return false;
  }
};

// --- Réglages ---------------------------------------------------------------------------------
// Plage d'identifiants réservée à nos rappels : on n'annule jamais que celle-ci, jamais les
// notifications immédiates (messages, switch) qui ont des ids aléatoires.
const ID_BASE = 700_000_000;
const ID_SPAN = 100_000;
// iOS plafonne à 64 notifications en attente ; on reste en dessous pour rester portable.
const MAX_REMINDERS = 60;
const HYDRO_START_HOUR = 8;
const HYDRO_END_HOUR = 22;
const HYDRO_MIN_INTERVAL_MIN = 30; // en natif : pas de rafale de rappels fixes (l'app ouverte n'a plus la main)
const HYDRO_MAX_SLOTS = 20;
const BACKUP_HOUR = 10;
const BACKUP_AFTER_DAYS = 7;
const BACKUP_NAG_DAYS = 14; // nombre de relances quotidiennes programmées à l'avance
const MIN_LEAD_MS = 5000;   // on ne programme pas ce qui est à moins de 5 s

// --- Types d'entrée (structurels : ni App.tsx ni PlanningPage ne sont importés) -----------------
export interface ReminderMedication {
  id: string;
  name: string;
  dosage?: string;
  times: { time: string }[];
  recurring?: boolean;
  oneTimeDate?: string;
}
export interface ReminderPlanningEntry {
  id: string;
  date: string;
  time?: string | null;
  text: string;
  reminderMinutes?: number | null;
}
export interface ReminderInput {
  lang: Lang;
  /** Détails (nom du traitement, texte du planning) dans la notification. Sinon : texte neutre. */
  showDetails: boolean;
  now: number;
  planning: ReminderPlanningEntry[];
  medications: ReminderMedication[];
  hydration: { on: boolean; intervalMinutes: number };
  backup: { hasData: boolean; lastExportMs: number };
}

export interface PlannedReminder {
  key: string;
  channel: ReminderChannel;
  target: ReminderTarget;
  title: string;
  body: string;
  /** Déclenchement unique (timestamp ms). */
  at?: number;
  /** Ou : tous les jours à cette heure locale. */
  daily?: { hour: number; minute: number };
}

// --- Utilitaires -------------------------------------------------------------------------------
function parseHM(value: string | undefined): { hh: number; mm: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec((value || '').trim());
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh > 23 || mm > 59) return null;
  return { hh, mm };
}

function localTimestamp(dateStr: string, hh: number, mm: number): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((dateStr || '').trim());
  if (!m) return null;
  const t = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), hh, mm, 0, 0).getTime();
  return Number.isNaN(t) ? null : t;
}

const pad = (n: number) => String(n).padStart(2, '0');

// --- Construction du programme (pure) ----------------------------------------------------------
export function buildReminders(input: ReminderInput): PlannedReminder[] {
  const { lang, showDetails, now } = input;
  const fr = lang === 'fr';
  const earliest = now + MIN_LEAD_MS;

  const meds: PlannedReminder[] = [];
  const backup: PlannedReminder[] = [];
  const hydro: PlannedReminder[] = [];
  const planning: PlannedReminder[] = [];

  // Traitements : un seul rappel par créneau horaire, même si plusieurs traitements tombent à la même heure.
  const dailySlots = new Map<string, string[]>();   // "HH:MM" -> libellés
  const oneShotSlots = new Map<number, string[]>(); // timestamp -> libellés
  for (const med of input.medications) {
    const label = med.dosage ? `${med.name} — ${med.dosage}` : med.name;
    const oneTime = !med.recurring && !!med.oneTimeDate;
    for (const slot of med.times || []) {
      const hm = parseHM(slot.time);
      if (!hm) continue;
      if (oneTime) {
        const at = localTimestamp(med.oneTimeDate as string, hm.hh, hm.mm);
        if (at === null || at < earliest) continue;
        oneShotSlots.set(at, [...(oneShotSlots.get(at) || []), label]);
      } else {
        const k = `${pad(hm.hh)}:${pad(hm.mm)}`;
        dailySlots.set(k, [...(dailySlots.get(k) || []), label]);
      }
    }
  }
  const medTitle = fr ? '✦ Rappel de traitement' : '✦ Medication reminder';
  const medBody = (labels: string[]) =>
    showDetails ? labels.join(' · ') : (fr ? "C'est l'heure de ton traitement" : 'Time for your medication');
  for (const [k, labels] of dailySlots) {
    const hm = parseHM(k) as { hh: number; mm: number };
    meds.push({ key: `med-daily-${k}`, channel: 'meds', target: 'health', title: medTitle, body: medBody(labels), daily: { hour: hm.hh, minute: hm.mm } });
  }
  for (const [at, labels] of oneShotSlots) {
    meds.push({ key: `med-once-${at}`, channel: 'meds', target: 'health', title: medTitle, body: medBody(labels), at });
  }

  // Sauvegarde : si ça fait plus de 7 jours → une relance par jour à 10h ; sinon relances programmées
  // à partir du jour où ça dépassera 7 jours. Un export remet le compteur à zéro (resynchronisation).
  if (input.backup.hasData) {
    const title = fr ? '✦ Pense à sauvegarder' : '✦ Backup reminder';
    const body = fr
      ? "Ça fait un moment que tu n'as pas exporté ton système en JSON — c'est ta seule sauvegarde."
      : "It's been a while since your last JSON export — it's your only backup.";
    const dueMs = input.backup.lastExportMs + BACKUP_AFTER_DAYS * 86400000;
    if (dueMs <= now) {
      backup.push({ key: 'backup-daily', channel: 'backup', target: 'backup', title, body, daily: { hour: BACKUP_HOUR, minute: 0 } });
    } else {
      const due = new Date(dueMs);
      for (let d = 0; d < BACKUP_NAG_DAYS + 1; d++) {
        const at = new Date(due.getFullYear(), due.getMonth(), due.getDate() + d, BACKUP_HOUR, 0, 0, 0).getTime();
        if (at < dueMs || at < earliest) continue;
        backup.push({ key: `backup-${at}`, channel: 'backup', target: 'backup', title, body, at });
        if (backup.length >= BACKUP_NAG_DAYS) break;
      }
    }
  }

  // Hydratation : créneaux fixes tous les jours entre 8h et 22h (le « depuis le dernier verre »
  // dynamique de la version web demande que le JS tourne, ce qui n'est pas le cas app fermée).
  if (input.hydration.on) {
    // Au moins 30 min d'écart, et jamais plus de HYDRO_MAX_SLOTS créneaux dans la journée : sans ça, un
    // intervalle court couperait le programme en milieu d'après-midi au lieu de le répartir jusqu'au soir.
    const windowMin = (HYDRO_END_HOUR - HYDRO_START_HOUR) * 60;
    const interval = Math.max(HYDRO_MIN_INTERVAL_MIN, Math.ceil(windowMin / HYDRO_MAX_SLOTS), Math.round(input.hydration.intervalMinutes || 0));
    const title = fr ? "✦ Rappel d'hydratation" : '✦ Hydration reminder';
    const body = fr
      ? 'Ton jardin a soif — et toi, tu as bu récemment ? Va arroser une graine 💧'
      : 'Your garden is thirsty — have you had water lately? Go water a seed 💧';
    for (let m = HYDRO_START_HOUR * 60, n = 0; m < HYDRO_END_HOUR * 60 && n < HYDRO_MAX_SLOTS; m += interval, n++) {
      hydro.push({
        key: `hydro-${m}`, channel: 'hydration', target: 'hydration', title, body,
        daily: { hour: Math.floor(m / 60), minute: m % 60 },
      });
    }
  }

  // Planning : une notification unique à (heure de l'entrée − délai de rappel), seulement dans le futur.
  for (const en of input.planning) {
    if (!en.time || !en.reminderMinutes || en.reminderMinutes <= 0) continue;
    const hm = parseHM(en.time);
    if (!hm) continue;
    const target = localTimestamp(en.date, hm.hh, hm.mm);
    if (target === null) continue;
    const at = target - en.reminderMinutes * 60000;
    if (at < earliest) continue;
    planning.push({
      key: `planning-${en.id}`,
      channel: 'planning',
      target: 'planning',
      title: fr ? '✦ Rappel de planning' : '✦ Planning reminder',
      body: showDetails
        ? `${en.time} — ${en.text}`
        : (fr ? `Quelque chose est prévu à ${en.time}` : `Something is planned at ${en.time}`),
      at,
    });
  }
  planning.sort((a, b) => (a.at as number) - (b.at as number));

  // Ordre de priorité si on dépasse le plafond : traitements, sauvegarde, hydratation, puis planning
  // du plus proche au plus lointain (les plus lointains seront reprogrammés à l'ouverture suivante).
  return [...meds, ...backup, ...hydro, ...planning].slice(0, MAX_REMINDERS);
}

/** Empreinte du programme : permet de ne rien reprogrammer quand rien n'a changé. */
export const reminderSignature = (reminders: PlannedReminder[]): string => JSON.stringify(reminders);

// --- Synchronisation avec le système ------------------------------------------------------------
const CHANNEL_META: Record<ReminderChannel, { fr: string; en: string }> = {
  planning:  { fr: 'Rappels de planning',   en: 'Planning reminders' },
  meds:      { fr: 'Rappels de traitement', en: 'Medication reminders' },
  hydration: { fr: "Rappels d'hydratation", en: 'Hydration reminders' },
  backup:    { fr: 'Rappels de sauvegarde', en: 'Backup reminders' },
};
const channelId = (c: ReminderChannel) => `hs-${c}`;

// Un seul sync à la fois : deux « annule puis reprogramme » qui s'entremêlent perdraient des rappels.
let queue: Promise<unknown> = Promise.resolve();
const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
};

async function plugin() {
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  return LocalNotifications;
}

async function cancelOurs(LN: Awaited<ReturnType<typeof plugin>>) {
  const pending = await LN.getPending();
  const ours = pending.notifications.filter(n => n.id >= ID_BASE && n.id < ID_BASE + ID_SPAN);
  if (ours.length > 0) await LN.cancel({ notifications: ours.map(n => ({ id: n.id })) });
}

export function cancelAllNativeReminders(): Promise<void> {
  return enqueue(async () => {
    try {
      await cancelOurs(await plugin());
    } catch (e) {
      console.warn('[Haven Space] Annulation des rappels natifs impossible :', e);
    }
  });
}

export interface SyncResult { scheduled: number; permission: boolean }

export function syncNativeReminders(reminders: PlannedReminder[], lang: Lang): Promise<SyncResult> {
  return enqueue(async () => {
    const LN = await plugin();
    const perm = await LN.checkPermissions();
    if (perm.display !== 'granted') return { scheduled: 0, permission: false };

    // Canaux Android (un par type de rappel : l'utilisateur peut couper l'hydratation sans toucher aux traitements).
    // On n'utilise un canal que s'il a bien été créé : sur Android 8+, un canal inexistant = notification muette.
    const okChannels = new Set<ReminderChannel>();
    for (const c of Object.keys(CHANNEL_META) as ReminderChannel[]) {
      try {
        await LN.createChannel({ id: channelId(c), name: CHANNEL_META[c][lang], importance: 4, vibration: true });
        okChannels.add(c);
      } catch { /* iOS/web : pas de canaux, c'est normal */ }
    }

    await cancelOurs(LN);
    if (reminders.length === 0) return { scheduled: 0, permission: true };

    await LN.schedule({
      notifications: reminders.map((r, i) => ({
        id: ID_BASE + i,
        title: r.title,
        body: r.body,
        ...(okChannels.has(r.channel) ? { channelId: channelId(r.channel) } : {}),
        schedule: r.at !== undefined
          ? { at: new Date(r.at), allowWhileIdle: true }
          : { on: { hour: r.daily!.hour, minute: r.daily!.minute }, allowWhileIdle: true },
        extra: { hsReminder: true, hsTarget: r.target },
      })),
    });
    return { scheduled: reminders.length, permission: true };
  });
}

// --- Alarmes exactes (Android 12+) ---------------------------------------------------------------
export type ExactAlarmStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

/** Sans « Alarmes et rappels » autorisé, Android peut retarder les rappels de plusieurs minutes. */
export async function getExactAlarmStatus(): Promise<ExactAlarmStatus> {
  try {
    const LN = await plugin();
    const res = await LN.checkExactNotificationSetting();
    const s = res.exact_alarm as string;
    return s === 'granted' ? 'granted' : s === 'denied' ? 'denied' : 'prompt';
  } catch {
    return 'unsupported';
  }
}

export async function openExactAlarmSettings(): Promise<void> {
  try {
    const LN = await plugin();
    await LN.changeExactNotificationSetting();
  } catch (e) {
    console.warn('[Haven Space] Ouverture des réglages « alarmes exactes » impossible :', e);
  }
}
