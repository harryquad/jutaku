// 住宅ローンの共通計算
const MAN = 10000;
const num = id => Math.max(0, Number(document.getElementById(id).value) || 0);
const yen = n => Math.round(n).toLocaleString("ja-JP") + "円";
const man = n => (Math.round(n / 1000) / 10).toLocaleString("ja-JP") + "万円";

// 元利均等返済の毎月の返済額
function annuity(principal, annualRate, months) {
  if (months <= 0) return 0;
  const r = annualRate / 12;
  return r ? principal * r / (1 - Math.pow(1 + r, -months)) : principal / months;
}

/**
 * 返済予定表を作る
 * p = { principal, rate（年利・小数）, months, type: "annuity"|"equal" }
 * rateAt(m) を渡すと、m回目（1始まり）の金利を変えられる（変動金利用）
 * 戻り値：各月の { m, pay, interest, principal, balance }
 */
function schedule(p, rateAt) {
  const rows = [];
  let bal = p.principal, pay = 0, curRate = null;
  for (let m = 1; m <= p.months && bal > 0.5; m++) {
    const rate = rateAt ? rateAt(m) : p.rate;
    const r = rate / 12;
    const interest = bal * r;
    let prin;
    if (p.type === "equal") {
      prin = p.principal / p.months;
      pay = prin + interest;
    } else {
      if (rate !== curRate) { pay = annuity(bal, rate, p.months - m + 1); curRate = rate; }
      prin = pay - interest;
    }
    prin = Math.min(prin, bal);
    bal -= prin;
    rows.push({ m, pay: prin + interest, interest, principal: prin, balance: bal, rate });
  }
  return rows;
}
const sum = (rows, k) => rows.reduce((s, r) => s + r[k], 0);

// ---- 税金（住宅ローン控除の上限計算用。2026年分の所得税） ----
const BRACKETS = [
  [1949000, 0.05, 0], [3299000, 0.10, 97500], [6949000, 0.20, 427500], [8999000, 0.23, 636000],
  [17999000, 0.33, 1536000], [39999000, 0.40, 2796000], [Infinity, 0.45, 4796000],
];
function salaryIncome(a) {
  const d = a <= 3600000 ? a * 0.3 + 80000 : a <= 6600000 ? a * 0.2 + 440000 : a <= 8500000 ? a * 0.1 + 1100000 : 1950000;
  return Math.max(0, a - Math.max(740000, d));
}
function basicIT(inc) {
  if (inc <= 4890000) return 1040000;
  if (inc <= 6550000) return 670000;
  if (inc <= 23500000) return 620000;
  return 480000;
}
// 会社員の所得税（住宅ローン控除前、復興特別所得税を除く）と課税総所得金額
// deps: 配偶者・扶養などの所得控除の合計
function incomeTaxBase(annual, deps = 0) {
  const inc = salaryIncome(annual);
  const social = Math.min(annual / 12, 650000) * 0.0915 * 12 + annual * 0.0555;
  const taxable = Math.max(0, Math.floor((inc - social - basicIT(inc) - deps) / 1000) * 1000);
  const [, rate, minus] = BRACKETS.find(b => taxable <= b[0]);
  return { taxable, tax: taxable ? taxable * rate - minus : 0, income: inc };
}
