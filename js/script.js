document.addEventListener('DOMContentLoaded', () => {
  const WEEKS_BACK = Number(new URLSearchParams(location.search).get('weeks') ?? 4);

  // 月=1, 火=2, 水=3, 木=4, 金=5
  const TIMES = ['16:00', '18:00'];
  const TIMES_BY_DOW = {
    1: TIMES, 2: TIMES, 3: TIMES, 4: TIMES, 5: TIMES,
  };
  
  // A~Iの問題リストと、ステータスの選択肢
  const PROBLEMS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const STATUSES = [
    { value: 'unattempted', label: '未挑戦' },
    { value: 'ac', label: 'AC' },
    { value: 'editorial', label: '解説AC' },
    { value: 'trying', label: '挑戦中' }
  ];

  const tbody = document.getElementById('schedule-body');
  const table = document.querySelector('table');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const MS_PER_DAY = 86_400_000;
  const maxDays = WEEKS_BACK * 7;

  // --- 参加済み非表示UIの追加 ---
  const filterContainer = document.createElement('div');
  filterContainer.style.marginBottom = '10px';
  const hideChk = document.createElement('input');
  hideChk.type = 'checkbox';
  hideChk.id = 'hide-participated-chk';
  
  const hideLabel = document.createElement('label');
  hideLabel.style.cursor = 'pointer';
  hideLabel.appendChild(hideChk);
  hideLabel.appendChild(document.createTextNode(' 参加済みの回を非表示にする'));
  
  filterContainer.appendChild(hideLabel);
  table.parentNode.insertBefore(filterContainer, table);

  // 非表示状態の復元
  hideChk.checked = localStorage.getItem('hide-participated') === 'true';

  // フィルタリング実行関数
  function applyFilter() {
    const isHide = hideChk.checked;
    const rows = document.querySelectorAll('#schedule-body tr');
    rows.forEach(tr => {
      const chk = tr.querySelector('.chk');
      if (chk && chk.checked && isHide) {
        tr.style.display = 'none';
      } else {
        tr.style.display = '';
      }
    });
  }

  hideChk.addEventListener('change', () => {
    localStorage.setItem('hide-participated', hideChk.checked);
    applyFilter();
  });
  // ------------------------------

  // 背景色を更新する関数
  function updateCellColor(td, status) {
    td.classList.remove('status-ac', 'status-editorial', 'status-trying', 'status-unattempted');
    td.classList.add(`status-${status}`);
  }

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
      const contestId = `adt_all_${ymd}_${slot}`;
      
      // コンテストのURLを生成
      const contestUrl = `https://atcoder.jp/contests/${contestId}`;

      /* 日付＋時刻セル（ここをコンテストへのリンクにする） */
      const tdDate = document.createElement('td');
      const dateLink = document.createElement('a');
      dateLink.href = contestUrl;
      dateLink.target = '_blank';
      dateLink.textContent = `${y}-${m}-${dd} ${time}`;
      tdDate.appendChild(dateLink);
      tr.appendChild(tdDate);

      /* ALL セル（参加チェックボックスのみ） */
      const tdAll = document.createElement('td');
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'chk';
      chk.dataset.key = contestUrl; // 保存用のキーを設定
      
      // aタグの追加を削除し、チェックボックスのみ配置
      tdAll.appendChild(chk);
      tr.appendChild(tdAll);

      /* 各問題 (A~I) のセル */
      PROBLEMS.forEach(prob => {
        const tdProb = document.createElement('td');
        const select = document.createElement('select');
        select.className = 'status-select';
        
        // 保存用キー（例: adt_all_20260501_1_A）
        const storageKey = `${contestId}_${prob}`;

        // プルダウンの選択肢を作成
        STATUSES.forEach(st => {
          const opt = document.createElement('option');
          opt.value = st.value;
          opt.textContent = st.label;
          select.appendChild(opt);
        });

        // 保存されているステータスを復元（なければ未挑戦）
        const savedStatus = localStorage.getItem(storageKey) || 'unattempted';
        select.value = savedStatus;
        updateCellColor(tdProb, savedStatus);

        // 変更されたらローカルストレージに保存し、色を変える
        select.addEventListener('change', (e) => {
          const val = e.target.value;
          localStorage.setItem(storageKey, val);
          updateCellColor(tdProb, val);
        });

        tdProb.appendChild(select);
        tr.appendChild(tdProb);
      });

      tbody.appendChild(tr);
    });
  }

  /* ALL列の参加チェックボックスの復元と保存 */
  document.querySelectorAll('input.chk').forEach(chk => {
    const td  = chk.closest('td');
    const key = chk.dataset.key;

    if (localStorage.getItem(key) === 'true') {
      chk.checked = true;
      td.classList.add('participated');
    }

    chk.addEventListener('change', () => {
      td.classList.toggle('participated', chk.checked);
      localStorage.setItem(key, chk.checked);
      applyFilter(); // チェックを切り替えた時にもフィルタを適用
    });
  });

  // 初期ロード時にもフィルタを適用
  applyFilter();
});