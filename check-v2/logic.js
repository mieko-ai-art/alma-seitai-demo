// 問診の回答から結果を組み立てる判定ロジック（画面には触れない）。
// 分岐は「痛みに伴う解決チャート」に沿って書き、チャートにない優先順位は作らない。
// 病状タイプは「初回の関節へのアプローチ後、約2週間後にも痛みが残った場合」の参考情報として扱う。

// ===== 判定（チャートの分岐） =====
// 返り値: { resultId, motions（動作時痛のある動き）, hasOther（「その他」の回答があるか） }

/** 回答からチャート上の行き先（結果ID）を判定する */
function judge(answers) {
  return answers.area === "upper" ? judgeUpper(answers) : judgeLower(answers);
}

/** 腰部・下半身：「どのような状況で痛みを感じますか？」の回答をそのままチャートの行き先にする */
function judgeLower(a) {
  const resultId = JUDGE_RULES.lowerSituation[a.lowerSituation] || "unclear";
  const motions = a.lowerSituation === "motion" ? ["motion"] : [];
  return { resultId, motions, hasOther: a.lowerSituation === OTHER };
}

/** 頸部・上半身：痛みが残る場所 → 腕の上げ下ろし の順に見てタイプを決める */
function judgeUpper(a) {
  // 動きの回答は関節の対象を決めるだけに使う（「その他」を含むときは関節名を出さない）
  const motions = a.upperMotion || [];
  const hasOther = [a.upperArm, a.upperRemain].includes(OTHER) || motions.includes(OTHER);
  return { resultId: decideUpperType(a), motions, hasOther };
}

/** 上半身のタイプを決める。「その他」の回答は使わず、ほかの回答で決まればそれを採用する */
function decideUpperType(a) {
  for (const questionId of JUDGE_RULES.upperOrder) {
    const resultId = JUDGE_RULES[questionId][a[questionId]];
    if (resultId) return resultId;
  }
  const noPain = Object.entries(JUDGE_RULES.upperNoPainAnswers).every(([questionId, value]) => a[questionId] === value);
  return noPain ? JUDGE_RULES.upperNoPainResult : "unclear";
}

// ===== 結果の組み立て =====

/** 回答から結果画面に表示する内容をまとめて返す */
function buildResult(answers) {
  const { resultId, motions, hasOther } = judge(answers);
  const result = RESULTS[resultId];
  const duration = DURATIONS.find((d) => d.value === answers.duration) || null;
  const joint = motions.length > 0 ? jointTarget(motions) : null;

  return {
    resultId,
    conditionType: result.conditionType,
    feature: result.feature,
    summary: hasOther ? `${result.summary}${EXTRA_TEXTS.otherAnswerNote}` : result.summary,
    isUnclear: result.kind === "unclear",
    causes: buildCauses(result, joint, duration),
    solutions: result.solutions || [],
    // check-v2：筋肉のイラスト（筋肉名を設定したタイプだけ。無いタイプは空）
    figures: (result.figures || []).filter((key) => MUSCLE_FIGURES[key]).map((key) => ({ key, figure: MUSCLE_FIGURES[key] })),
    steps: buildSteps(result, joint, duration),
    duration,
    improvementRate: findImprovementRate(resultId),
  };
}

/** 関節へのアプローチの対象を返す（チャートと1対1で決まらないときは関節名を出さない） */
function jointTarget(motions) {
  const target = motions.length === 1 ? JOINT_TARGETS[motions[0]] : null;
  return target || { name: null, note: EXTRA_TEXTS.jointUnknownNote };
}

/** 回答から「考えられる要因」の一覧を作る */
function buildCauses(result, joint, duration) {
  // 結果画面では原因を2〜3項目に絞るため、タイプごとの causes をそのまま使う
  // （関節へのアプローチは「解決策」の1つ目に必ず入るので、共通の関節の文はここでは足さない）
  const causes = [...result.causes];
  if (result.kind === "joint" && duration && duration.considerMuscle) causes.push(EXTRA_TEXTS.longDurationCause);
  if (result.kind === "unclear") {
    if (joint) causes.push(EXTRA_TEXTS.jointCause);
    causes.push(EXTRA_TEXTS.unclearCause);
  }
  return causes;
}

/** 施術の STEP（初回は必ず関節 → 約2週間後に再評価 → 痛みが残る場合に次のアプローチ）を作る */
function buildSteps(result, joint, duration) {
  const unknownJoint = { name: null, note: EXTRA_TEXTS.jointUnknownNote };
  const unknownMuscle = { name: null, note: EXTRA_TEXTS.muscleTargetNote };
  const typeText = result.conditionType ? `${result.conditionType}の傾向` : EXTRA_TEXTS.typeFallback;
  return TREATMENT_STEPS.map((step) => ({
    code: step.code,
    flowLabel: step.flowLabel || null,
    flowTitle: step.flowTitle || step.title,
    arrowLabel: step.arrowLabel || null,
    showPeriodOnArrow: Boolean(step.showPeriodOnArrow),
    overview: step.overview || step.title,
    overviewNote: step.overviewNote || null,
    sectionTitle: step.sectionTitle,
    timing: step.timing,
    period: stepPeriod(step, duration),
    periodLabel: step.periodLabel || "期間の目安",
    title: step.title,
    description: step.description.replace("{type}", typeText),
    target: step.showJointTarget ? joint || unknownJoint : null,
    durationNote: step.showDurationNote ? duration : null,
    items: (step.muscleItems || []).map((key) => ({
      ...APPROACHES[key],
      target: result.kind === "muscle" && result[key] ? plainMuscle(result[key]) : unknownMuscle,
    })),
  }));
}

/** STEP の期間の目安を返す（痛みが出てからの期間ごとの指定があればそれを優先） */
function stepPeriod(step, duration) {
  const byDuration = step.periodByDuration && duration ? step.periodByDuration[duration.value] : null;
  return byDuration || step.period || null;
}

/** 対象の筋肉を画面用にする。専門的な筋肉名は出さず、分かりやすい説明（note）だけを表示する */
function plainMuscle(muscle) {
  return { name: null, note: muscle.note };
}

/** 改善見込みのデータがあれば返す（未設定なら null） */
function findImprovementRate(resultId) {
  if (!IMPROVEMENT_RATE.enabled) return null;
  return IMPROVEMENT_RATE.byResult[resultId] || null;
}
