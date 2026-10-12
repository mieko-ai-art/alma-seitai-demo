// 痛みチェックアプリの設定ファイル。質問・判定ルール・結果の文章・期間の目安・予約URLはすべてここで編集する。
// 質問文と選択肢は、実際に使用している Google フォームの問診票に合わせている。

// ===== 予約・お問い合わせ（結果画面④。リンク先URLはここに貼る） =====
// リンク先は、予約とお問い合わせを選んで分岐できる共通フォーム。結果を保存しなくても使える。
// 画面にはフォームのサービス名を出さない
const COUNSELING = {
  title: "ご予約・お問い合わせ",
  note: "結果を保存しなくても、そのままご利用いただけます。",
  // url が空のボタンは「準備中」として表示される。style: "primary"（塗りつぶし）/ "line"（LINE の緑）/ "outline"（枠線）
  buttons: [{ label: "予約・お問い合わせ", url: "https://forms.gle/JCkZGnLkBEJnqaNr9", style: "primary" }],
};

// ===== 結果の保存（任意。結果画面の一番下に表示） =====
// 現在は入力画面だけを用意した段階で、実際の保存（Supabase）と本人確認メールはまだ行わない。
// ready が false のあいだは、入力内容をどこにも送信・保存せず、notReady の案内だけを表示する。
// 入力されたお名前・メールアドレスは、画面の入力欄の中にしか置かない（ブラウザの保存領域や変数に残さない）
const SAVE_FORM = {
  ready: false,
  policyVersion: "2026-10", // 同意した利用目的の版（将来、同意の記録に使う）
  cardTitle: "この結果を保存する（任意）",
  cardText: "保存を希望する方のみ、お名前とメールアドレスをご入力ください。保存しなくても、結果はこのままご確認いただけます。",
  openButton: "結果を保存する",
  formTitle: "結果の保存",
  nameLabel: "お名前",
  namePlaceholder: "例）山田 花子",
  emailLabel: "メールアドレス",
  emailPlaceholder: "例）example@gmail.com",
  emailHint: "本人確認のため、このアドレスに6桁の確認コードをお送りします。",
  purposeTitle: "個人情報の取り扱いについて",
  purposeLead: "ご入力いただいたお名前・メールアドレスと、からだチェックの回答・結果は、アルマ整体が次の目的にのみ利用します。",
  purposes: [
    "チェック結果の保存と、ご来院時の施術の参考",
    "ご予約やお問い合わせへのご連絡",
    "施術内容やサービスの改善（個人が特定されない形での集計）",
  ],
  purposeNotes: [
    "ご本人の同意なく第三者に提供することはありません（法令に基づく場合を除きます）。",
    "保存した情報は、いつでも削除をご依頼いただけます。",
  ],
  consentLabel: "個人情報の取り扱い（体の不調に関する情報を含む）に同意して、チェック結果を保存します",
  submitButton: "確認コードを送る",
  cancelButton: "保存しないで閉じる",
  errors: {
    name: "お名前を入力してください",
    email: "メールアドレスを正しく入力してください",
    consent: "保存するには、個人情報の取り扱いへの同意が必要です",
  },
  notReady: {
    title: "結果の保存は、現在準備中です",
    text: "まだ保存は行われていません。ご入力いただいた内容は、どこにも送信・保存されていません。ご不便をおかけしますが、公開までお待ちください。",
    closeButton: "閉じる",
  },
};

// ===== ここから下の4つ（SOFT_TREATMENT / JOINT_SENSOR_FOCUS / RECOMMENDED_FOR / BEFORE_TREATMENT_NOTES）は =====
// 結果画面をシンプルにしたため現在は表示していない。ホームページなど別の場所で使うために文言を残している

// ===== 施術についての安心材料 =====
// 「絶対に痛くない」などの断定表現は書かない
// 「刺激」という言葉は痛そうな印象を与えるため使わず、「やさしく触れる」「やさしいタッチ」と表現する
const SOFT_TREATMENT = {
  title: "身体への負担を抑えたソフトな施術です",
  text: "マッサージではなく、強く押したり揉んだりもしません。やさしく触れながら、身体の反応を確認していきます。",
  points: ["マッサージではありません", "強く押したり揉んだりしません", "やさしいタッチ"],
};

// ===== 関節センサーへの着目 =====
// 約85％は学んでいるメソッドにおける考え方。医学的に確立・証明された数値のように書かない
const JOINT_SENSOR_FOCUS = {
  label: "痛みの原因の考え方",
  title: "痛みは「痛い場所」だけが原因とは限りません",
  figure: "約85%",
  figureCaption: "の痛みに「関節センサー」が関係している、という考え方",
  paragraphs: [
    "当施術で学んでいるメソッドでは、痛みの約85％に、身体の動きを脳へ伝える「関節センサー」が関係していると考えています。",
    "だから、まず関節へのアプローチから始めます。",
  ],
  note: "※85％は当施術で学んでいるメソッドに基づく考え方です。",
};

// ===== こんな方におすすめ =====
const RECOMMENDED_FOR = {
  title: "こんな方におすすめです",
  items: [
    "デスクワークが多く、腰の痛みで座っているのがつらい",
    "首がつらく、動かしにくい",
    "整体などに通っているが、なかなか変化を感じられない",
    "強く揉む施術が苦手",
    "運動やセルフケアなど色々試しているが、なかなか良くならない",
  ],
};

// ===== 施術を受ける前にご確認ください =====
// 医学的な断定表現（「〜は治りません」「〜すると感覚が鈍くなる」など）は書かない
const BEFORE_TREATMENT_NOTES = {
  title: "施術を受ける前にご確認ください",
  items: [
    "当施術はマッサージではありません。",
    "医療行為や診断を行うものではありません。",
    "医療機関での診断・治療が必要な症状については、当施術の対象外となる場合があります。",
    "服薬中または治療中の方は、カウンセリング時にお知らせください。",
    "身体の状態や変化には個人差があります。",
  ],
};

// 「その他（自由記入）」の選択肢の値。この値が選ばれた回答は判定に使わない
const OTHER = "other";

// ===== いつから痛いか（質問の選択肢と、改善プロセスの目安を兼ねる） =====
// considerMuscle: true の期間は「関節だけでなく筋肉の影響も考慮する」扱いになる
const DURATIONS = [
  {
    value: "d1",
    label: "2〜3日以内",
    text: "関節センサーの再起動を促すことで、身体の反応を比較的早く確認しやすい時期です。",
    considerMuscle: false,
  },
  {
    value: "d2",
    label: "3〜7日",
    text: "関節センサーの再起動を促しながら、身体の状態が落ち着くまでの期間も考えて進めていきます。",
    considerMuscle: false,
  },
  {
    value: "d3",
    label: "1週間〜1か月未満",
    text: "関節センサーの再起動を促したあと、身体がどのように反応・適応していくかを確認していく期間です。",
    considerMuscle: false,
  },
  {
    value: "d4",
    label: "1か月以上3か月未満",
    text: "関節だけでなく筋肉の影響も考え、再評価のあと、筋肉を緩めるアプローチと、筋肉の働きを促すトレーニングを組み合わせていきます。",
    considerMuscle: true,
  },
  {
    value: "d5",
    label: "3か月以上",
    text: "再評価のあとは継続的なトレーニングを行い、毎日の生活をより快適に、自分らしく過ごせることを目指していきます。",
    considerMuscle: true,
  },
];

// ===== 問診の質問（Google フォームの順番・文言に合わせる） =====
// type: "single"（1つ選ぶ）/ "multi"（複数選べる）/ "text"（1行）/ "textarea"（複数行）
// showIf: 表示する条件 / heading: 質問の前に出す見出し（フォームのセクション）
// summaryLabel: 結果画面の「回答内容」欄に出すときの項目名（無ければ出さない）
// 選択肢に withText: true を付けると、選んだときに自由記入欄が出る（値は OTHER にする）
const QUESTIONS = [
  {
    id: "area",
    text: "今いちばんつらい症状はどちらですか？",
    type: "single",
    required: true,
    summaryLabel: "つらい症状",
    options: [
      { value: "lower", label: "腰部・下半身" },
      { value: "upper", label: "頸部・上半身" },
    ],
  },

  // --- 腰部・下半身 ---
  {
    id: "lowerLocation",
    showIf: (a) => a.area === "lower",
    heading: {
      title: "【腰部・下半身】で、今いちばん気になる痛みについて",
      description: "現在の症状を把握するため、痛みの場所や出方についてお聞きします。当てはまるものをお選びください。",
    },
    text: "どこが痛いですか？",
    hint: "一番痛い所を一つ選んでください",
    type: "single",
    required: true,
    summaryLabel: "痛む場所",
    options: [
      { value: "waist", label: "腰" },
      { value: "buttocks", label: "おしり" },
      { value: "backThigh", label: "太ももの後ろ" },
      { value: "shin", label: "すね" },
      { value: "waistButtocks", label: "腰～臀部にかけて" },
      { value: "waistToThigh", label: "腰～臀部～太もも後面にかけて" },
      { value: "waistToShin", label: "腰～臀部～太もも後面～すね" },
      { value: OTHER, label: "その他", withText: true },
    ],
  },
  {
    id: "lowerSituation",
    chartRef: "腰部 Q1〜Q3",
    showIf: (a) => a.area === "lower",
    text: "どのような状況で痛みを感じますか？",
    hint: "※動作時か、同じ姿勢の継続かを基準にお選びください。",
    type: "single",
    required: true,
    summaryLabel: "痛む状況",
    options: [
      { value: "motion", label: "動かすと痛い（寝返り・起き上がり・立ち上がりなど）" },
      { value: "sitting", label: "座っていると痛い" },
      { value: "walking", label: "歩き始めは良いが、５分くらい歩くと痛くなる" },
      { value: "load", label: "歩き始めや体重をかけたときに痛い" },
      { value: OTHER, label: "その他", withText: true },
    ],
  },

  // --- 頸部・上半身 ---
  {
    id: "upperLocation",
    showIf: (a) => a.area === "upper",
    heading: {
      title: "【首・上半身】の痛みの状態について",
      description: "現在感じている痛みの「場所」や「動きとの関係」を把握するためにお聞きします。当てはまるものをお選びください。",
    },
    text: "今、いちばん痛みを感じる場所を一つ選んでください。",
    type: "single",
    required: true,
    summaryLabel: "痛む場所",
    options: [
      { value: "neck", label: "首" },
      { value: "shoulder", label: "肩" },
      { value: "back", label: "背中" },
      { value: "arm", label: "腕" },
      { value: "elbow", label: "肘" },
      { value: OTHER, label: "その他", withText: true },
    ],
  },
  {
    id: "upperMotion",
    chartRef: "頸部 Q1 動作時痛",
    showIf: (a) => a.area === "upper",
    text: "どのような動きで痛みを感じますか？（複数選択可）",
    type: "multi",
    required: true,
    summaryLabel: "痛む動き",
    options: [
      { value: "neckRotate", label: "首を横左右に回旋させたとき" },
      { value: "neckUpDown", label: "首を上下に屈曲するとき" },
      { value: "shoulderFrontBack", label: "肩を前後に動かしたとき" },
      { value: "shoulderUpDown", label: "肩を上下に動かしたとき" },
      { value: OTHER, label: "その他", withText: true },
    ],
  },
  {
    id: "upperArm",
    chartRef: "頸部 Q2 上肢挙上 or 下垂",
    showIf: (a) => a.area === "upper",
    text: "腕を動かしたときの痛みについて、当てはまるものを選んでください。",
    type: "single",
    required: true,
    summaryLabel: "腕の痛み",
    options: [
      { value: "raise", label: "腕を上げたとき" },
      { value: "hang", label: "腕を下している時" },
      { value: "noPain", label: "痛くない" },
      { value: OTHER, label: "その他", withText: true },
    ],
  },
  {
    id: "upperRemain",
    chartRef: "頸部 Q3 痛みが残る部位",
    showIf: (a) => a.area === "upper",
    text: "動かしたあと、どこに痛みが残りますか？",
    type: "single",
    required: true,
    summaryLabel: "痛みが残る場所",
    options: [
      { value: "shoulder", label: "肩に痛みが残る" },
      { value: "elbow", label: "肘に痛みが残る" },
      { value: "none", label: "痛みは残らない" },
      { value: OTHER, label: "その他", withText: true },
    ],
  },

  // --- 共通 ---
  {
    id: "duration",
    heading: {
      title: "痛みが出てからの期間について",
      description: "痛みが出てから、どのくらい経っていますか？",
    },
    text: "いつから痛いですか？",
    hint: "痛くなってから、どのくらい経過しているかお答えください。",
    type: "single",
    required: true,
    summaryLabel: "痛みが出てから",
    options: DURATIONS.map((d) => ({ value: d.value, label: d.label })),
  },
  {
    id: "inquiry",
    text: "その他、お問い合わせなど",
    type: "textarea",
    required: false,
    summaryLabel: "お問い合わせ",
  },
];

// ===== 判定ルール（回答の値 → 結果ID。RESULTS のキーを指定する） =====
// 病状タイプは「初回の関節へのアプローチ後、約2週間後にも痛みが残った場合」に次のアプローチを考えるための参考情報。
// ここに無い回答（その他・痛くない など）はタイプ判定に使わない
const JUDGE_RULES = {
  // 腰部：「どのような状況で痛みを感じますか？」の1問で チャートの Q1〜Q3 を判定する
  lowerSituation: {
    motion: "lowerJoint", // Q1 動作時痛あり
    sitting: "lowerDisc", // Q2 座位で痛くなる
    walking: "lowerStenosis", // Q3 立っていると痛くなる（間欠性跛行を含む）
    load: "lowerKneeHip", // Q3 荷重すると痛くなる（歩き始めから痛い）
  },
  // 上半身：upperOrder の順に質問を見て、最初にタイプが決まった時点で判定する
  // 「痛みが残る場所」を優先するのは、タイプが「関節へのアプローチ後に残る痛み」を見るためのものだから
  upperOrder: ["upperRemain", "upperArm"],
  // 上半身 Q3：動かしたあと痛みが残る場所（肩甲上腕関節 → 五十肩、肘・手首・指 → テニス肘）
  upperRemain: {
    shoulder: "upperFrozen",
    elbow: "upperTennis",
  },
  // 上半身 Q2：腕を上げたとき／下ろしているとき
  upperArm: {
    raise: "upperToc",
    hang: "upperDisc",
  },
  // どの質問でもタイプが決まらず、痛みが残る場所も腕の痛みも「無い」と答えたときは動作時痛タイプ
  upperNoPainAnswers: { upperRemain: "none", upperArm: "noPain" },
  upperNoPainResult: "upperJoint",
};

// ===== 関節へのアプローチの対象（動作時痛の回答ごと） =====
// null はチャートと1対1で対応しない回答。対象の関節はカウンセリングで確認する扱いになる
const JOINT_TARGETS = {
  // 腰部「動かすと痛い」は、ひねる動き（寝返り・起き上がり）と曲げる動き（立ち上がり）が混在するため決めない
  motion: null,
  neckRotate: { name: "上位肋椎関節", note: "背骨と上のほうの肋骨のつなぎ目" },
  // 「上下に屈曲」は伸展（上位肋椎関節）と屈曲（胸肋関節）のどちらも含みうるため決めない
  neckUpDown: null,
  shoulderFrontBack: null,
  shoulderUpDown: null,
};

// ===== 施術の進め方（結果画面「改善までの目安と進め方」に、時間の流れとして表示する） =====
// 病状タイプにかかわらず、初回は必ず関節へのアプローチ（AFR）から始め、約2週間後に再評価し、
// 痛みが残っている場合に病状タイプを参考にして筋肉へのアプローチ（MCR・NMF）へ進む。
// 結果画面で使うのは次の項目：
//   flowLabel（各段階の小見出し）／ flowTitle（各段階の名前）／ arrowLabel（その段階へ向かう「↓」の横に出す言葉）／
//   period・periodByDuration（showPeriodOnArrow のときは次の「↓」の下、それ以外は段階の下に出す目安）
// それ以外の項目（overview・sectionTitle・description など）は、以前の詳しい表示用に残している
// sectionTitle（結果画面の項目名）・timing（時期）・period（期間の目安）・periodLabel（期間の見出し。無ければ「期間の目安」）・
// title・description を書き換えれば内容を変えられる。
// description の {type} は「○○タイプの傾向」（判定できないときは EXTRA_TEXTS.typeFallback）に置き換わる
// code はチャート上の名称（内部用。画面には出さない）。お客様向けの文言には AFR / MCR / NMF などの専門用語を書かない
// showJointTarget: 関節の対象を表示する / showDurationNote: 痛みが出てからの期間ごとの目安を表示する
// muscleItems: APPROACHES のどの項目を、判定結果の対象とともに表示するか
const TREATMENT_STEPS = [
  {
    code: "AFR",
    // overview: 結果画面上部の「これからの流れ」に出す短い一言
    overview: "まずは関節へのアプローチから",
    sectionTitle: "まず関節へのアプローチ",
    timing: "初回",
    // 「最大2週間程度で、身体の反応を確認」は次の「約2週間後 経過確認・再評価」と重なるため、結果画面には出さない
    // （period を書くと段階の下に、period と showPeriodOnArrow: true を書くと次の「↓」の下に表示される）
    flowLabel: "初回",
    flowTitle: "関節へのアプローチ",
    title: "関節へのアプローチ",
    description: "強く押したり揉んだりせず、やさしく触れるソフトな方法で関節へアプローチし、関節センサーの働きに働きかけます。",
    showJointTarget: true,
  },
  {
    code: "REVIEW",
    overview: "約2週間後に経過確認・再評価",
    // overviewNote: 「これからの流れ」で一言の下に添える補足
    overviewNote: "痛みがなくなっている場合も、経過を確認します",
    sectionTitle: "約2週間後に再評価",
    timing: "約2週間後",
    flowLabel: "約2週間後",
    flowTitle: "経過確認・再評価",
    title: "経過確認・再評価",
    description:
      "約2週間後に、痛みや日常生活での動きがどの程度変化したかを確認します。痛みがなくなっている場合も、経過確認・再評価を行います。",
    showDurationNote: true,
  },
  {
    code: "MCR_NMF",
    overview: "痛みが残る場合のみ、次のアプローチを検討",
    overviewNote: "筋肉や神経など、関節以外の要因も考えます",
    sectionTitle: "痛みが残る場合のみ、次のアプローチを検討",
    timing: "痛みが残っている場合のみ",
    arrowLabel: "痛みが残る場合",
    flowLabel: "次のアプローチ",
    flowTitle: "筋肉を緩める・筋肉の働きを促すトレーニング",
    period: "目安：1〜3か月",
    title: "筋肉を緩めるアプローチ／筋肉の働きを促すトレーニング",
    description:
      "関節へのアプローチ後も痛みが残っている場合には、関節以外の要因として、筋肉の緊張や筋肉の働き、神経に関係する要因なども考えます。{type}を参考にしながら、必要に応じて次のアプローチへ進みます。",
    muscleItems: ["mcr", "nmf"],
  },
];

// ===== 筋肉へのアプローチの説明 =====
// キーはチャート上の名称（mcr = MCR、nmf = NMF）。title / description はお客様向けの分かりやすい表現にする
// RESULTS の mcr / nmf には、それぞれの対象となる筋肉を書く。
// name（専門的な筋肉名）は内部用で画面には出さない。画面には note（一般の方向けの説明）だけを表示する
const APPROACHES = {
  mcr: {
    title: "筋肉を緩めるアプローチ",
    description: "緊張して硬くなった筋肉を緩め、動きやすい状態をつくります。",
  },
  nmf: {
    title: "筋肉の働きを促すトレーニング",
    description: "うまく使えていない筋肉が働くように促し、トレーニングで身体の使い方を身につけていきます。",
  },
};

// ===== 判定結果ごとの内容 =====
// kind: "joint"（動作時痛。チャート上は関節へのアプローチのみ）/ "muscle"（チャート上で次に筋肉へのアプローチが続くタイプ）/ "unclear"（判定しない）
// conditionType: チャート上の病状タイプ名。画面では「○○の傾向」（問診結果から考えられるタイプ）として表示する
// feature: 痛みの出方の特徴（問診の回答に近い言葉で、タイプ名の下に小さく表示する）
// causes: 結果画面「考えられる原因」（2〜3項目・短く）
// solutions: 結果画面「解決策」（2〜3項目・短く）。1つ目は初回に行うこと、2つ目以降は必要に応じて行うこととして表示する。
//   専門的な筋肉名や AFR / MCR / NMF などの略語は書かない。「関節を整える」ではなく関節センサーに着目した表現にする
// mcr / nmf: チャート上の対象筋（内部用。name は画面に出さない）
// 新しいタイプを追加するときは、ここに1件足して JUDGE_RULES からその結果IDを指定する
const JOINT_SOLUTION = "関節センサーの働きに着目した、関節へのアプローチ";

const RESULTS = {
  lowerJoint: {
    kind: "joint",
    conditionType: "動作時痛タイプ",
    feature: "動かすと痛い（寝返り・起き上がり・立ち上がりなど）",
    summary: "寝返りや起き上がり、立ち上がりなど、体を動かしたときに痛みが出る傾向があります。",
    causes: ["背骨・骨盤まわりの関節センサーの働き不足", "体のひねり方・曲げ方のくせ"],
    solutions: ["背骨・骨盤まわりの関節センサーに着目した、関節へのアプローチ", "体の動かし方のくせを一緒に確認"],
  },
  lowerStenosis: {
    kind: "muscle",
    conditionType: "脊柱管狭窄症タイプ",
    feature: "しばらく歩くと痛みが出る",
    summary: "歩き始めは良くても、しばらく立っていたり歩いたりすると痛みが出てくる傾向があります。",
    causes: ["立っているときの姿勢や背骨のバランス", "骨盤から太ももの付け根の筋肉の緊張", "お腹の深い筋肉の働きの低下"],
    solutions: [JOINT_SOLUTION, "骨盤から太ももの付け根の筋肉を緩める", "お腹の深い筋肉の働きを促すトレーニング"],
    mcr: { name: "腸骨筋", note: "骨盤の内側から太ももの付け根につながる筋肉" },
    nmf: { name: "腹横筋", note: "お腹を深いところからコルセットのように支える筋肉" },
  },
  lowerKneeHip: {
    kind: "muscle",
    conditionType: "変形性膝関節症・変形性股関節症タイプ",
    feature: "体重をかけると痛い（荷重時痛）",
    summary: "歩き始めや、脚に体重をかけたときに痛みが出る傾向があります。",
    causes: ["脚への体重（荷重）のかかり方", "お尻の横の筋肉の緊張", "太もも前側の筋肉の働きの低下"],
    solutions: [JOINT_SOLUTION, "お尻の横の筋肉を緩める", "太もも前側の筋肉の働きを促すトレーニング"],
    mcr: { name: "小殿筋・中殿筋", note: "お尻の横で骨盤を支える筋肉" },
    nmf: { name: "広筋（大腿四頭筋）", note: "太ももの前側でひざを支える筋肉" },
  },
  lowerDisc: {
    kind: "muscle",
    conditionType: "椎間板ヘルニアタイプ",
    feature: "座っていると痛い",
    summary: "座っているときに痛みが出やすい傾向があります（お尻から脚にかけての痛みを含む）。",
    causes: ["座り姿勢による背骨・骨盤への負担", "お尻の奥の筋肉の緊張", "背骨を支える深い筋肉の働きの低下"],
    solutions: [JOINT_SOLUTION, "お尻の奥の筋肉を緩める", "背骨を支える深い筋肉の働きを促すトレーニング"],
    mcr: { name: "深層外旋六筋", note: "お尻の奥で股関節を支える小さな筋肉のグループ" },
    nmf: { name: "多裂筋", note: "背骨を一つひとつ支える深い筋肉" },
  },
  upperJoint: {
    kind: "joint",
    conditionType: "動作時痛タイプ",
    feature: "首や肩を動かすと痛い",
    summary: "首や肩を動かしたときに、痛みが出る傾向があります。",
    causes: ["首・肩まわりの関節センサーの働き不足", "首や肩の動かし方のくせ"],
    solutions: ["首・肩まわりの関節センサーに着目した、関節へのアプローチ", "首や肩の動かし方のくせを一緒に確認"],
  },
  upperDisc: {
    kind: "muscle",
    conditionType: "椎間板ヘルニアタイプ",
    feature: "腕を下ろしていると痛い",
    summary: "腕を下ろしているときに痛みが出る傾向があります。肩甲骨が下向きに回りやすい傾向（下方回旋傾向）が考えられます。",
    causes: ["肩甲骨の位置や首・肩のバランス", "首から肩甲骨にかけての筋肉の緊張", "肩甲骨を支える背中の筋肉の働きの低下"],
    solutions: [JOINT_SOLUTION, "首から肩甲骨にかけての筋肉を緩める", "肩甲骨を支える背中の筋肉の働きを促すトレーニング"],
    mcr: { name: "肩甲挙筋", note: "首から肩甲骨につながる筋肉" },
    nmf: { name: "僧帽筋（下部線維）", note: "背中で肩甲骨を下から支える筋肉" },
  },
  upperToc: {
    kind: "muscle",
    conditionType: "胸郭出口症候群タイプ",
    feature: "腕を上げると痛い",
    summary: "腕を上げたときに痛みが出る傾向があります。肩甲骨が前に傾きやすい傾向（前傾傾向）が考えられます。",
    causes: ["肩甲骨が前に傾きやすい姿勢", "胸の奥の筋肉の緊張", "肩甲骨を支える背中の筋肉の働きの低下"],
    solutions: [JOINT_SOLUTION, "胸の奥の筋肉を緩める", "肩甲骨を支える背中の筋肉の働きを促すトレーニング"],
    mcr: { name: "小胸筋", note: "胸の奥で肩甲骨につながる筋肉" },
    nmf: { name: "僧帽筋（下部線維）", note: "背中で肩甲骨を下から支える筋肉" },
  },
  upperTennis: {
    kind: "muscle",
    conditionType: "テニス肘タイプ",
    feature: "動かしたあと肘に痛みが残る",
    summary: "首や肩を動かしたあとに、肘のまわりに痛みが残る傾向があります。",
    causes: ["腕や手の使い方のくせ", "二の腕の筋肉の緊張", "肘まわりの筋肉の働きの低下"],
    solutions: [JOINT_SOLUTION, "二の腕の筋肉を緩める", "肘まわりの筋肉の働きを促すトレーニング"],
    mcr: { name: "上腕筋", note: "二の腕の前側、深いところにある筋肉" },
    nmf: { name: "肘筋", note: "肘の外側にある小さな筋肉" },
  },
  upperFrozen: {
    kind: "muscle",
    conditionType: "五十肩タイプ",
    feature: "動かしたあと肩に痛みが残る",
    summary: "首や肩を動かしたあとに、肩（腕の付け根の関節）に痛みが残る傾向があります。",
    causes: ["肩まわりの関節センサーの働き不足", "肩まわりの筋肉の緊張", "肩を内側から支える筋肉の働きの低下"],
    solutions: [JOINT_SOLUTION, "肩まわりの筋肉を緩める", "肩を内側から支える筋肉の働きを促すトレーニング"],
    mcr: { name: "棘上筋", note: "肩甲骨の上から腕の付け根につながる筋肉" },
    nmf: { name: "棘上筋・肩甲下筋", note: "肩関節を内側から支える筋肉" },
  },
  unclear: {
    kind: "unclear",
    conditionType: null,
    feature: null,
    summary:
      "今回の回答では、痛みのタイプを1つに絞ることができませんでした。痛みの出方を直接確認したうえで、あなたに合った進め方をご提案します。",
    causes: [],
    solutions: ["カウンセリングで痛みの出方を確認し、進め方を一緒に決めます"],
  },
};

// ===== 状況に応じて追加する要因・案内文 =====
const EXTRA_TEXTS = {
  // 動作時痛があり、さらに筋肉系の type に当てはまったとき
  jointCause: "首・肩まわりの関節センサーの働き不足",
  // 関節が主な要因だが、痛みの期間が長いとき
  longDurationCause: "痛みが長引いていることによる、筋肉の緊張や働きの変化",
  // 対象の関節がチャートと1対1で決まらないとき
  jointUnknownNote: "どの関節にアプローチするかは、カウンセリングで実際の動きを確認して決めます。",
  // 対象の筋肉がチャートで決まらないとき
  muscleTargetNote: "対象となる筋肉はカウンセリングで確認します。",
  // 「その他」を選んだ回答があるとき
  otherAnswerNote: "「その他」にご記入いただいた内容は、カウンセリングで詳しくお伺いします。",
  unclearCause: "詳しい原因は、カウンセリングで確認します",
  // 病状タイプの位置づけ（「今回の痛みの見立て」に添える）
  typeNote: "このタイプは、約2週間後の再評価でも痛みが残っている場合に、次のアプローチを考えるための参考にします。",
  // STEP の {type} に入れる文言（タイプが判定できないとき）
  typeFallback: "カウンセリングで確認した痛みの出方",
  // 期間の目安に添える一文
  periodNote: "期間は目安であり、改善を保証するものではありません。",
  // 「解決策」の各項目に付ける小さな印（1つ目は初回に行うこと、2つ目以降は必要に応じて行うこと）
  solutionTags: { first: "初回", rest: "必要に応じて" },
};

// ===== 改善見込み（将来、実績データが集まったら使う） =====
// enabled を true にし、byResult に結果IDごとの値と根拠を入れると結果画面に表示される。
// 例: byResult: { lowerDisc: { text: "約○％", basis: "2027年○月までの○名の実績より" } }
const IMPROVEMENT_RATE = {
  enabled: false,
  byResult: {},
};

// ===== 注意書き（結果画面をシンプルにしたため現在は表示していない） =====
const DISCLAIMER =
  "この結果は問診回答をもとにした参考分析であり、医療機関による診断ではありません。改善までの期間は目安であり、改善や治癒を保証するものではありません。強い痛みやしびれ、症状の急な悪化がある場合は、医療機関にご相談ください。";
