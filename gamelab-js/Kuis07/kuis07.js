$(document).ready(function() {
    let clickCount = 0;

    $("#btn-click").click(function() {
        clickCount++;
        $("#counter-value")
            .text(clickCount)
            .css("color", "#0d6efd")
            .animate({ fontSize: "2.1rem" }, 100)
            .animate({ fontSize: "1.75rem" }, 100);
    });

    $("#magic-box").dblclick(function() {
        $("body").toggleClass("theme-alternate");
        const isAlternate = $("body").hasClass("theme-alternate");
        
        if (isAlternate) {
            $(this).css({
                "border-color": "#0d6efd",
                "background-color": "rgba(13, 110, 253, 0.08)"
            });
            $(this).find("p").text("✨ Tema Alternatif Aktif! ✨");
        } else {
            $(this).css({
                "border-color": "#cbd5e1",
                "background-color": "transparent"
            });
            $(this).find("p").text("Double Click Box Ini");
        }
    });

    $("#hover-card").mouseenter(function() {
        $(this).css({
            "transform": "scale(1.02)",
            "border-color": "#198754",
            "box-shadow": "0 4px 12px rgba(25, 135, 84, 0.15)"
        });
        $("#hover-badge")
            .removeClass("bg-secondary")
            .addClass("bg-success")
            .text("Kursor Masuk Area!");
    });

    $("#hover-card").mouseleave(function() {
        $(this).css({
            "transform": "scale(1)",
            "border-color": "#dee2e6",
            "box-shadow": "none"
        });
        $("#hover-badge")
            .removeClass("bg-success")
            .addClass("bg-secondary")
            .text("Arahkan Mouse ke Sini");
    });

    $("#input-validation").focus(function() {
        $("#validation-tip").slideDown(200);
    });

    $("#input-validation").blur(function() {
        $("#validation-tip").slideUp(200);
        
        const value = $(this).val().trim();
        if (value === "") {
            $(this).addClass("is-invalid").removeClass("is-valid");
        } else {
            $(this).addClass("is-valid").removeClass("is-invalid");
        }
    });

    $("#input-keyup").keyup(function(e) {
        const textVal = $(this).val();
        const charLength = textVal.length;
        
        $("#char-count").text(charLength);
        
        if (charLength > 0) {
            $("#preview-text")
                .text(textVal)
                .removeClass("text-muted fst-italic")
                .addClass("text-dark");
        } else {
            $("#preview-text")
                .text("Belum ada input...")
                .removeClass("text-dark")
                .addClass("text-muted fst-italic");
        }
    });
});
