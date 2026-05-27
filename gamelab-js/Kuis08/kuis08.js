$(document).ready(function () {
    // 1. Show, Hide & Toggle Effects
    $("#btn-toggle-show").click(function () {
        $("#toggle-box").show(400);
    });

    $("#btn-toggle-hide").click(function () {
        $("#toggle-box").hide(400);
    });

    $("#btn-toggle").click(function () {
        $("#toggle-box").toggle(400);
    });


    // 2. Fading Effects
    $("#btn-fade-in").click(function () {
        $("#fade-box").fadeIn(400);
    });

    $("#btn-fade-out").click(function () {
        $("#fade-box").fadeOut(400);
    });

    $("#btn-fade-toggle").click(function () {
        $("#fade-box").fadeToggle(400);
    });


    // 3. Sliding Effects
    $("#btn-trigger-alert").click(function () {
        $("#sliding-alert").slideDown(400);
    });

    $("#btn-slide-up").click(function () {
        $("#sliding-alert").slideUp(400);
    });

    $("#btn-slide-down").click(function () {
        $("#sliding-alert").slideDown(400);
    });

    $("#btn-slide-toggle").click(function () {
        $("#sliding-alert").slideToggle(400);
    });


    // 4. Custom Animation
    $("#btn-anim-move").click(function () {
        $("#animated-orb").animate({
            left: "+=150px",
            width: "100px",
            height: "100px",
            opacity: "0.7"
        }, 1000);
    });

    $("#btn-anim-reset").click(function () {
        // Hentikan semua animasi aktif terlebih dahulu
        $("#animated-orb").stop(true, true);
        
        // Reset properties
        $("#animated-orb").animate({
            left: "0px",
            width: "60px",
            height: "60px",
            opacity: "1.0"
        }, 500);
    });

    $("#btn-anim-loop").click(function () {
        // Rantai animasi yang panjang untuk mendemonstrasikan fungsi Stop
        $("#animated-orb")
            .animate({ left: "200px" }, 2000)
            .animate({ width: "120px", height: "120px" }, 2000)
            .animate({ left: "0px" }, 2000)
            .animate({ width: "60px", height: "60px" }, 2000);
    });


    // 5. Stop Animation Effect
    $("#btn-anim-stop").click(function () {
        // parameter stop(clearQueue, jumpToEnd)
        // clearQueue = true untuk membatalkan semua animasi dalam antrian
        // jumpToEnd = false agar objek berhenti tepat di posisi saat tombol ditekan
        $("#animated-orb").stop(true, false);
    });
});
