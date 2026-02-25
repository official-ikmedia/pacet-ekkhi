function handleFormSubmit(event) {
   event.preventDefault();

   Swal.fire({
      title: 'Kirim Doa dan Ucapan Ini?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6a00',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, kirim!'
   }).then((result) => {
      if (result.isConfirmed) {
         const form = document.getElementById('combined-form');
         const spinner = document.getElementById('spinnerContainer');
         const submitButton = document.getElementById('submitButton');

         submitButton.disabled = true;
         submitButton.style.display = 'none';
         spinner.style.display = 'block';

         fetch(form.action, {
               method: 'POST',
               body: new FormData(form)
            })
            .then(response => {
               if (response.ok) {
                  Swal.fire('Terkirim!', 'Terima kasih atas doa dan ucapannya.', 'success');
                  form.reset();
                  fetchData();
               } else {
                  Swal.fire('Error!', 'Terjadi kesalahan, silakan coba lagi.', 'error');
               }
            })
            .catch(error => {
               Swal.fire('Error!', 'Terjadi kesalahan: ' + error.message, 'error');
            })
            .finally(() => {
               submitButton.disabled = false;
               submitButton.style.display = 'block';
               spinner.style.display = 'none';
            });
      }
   });
}

async function fetchData() {
   try {
      const response = await fetch(
         'https://script.google.com/macros/s/AKfycbxNOw8Odh-YG3DuUfes_zYuurrqPlA_X4UO8YYO6mS6Ox5W2KcQEk3b92_keLzfqXys/exec'
      );
      const data = await response.json();

      const commentsContainer = document.getElementById('comments-container');
      commentsContainer.innerHTML = '';
      data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort by timestamp descending
      data.forEach(item => {
         const comment = document.createElement('div');
         comment.className = 'mb-4 bg-gradient p-3 rounded border border-light text-white';
         comment.innerHTML = `<div class="border-bottom fw-bold">${item.nama}</div> <div class="fst-italic mt-2">${item.doa}</div>`;
         commentsContainer.appendChild(comment);
      });
   } catch (error) {
      console.error('Error fetching data:', error);
   }
}

document.addEventListener('DOMContentLoaded', fetchData);


async function checkUpdate() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();

    if (json.lastUpdated !== lastUpdated) {
      console.log("🔄 Data berubah → update");
      lastUpdated = json.lastUpdated;
      renderData(json.data);
    } else {
      console.log("⏸️ Tidak ada perubahan");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

// Load pertama
checkUpdate();

// Cek tiap 30 detik
setInterval(checkUpdate, 30000);