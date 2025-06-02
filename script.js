// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const profileCardLinks = document.querySelectorAll('.profile-card-link');
    const modalOverlay = document.getElementById('memberDetailModalOverlay');
    const modalDynamicContent = document.getElementById('modalDynamicContent');
    const closeModalButton = modalOverlay.querySelector('.modal-close-button');
    const navLinks = document.querySelectorAll('.main-nav-links a[href^="#"]');

    if (!modalOverlay || !modalDynamicContent || !closeModalButton) {
        console.error("Elemen modal tidak ditemukan. Pop-up tidak akan berfungsi.");
        return;
    }

    // Fungsi untuk membuka modal
    
    function openModalWithContent(targetModalId) {
        const contentSourceDiv = document.getElementById(targetModalId);

        if (contentSourceDiv) {
            modalDynamicContent.innerHTML = contentSourceDiv.innerHTML;
        } else {
            console.error('Konten detail untuk ID: ' + targetModalId + ' tidak ditemukan.');
            modalDynamicContent.innerHTML = '<p style="text-align:center;padding:20px;color:red;">Konten tidak ditemukan.</p>';
        }

        // Langkah 1: Ubah display agar elemen siap di-render (meskipun masih opacity 0)
        modalOverlay.style.display = 'flex';

        // Langkah 2: Gunakan requestAnimationFrame atau setTimeout(0) untuk memastikan
        // browser telah memproses perubahan display sebelum kita menambahkan kelas .active
        // untuk memicu transisi opacity dan transform.
        requestAnimationFrame(() => {
            // Tambahkan sedikit timeout lagi jika perlu, tapi rAF biasanya cukup
            setTimeout(() => {
                modalOverlay.classList.add('active');
            }, 10); // Delay sangat kecil (10ms)
        });
    }

    function closeModal() {
        modalOverlay.classList.remove('active'); // Ini akan memicu transisi kembali ke opacity 0 dan transform awal

        // Tambahkan event listener untuk 'transitionend' pada overlay.
        // Ini akan dijalankan setelah transisi opacity pada .modal-overlay selesai.
        function handleTransitionEnd(event) {
            // Pastikan kita hanya bereaksi pada transisi opacity dari .modal-overlay
            // dan modal memang sudah tidak aktif lagi (untuk menghindari trigger ganda)
            if (event.target === modalOverlay && event.propertyName === 'opacity' && !modalOverlay.classList.contains('active')) {
                modalOverlay.style.display = 'none'; // Baru sembunyikan elemen sepenuhnya
                modalDynamicContent.innerHTML = '';    // Kosongkan konten
                modalOverlay.removeEventListener('transitionend', handleTransitionEnd); // Hapus listener agar tidak berjalan lagi
            }
        }
        modalOverlay.addEventListener('transitionend', handleTransitionEnd);
    }

    // Tambahkan event listener ke setiap kartu profil
    profileCardLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah navigasi ke href="#"

            const targetModalId = this.dataset.targetModal; // Ambil ID dari atribut data-target-modal
            if (targetModalId) {
                openModalWithContent(targetModalId);
            } else {
                console.warn("Atribut data-target-modal tidak ditemukan pada kartu ini.");
            }
        });
    });

    // Event listener untuk tombol close
    closeModalButton.addEventListener('click', closeModal);

    // Event listener untuk menutup modal dengan klik di luar area modal (pada overlay)
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // Event listener untuk menutup modal dengan tombol Escape (Esc)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah perilaku default melompat langsung

            const targetId = this.getAttribute('href'); // Dapatkan ID target (misal: "#news")
            const targetElement = document.querySelector(targetId); // Cari elemen dengan ID tersebut

            if (targetElement) {
                // Hitung posisi header jika sticky/fixed (opsional)
                const header = document.querySelector('.main-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                // Scroll ke elemen target dengan animasi smooth
                // Opsi 1: Menggunakan window.scrollTo dengan offset
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Opsi 2: Langsung ke elemen (mungkin tidak selalu memperhitungkan header dengan baik tanpa CSS scroll-padding-top)
                // targetElement.scrollIntoView({
                //     behavior: 'smooth',
                //     block: 'start' // atau 'center'
                // });
            } else {
                console.warn('Elemen target untuk smooth scroll tidak ditemukan:', targetId);
            }
        });
    });
});