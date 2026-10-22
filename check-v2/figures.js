// 筋肉イラスト（check-v2）。結果画面（index.html）と13種類の一覧（muscles.html）で共通に使う。
// 人物はユーザー提供の画像（images/source/）だけを使い、人物を新しく描かない。
//   ・棘上筋・肩甲下筋：ユーザー提供の完成イラスト（images/source/shoulder-cards.webp）から、見出しの文字だけを消して切り出した画像
//   ・ほかの11種類：キャラクターシート（images/source/character-sheet-retouched.webp。短パンの股・お尻の線だけを消したもの）を
//     角度ごとに切り出した画像に、筋肉の位置（淡いゴールド）・細い引き出し線・丸い拡大図を重ねる
// 筋肉の位置・形は一般的な解剖学の位置関係で描く（筋肉ごとの起始・停止は ZOOM_SCENES のコメント）。

const SVG_NS = "http://www.w3.org/2000/svg";

/** SVG の要素を作る */
function svgEl(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/** HTML の要素を作る（文字は textContent で入れる） */
function figEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

const ART = {
  line: "#2f4a3e",       // 線・印（深緑）
  label: "#1f3a2e",      // 拡大図の筋肉名
  zoomBg: "#fbf7ef",     // 拡大図の地色
  bone: "#f3ece0",       // 拡大図の骨（やわらかい色）
  boneLine: "#cbbfa9",
  gold: "#dcb468",
  goldLight: "#f3dca6",
  goldLine: "#c99c50",
  cardBg: "#fcfaf4",     // カードの地色（人物画像の背景色に合わせる）
};

/** 人物画像（キャラクターシートから角度ごとに切り出したもの）。x / y / width / height は筋肉の座標で使う枠 */
const BODY_IMAGES = {
  backUpper: { href: "images/body-back-upper.webp", x: 0, y: 0, width: 418, height: 668 },   // 後ろ姿・上半身
  frontUpper: { href: "images/body-front-upper.webp", x: 0, y: 0, width: 412, height: 670 }, // 正面・上半身
  frontFull: { href: "images/body-front-full.webp", x: 30, y: 0, width: 250, height: 540 }, // 正面・頭からひざ（全身図の座標）
  backFull: { href: "images/body-back-full.webp", x: 30, y: 0, width: 235, height: 520 },   // 後ろ姿・頭からひざ（全身図の座標）
};

// ===== 丸い拡大図の中身（中心 0,0・半径 100 の座標。右側の筋肉を、人物と同じ向きから見た図） =====
// bones：骨（やわらかい色）／ribs：肋骨（帯状）／muscles：対象の筋肉／deep：さらに奥にある筋肉（点線）／
// fibers：筋の流れ／over：筋肉の上に重ねる骨
const ZOOM_SCENES = {
  // 腸骨筋：腸骨の内側（腸骨窩）→ 大腿骨の小転子。正面から見た右の骨盤（外側が左）
  iliacus: {
    bones: [
      { d: "M48 -58 L80 -52 L74 18 L58 40 L44 -10 Z" },
      { d: "M42 -56 C20 -82 -42 -86 -70 -60 C-80 -50 -82 -38 -73 -30 C-66 -20 -60 -4 -50 10 L-30 22 C-10 10 12 -6 32 -16 C42 -26 46 -42 42 -56 Z" },
      { d: "M-30 22 C-18 36 4 46 34 46 L64 42 L64 56 C34 62 2 62 -24 52 C-38 46 -46 36 -46 26 Z" },
      { d: "M-90 36 C-82 30 -64 32 -54 40 L-42 48 C-46 62 -48 82 -48 110 L-78 110 C-78 82 -82 56 -90 36 Z" },
      { circle: { cx: -46, cy: 26, r: 14 } },
      { circle: { cx: -40, cy: 62, r: 6 } },
    ],
    muscles: ["M34 -50 C12 -73 -40 -76 -62 -55 C-70 -45 -66 -30 -58 -15 C-52 -2 -46 12 -41 30 C-39 45 -39 55 -41 62 L-33 64 C-29 49 -23 30 -11 15 C4 0 22 -15 35 -28 Z"],
    fibers: ["M28 -44 C5 -20 -20 15 -37 58", "M0 -66 C-12 -30 -28 10 -37 58", "M-40 -66 C-44 -30 -42 10 -37 58", "M-60 -48 C-52 -20 -44 20 -37 58"],
  },
  // 腹横筋：下部の肋軟骨の内側・腰の筋膜・腸骨稜 → お腹の中央（白線）。横向きの線維でお腹を包む。正面から見た右側
  transversus: {
    muscles: ["M-94 -28 C-60 -42 -10 -52 46 -56 L48 96 C14 98 -16 94 -40 84 C-62 74 -82 62 -98 54 Z"],
    fibers: ["M-90 -20 C-50 -30 0 -38 46 -40", "M-94 5 C-50 0 0 -4 46 -5", "M-96 30 C-50 30 0 30 47 30", "M-90 55 C-50 62 0 68 47 70"],
    over: [
      { rib: "M60 -70 C20 -62 -40 -55 -96 -30" },
      { rib: "M55 -92 C10 -88 -50 -82 -100 -58" },
      { d: "M-100 66 C-80 54 -55 56 -38 74 C-30 82 -30 92 -36 100 L-46 100 C-44 92 -46 84 -52 78 C-66 66 -82 66 -100 76 Z" },
      { guide: "M50 -80 L50 100" },
    ],
  },
  // 中殿筋（上）・小殿筋（奥・点線）：腸骨の外側 → 大腿骨の大転子。後ろから見た右の骨盤（外側が右）
  gluteMed: {
    bones: [
      { d: "M-62 -46 L-96 -40 L-90 30 L-72 46 Z" },
      { d: "M-56 -50 C-30 -80 30 -84 70 -56 C80 -46 78 -30 68 -18 C55 0 40 14 25 24 L-10 24 C-30 10 -50 -10 -58 -30 Z" },
      { d: "M-10 24 C-6 40 0 54 14 60 C26 62 30 52 26 42 L25 24 Z" },
      { d: "M58 40 C70 32 86 34 92 46 C90 70 88 96 86 120 L60 120 C60 96 58 70 58 40 Z" },
      { circle: { cx: 30, cy: 30, r: 13 } },
    ],
    muscles: ["M-46 -50 C-10 -80 40 -80 68 -54 C76 -42 76 -26 72 -10 C75 10 78 24 82 38 L67 44 C50 24 24 4 0 -6 C-20 -16 -38 -30 -46 -50 Z"],
    deep: ["M-18 -46 C12 -62 46 -58 62 -40 C66 -20 70 8 72 32 L64 36 C50 14 25 -6 0 -16 C-12 -24 -18 -34 -18 -46 Z"],
    fibers: ["M-40 -46 C0 -20 40 10 74 38", "M0 -66 C25 -30 50 5 75 38", "M45 -66 C60 -30 68 5 76 38"],
  },
  // 広筋（外側広筋・内側広筋・中間広筋〈奥・点線〉）：大腿骨 → ひざのお皿（膝蓋骨）。正面から見た右の太もも（外側が左）
  vastus: {
    bones: [
      { d: "M-10 -96 L12 -96 L14 66 C20 74 24 82 20 90 L-20 90 C-24 82 -20 74 -12 66 Z" },
      { ellipse: { cx: 0, cy: 98, rx: 14, ry: 17 } },
    ],
    muscles: [
      "M-14 -90 C-40 -60 -48 -10 -42 40 C-38 64 -26 84 -12 94 L-6 80 C-14 50 -16 10 -16 -30 Z",
      "M16 0 C36 24 42 54 34 80 C28 92 18 98 10 98 L8 82 C14 60 16 30 16 0 Z",
    ],
    deep: ["M-12 -82 L12 -82 L14 64 L-14 64 Z"],
    fibers: ["M-30 -60 C-34 -20 -32 30 -14 86", "M30 30 C30 55 24 75 12 92"],
  },
  // 深層外旋六筋（梨状筋・上双子筋・内閉鎖筋・下双子筋・大腿方形筋〈外閉鎖筋は奥〉）：仙骨・骨盤の後ろ側 → 大転子。後ろから見た右（外側が右）
  deepRotators: {
    bones: [
      { d: "M-96 -60 L-56 -60 L-50 10 L-70 42 L-92 30 Z" },
      { d: "M-56 -60 C-20 -90 40 -86 70 -60 C72 -40 60 -20 40 -6 L-42 0 Z" },
      { d: "M-32 18 C-22 40 -10 56 6 60 C22 62 26 52 20 40 C14 26 0 16 -32 18 Z" },
      { d: "M58 -10 C72 -14 84 -6 86 6 C88 20 84 30 78 36 L80 120 L56 120 L56 30 C52 20 52 0 58 -10 Z" },
      { circle: { cx: 36, cy: 8, r: 12 } },
    ],
    muscles: [
      "M-54 -26 C-20 -33 30 -23 66 -9 L64 2 C30 -8 -20 -12 -52 -9 Z",
      "M-16 8 C14 6 44 5 66 5 L66 17 C44 19 14 21 -12 23 Z",
      "M10 40 C30 36 50 34 70 32 L72 48 C50 52 30 56 12 58 Z",
    ],
    fibers: ["M-50 -18 C-10 -22 30 -14 64 -4", "M-12 15 C20 12 44 11 64 11", "M14 49 C34 45 52 42 70 40"],
  },
  // 多裂筋：仙骨・腰椎の横突起 → 上の椎骨の棘突起。背骨のすぐ両わき（後ろから見た腰の背骨）
  multifidus: {
    bones: [
      ...[-92, -62, -32, -2, 28].flatMap((y) => [
        { d: `M-30 ${y} C-30 ${y - 4} 30 ${y - 4} 30 ${y} L30 ${y + 8} C30 ${y + 12} -30 ${y + 12} -30 ${y + 8} Z` },
        { d: `M-7 ${y - 4} L7 ${y - 4} L7 ${y + 16} L-7 ${y + 16} Z` },
      ]),
      { d: "M-42 58 L42 58 C38 75 26 92 12 104 L-12 104 C-26 92 -38 75 -42 58 Z" },
    ],
    muscles: [
      "M-9 -100 L-26 -100 C-30 -40 -34 20 -38 60 L-9 60 Z", "M9 -100 L26 -100 C30 -40 34 20 38 60 L9 60 Z",
      "M-36 58 L-9 58 L-9 92 C-20 84 -30 72 -36 58 Z", "M36 58 L9 58 L9 92 C20 84 30 72 36 58 Z",
    ],
    fibers: ["M-30 40 L-11 10", "M-28 10 L-11 -20", "M-26 -20 L-11 -50", "M-24 -50 L-11 -80",
      "M30 40 L11 10", "M28 10 L11 -20", "M26 -20 L11 -50", "M24 -50 L11 -80"],
  },
  // 肩甲挙筋：首の骨（第1〜4頸椎の横突起）→ 肩甲骨の上角。後ろから見た右（外側が右）
  levator: {
    bones: [
      ...[-96, -71, -46, -21].map((y) => ({ d: `M-74 ${y} L-42 ${y} L-40 ${y + 18} L-76 ${y + 18} Z` })),
      { d: "M-12 32 L58 26 C74 28 86 36 92 46 L72 104 L-20 104 Z" },
      { d: "M-16 52 C20 46 60 34 92 26 L94 34 C62 44 24 58 -14 64 Z" },
    ],
    muscles: ["M-44 -90 C-36 -92 -30 -86 -30 -78 C-26 -44 -18 -6 -4 30 L-18 36 C-32 4 -42 -32 -48 -72 Z"],
    fibers: ["M-40 -84 C-30 -40 -20 0 -10 32", "M-46 -60 C-36 -20 -24 10 -14 34"],
  },
  // 僧帽筋下部線維：胸椎の棘突起（第4〜12胸椎）→ 肩甲棘の内側の端。後ろから見た右（背骨が左）
  lowerTrap: {
    bones: [
      ...[-80, -54, -28, -2, 24, 50, 76].map((y) => ({ d: `M-68 ${y} L-56 ${y} L-56 ${y + 13} L-68 ${y + 13} Z` })),
      { d: "M-14 -70 L60 -76 C76 -72 86 -62 90 -50 L70 30 C40 50 10 72 -4 90 C-10 40 -12 -10 -14 -70 Z" },
      { d: "M-14 -40 C20 -50 55 -64 90 -74 L92 -66 C58 -54 22 -40 -12 -30 Z" },
    ],
    muscles: ["M-60 -34 L-10 -44 L-4 -34 C-22 0 -40 50 -60 100 Z"],
    fibers: ["M-58 -20 L-8 -40", "M-58 20 L-8 -38", "M-58 60 L-8 -36", "M-58 95 L-8 -35"],
  },
  // 小胸筋：第3〜5肋骨 → 肩甲骨の烏口突起。正面から見た右の胸（外側が左）
  pecMinor: {
    ribs: ["M-64 -36 C-20 -52 30 -48 76 -32", "M-64 -6 C-20 -22 30 -18 76 -2", "M-64 24 C-20 8 30 12 76 28", "M-64 54 C-20 38 30 42 76 58", "M-64 84 C-20 68 30 72 76 88"],
    bones: [
      { d: "M70 -64 L90 -64 L88 100 L72 100 Z" },
      { d: "M-96 -78 C-50 -74 0 -82 56 -72 L56 -62 C0 -70 -50 -64 -96 -66 Z" },
      { circle: { cx: -86, cy: -40, r: 20 } },
      { d: "M-72 -58 C-62 -66 -48 -64 -44 -56 C-46 -48 -56 -46 -64 -48 Z" },
    ],
    muscles: ["M-56 -56 L-44 -60 C-18 -30 12 10 38 56 L8 66 C-14 30 -38 -14 -56 -56 Z"],
    fibers: ["M-48 -56 C-30 -20 -10 20 12 62", "M-46 -58 C-24 -24 4 16 32 58"],
  },
  // 上腕筋：上腕骨の前面（下半分）→ 尺骨（ひじの少し下）。正面から見た右の腕
  brachialis: {
    bones: [
      { d: "M-10 -100 L10 -100 L12 40 C26 45 30 55 26 62 L-26 62 C-30 55 -26 45 -12 40 Z" },
      { d: "M-20 68 L-6 68 L-6 110 L-18 110 Z" },
      { d: "M4 68 L18 68 L16 110 L4 110 Z" },
    ],
    muscles: ["M-15 -24 C-24 0 -25 24 -19 44 C-15 58 -8 72 -3 84 L6 84 C9 70 14 58 19 44 C25 24 24 0 15 -24 Z"],
    fibers: ["M-8 -20 C-10 20 -6 55 0 82", "M8 -20 C10 20 6 55 2 82"],
  },
  // 肘筋：上腕骨の外側上顆 → 肘頭の外側・尺骨の後ろ側。後ろから見た右のひじ（外側が右）
  anconeus: {
    bones: [
      { d: "M-14 -100 L14 -100 L16 -12 C30 -8 36 2 32 12 L-32 12 C-36 2 -30 -8 -16 -12 Z" },
      { d: "M-10 -2 C-6 -14 6 -14 10 -2 L10 104 L-6 104 Z" },
      { d: "M16 20 L28 20 L30 104 L18 104 Z" },
    ],
    muscles: ["M30 6 C32 20 26 42 13 62 L8 54 C10 36 10 20 12 4 Z"],
    fibers: ["M28 10 L12 56", "M20 8 L10 48"],
  },
};

/** 拡大図の骨・筋肉を描く（ZOOM_SCENES の1件） */
function drawZoomScene(g, scene, gradId) {
  const line = (color, width, extra = {}) => ({ fill: "none", stroke: color, "stroke-width": width, "stroke-linecap": "round", "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke", ...extra });
  const bone = (b) => {
    if (b.circle) return svgEl("circle", { ...b.circle, fill: ART.bone, ...line(ART.boneLine, 0.9), fill: ART.bone });
    if (b.ellipse) return svgEl("ellipse", { ...b.ellipse, ...line(ART.boneLine, 0.9), fill: ART.bone });
    if (b.guide) return svgEl("path", { d: b.guide, ...line(ART.boneLine, 0.8, { "stroke-dasharray": "3 3" }) });
    if (b.rib) {
      const group = svgEl("g", {});
      group.appendChild(svgEl("path", { d: b.rib, ...line(ART.boneLine, 1), "stroke-width": 12, "vector-effect": "none" }));
      group.appendChild(svgEl("path", { d: b.rib, ...line(ART.bone, 1), "stroke-width": 10, "vector-effect": "none" }));
      return group;
    }
    return svgEl("path", { d: b.d, ...line(ART.boneLine, 0.9), fill: ART.bone });
  };
  (scene.ribs || []).forEach((d) => g.appendChild(bone({ rib: d })));
  (scene.bones || []).forEach((b) => g.appendChild(bone(b)));
  scene.muscles.forEach((d) => g.appendChild(svgEl("path", { d, fill: `url(#${gradId})`, ...line(ART.goldLine, 0.9), fill: `url(#${gradId})`, "fill-opacity": 0.92 })));
  (scene.fibers || []).forEach((d) => g.appendChild(svgEl("path", { d, ...line(ART.goldLine, 0.6, { opacity: 0.55 }) })));
  (scene.deep || []).forEach((d) => g.appendChild(svgEl("path", { d, ...line(ART.goldLine, 0.9, { "stroke-dasharray": "4 3" }), fill: ART.goldLight, "fill-opacity": 0.35 })));
  (scene.over || []).forEach((b) => g.appendChild(bone(b)));
}

/** 人物画像に筋肉・引き出し線・丸い拡大図を重ねた SVG を作る */
function renderOverlayArt(key, figure) {
  const art = figure.art;
  const body = BODY_IMAGES[art.body];
  const { cx, cy, r } = art.zoom;
  const id = `fig-${key}`;
  const svg = svgEl("svg", { viewBox: art.viewBox, class: "block h-auto w-full", role: "img", "aria-label": `${figure.name}の位置（${art.angle}と拡大図）` });
  const defs = svgEl("defs", {});
  const grad = svgEl("linearGradient", { id: `${id}-gold`, x1: "0", y1: "0", x2: "1", y2: "1" });
  grad.appendChild(svgEl("stop", { offset: "0", "stop-color": ART.goldLight }));
  grad.appendChild(svgEl("stop", { offset: "1", "stop-color": ART.gold }));
  defs.appendChild(grad);
  const blur = svgEl("filter", { id: `${id}-soft`, x: "-40%", y: "-40%", width: "180%", height: "180%" });
  blur.appendChild(svgEl("feGaussianBlur", { stdDeviation: r * 0.04 }));
  defs.appendChild(blur);
  const clip = svgEl("clipPath", { id: `${id}-clip` });
  clip.appendChild(svgEl("circle", { cx, cy, r }));
  defs.appendChild(clip);
  svg.appendChild(defs);

  // 人物（ユーザー提供の画像そのもの）
  svg.appendChild(svgEl("image", { href: body.href, x: body.x, y: body.y, width: body.width, height: body.height, preserveAspectRatio: "none" }));
  // 筋肉の位置（半透明の淡いゴールド＋ふんわりしたにじみ）
  svg.appendChild(svgEl("path", { d: art.muscle, fill: ART.gold, opacity: 0.35, filter: `url(#${id}-soft)` }));
  svg.appendChild(svgEl("path", { d: art.muscle, fill: `url(#${id}-gold)`, "fill-opacity": 0.62, stroke: ART.goldLine, "stroke-width": 0.8, "stroke-opacity": 0.55, "vector-effect": "non-scaling-stroke" }));
  // 細い引き出し線（印 → 丸い拡大図のふち）
  const dx = art.dot.x - cx;
  const dy = art.dot.y - cy;
  const len = Math.hypot(dx, dy);
  svg.appendChild(svgEl("line", { x1: art.dot.x, y1: art.dot.y, x2: cx + (dx / len) * r, y2: cy + (dy / len) * r, stroke: ART.line, "stroke-width": 1, "vector-effect": "non-scaling-stroke" }));
  svg.appendChild(svgEl("circle", { cx: art.dot.x, cy: art.dot.y, r: r * 0.035, fill: ART.line }));
  // 丸い拡大図
  svg.appendChild(svgEl("circle", { cx, cy, r, fill: ART.zoomBg }));
  const g = svgEl("g", { "clip-path": `url(#${id}-clip)` });
  const scene = svgEl("g", { transform: `translate(${cx} ${cy}) scale(${r / 112})` });
  drawZoomScene(scene, ZOOM_SCENES[key], `${id}-gold`);
  g.appendChild(scene);
  svg.appendChild(g);
  svg.appendChild(svgEl("circle", { cx, cy, r, fill: "none", stroke: ART.goldLine, "stroke-width": 1.3, "vector-effect": "non-scaling-stroke" }));
  // 筋肉名が長いとき（広筋（大腿四頭筋）など）は、枠からはみ出さないよう文字を小さくする
  const [vx, , vw] = art.viewBox.split(" ").map(Number);
  const room = 2 * Math.min(cx - vx, vx + vw - cx) * 0.94;
  const size = Math.min(r * 0.27, room / (figure.name.length * 1.1));
  const label = svgEl("text", { x: cx, y: cy + r + r * 0.34, "text-anchor": "middle", fill: ART.label, "font-size": size, "font-family": '"Shippori Mincho", serif', "font-weight": 600, "letter-spacing": size * 0.1 });
  label.textContent = figure.name;
  svg.appendChild(label);
  return svg;
}

// 見出しの改行位置（「|」の位置でだけ改行する）。iPhone の Safari は日本語を文節で折り返せないため、区切りを決めておく。
// 「|」を除いた文字が config.js の title と同じときだけ使う（違うときは、そのまま表示する）
const TITLE_PHRASES = {
  supraspinatus: "肩を|持ち上げる|動きを|支える筋肉",
  subscapularis: "肩の関節を|安定させる筋肉",
  levator: "首と肩甲骨を|つなぐ筋肉",
  lowerTrap: "肩甲骨の動きを|支える筋肉",
  multifidus: "背骨を|安定させる筋肉",
  gluteMed: "お尻の横で|骨盤を支える筋肉",
  deepRotators: "股関節を|安定させる|深い筋肉",
  iliacus: "脚の付け根の|動きに関わる筋肉",
  transversus: "お腹を内側から|支える筋肉",
  pecMinor: "胸と肩甲骨を|つなぐ筋肉",
  vastus: "太もも前側で|膝を伸ばす筋肉",
  brachialis: "肘を曲げる筋肉",
  anconeus: "肘を伸ばす|動きを助ける筋肉",
};

/** カードの大きな見出し（分かりやすい日本語。文節の区切りでだけ改行する） */
function renderMuscleTitle(key, figure) {
  const title = figure.title || figure.name;
  const node = figEl("p", "font-serif text-[22px] font-semibold leading-snug tracking-[0.06em] text-brand-700 sm:text-[24px]");
  const phrases = TITLE_PHRASES[key];
  if (phrases && phrases.replaceAll("|", "") === title) {
    phrases.split("|").forEach((part) => node.appendChild(figEl("span", "inline-block", part)));
  } else {
    node.textContent = title;
  }
  return node;
}

/** 筋肉カード1枚（筋肉名・場所の短い説明・イラスト）。13種類すべて同じ形 */
function renderMuscleCard(key, figure) {
  const card = figEl("figure", "rounded-[22px] border border-gold/25 px-4 pb-4 pt-5 shadow-[0_12px_30px_-24px_rgba(31,58,46,.45)] sm:px-6");
  card.style.background = ART.cardBg;
  // 大きな見出しは分かりやすい日本語（title）、その下に小さめの文字で正式な筋肉名、場所の短い説明
  const caption = figEl("figcaption", "");
  caption.appendChild(renderMuscleTitle(key, figure));
  if (figure.title) caption.appendChild(figEl("p", "mt-1.5 text-[14px] font-medium leading-snug tracking-[0.04em] text-gold-deep sm:text-[15px]", `筋肉名：${figure.name}`));
  caption.appendChild(figEl("p", "mt-1 text-[14px] leading-snug tracking-[0.04em] text-ink-soft", figure.place));
  card.appendChild(caption);
  const box = figEl("div", "mt-3");
  if (figure.art.image) {
    // ユーザー提供の完成イラスト（人物・筋肉・拡大図が描かれた画像）をそのまま表示する
    const img = figEl("img", "block h-auto w-full");
    img.src = figure.art.image;
    img.alt = `${figure.name}の位置（${figure.art.angle}と拡大図）`;
    img.width = figure.art.width;
    img.height = figure.art.height;
    img.loading = "lazy";
    box.appendChild(img);
  } else {
    box.appendChild(renderOverlayArt(key, figure));
  }
  card.appendChild(box);
  return card;
}

/** 結果画面の「関係する筋肉の位置」（筋肉名を設定したタイプだけ表示する） */
function renderFigures(figures) {
  const box = document.getElementById("result-figures-box");
  box.classList.toggle("hidden", figures.length === 0);
  document.getElementById("result-figures-title").textContent = CAUSE_TEXTS.figuresTitle;
  const grid = document.getElementById("result-figures");
  grid.replaceChildren();
  // スマホでも筋肉の位置が分かるよう、カードは横幅いっぱいに1枚ずつ並べる
  grid.className = "mt-2 grid grid-cols-1 gap-3";
  figures.forEach(({ key, figure }) => grid.appendChild(renderMuscleCard(key, figure)));
  setFiguresOpen(false); // 新しい結果を出すたびに、閉じた状態から始める
}

/** 「関係する筋肉を詳しく見る」の開閉 */
function setFiguresOpen(open) {
  const toggle = document.getElementById("result-figures-toggle");
  if (!toggle) return;
  toggle.setAttribute("aria-expanded", String(open));
  document.getElementById("result-figures-toggle-label").textContent = open ? CAUSE_TEXTS.figuresClose : CAUSE_TEXTS.figuresOpen;
  document.getElementById("result-figures-toggle-icon").textContent = open ? "－" : "＋";
  document.getElementById("result-figures-panel").classList.toggle("hidden", !open);
}

// 結果画面にだけあるボタン（一覧ページ muscles.html には無い）
const figuresToggle = document.getElementById("result-figures-toggle");
if (figuresToggle) {
  figuresToggle.addEventListener("click", () => setFiguresOpen(figuresToggle.getAttribute("aria-expanded") !== "true"));
}
