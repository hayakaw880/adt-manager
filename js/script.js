// script.js
document.addEventListener('DOMContentLoaded', () => {
  // すべてのチェックボックスにイベントを追加
  document.querySelectorAll('input.chk[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', () => {
      const cell = chk.parentElement;  // 親の <td>
      if (chk.checked) {
        cell.classList.add('participated');
      } else {
        cell.classList.remove('participated');
      }
    });
  });
});
