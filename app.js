import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LEVEL_STEP = 120;
const rankNames = ["Rookie", "Momentum", "Focused Hero", "Streak Keeper", "Discipline Master", "Legend"];
const badgeDefinitions = [
  {
    key: "first-step",
    title: "First Step",
    description: "Complete your first check-in.",
    icon: "01",
    matches: ({ totalCheckIns }) => totalCheckIns >= 1,
  },
  {
    key: "triple-fire",
    title: "Three-Day Flame",
    description: "Reach a 3 day streak.",
    icon: "03",
    matches: ({ streak }) => streak >= 3,
  },
  {
    key: "week-streak",
    title: "Week Warrior",
    description: "Reach a 7 day streak.",
    icon: "07",
    matches: ({ streak }) => streak >= 7,
  },
  {
    key: "goal-grinder",
    title: "Goal Grinder",
    description: "Complete 10 total check-ins.",
    icon: "10",
    matches: ({ totalCheckIns }) => totalCheckIns >= 10,
  },
  {
    key: "achievement-hunter",
    title: "Achievement Hunter",
    description: "Unlock three badges.",
    icon: "AH",
    matches: ({ unlockedCount }) => unlockedCount >= 3,
  },
];

const state = {
  supabase: null,
  user: null,
  profile: null,
  goals: [],
  progress: [],
  achievements: [],
  authMode: "signup",
};

const elements = {
  authCard: document.getElementById("auth-card"),
  authForm: document.getElementById("auth-form"),
  authMessage: document.getElementById("auth-message"),
  authSubmit: document.getElementById("auth-submit"),
  modeButtons: [...document.querySelectorAll(".mode-button")],
  signupGoals: document.getElementById("signup-goals"),
  displayNameField: document.querySelector('[data-signup-only="true"]'),
  goalInputs: [...document.querySelectorAll(".goal-input")],
  appShell: document.getElementById("app-shell"),
  welcomeTitle: document.getElementById("welcome-title"),
  welcomeSubtitle: document.getElementById("welcome-subtitle"),
  dashboardMessage: document.getElementById("dashboard-message"),
  levelValue: document.getElementById("level-value"),
  rankLabel: document.getElementById("rank-label"),
  xpValue: document.getElementById("xp-value"),
  xpBar: document.getElementById("xp-bar"),
  xpCaption: document.getElementById("xp-caption"),
  streakValue: document.getElementById("streak-value"),
  checkinsValue: document.getElementById("checkins-value"),
  achievementCount: document.getElementById("achievement-count"),
  goalList: document.getElementById("goal-list"),
  achievementList: document.getElementById("achievement-list"),
  activityList: document.getElementById("activity-list"),
  progressForm: document.getElementById("progress-form"),
  progressGoal: document.getElementById("progress-goal"),
  progressNotes: document.getElementById("progress-notes"),
  logoutButton: document.getElementById("logout-button"),
  addGoalButton: document.getElementById("add-goal-button"),
  goalDialog: document.getElementById("goal-dialog"),
  goalForm: document.getElementById("goal-form"),
  goalTitle: document.getElementById("goal-title"),
  goalCategory: document.getElementById("goal-category"),
  goalXp: document.getElementById("goal-xp"),
  cancelGoalButton: document.getElementById("cancel-goal-button"),
};

boot();

async function boot() {
  try {
    const config = await fetchConfig();
    state.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    wireEvents();

    const {
      data: { session },
    } = await state.supabase.auth.getSession();

    state.supabase.auth.onAuthStateChange(async (_event, sessionValue) => {
      await handleSession(sessionValue);
    });

    await handleSession(session);
  } catch (error) {
    showAuthMessage(error.message, true);
  }
}

async function fetchConfig() {
  const response = await fetch("/api/env", { cache: "no-store" });
  const config = await response.json();

  if (!response.ok) {
    throw new Error(config.error || "Missing Supabase configuration.");
  }

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel before using the app.");
  }

  return config;
}

function wireEvents() {
  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setAuthMode(button.dataset.mode));
  });

  elements.authForm.addEventListener("submit", onAuthSubmit);
  elements.progressForm.addEventListener("submit", onProgressSubmit);
  elements.logoutButton.addEventListener("click", async () => {
    await state.supabase.auth.signOut();
  });
  elements.addGoalButton.addEventListener("click", () => {
    elements.goalDialog.showModal();
  });
  elements.cancelGoalButton.addEventListener("click", () => {
    elements.goalDialog.close();
  });
  elements.goalForm.addEventListener("submit", onGoalSubmit);
}

function setAuthMode(mode) {
  state.authMode = mode;
  const isSignup = mode === "signup";
  elements.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  elements.signupGoals.classList.toggle("hidden", !isSignup);
  elements.displayNameField.classList.toggle("hidden", !isSignup);
  elements.authSubmit.textContent = isSignup ? "Create account" : "Log in";
  elements.authMessage.textContent = "";
}

async function onAuthSubmit(event) {
  event.preventDefault();
  const form = new FormData(elements.authForm);
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "").trim();
  const displayName = String(form.get("displayName") || "").trim();
  const goals = elements.goalInputs.map((input) => input.value.trim()).filter(Boolean);

  try {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    if (state.authMode === "signup") {
      if (!displayName) {
        throw new Error("Add a display name to continue.");
      }
      if (!goals.length) {
        throw new Error("Add at least one goal during sign up.");
      }

      const { error } = await state.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            onboarding_goals: goals,
          },
        },
      });

      if (error) throw error;

      showAuthMessage("Account created. If email confirmation is enabled, confirm your email and then log in.", false);
      elements.authForm.reset();
    } else {
      const { error } = await state.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showAuthMessage("Logged in.", false);
    }
  } catch (error) {
    showAuthMessage(error.message, true);
  }
}

async function handleSession(session) {
  state.user = session?.user ?? null;

  if (!state.user) {
    elements.authCard.classList.remove("hidden");
    elements.appShell.classList.add("hidden");
    return;
  }

  elements.authCard.classList.add("hidden");
  elements.appShell.classList.remove("hidden");

  await ensureOnboarding();
  await loadDashboard();
}

async function ensureOnboarding() {
  const user = state.user;
  const metadata = user.user_metadata || {};

  const { data: profile } = await state.supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const { error } = await state.supabase.from("profiles").insert({
      id: user.id,
      display_name: metadata.display_name || user.email?.split("@")[0] || "Player One",
      xp: 0,
      level: 1,
      streak: 0,
      longest_streak: 0,
    });
    if (error) throw error;
  }

  const { data: existingGoals } = await state.supabase
    .from("goals")
    .select("id")
    .eq("user_id", user.id);

  if ((!existingGoals || !existingGoals.length) && Array.isArray(metadata.onboarding_goals) && metadata.onboarding_goals.length) {
    const goalRows = metadata.onboarding_goals.slice(0, 5).map((title, index) => ({
      user_id: user.id,
      title,
      category: suggestCategory(title),
      xp_reward: 25 + index * 5,
    }));
    const { error } = await state.supabase.from("goals").insert(goalRows);
    if (error) throw error;
  }
}

async function loadDashboard() {
  const userId = state.user.id;

  const [{ data: profile }, { data: goals }, { data: progress }, { data: achievements }] = await Promise.all([
    state.supabase.from("profiles").select("*").eq("id", userId).single(),
    state.supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    state.supabase.from("goal_progress").select("*").eq("user_id", userId).order("progress_date", { ascending: false }).order("created_at", { ascending: false }),
    state.supabase.from("achievements").select("*").eq("user_id", userId).order("unlocked_at", { ascending: false }),
  ]);

  state.profile = profile;
  state.goals = goals || [];
  state.progress = progress || [];
  state.achievements = achievements || [];

  await syncAchievements();
  renderDashboard();
}

function renderDashboard() {
  const totalCheckIns = state.progress.length;
  const xp = state.profile?.xp || 0;
  const level = state.profile?.level || 1;
  const streak = state.profile?.streak || 0;
  const currentLevelBase = (level - 1) * LEVEL_STEP;
  const progressInLevel = xp - currentLevelBase;
  const xpToNext = Math.max(level * LEVEL_STEP - xp, 0);
  const percent = Math.min((progressInLevel / LEVEL_STEP) * 100, 100);
  const displayName = state.profile?.display_name || state.user.email?.split("@")[0] || "Player";

  elements.welcomeTitle.textContent = `${displayName}, your mission board is live.`;
  elements.welcomeSubtitle.textContent = `${state.goals.length} active goals. Keep the chain moving today.`;
  elements.levelValue.textContent = String(level);
  elements.rankLabel.textContent = getRankLabel(level);
  elements.xpValue.textContent = String(xp);
  elements.xpBar.style.width = `${percent}%`;
  elements.xpCaption.textContent = `${xpToNext} XP to level ${level + 1}`;
  elements.streakValue.textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  elements.checkinsValue.textContent = String(totalCheckIns);
  elements.achievementCount.textContent = String(state.achievements.length);

  renderGoalList();
  renderGoalSelect();
  renderAchievements();
  renderActivity();
}

function renderGoalList() {
  if (!state.goals.length) {
    elements.goalList.innerHTML = '<div class="empty-state">No goals yet. Add a new quest to begin earning XP.</div>';
    return;
  }

  elements.goalList.innerHTML = state.goals
    .map((goal) => {
      const completedToday = state.progress.some((entry) => entry.goal_id === goal.id && entry.progress_date === todayKey());
      const totalForGoal = state.progress.filter((entry) => entry.goal_id === goal.id).length;
      return `
        <article class="goal-card">
          <div class="goal-card-header">
            <div>
              <strong>${escapeHtml(goal.title)}</strong>
              <p class="goal-meta">${escapeHtml(goal.category || "General")} quest</p>
            </div>
            <span class="goal-chip">${goal.xp_reward || 20} XP</span>
          </div>
          <div class="goal-card-footer">
            <div class="badge-grid">
              <span class="badge-chip">${totalForGoal} clears</span>
              <span class="badge-chip">${completedToday ? "Done today" : "Ready today"}</span>
            </div>
            <button class="goal-action" type="button" data-goal-id="${goal.id}">${completedToday ? "Logged" : "Quick complete"}</button>
          </div>
        </article>
      `;
    })
    .join("");

  elements.goalList.querySelectorAll("[data-goal-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      elements.progressGoal.value = button.dataset.goalId;
      elements.progressNotes.value = "";
      await createProgress(button.dataset.goalId, "");
    });
  });
}

function renderGoalSelect() {
  elements.progressGoal.innerHTML = state.goals
    .map((goal) => `<option value="${goal.id}">${escapeHtml(goal.title)} (${goal.xp_reward || 20} XP)</option>`)
    .join("");
}

function renderAchievements() {
  if (!state.achievements.length) {
    const locked = badgeDefinitions
      .slice(0, 3)
      .map(
        (badge) => `
          <article class="achievement-card locked">
            <strong>${badge.icon} ${badge.title}</strong>
            <p>${badge.description}</p>
          </article>
        `
      )
      .join("");
    elements.achievementList.innerHTML = `${locked}<div class="empty-state">Your first badge unlocks after the first completed check-in.</div>`;
    return;
  }

  elements.achievementList.innerHTML = state.achievements
    .map(
      (badge) => `
        <article class="achievement-card">
          <strong>${escapeHtml(badge.icon || "++")} ${escapeHtml(badge.title)}</strong>
          <p>${escapeHtml(badge.description)}</p>
        </article>
      `
    )
    .join("");
}

function renderActivity() {
  if (!state.progress.length) {
    elements.activityList.innerHTML = '<div class="empty-state">No progress logged yet. Complete a quest to start the timeline.</div>';
    return;
  }

  elements.activityList.innerHTML = state.progress
    .slice(0, 8)
    .map((entry) => {
      const goal = state.goals.find((item) => item.id === entry.goal_id);
      return `
        <article class="activity-item">
          <div class="activity-head">
            <strong>${escapeHtml(goal?.title || "Goal")}</strong>
            <span class="badge-chip">${entry.xp_earned || 0} XP</span>
          </div>
          <p class="activity-note">${escapeHtml(entry.notes || "Progress logged.")}</p>
          <p class="goal-meta">${formatDate(entry.progress_date)}</p>
        </article>
      `;
    })
    .join("");
}

async function onProgressSubmit(event) {
  event.preventDefault();
  const goalId = elements.progressGoal.value;
  const notes = elements.progressNotes.value.trim();
  await createProgress(goalId, notes);
}

async function createProgress(goalId, notes) {
  try {
    const goal = state.goals.find((item) => item.id === goalId);
    if (!goal) {
      throw new Error("Choose a goal first.");
    }

    const existingToday = state.progress.find((entry) => entry.goal_id === goalId && entry.progress_date === todayKey());
    if (existingToday) {
      showAuthMessage("That goal is already logged for today.", true);
      return;
    }

    const { error } = await state.supabase.from("goal_progress").insert({
      user_id: state.user.id,
      goal_id: goalId,
      progress_date: todayKey(),
      notes,
      xp_earned: goal.xp_reward || 20,
    });

    if (error) throw error;

    await recalculateProfile();
    await loadDashboard();
    elements.progressForm.reset();
    showAuthMessage("XP claimed.", false);
  } catch (error) {
    showAuthMessage(error.message, true);
  }
}

async function recalculateProfile() {
  const { data: entries, error } = await state.supabase
    .from("goal_progress")
    .select("progress_date, xp_earned")
    .eq("user_id", state.user.id)
    .order("progress_date", { ascending: true });

  if (error) throw error;

  const totalXp = (entries || []).reduce((sum, entry) => sum + (entry.xp_earned || 0), 0);
  const uniqueDays = [...new Set((entries || []).map((entry) => entry.progress_date))];
  const streak = calculateStreak(uniqueDays);
  const level = Math.max(Math.floor(totalXp / LEVEL_STEP) + 1, 1);

  const { error: updateError } = await state.supabase
    .from("profiles")
    .update({
      xp: totalXp,
      level,
      streak,
      longest_streak: Math.max(state.profile?.longest_streak || 0, streak),
      last_check_in: uniqueDays.at(-1) || null,
    })
    .eq("id", state.user.id);

  if (updateError) throw updateError;
}

async function syncAchievements() {
  const totalCheckIns = state.progress.length;
  const unlockedSet = new Set(state.achievements.map((item) => item.key));
  const unlockedCount = state.achievements.length;
  const streak = state.profile?.streak || 0;

  const pending = badgeDefinitions.filter((badge) =>
    !unlockedSet.has(badge.key) &&
    badge.matches({ totalCheckIns, streak, unlockedCount })
  );

  if (!pending.length) return;

  const rows = pending.map((badge) => ({
    user_id: state.user.id,
    key: badge.key,
    title: badge.title,
    description: badge.description,
    icon: badge.icon,
  }));

  const { error } = await state.supabase.from("achievements").insert(rows);
  if (error) throw error;

  const { data: refreshed } = await state.supabase
    .from("achievements")
    .select("*")
    .eq("user_id", state.user.id)
    .order("unlocked_at", { ascending: false });

  state.achievements = refreshed || [];
}

async function onGoalSubmit(event) {
  event.preventDefault();

  try {
    const payload = {
      user_id: state.user.id,
      title: elements.goalTitle.value.trim(),
      category: elements.goalCategory.value,
      xp_reward: Number(elements.goalXp.value || 25),
    };

    if (!payload.title) {
      throw new Error("Add a title for the goal.");
    }

    const { error } = await state.supabase.from("goals").insert(payload);
    if (error) throw error;

    elements.goalDialog.close();
    elements.goalForm.reset();
    await loadDashboard();
  } catch (error) {
    showAuthMessage(error.message, true);
  }
}

function calculateStreak(uniqueDays) {
  if (!uniqueDays.length) return 0;

  const dates = uniqueDays.map((day) => new Date(`${day}T00:00:00`)).sort((a, b) => a - b);
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let index = dates.length - 1; index >= 0; index -= 1) {
    const entryDate = dates[index];
    const diff = Math.round((cursor - entryDate) / 86400000);
    if (diff === 0) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (diff === 1 && streak === 0) {
      streak += 1;
      cursor = new Date(entryDate);
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    break;
  }

  return streak;
}

function suggestCategory(title) {
  const value = title.toLowerCase();
  if (/(gym|fitness|run|workout|exercise)/.test(value)) return "Fitness";
  if (/(cert|course|study|read|learn|exam)/.test(value)) return "Learning";
  if (/(career|job|portfolio)/.test(value)) return "Career";
  if (/(sleep|water|health|walk)/.test(value)) return "Health";
  return "Mindset";
}

function getRankLabel(level) {
  return rankNames[Math.min(level - 1, rankNames.length - 1)];
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function showAuthMessage(message, isError) {
  const color = isError ? "#ffb4b4" : "rgba(245, 245, 247, 0.72)";
  elements.authMessage.textContent = message;
  elements.authMessage.style.color = color;
  elements.dashboardMessage.textContent = message;
  elements.dashboardMessage.style.color = color;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
