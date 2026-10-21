// 画面の描画とイベント登録。質問は config.js から組み立て、判定は logic.js の buildResult に任せる。

// ===== 状態 =====
const answers = {};

// ===== 共通の小道具 =====

/** 要素を作り、クラスと文字を設定して返す（文字は textContent で入れる） */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/** 表示中の質問だけを返す */
function visibleQuestions() {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

// ===== 問診フォームの描画 =====

/** 全質問のカードを作ってフォームに入れる */
function renderQuestions() {
  const form = document.getElementById("question-form");
  QUESTIONS.forEach((q) => form.appendChild(renderQuestion(q)));
  updateVisibility();
}

/** フォームのセクション見出しを作る */
function renderHeading(heading) {
  const box = el("div", "mb-3 border-l-2 border-gold pl-3");
  box.appendChild(el("p", "font-serif font-semibold text-brand-700 leading-snug", heading.title));
  if (heading.description) box.appendChild(el("p", "mt-1 text-xs leading-relaxed text-ink-soft", heading.description));
  return box;
}

/** 質問1つ分のカード（見出しがあれば見出しごと）を作る */
function renderQuestion(q) {
  const wrapper = el("div", "question");
  wrapper.dataset.qid = q.id;
  if (q.heading) wrapper.appendChild(renderHeading(q.heading));
  const card = el("div", "card-gold rounded-[18px] bg-white shadow-sm p-5");
  card.setAttribute("role", "group");
  wrapper.appendChild(card);

  const head = el("p", "flex items-center gap-2 text-xs font-semibold text-gold-deep");
  head.appendChild(el("span", "q-number"));
  head.appendChild(el("span", q.required ? "rounded border border-gold/50 px-1.5 py-0.5" : "rounded border border-gray-300 px-1.5 py-0.5 text-ink-soft",
    q.required ? "必須" : "任意"));
  card.appendChild(head);
  card.appendChild(el("p", "mt-2 font-bold leading-relaxed", q.text));
  if (q.hint) card.appendChild(el("p", "mt-1 text-xs text-gray-500", q.hint));

  const body = el("div", "mt-3 grid gap-2");
  if (q.type === "text" || q.type === "textarea") body.appendChild(renderTextInput(q.id, q.type));
  else q.options.forEach((opt) => body.appendChild(renderOption(q, opt)));
  card.appendChild(body);

  card.appendChild(el("p", "q-error hidden mt-2 text-xs text-rose-600", "この質問にお答えください"));
  return wrapper;
}

/** 選択肢1つ分（ラジオボタン or チェックボックス）を作る。「その他」には記入欄も付ける */
function renderOption(q, opt) {
  const box = el("div");
  const label = el("label", "block cursor-pointer");
  const input = el("input", "peer sr-only");
  input.type = q.type === "multi" ? "checkbox" : "radio";
  input.name = q.id;
  input.value = opt.value;
  label.appendChild(input);
  label.appendChild(el("span",
    "block rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-relaxed transition " +
    "hover:border-gold-light peer-checked:border-gold peer-checked:bg-[rgba(214,189,140,.16)] peer-checked:font-semibold " +
    "peer-checked:text-brand-700 peer-checked:shadow-[inset_0_0_0_1px_#b8975a] peer-focus-visible:ring-2 peer-focus-visible:ring-gold-light",
    opt.label));
  box.appendChild(label);

  if (opt.withText) {
    const text = renderTextInput(otherKey(q.id), "text");
    text.classList.add("other-text", "hidden", "mt-2");
    box.appendChild(text);
  }
  return box;
}

/** 自由記入欄（1行 or 複数行）を作る */
function renderTextInput(name, type) {
  const input = el(type === "textarea" ? "textarea" : "input",
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none");
  if (type === "textarea") input.rows = 3;
  else input.type = "text";
  input.name = name;
  input.maxLength = type === "textarea" ? 500 : 100;
  input.placeholder = "自由にご記入ください";
  return input;
}

/** 「その他」の記入内容を answers に入れるときのキー */
function otherKey(questionId) {
  return `${questionId}OtherText`;
}

/** 回答に応じて質問の表示・非表示と番号を更新する */
function updateVisibility() {
  const shown = visibleQuestions().map((q) => q.id);
  document.querySelectorAll(".question").forEach((card) => {
    const index = shown.indexOf(card.dataset.qid);
    card.classList.toggle("hidden", index === -1);
    card.querySelector(".q-number").textContent = index === -1 ? "" : `Q${index + 1}`;
  });
}

// ===== 入力 =====

/** 入力の変化を answers に反映する */
function handleInput(event) {
  const input = event.target;
  const card = input.closest(".question");
  const q = QUESTIONS.find((item) => item.id === card.dataset.qid);

  if (input.name === otherKey(q.id)) {
    answers[input.name] = input.value.trim();
  } else if (q.type === "multi") {
    const checked = card.querySelectorAll(`input[name="${q.id}"]:checked`);
    answers[q.id] = Array.from(checked, (c) => c.value);
  } else {
    answers[q.id] = input.value.trim();
  }
  updateOtherText(q, card);
  card.querySelector(".q-error").classList.add("hidden");
  updateVisibility();
}

/** 「その他」が選ばれているときだけ記入欄を表示する */
function updateOtherText(q, card) {
  const text = card.querySelector(".other-text");
  if (text) text.classList.toggle("hidden", !hasOtherSelected(q));
}

/** その質問で「その他」が選ばれているか */
function hasOtherSelected(q) {
  return [].concat(answers[q.id] || []).includes(OTHER);
}

/** 表示中の必須質問のうち、未回答のもの（「その他」の記入漏れを含む）を返す */
function findUnanswered() {
  return visibleQuestions().filter((q) => {
    if (!q.required) return false;
    const value = answers[q.id];
    if (value == null || value.length === 0) return true;
    return hasOtherSelected(q) && !answers[otherKey(q.id)];
  });
}

/** 判定に使う回答（表示中の質問の分だけ）を返す */
function collectAnswers() {
  const result = {};
  visibleQuestions().forEach((q) => {
    if (answers[q.id] != null) result[q.id] = answers[q.id];
    if (hasOtherSelected(q)) result[otherKey(q.id)] = answers[otherKey(q.id)] || "";
  });
  return result;
}

/** 「結果を見る」：未回答があれば知らせ、なければ結果を表示する */
function handleSubmit(event) {
  event.preventDefault();
  const missing = findUnanswered();
  const errorBox = document.getElementById("form-error");
  if (missing.length > 0) {
    missing.forEach((q) => {
      document.querySelector(`.question[data-qid="${q.id}"] .q-error`).classList.remove("hidden");
    });
    errorBox.textContent = `未回答の質問が${missing.length}つあります。`;
    errorBox.classList.remove("hidden");
    document.querySelector(`.question[data-qid="${missing[0].id}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  errorBox.classList.add("hidden");
  const collected = collectAnswers();
  renderResult(buildResult(collected));
  showView("result");
}

// ===== 画面切替 =====

/** 問診（form）と結果（result）のどちらか一方を表示する */
function showView(name) {
  document.getElementById("view-form").classList.toggle("hidden", name !== "form");
  document.getElementById("view-result").classList.toggle("hidden", name !== "result");
  window.scrollTo({ top: 0 });
}

/** 回答をすべて消して問診の最初に戻る */
function restart() {
  Object.keys(answers).forEach((key) => delete answers[key]);
  document.getElementById("question-form").reset();
  document.querySelectorAll(".q-error, .other-text").forEach((e) => e.classList.add("hidden"));
  updateVisibility();
  closeSaveForm();
  showView("form");
}

// ===== 結果の描画 =====
// 結果画面は「① タイプ ② 改善までの目安 ③ 原因と解決策 ④ 相談・予約」の4項目だけにする
// ②は時間の流れ、③は原因に対して何をするか。同じ説明を繰り返さない

/** 結果画面の4項目を描画する */
function renderResult(result) {
  renderType(result);
  renderTimeline(result);
  renderCauses(result.causes);
  renderFigures(result.figures);
  renderSolutions(result.solutions);
  renderCounseling();
  closeSaveForm(); // 新しい結果を出すたびに、保存の入力欄は閉じた状態から始める
}

/** ① 痛みのタイプ（「○○タイプの傾向」。判定できないときだけ短い説明を添える） */
function renderType(result) {
  const hasType = Boolean(result.conditionType);
  document.getElementById("result-type-name").textContent = hasType ? `${result.conditionType}の傾向` : "カウンセリングで詳しく確認";
  const feature = document.getElementById("result-type-feature");
  feature.textContent = result.feature ? `痛みの出方：${result.feature}` : "";
  feature.classList.toggle("hidden", !result.feature);
  const summary = document.getElementById("result-type-summary");
  summary.textContent = hasType ? "" : result.summary;
  summary.classList.toggle("hidden", hasType);
}

/** ② 改善までの目安（初回 → 約2週間後 → 痛みが残る場合の次のアプローチ を「↓」でつなぐ） */
function renderTimeline(result) {
  document.getElementById("result-duration").textContent = result.duration ? `痛みが出てから：${result.duration.label}` : "";
  const list = document.getElementById("result-flow");
  list.replaceChildren();
  result.steps.forEach((step, i) => {
    if (i > 0) list.appendChild(renderArrow(step, result.steps[i - 1]));
    list.appendChild(renderTimelineStep(step, i));
  });
  document.getElementById("result-period-note").textContent = EXTRA_TEXTS.periodNote;
  renderImprovementRate(result.improvementRate);
}

/** 流れの1段階（最初の段階だけ色を濃くして「まずここから」を伝える） */
function renderTimelineStep(step, index) {
  const first = index === 0;
  const item = el("li", `rounded-xl px-3 py-2.5 ${first ? "bg-brand-500 text-white" : "border border-gold/30 bg-brand-50"}`);
  if (step.flowLabel) item.appendChild(el("p", `text-[11px] font-semibold tracking-[0.08em] ${first ? "text-gold-light" : "text-gold-deep"}`, step.flowLabel));
  item.appendChild(el("p", "text-sm font-bold leading-snug", step.flowTitle));
  if (step.period && !step.showPeriodOnArrow) item.appendChild(el("p", "mt-0.5 text-xs font-bold text-brand-600", step.period));
  return item;
}

/** 段階と段階のあいだの「↓」。前の段階のあとの期間（身体の反応を確認する目安）もここに添える */
function renderArrow(step, prev) {
  const item = el("li", "flex gap-2 py-1.5 pl-3");
  item.appendChild(el("span", "text-base leading-5 text-gold", "↓"));
  const body = el("div", "leading-tight");
  if (step.arrowLabel) body.appendChild(el("p", "text-xs font-bold text-brand-700", step.arrowLabel));
  if (prev.showPeriodOnArrow && prev.period) body.appendChild(el("p", "mt-0.5 text-[11px] text-gray-500", prev.period));
  item.appendChild(body);
  return item;
}

/** 改善見込み（実績データが設定されているときだけ表示） */
function renderImprovementRate(rate) {
  document.getElementById("result-rate").classList.toggle("hidden", !rate);
  document.getElementById("result-rate-text").textContent = rate ? rate.text : "";
  document.getElementById("result-rate-basis").textContent = rate ? rate.basis || "" : "";
}

/** ③ 解決策（1つのカードにまとめる。印の行の下に、それぞれの解決策の文章を出す）
 *  1つ目は「初回」、2つ目以降は「必要に応じて」の印と、そのすぐ横に「施術とセルフケア指導」を表示する */
function renderSolutions(solutions) {
  const list = document.getElementById("result-solutions");
  list.replaceChildren();
  const tagged = solutions.length > 1;
  const tags = EXTRA_TEXTS.solutionTags;
  solutions.forEach((text, i) => {
    const item = el("li", "py-3 first:pt-1.5 last:pb-1");
    if (tagged) {
      const head = el("div", "flex flex-wrap items-center gap-x-2 gap-y-1");
      head.appendChild(el("span",
        `shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${i === 0 ? "bg-brand-500 text-white" : "border border-gold/50 bg-white text-gold-deep"}`,
        i === 0 ? tags.first : tags.rest));
      if (i > 0) head.appendChild(el("span", "text-[13px] font-semibold tracking-[0.04em] text-brand-600", tags.restNote));
      item.appendChild(head);
    }
    item.appendChild(el("p", `${tagged ? "mt-1.5 " : ""}text-[15px] font-semibold leading-snug text-brand-700`, text));
    list.appendChild(item);
  });
}

/** ③ 考えられる原因・要因（筋肉名は強調して表示する） */
function renderCauses(causes) {
  document.getElementById("result-causes-title").textContent = CAUSE_TEXTS.title;
  document.getElementById("result-causes-basis").textContent = CAUSE_TEXTS.basis;
  document.getElementById("result-causes-lead").textContent = CAUSE_TEXTS.lead;
  document.getElementById("result-causes-note").textContent = CAUSE_TEXTS.note;
  const list = document.getElementById("result-causes");
  list.replaceChildren();
  causes.forEach((cause) => {
    const item = el("li", "flex gap-2 text-sm leading-relaxed");
    item.appendChild(el("span", "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"));
    const body = el("span");
    if (typeof cause === "string") {
      body.textContent = cause;
    } else {
      body.appendChild(el("span", "font-serif font-semibold text-brand-700 underline decoration-gold/60 decoration-1 underline-offset-4", cause.muscle));
      body.appendChild(document.createTextNode(cause.text));
    }
    item.appendChild(body);
    list.appendChild(item);
  });
}

// 筋肉のイラスト（renderFigures など）は figures.js にある（13種類の一覧 muscles.html と共通）

/** ④ 相談・予約のボタン */
function renderCounseling() {
  document.getElementById("counseling-title").textContent = COUNSELING.title;
  document.getElementById("counseling-note").textContent = COUNSELING.note || "";
  const box = document.getElementById("counseling-buttons");
  box.replaceChildren();
  COUNSELING.buttons.forEach((b) => box.appendChild(renderCounselingButton(b)));
}

/** ボタンの見た目（config.js の style ごと） */
const COUNSELING_BUTTON_COLORS = {
  primary: "btn-gold hover:-translate-y-0.5 transition",
  line: "bg-[#06c755] text-white shadow-sm",
  outline: "btn-outline transition",
};

/** 予約・お問い合わせボタン1つ分を作る（URL未設定のボタンは「準備中」表示。別タブで開いて結果画面を残す） */
function renderCounselingButton(button) {
  const base = "relative flex w-full flex-col items-center justify-center rounded-full py-4 text-center text-lg font-bold";
  const color = COUNSELING_BUTTON_COLORS[button.style] || COUNSELING_BUTTON_COLORS.outline;
  const ready = Boolean(button.url);
  const node = el(ready ? "a" : "span", `${base} ${color} ${ready ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"}`);
  node.appendChild(el("span", "", button.label));
  const sub = [button.sublabel, ready ? null : "準備中"].filter(Boolean).join("・");
  if (sub) node.appendChild(el("span", "text-[11px] font-semibold opacity-90", sub));
  if (ready) node.appendChild(el("span", "pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-normal leading-none", "›"));
  if (ready) {
    node.href = button.url;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
  } else {
    node.setAttribute("aria-disabled", "true");
  }
  return node;
}

// ===== 結果の保存（任意） =====
// 今は入力画面だけ。SAVE_FORM.ready が false のあいだは送信も保存もせず、準備中の案内を出す。
// 個人情報を残さないため、入力値は変数・ブラウザの保存領域に入れず、閉じるときに入力欄ごと消す

const SAVE_FIELDS = ["save-name", "save-email", "save-consent"];

/** 保存カードと入力画面の文言を config.js から入れる（起動時に1回） */
function renderSaveForm() {
  const texts = {
    "save-card-title": SAVE_FORM.cardTitle, "save-card-text": SAVE_FORM.cardText, "save-open-btn": SAVE_FORM.openButton,
    "save-form-title": SAVE_FORM.formTitle, "save-name-label": SAVE_FORM.nameLabel, "save-email-label": SAVE_FORM.emailLabel,
    "save-email-hint": SAVE_FORM.emailHint, "save-purpose-title": SAVE_FORM.purposeTitle, "save-purpose-lead": SAVE_FORM.purposeLead,
    "save-consent-label": SAVE_FORM.consentLabel, "save-submit-btn": SAVE_FORM.submitButton, "save-cancel-btn": SAVE_FORM.cancelButton,
    "save-not-ready-title": SAVE_FORM.notReady.title, "save-not-ready-text": SAVE_FORM.notReady.text,
    "save-not-ready-close": SAVE_FORM.notReady.closeButton,
  };
  Object.entries(texts).forEach(([id, text]) => { document.getElementById(id).textContent = text; });
  document.getElementById("save-name").placeholder = SAVE_FORM.namePlaceholder;
  document.getElementById("save-email").placeholder = SAVE_FORM.emailPlaceholder;
  renderSaveList("save-purposes", SAVE_FORM.purposes, "text-[11px] leading-relaxed text-gray-700", "・");
  renderSaveList("save-purpose-notes", SAVE_FORM.purposeNotes, "text-[11px] leading-relaxed text-gray-500", "※");
}

/** 利用目的などの箇条書きを作る */
function renderSaveList(id, items, className, mark) {
  const list = document.getElementById(id);
  list.replaceChildren();
  items.forEach((text) => {
    const item = el("li", `flex gap-1 ${className}`);
    item.appendChild(el("span", "shrink-0", mark));
    item.appendChild(el("span", "", text));
    list.appendChild(item);
  });
}

/** 「結果を保存する」を押した方だけに入力欄を開く */
function openSaveForm() {
  document.getElementById("save-open-btn").classList.add("hidden");
  document.getElementById("save-panel").classList.remove("hidden");
  document.getElementById("save-name").focus();
}

/** 入力欄を閉じ、入力内容・エラー・準備中の案内をすべて消す */
function closeSaveForm() {
  document.getElementById("save-name").value = "";
  document.getElementById("save-email").value = "";
  document.getElementById("save-consent").checked = false;
  SAVE_FIELDS.forEach((id) => { document.getElementById(id).disabled = false; });
  ["name", "email", "consent"].forEach((key) => showSaveError(key, false));
  document.getElementById("save-not-ready").classList.add("hidden");
  document.getElementById("save-actions").classList.remove("hidden");
  document.getElementById("save-panel").classList.add("hidden");
  document.getElementById("save-open-btn").classList.remove("hidden");
}

/** 入力欄の下のエラー表示を切り替える */
function showSaveError(key, visible) {
  const error = document.getElementById(`save-${key}-error`);
  error.textContent = visible ? SAVE_FORM.errors[key] : "";
  error.classList.toggle("hidden", !visible);
}

/** 入力内容を確認し、問題がなければ true を返す（値はその場で読むだけで、どこにも残さない） */
function validateSaveForm() {
  const checks = {
    name: document.getElementById("save-name").value.trim().length > 0,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById("save-email").value.trim()),
    consent: document.getElementById("save-consent").checked,
  };
  Object.entries(checks).forEach(([key, ok]) => showSaveError(key, !ok));
  const firstError = Object.keys(checks).find((key) => !checks[key]);
  if (firstError) document.getElementById(`save-${firstError}`).focus();
  return !firstError;
}

/** 「確認コードを送る」：入力を確認したうえで、準備中のあいだは何も送らずに案内だけを出す */
function handleSaveSubmit() {
  if (!validateSaveForm()) return;
  if (!SAVE_FORM.ready) {
    SAVE_FIELDS.forEach((id) => { document.getElementById(id).disabled = true; });
    document.getElementById("save-actions").classList.add("hidden");
    const notice = document.getElementById("save-not-ready");
    notice.classList.remove("hidden");
    notice.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  // 公開時はここで確認コードの送信（Supabase の本人確認）を行う
}

// ===== イベント =====
renderQuestions();
renderSaveForm();
document.getElementById("question-form").addEventListener("change", handleInput);
document.getElementById("question-form").addEventListener("input", handleInput);
document.getElementById("question-form").addEventListener("submit", handleSubmit);
document.getElementById("restart-btn").addEventListener("click", restart);
document.getElementById("save-open-btn").addEventListener("click", openSaveForm);
document.getElementById("save-cancel-btn").addEventListener("click", closeSaveForm);
document.getElementById("save-not-ready-close").addEventListener("click", closeSaveForm);
document.getElementById("save-submit-btn").addEventListener("click", handleSaveSubmit);
["name", "email", "consent"].forEach((key) => {
  document.getElementById(`save-${key}`).addEventListener("input", () => showSaveError(key, false));
});
