// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const profileCardLinks = document.querySelectorAll('.profile-card-link');
    const modalOverlay = document.getElementById('memberDetailModalOverlay');
    const modalDynamicContent = document.getElementById('modalDynamicContent');
    const closeModalButton = modalOverlay.querySelector('.modal-close-button');

    // Pastikan semua elemen modal ada
    if (!modalOverlay || !modalDynamicContent || !closeModalButton) {
        console.error("Elemen modal tidak ditemukan. Pop-up tidak akan berfungsi.");
        return;
    }

    // Fungsi untuk membuka modal
    function openModal(contentUrl) {
        // Tampilkan loading (opsional)
        modalDynamicContent.innerHTML = '<p style="text-align:center; padding:20px;">Memuat detail...</p>';
        modalOverlay.classList.add('active'); // Tampilkan overlay dan modal

        // Ambil konten dari file HTML terpisah
        fetch(contentUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal memuat konten: ' + response.statusText);
                }
                return response.text(); // Dapatkan HTML sebagai teks
            })
            .then(htmlFragment => {
                modalDynamicContent.innerHTML = htmlFragment; // Masukkan HTML ke dalam modal
            })
            .catch(error => {
                console.error('Error saat mengambil detail member:', error);
                modalDynamicContent.innerHTML = '<p style="text-align:center; padding:20px; color:red;">Maaf, tidak bisa memuat detail saat ini.</p>';
            });
    }

    // Fungsi untuk menutup modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        // Kosongkan konten setelah ditutup agar tidak tampil saat dibuka lagi (jika user klik kartu lain)
        // Tambahkan sedikit delay agar tidak terlihat aneh saat animasi fade-out
        setTimeout(() => {
            modalDynamicContent.innerHTML = '';
        }, 300); // Sesuaikan dengan durasi transisi opacity modal-overlay
    }

    // Tambahkan event listener ke setiap kartu profil
    profileCardLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah navigasi ke href link (karena kita tampilkan pop-up)

            const contentFile = this.dataset.detailSrc; // Ambil path file dari atribut data-detail-src
            if (contentFile) {
                openModal(contentFile);
            } else {
                console.warn("Atribut data-detail-src tidak ditemukan pada kartu ini. Menggunakan href sebagai fallback...");
                // Fallback: jika tidak ada data-detail-src, navigasi ke href (halaman detail penuh)
                window.location.href = this.href;
            }
        });
    });

    // Event listener untuk tombol close
    closeModalButton.addEventListener('click', closeModal);

    // Event listener untuk menutup modal dengan klik di luar area modal (pada overlay)
    modalOverlay.addEventListener('click', function(event) {
        // Pastikan yang diklik adalah overlay, bukan konten di dalamnya
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
});