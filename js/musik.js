// Mendapatkan elemen yang diperlukan
      const rootElement = document.documentElement;
      const audioIconWrapper = document.querySelector('.audio-icon-wrapper');
      const audioIcon = audioIconWrapper.querySelector('i');
      const song = document.querySelector('#song');
      let isPlaying = false;

      /**
       * Menonaktifkan scroll pada halaman.
       */
      const disableScroll = () => {
         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
         const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

         window.onscroll = () => window.scrollTo(scrollTop, scrollLeft);
         rootElement.style.scrollBehavior = 'auto';
      };

      /**
       * Mengaktifkan scroll pada halaman dan memulai audio.
       */
      const enableScroll = () => {
         window.onscroll = null; // Menghapus event scroll
         rootElement.style.scrollBehavior = 'smooth';
         playAudio();
      };

      /**
       * Memutar audio dan menampilkan ikon audio.
       */
      const playAudio = () => {
         song.volume = 0.5;
         audioIconWrapper.style.display = 'flex';
         song.play();
         isPlaying = true;
      };

      /**
       * Mengelola klik pada ikon audio untuk memutar atau menjeda audio.
       */
      audioIconWrapper.onclick = () => {
         if (isPlaying) {
            song.pause();
            audioIcon.classList.replace('bi-disc', 'bi-pause-circle');
         } else {
            song.play();
            audioIcon.classList.replace('bi-pause-circle', 'bi-disc');
         }
         isPlaying = !isPlaying;
      };

      // Menonaktifkan scroll pada awal halaman
      disableScroll();