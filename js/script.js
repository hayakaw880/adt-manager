document.addEventListener('DOMContentLoaded', () => {
  /** ====== ここだけ変えれば挙動を調整できる ====== */
  const WEEKS_BACK = Number(
    new URLSearchParams(location.search).get('weeks') ?? 4
  );

  // 月=1, 火=2, 水=3, 木=4, 金=5
  const TIMES = ['16:00', '18:00'];
  const TIMES_BY_DOW = {
    1: TIMES, 2: TIMES, 3: TIMES, 4: TIMES, 5: TIMES,
  };
  
  // 難易度を ALL のみに変更
  const DIFFICULTIES = [
    { slug: 'all',  label: 'All'  },
  ];
  /** ============================================== */

  const tbody = document.getElementById('schedule-body');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const MS_PER_DAY = 86_400_000;
  const maxDays = WEEKS_BACK * 7;

  // ── 日付を今日から古い方へ調べる
  for (let off = 0; off <= maxDays; off++) {
    const d = new Date(today.getTime() - off * MS_PER_DAY);
    const dow = d.getDay();
    if (!TIMES_BY_DOW[dow]) continue;

    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const ymd = `${y}${m}${dd}`;

    TIMES_BY_DOW[dow].forEach((time, idx) => {
      const slot = idx + 1;
      const tr = document.createElement('tr');

      /* 日付＋時刻セル */
      const tdDate = document.createElement('td');
      tdDate.textContent = `${y}-${m}-${dd} ${time}`;
      tr.appendChild(tdDate);

      /* 各 difficulty セル */
      DIFFICULTIES.forEach(({ slug, label }) => {
        const td = document.createElement('td');
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.className = 'chk';

        const a = document.createElement('a');
        a.href   = `https://atcoder.jp/contests/adt_${slug}_${ymd}_${slot}`;
        a.target = '_blank';
        a.textContent = label;

        td.appendChild(chk);
        td.appendChild(a);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  document.querySelectorAll('input.chk').forEach(chk => {
    const td  = chk.closest('td');
    const key = chk.nextElementSibling.href;

    /* ページ読み込み時の復元 */
    if (localStorage.getItem(key) === 'true') {
      chk.checked = true;
      td.classList.add('participated');
    }

    /* 変更時の保存 */
    chk.addEventListener('change', () => {
      td.classList.toggle('participated', chk.checked);
      localStorage.setItem(key, chk.checked);
    });
  });
});