// function handleFormSubmit(event) {
//    event.preventDefault();

//    Swal.fire({
//       title: 'Kirim Doa dan Ucapan Ini?',
//       text: "",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#ff6a00',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Ya, kirim!'
//    }).then((result) => {
//       if (result.isConfirmed) {
//          const form = document.getElementById('combined-form');
//          const spinner = document.getElementById('spinnerContainer');
//          const submitButton = document.getElementById('submitButton');

//          submitButton.disabled = true;
//          submitButton.style.display = 'none';
//          spinner.style.display = 'block';

//          fetch(form.action, {
//                method: 'POST',
//                body: new FormData(form)
//             })
//             .then(response => {
//                if (response.ok) {
//                   Swal.fire('Terkirim!', 'Terima kasih atas doa dan ucapannya.', 'success');
//                   form.reset();
//                   fetchData();
//                } else {
//                   Swal.fire('Error!', 'Terjadi kesalahan, silakan coba lagi.', 'error');
//                }
//             })
//             .catch(error => {
//                Swal.fire('Error!', 'Terjadi kesalahan: ' + error.message, 'error');
//             })
//             .finally(() => {
//                submitButton.disabled = false;
//                submitButton.style.display = 'block';
//                spinner.style.display = 'none';
//             });
//       }
//    });
// }

// async function fetchData() {
//    try {
//       const response = await fetch(
//          'https://script.google.com/macros/s/AKfycbxNOw8Odh-YG3DuUfes_zYuurrqPlA_X4UO8YYO6mS6Ox5W2KcQEk3b92_keLzfqXys/exec'
//       );
//       const data = await response.json();

//       const commentsContainer = document.getElementById('comments-container');
//       commentsContainer.innerHTML = '';
//       data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort by timestamp descending
//       data.forEach(item => {
//          const comment = document.createElement('div');
//          comment.className = 'mb-4 bg-gradient p-3 rounded border border-light text-white';
//          comment.innerHTML = `<div class="border-bottom fw-bold">${item.nama}</div> <div class="fst-italic mt-2">${item.doa}</div>`;
//          commentsContainer.appendChild(comment);
//       });
//    } catch (error) {
//       console.error('Error fetching data:', error);
//    }
// }

// document.addEventListener('DOMContentLoaded', fetchData);


// async function checkUpdate() {
//   try {
//     const res = await fetch(API_URL);
//     const json = await res.json();

//     if (json.lastUpdated !== lastUpdated) {
//       console.log("🔄 Data berubah → update");
//       lastUpdated = json.lastUpdated;
//       renderData(json.data);
//     } else {
//       console.log("⏸️ Tidak ada perubahan");
//     }
//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

// // Load pertama
// checkUpdate();

// // Cek tiap 30 detik
// setInterval(checkUpdate, 30000);


const API_URL = 'https://script.google.com/macros/s/AKfycby7HfGzsBwHktnqJhr_2MON-pEfLB2-3_9F8jBZ492poA7REm5RMtOnjuckgSzvoziJ/exec';

function formatTanggalIndo(dateString) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return '';

  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const jam = date.getHours().toString().padStart(2, '0');
  const menit = date.getMinutes().toString().padStart(2, '0');
  const hari = date.getDate();
  const namaBulan = bulan[date.getMonth()];
  const tahun = date.getFullYear();

  return `${jam}:${menit} - ${hari} ${namaBulan} ${tahun}`;
}

const COMMENTS_PER_LOAD = 5;

let allComments = [];
let visibleCount = COMMENTS_PER_LOAD;
let lastUpdated = null;

// ================= SUBMIT FORM =================
document.getElementById('combined-form').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();

  Swal.fire({
    title: 'Kirim Doa dan Ucapan Ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff6a00',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, kirim!'
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    const form = event.target;
    const submitBtn = document.getElementById('submitButton');
    const spinner = document.getElementById('spinnerContainer');

    submitBtn.style.display = 'none';
    spinner.style.display = 'block';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: new FormData(form)
      });

      const json = await res.json();

      if (!json.success) throw new Error('Gagal menyimpan data');

      Swal.fire('Terkirim!', 'Terima kasih atas doa dan ucapannya.', 'success');
      form.reset();
      checkUpdate();

    } catch (err) {
      Swal.fire('Error!', err.message, 'error');
    } finally {
      submitBtn.style.display = 'block';
      spinner.style.display = 'none';
    }
  });
}

// ================= RENDER DATA =================
function renderData(data) {
  allComments = data.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  visibleCount = COMMENTS_PER_LOAD;
  renderComments();
}

function renderComments() {
  const container = document.getElementById('comments-container');
  container.innerHTML = '';

  const visible = allComments.slice(0, visibleCount);

  visible.forEach(item => {
    const div = document.createElement('div');
    div.className = 'mb-4 bg-gradient p-3 rounded border border-light text-white';
    div.innerHTML = `
      <div class="namatamu border-bottom fw-bold pb-2">${item.nama}<span class="jam-komentar">${formatTanggalIndo(item.timestamp)}</span></div>
  <div class="isidoa fst-italic mt-2">${item.doa}</div>
    `;
    container.appendChild(div);
  });

  toggleLoadMore();
}

function toggleLoadMore() {
  const btn = document.getElementById('loadMoreBtn');
  btn.style.display = visibleCount >= allComments.length ? 'none' : 'inline-block';
}

// ================= LOAD MORE =================
document.getElementById('loadMoreBtn').addEventListener('click', () => {
  visibleCount += COMMENTS_PER_LOAD;
  renderComments();
});

// ================= AUTO REFRESH =================
async function checkUpdate() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();

    if (json.lastUpdated !== lastUpdated) {
      lastUpdated = json.lastUpdated;
      renderData(json.data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

document.addEventListener('DOMContentLoaded', checkUpdate);
setInterval(checkUpdate, 30000);

setInterval(() => {
  document.querySelectorAll('[data-time]').forEach(el => {
    el.textContent = timeAgo(el.dataset.time);
  });
}, 60000);