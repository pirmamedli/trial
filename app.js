const appShell = document.querySelector(".app-shell");
const splash = document.querySelector("#splash");
const auth = document.querySelector("#auth");
const portal = document.querySelector("#portal");
const authForm = document.querySelector("#auth-form");
const studentName = document.querySelector("#student-name");
const studentGroup = document.querySelector("#student-group");
const friendCode = document.querySelector("#friend-code");
const profileName = document.querySelector("#profile-name");
const leaderName = document.querySelector("#leader-name");
const avatarButton = document.querySelector("#logout-button");
const copyCode = document.querySelector("#copy-code");
const navLinks = document.querySelectorAll(".bottom-nav a");
const appViews = document.querySelectorAll(".app-view");
const viewStack = document.querySelector(".view-stack");
const todayProgress = document.querySelector("#today-progress");
const examPanel = document.querySelector("#exam-panel");
const openCalendar = document.querySelector("#open-calendar");
const closeCalendar = document.querySelector("#close-calendar");
const closeSubject = document.querySelector("#close-subject");
const rankButtons = document.querySelectorAll(".rank-ladder button");
const rankNote = document.querySelector("#rank-note");
const planItems = document.querySelectorAll(".plan-item");
const xpToast = document.querySelector("#xp-toast");
const contentImport = document.querySelector("#content-import");

const prepList = document.querySelector("#prep-list");
const subjectGrid = document.querySelector("#subject-grid");
const subjectsCount = document.querySelector("#subjects-count");
const taskList = document.querySelector("#task-list");
const weakTopicList = document.querySelector("#weak-topic-list");
const profileProgressList = document.querySelector("#profile-progress-list");
const subjectTitle = document.querySelector("#subject-title");
const subjectDetailIcon = document.querySelector("#subject-detail-icon");
const subjectDetailFocus = document.querySelector("#subject-detail-focus");
const subjectDetailName = document.querySelector("#subject-detail-name");
const subjectDetailMeta = document.querySelector("#subject-detail-meta");
const subjectDetailProgress = document.querySelector("#subject-detail-progress");
const subjectTaskCount = document.querySelector("#subject-task-count");
const subjectTaskList = document.querySelector("#subject-task-list");
const subjectWeakList = document.querySelector("#subject-weak-list");

const dynamicTest = {
  screen: document.querySelector("#dynamic-test-screen"),
  close: document.querySelector("#close-dynamic-test"),
  subtitle: document.querySelector("#dynamic-test-subtitle"),
  title: document.querySelector("#dynamic-test-title"),
  step: document.querySelector("#dynamic-test-step"),
  progressBar: document.querySelector("#dynamic-test-progress-bar"),
  questionText: document.querySelector("#dynamic-test-question-text"),
  answerList: document.querySelector("#dynamic-answer-list"),
  feedback: document.querySelector("#dynamic-answer-feedback"),
  prev: document.querySelector("#dynamic-prev-question"),
  next: document.querySelector("#dynamic-next-question"),
  result: document.querySelector("#dynamic-test-result"),
  resultTitle: document.querySelector("#dynamic-result-title"),
  resultPercent: document.querySelector("#dynamic-result-percent"),
  resultCorrect: document.querySelector("#dynamic-result-correct"),
  resultXp: document.querySelector("#dynamic-result-xp"),
  resultRankLeft: document.querySelector("#dynamic-result-rank-left"),
  resultRankProgress: document.querySelector("#dynamic-result-rank-progress"),
  repeat: document.querySelector("#dynamic-repeat-mistakes"),
  nextTest: document.querySelector("#dynamic-next-test")
};

const storageKey = "studyfyAccount";
const progressKey = "studyfyProgress";
const contentKey = "studyfyContentOverrides";

const rankScale = [
  { title: "Новичок", xp: 0, icon: "N" },
  { title: "Ученик", xp: 120, icon: "U" },
  { title: "Исследователь", xp: 260, icon: "I" },
  { title: "Знаток", xp: 420, icon: "Z" },
  { title: "Эксперт", xp: 620, icon: "E" },
  { title: "Магистр", xp: 820, icon: "M" },
  { title: "Профессор", xp: 980, icon: "P" },
  { title: "Академик", xp: 1160, icon: "A" }
];

const defaultProgress = {
  xp: 840,
  streak: 25,
  correct: 545,
  wrong: 86,
  tasksDone: 128,
  testsDone: 18,
  completedTasks: []
};

const readJson = (key, fallback = null) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getSavedAccount = () => readJson(storageKey);
const getProgress = () => ({ ...defaultProgress, ...readJson(progressKey, {}) });
const saveProgress = (progress) => writeJson(progressKey, progress);

const mergeContent = (base, extra) => {
  const merged = {
    subjects: [...(base.subjects || [])],
    tests: { ...(base.tests || {}) },
    tasks: [...(base.tasks || [])]
  };

  if (!extra) return merged;

  if (Array.isArray(extra.subjects)) {
    extra.subjects.forEach((subject) => {
      const index = merged.subjects.findIndex((item) => item.id === subject.id);
      if (index >= 0) merged.subjects[index] = { ...merged.subjects[index], ...subject };
      else merged.subjects.push(subject);
    });
  }

  if (extra.tests && typeof extra.tests === "object") {
    merged.tests = { ...merged.tests, ...extra.tests };
  }

  if (Array.isArray(extra.tasks)) {
    extra.tasks.forEach((task) => {
      const index = merged.tasks.findIndex((item) => item.id === task.id);
      if (index >= 0) merged.tasks[index] = { ...merged.tasks[index], ...task };
      else merged.tasks.push(task);
    });
  }

  return merged;
};

let appData = mergeContent(window.STUDIFY_CONTENT || {}, readJson(contentKey));

const getSubject = (id) => appData.subjects.find((subject) => subject.id === id) || appData.subjects[0];
const getTest = (id) => appData.tests[id];
const getTaskByTest = (testId) => appData.tasks.find((task) => task.testId === testId);

const getRankInfo = (xp = getProgress().xp) => {
  const currentIndex = rankScale.reduce((best, rank, index) => (xp >= rank.xp ? index : best), 0);
  const current = rankScale[currentIndex];
  const next = rankScale[currentIndex + 1] || current;
  const previousXp = current.xp;
  const nextXp = next.xp;
  const span = Math.max(1, nextXp - previousXp);
  const progress = current === next ? 100 : Math.min(100, Math.round(((xp - previousXp) / span) * 100));
  const left = current === next ? 0 : Math.max(0, nextXp - xp);
  return { current, next, progress, left };
};

const setScreen = (screen) => {
  appShell.classList.remove("is-auth", "is-portal");
  appShell.classList.add(`is-${screen}`);
  auth.setAttribute("aria-hidden", screen === "auth" ? "false" : "true");
  portal.setAttribute("aria-hidden", screen === "portal" ? "false" : "true");
};

const viewMap = {
  home: "home-screen",
  subject: "subject-screen",
  tasks: "tasks-screen",
  calendar: "calendar-screen",
  rating: "rating-screen",
  materials: "materials-screen",
  profile: "settings-screen",
  settings: "settings-screen",
  test: "dynamic-test-screen"
};

const routeAliases = {
  portal: "home",
  "tasks-title": "tasks",
  "calendar-title": "calendar",
  "leaderboard-title": "rating",
  "materials-title": "materials",
  "profile-title": "profile",
  "settings-title": "profile",
  settings: "profile",
  "accent-test": "test-accent",
  "history-test": "test-historyTrial1"
};

const getHash = () => window.location.hash.replace("#", "");

const parseRoute = () => {
  const raw = routeAliases[getHash()] || getHash();
  if (raw.startsWith("subject-")) return { route: "subject", id: raw.replace("subject-", "") };
  if (raw.startsWith("test-")) return { route: "test", id: raw.replace("test-", "") };
  return { route: viewMap[raw] ? raw : "home", id: null };
};

const renderAccount = (account) => {
  const firstName = account.name.trim().split(" ")[0] || "Ученик";
  const classCode = account.code && account.code !== "STUDY-7B" ? account.code : "EGE-2026";
  profileName.textContent = firstName;
  leaderName.textContent = firstName;
  avatarButton.textContent = firstName.slice(0, 1).toUpperCase();
  copyCode.textContent = `Код: ${classCode}`;
};

const renderProgressState = () => {
  const progress = getProgress();
  const rank = getRankInfo(progress.xp);
  const profileStripItems = document.querySelectorAll(".profile-strip strong");
  const profileTitle = document.querySelector("#profile-card-title");
  const profileCardText = document.querySelector(".profile-card > div > span");
  const metrics = document.querySelectorAll(".profile-metrics article strong");

  if (profileStripItems[0]) profileStripItems[0].textContent = rank.current.title;
  if (profileStripItems[2]) profileStripItems[2].textContent = `${progress.streak} дней`;
  if (profileTitle) profileTitle.textContent = `${rank.current.title} · ${progress.xp} XP`;
  if (profileCardText) profileCardText.textContent = `Серия ${progress.streak} дней, ${progress.tasksDone} заданий и ${progress.testsDone} тестов`;
  if (metrics[0]) metrics[0].textContent = progress.tasksDone;
  if (metrics[1]) metrics[1].textContent = progress.testsDone;
  if (metrics[2]) metrics[2].textContent = `${Math.round((progress.correct / Math.max(1, progress.correct + progress.wrong)) * 100)}%`;

  if (rankNote) {
    rankNote.textContent = `${rank.current.title}: ${progress.xp} очков, серия ${progress.streak} дней. До звания “${rank.next.title}” осталось ${rank.left} XP.`;
  }
};

const subjectProgress = (subject) => `
  <article style="--value: ${subject.progress}%">
    <div><img src="${subject.icon}" alt="" aria-hidden="true"><strong>${subject.title}</strong><span>${subject.progress}%</span></div>
    <progress max="100" value="${subject.progress}">${subject.progress}%</progress>
  </article>
`;

const profileSubjectProgress = (subject) => `
  <article>
    <img src="${subject.icon}" alt="" aria-hidden="true">
    <strong>${subject.title}</strong>
    <span>${subject.progress}%</span>
    <progress max="100" value="${subject.progress}">${subject.progress}%</progress>
  </article>
`;

const renderSubjects = () => {
  if (subjectsCount) subjectsCount.textContent = `${appData.subjects.length} предметов`;
  if (prepList) prepList.innerHTML = appData.subjects.map(subjectProgress).join("");
  if (profileProgressList) profileProgressList.innerHTML = appData.subjects.map(profileSubjectProgress).join("");

  if (subjectGrid) {
    subjectGrid.innerHTML = appData.subjects.map((subject) => `
      <button class="subject-card" type="button" data-subject-id="${subject.id}">
        <span class="subject-icon"><img src="${subject.icon}" alt="" aria-hidden="true"></span>
        <strong>${subject.title}</strong>
      </button>
    `).join("");

    subjectGrid.querySelectorAll("[data-subject-id]").forEach((card) => {
      card.addEventListener("click", () => {
        window.location.hash = `#subject-${card.dataset.subjectId}`;
        activateNavLink();
      });
    });
  }
};

const taskButton = (task) => {
  const subject = getSubject(task.subjectId);
  const progress = getProgress();
  const isDone = progress.completedTasks.includes(task.id);

  return `
    <button class="task-item task-button ${isDone ? "is-done" : ""}" type="button" data-task-id="${task.id}">
      <time datetime="${task.date || ""}">${task.day || "Сегодня"}</time>
      <img src="${subject.icon}" alt="" aria-hidden="true">
      <strong>${task.title}</strong>
      <span>${isDone ? "✓ готово" : `+${task.xp || 10} XP`}</span>
    </button>
  `;
};

const bindTaskButtons = (root) => {
  root.querySelectorAll("[data-task-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = appData.tasks.find((item) => item.id === button.dataset.taskId);
      if (!task) return;
      if (task.testId && getTest(task.testId)) {
        openTest(task.testId);
        return;
      }
      completeTask(task, task.xp || 10);
    });
  });
};

const renderTasks = () => {
  if (!taskList) return;
  taskList.innerHTML = appData.tasks.map(taskButton).join("");
  bindTaskButtons(taskList);
};

const renderWeakTopics = () => {
  if (!weakTopicList) return;
  weakTopicList.innerHTML = appData.subjects.slice(0, 6).map((subject) => {
    const topic = subject.weakTopics?.[0] || subject.focus;
    const value = Math.max(30, Math.min(76, subject.progress + 5));
    return `
      <article>
        <img src="${subject.icon}" alt="" aria-hidden="true">
        <strong>${topic}</strong>
        <span>${value}%</span>
        <progress max="100" value="${value}">${value}%</progress>
      </article>
    `;
  }).join("");
};

const renderSubjectScreen = (subjectId) => {
  const subject = getSubject(subjectId);
  const tasks = appData.tasks.filter((task) => task.subjectId === subject.id);
  subjectTitle.textContent = subject.title;
  subjectDetailIcon.src = subject.icon;
  subjectDetailFocus.textContent = subject.focus;
  subjectDetailName.textContent = subject.title;
  subjectDetailMeta.textContent = `${subject.progress}% подготовки · ${subject.tasksDone} заданий`;
  subjectDetailProgress.value = subject.progress;
  subjectDetailProgress.textContent = `${subject.progress}%`;
  subjectTaskCount.textContent = `${tasks.length} заданий`;
  subjectTaskList.innerHTML = tasks.map(taskButton).join("");
  bindTaskButtons(subjectTaskList);
  subjectWeakList.innerHTML = (subject.weakTopics || []).map((topic, index) => {
    const value = Math.max(34, subject.progress - index * 4);
    return `<article><img src="${subject.icon}" alt="" aria-hidden="true"><strong>${topic}</strong><span>${value}%</span><progress max="100" value="${value}">${value}%</progress></article>`;
  }).join("");
};

const renderAllData = () => {
  renderSubjects();
  renderTasks();
  renderWeakTopics();
  renderProgressState();
};

const showNextScreen = () => {
  portal.scrollTop = 0;
  appShell.classList.add("is-ready");
  splash.setAttribute("aria-hidden", "true");
  const account = getSavedAccount();

  if (account?.name) {
    renderAccount(account);
    setScreen("portal");
    showAppView();
    return;
  }

  setScreen("auth");
};

const splashDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 500 : 2300;
window.setTimeout(showNextScreen, splashDelay);
splash.addEventListener("click", showNextScreen);

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(authForm);
  const account = {
    name: String(formData.get("studentName") || "").trim(),
    group: String(formData.get("studentGroup") || "").trim(),
    code: String(formData.get("friendCode") || "").trim(),
    role: String(formData.get("role") || "Ученик"),
    createdAt: new Date().toISOString()
  };

  writeJson(storageKey, account);
  if (!readJson(progressKey)) saveProgress(defaultProgress);
  renderAccount(account);
  window.location.hash = "#home";
  setScreen("portal");
  showAppView("home");
});

avatarButton.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  studentName.value = profileName.textContent;
  studentGroup.value = "11 класс";
  friendCode.value = "EGE-2026";
  setScreen("auth");
});

copyCode.addEventListener("click", async () => {
  const account = getSavedAccount();
  const code = account?.code && account.code !== "STUDY-7B" ? account.code : "EGE-2026";
  try {
    await navigator.clipboard.writeText(code);
    copyCode.textContent = "Код скопирован";
    window.setTimeout(() => {
      copyCode.textContent = `Код: ${code}`;
    }, 1400);
  } catch {
    copyCode.textContent = `Код: ${code}`;
  }
});

const showAppView = (forcedRoute = null) => {
  const parsed = forcedRoute ? { route: forcedRoute, id: null } : parseRoute();
  const viewId = viewMap[parsed.route] || viewMap.home;
  appShell.dataset.route = parsed.route;

  appViews.forEach((view) => {
    const isActive = view.id === viewId;
    view.classList.toggle("active", isActive);
    view.setAttribute("aria-hidden", isActive ? "false" : "true");
  });

  portal.scrollTop = 0;
  viewStack.scrollTop = 0;

  if (parsed.route === "subject") renderSubjectScreen(parsed.id);
  if (parsed.route === "test") renderActiveTest(parsed.id);
};

const activateNavLink = () => {
  const { route } = parseRoute();
  const navRoute = route === "test" || route === "calendar" ? "tasks" : route === "subject" ? "home" : route;
  const activeLink = [...navLinks].find((link) => link.getAttribute("href") === `#${navRoute}`) || [...navLinks].find((link) => link.getAttribute("href") === "#home");

  navLinks.forEach((item) => {
    item.classList.toggle("active", item === activeLink);
    if (item === activeLink) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  showAppView();
};

navLinks.forEach((link) => link.addEventListener("click", () => window.setTimeout(activateNavLink, 0)));

todayProgress?.addEventListener("click", () => {
  window.location.hash = "#tasks";
  activateNavLink();
});

examPanel?.addEventListener("click", () => {
  window.location.hash = "#tasks";
  activateNavLink();
});

openCalendar?.addEventListener("click", () => {
  window.location.hash = "#calendar";
  activateNavLink();
});

closeCalendar?.addEventListener("click", () => {
  window.location.hash = "#tasks";
  activateNavLink();
});

closeSubject?.addEventListener("click", () => {
  window.location.hash = "#home";
  activateNavLink();
});

rankButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rankButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    rankNote.textContent = `${button.dataset.rank}: ${button.dataset.score} очков, серия ${button.dataset.streak} дней. Звание растет от очков, серии и ежедневных заходов.`;
  });
});

planItems.forEach((item) => {
  item.addEventListener("click", () => item.classList.toggle("is-done"));
});

const showXpToast = (xp) => {
  const rank = getRankInfo(getProgress().xp);
  xpToast.textContent = `+${xp} XP · До звания “${rank.next.title}” осталось ${rank.left} XP`;
  xpToast.classList.remove("show");
  window.requestAnimationFrame(() => xpToast.classList.add("show"));
};

const completeTask = (task, xp, correct = 0, wrong = 0) => {
  const progress = getProgress();
  const alreadyDone = progress.completedTasks.includes(task.id);
  const nextProgress = {
    ...progress,
    xp: progress.xp + xp,
    correct: progress.correct + correct,
    wrong: progress.wrong + wrong,
    tasksDone: progress.tasksDone + (alreadyDone ? 0 : 1),
    testsDone: progress.testsDone + (task.testId ? 1 : 0),
    completedTasks: alreadyDone ? progress.completedTasks : [...progress.completedTasks, task.id]
  };
  saveProgress(nextProgress);
  renderTasks();
  renderProgressState();
  showXpToast(xp);
};

let activeTestId = null;
let activeQuestion = 0;
let activeAnswers = [];

const openTest = (testId) => {
  const test = getTest(testId);
  if (!test) return;
  activeTestId = testId;
  activeQuestion = 0;
  activeAnswers = new Array(test.questions.length).fill(null);
  window.location.hash = `#test-${testId}`;
  renderActiveTest(testId);
  activateNavLink();
};

const renderActiveTest = (testId) => {
  const test = getTest(testId);
  if (!test) {
    window.location.hash = "#tasks";
    activateNavLink();
    return;
  }

  if (activeTestId !== testId) {
    activeTestId = testId;
    activeQuestion = 0;
    activeAnswers = new Array(test.questions.length).fill(null);
  }

  const question = test.questions[activeQuestion];
  dynamicTest.screen.classList.remove("is-result");
  dynamicTest.result.hidden = true;
  dynamicTest.subtitle.textContent = test.subtitle || getSubject(test.subjectId)?.title || "Тест";
  dynamicTest.title.textContent = test.title;
  dynamicTest.step.textContent = `Вопрос ${activeQuestion + 1} из ${test.questions.length}`;
  dynamicTest.progressBar.style.width = `${((activeQuestion + 1) / test.questions.length) * 100}%`;
  dynamicTest.questionText.textContent = question.question;
  dynamicTest.feedback.textContent = "";
  dynamicTest.answerList.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.textContent = answer;

    if (activeAnswers[activeQuestion] !== null) {
      if (index === question.correct) button.classList.add("is-correct");
      if (index === activeAnswers[activeQuestion] && index !== question.correct) button.classList.add("is-wrong");
      if (index === activeAnswers[activeQuestion]) button.classList.add("is-selected");
    }

    button.addEventListener("click", () => {
      activeAnswers[activeQuestion] = index;
      renderActiveTest(testId);
      dynamicTest.feedback.textContent = index === question.correct ? question.hint : `Почти. ${question.hint}`;
    });

    dynamicTest.answerList.append(button);
  });

  dynamicTest.prev.disabled = activeQuestion === 0;
  dynamicTest.next.textContent = activeQuestion === test.questions.length - 1 ? "Завершить" : "Дальше";
};

const finishActiveTest = () => {
  const test = getTest(activeTestId);
  if (!test) return;
  const correctCount = activeAnswers.filter((answer, index) => answer === test.questions[index].correct).length;
  const wrongCount = test.questions.length - correctCount;
  const percent = Math.round((correctCount / test.questions.length) * 100);
  const earnedXp = Math.round((correctCount / test.questions.length) * test.xpReward);
  const projectedRank = getRankInfo(getProgress().xp + earnedXp);
  const task = getTaskByTest(test.id) || { id: `test-${test.id}`, testId: test.id, xp: test.xpReward };

  dynamicTest.resultTitle.textContent = test.resultTitle || "Тест завершен";
  dynamicTest.resultPercent.textContent = `${percent}%`;
  dynamicTest.resultCorrect.textContent = `${correctCount} из ${test.questions.length} правильных ответов`;
  dynamicTest.resultXp.textContent = `+${earnedXp} XP`;
  dynamicTest.resultRankLeft.textContent = `${projectedRank.left} XP`;
  dynamicTest.resultRankProgress.value = projectedRank.progress;
  dynamicTest.resultRankProgress.textContent = `${projectedRank.progress}%`;
  dynamicTest.screen.classList.add("is-result");
  dynamicTest.result.hidden = false;
  completeTask(task, earnedXp || 5, correctCount, wrongCount);
};

dynamicTest.close?.addEventListener("click", () => {
  window.location.hash = "#tasks";
  activateNavLink();
});

dynamicTest.prev?.addEventListener("click", () => {
  if (activeQuestion > 0) {
    activeQuestion -= 1;
    renderActiveTest(activeTestId);
  }
});

dynamicTest.next?.addEventListener("click", () => {
  const test = getTest(activeTestId);
  if (!test) return;
  if (activeQuestion < test.questions.length - 1) {
    activeQuestion += 1;
    renderActiveTest(activeTestId);
    return;
  }
  finishActiveTest();
});

dynamicTest.repeat?.addEventListener("click", () => {
  const test = getTest(activeTestId);
  if (!test) return;
  const firstWrong = activeAnswers.findIndex((answer, index) => answer !== test.questions[index].correct);
  activeQuestion = firstWrong >= 0 ? firstWrong : 0;
  activeAnswers = new Array(test.questions.length).fill(null);
  renderActiveTest(activeTestId);
});

dynamicTest.nextTest?.addEventListener("click", () => {
  const tests = appData.tasks.map((task) => task.testId).filter(Boolean);
  const currentIndex = tests.indexOf(activeTestId);
  const nextId = tests[currentIndex + 1] || tests[0];
  openTest(nextId);
});

contentImport?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    const currentOverrides = readJson(contentKey, { subjects: [], tests: {}, tasks: [] });
    const nextOverrides = mergeContent(currentOverrides, imported);
    writeJson(contentKey, nextOverrides);
    appData = mergeContent(window.STUDIFY_CONTENT || {}, nextOverrides);
    renderAllData();
    copyCode.textContent = "Задания импортированы";
  } catch {
    copyCode.textContent = "Ошибка импорта JSON";
  } finally {
    event.target.value = "";
  }
});

renderAllData();
window.addEventListener("hashchange", activateNavLink);
activateNavLink();
