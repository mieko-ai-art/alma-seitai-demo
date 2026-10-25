/* ============================================================
   リンク先の設定ファイル
   ------------------------------------------------------------
   URLが決まったら、下の "" の中に貼り付けて保存してください。
   例） reservation: "https://forms.gle/xxxxxxxx",

   空欄 "" のままの場合、ボタンを押すと
   「リンクは後日設定します」と表示されます。
   ============================================================ */

window.ALMA_LINKS = {
  // 無料診断（からだの痛みチェック）アプリのURL（v1〜v8 の旧版が使用。旧版の表示を変えないため空欄のまま残す）
  diagnosis: "",

  // 無料からだチェック（診断アプリ）のURL（Vercel で公開中の最新版。LINE公式の「無料診断」と同じ）
  bodyCheck: "https://pain-check-app.vercel.app/",

  // ご予約用 Googleフォーム のURL（公開版では未使用。下の reservationForm と同じ）
  reservation: "https://docs.google.com/forms/d/e/1FAIpQLSdODxRcdI_fqiLDrvWYRR0xMZs7sv-9h9PrReZI_oEX8hnt3g/viewform?usp=dialog",

  // 施術予約フォームのURL（v9 で使用。2026-10-25 に新しい「alma整体｜施術予約フォーム」へ差し替え。ページ内の予約ボタンはすべてここへ直接移動する）
  reservationForm: "https://docs.google.com/forms/d/e/1FAIpQLSdODxRcdI_fqiLDrvWYRR0xMZs7sv-9h9PrReZI_oEX8hnt3g/viewform?usp=dialog",

  // LINE公式アカウント（友だち追加）のURL
  line: "https://lin.ee/t6ZOaiV",

  // 「メールでお問い合わせ」の宛先と件名
  email: "alma.biz0024@gmail.com",
  emailSubject: "アルマ整体へのお問い合わせ"
};
