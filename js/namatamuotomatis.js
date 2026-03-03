const params = new URLSearchParams(window.location.search);
      const token = params.get('t');

      const elSapaan = document.querySelector('.sapaan');
      const elNama = document.querySelector('.nama-tamu');

      function renderDefault() {
         if (elSapaan) elSapaan.textContent = 'Bapak/Ibu';
         if (elNama) elNama.textContent = '';
      }

      if (!token) {
         renderDefault();
      } else {
         try {
            const decoded = JSON.parse(atob(token));

            const sapaan = decoded.sapaan || 'Bapak';
            const nama = decoded.nama || '';

            if (elSapaan) elSapaan.textContent = sapaan;
            if (elNama) elNama.textContent = ' ' + nama;

            // Auto isi form RSVP
            const namaInput = document.querySelector('#nama');
            if (namaInput && nama) {
               namaInput.value = nama;
            }

            // Tracking buka undangan (silent)
            fetch('https://script.google.com/macros/s/AKfycbzLYYAx77RXEHws_s8WMuXrEj-9MitW7j0ox3dj-t0Vxw7Aj7oOxLFb3r72sVU_-N3uOg/exec?id=' + encodeURIComponent(decoded.id))
               .catch(() => { });

         } catch (err) {
            console.warn('Token tidak valid');
            renderDefault();
         }
      }