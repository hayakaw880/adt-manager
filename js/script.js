// script.js
document.addEventListener('DOMContentLoaded', () => {
  // 全てのチェックボックスをループ
  document.querySelectorAll('input.chk').forEach(checkbox => {
    // このセルの <td> 要素を取得
    const td = checkbox.closest('td');
    // 一意のキーとしてリンク先 URL を使う
    const key = checkbox.nextElementSibling.href;

    // ① ページ読み込み時に保存済みの状態を復元
    if (localStorage.getItem(key) === 'true') {
      checkbox.checked = true;
      td.classList.add('participated');
    }

    // ② チェック変更時に色付け＆localStorage に保存
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        td.classList.add('participated');
      } else {
        td.classList.remove('participated');
      }
      localStorage.setItem(key, checkbox.checked);
    });
  });
});
