// 住宅ローンサイトのツール一覧（このサイト専用。ほかのサイトとは別管理）
const TOOLS = [
  { path: "/jutaku/", name: "住宅ローン 返済シミュレーション", desc: "毎月の返済額・利息の総額・年ごとの残高を計算（元利均等・元金均等）" },
  { path: "/jutaku/koujo/", name: "住宅ローン控除 計算（2026年入居）", desc: "新ルールの借入限度額・控除期間で、毎年いくら戻るかを計算" },
  { path: "/jutaku/karikae/", name: "住宅ローン 借り換え 計算", desc: "借り換えの諸費用を引いても得か、いくら得かを計算" },
  { path: "/jutaku/kinri/", name: "金利上昇 シミュレーション", desc: "変動金利が上がると返済額と総額はどうなる？固定金利とも比較" },
  { path: "/jutaku/kuriage/", name: "繰上げ返済 計算", desc: "期間短縮型と返済額軽減型で、減る利息と期間を比べる" },
  { path: "/jutaku/karireru/", name: "借りられる額・無理なく返せる額", desc: "年収から借入可能額の目安と、手取りから見た安全な借入額を計算" },
];

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("related");
  if (!el) return;
  const here = location.pathname.replace(/index\.html$/, "");
  el.innerHTML = `<h2>ほかのツール</h2><ul class="tools">${TOOLS.filter(t => t.path !== here)
    .map(t => `<li><a href="${t.path}"><b>${t.name}</b><span>${t.desc}</span></a></li>`).join("")}</ul>`;
});
