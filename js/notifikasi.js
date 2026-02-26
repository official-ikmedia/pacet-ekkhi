document.addEventListener("DOMContentLoaded", function () {

  // aktifkan semua tooltip bootstrap
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const code = btn.closest(".copy-wrapper").querySelector("code").innerText;

      navigator.clipboard.writeText(code).then(() => {
        const tooltip = bootstrap.Tooltip.getInstance(btn);

        // ubah tooltip jadi "Copied!"
        btn.setAttribute("data-bs-original-title", "Berhasil di Copy");
        tooltip.show();

        // kembalikan ke "Copy"
        setTimeout(() => {
          tooltip.hide();
          btn.setAttribute("data-bs-original-title", "Copy");
        }, 1200);
      });
    });
  });
});