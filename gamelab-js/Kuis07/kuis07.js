$(document).ready(function() {
    let clickCount = 0;
    const $logBody = $("#log-body");

    function addLog(eventName, message) {
        if ($logBody.find("div").length === 1 && $logBody.find("div").css("font-style") === "italic") {
            $logBody.empty();
        }

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
        
        const logHtml = `
            <div class="log-entry">
                <span class="log-time">[${timeStr}]</span>
                <span class="log-event event-${eventName}">${eventName}</span>
                <span class="log-msg">${message}</span>
            </div>
        `;
        
        $logBody.append(logHtml);
        $logBody.scrollTop($logBody[0].scrollHeight);
    }

    $("#btn-click").click(function() {
        clickCount++;
        $("#counter-value")
            .text(clickCount)
            .css("color", "var(--accent-primary)")
            .animate({ fontSize: "2.4rem" }, 100)
            .animate({ fontSize: "2rem" }, 100);
            
        $(this).addClass("pulse");
        setTimeout(() => {
            $(this).removeClass("pulse");
        }, 1500);

        addLog("click", `Tombol diklik. Nilai counter dinaikkan menjadi: <strong>${clickCount}</strong>`);
    });

    $("#magic-box").dblclick(function() {
        $("body").toggleClass("theme-alternate");
        const isAlternate = $("body").hasClass("theme-alternate");
        
        if (isAlternate) {
            $(this).css({
                "border-color": "var(--accent-primary)",
                "background": "rgba(20, 184, 166, 0.08)"
            });
            $(this).find("p").text("🌈 Tema Teal Aktif! 🌈");
            addLog("dblclick", "Double-click box. Mengubah tema halaman ke: <strong>Teal/Amber (Mode Alternatif)</strong>");
        } else {
            $(this).css({
                "border-color": "var(--border-color)",
                "background": "transparent"
            });
            $(this).find("p").text("✨ Double Click Box Ini ✨");
            addLog("dblclick", "Double-click box. Mengembalikan tema halaman ke: <strong>Indigo/Pink (Default)</strong>");
        }
    });

    $("#hover-card").mouseenter(function() {
        $(this).css({
            "transform": "scale(1.05)",
            "border-color": "var(--accent-secondary)",
            "box-shadow": "0 10px 25px var(--accent-secondary-glow)"
        });
        $("#hover-badge")
            .text("Kursor Masuk Area!")
            .css({
                "background": "var(--accent-secondary)",
                "color": "#fff"
            });
            
        addLog("mouseenter", "Kursor mouse MEMASUKI area hover card.");
    });

    $("#hover-card").mouseleave(function() {
        $(this).css({
            "transform": "scale(1)",
            "border-color": "var(--border-color)",
            "box-shadow": "none"
        });
        $("#hover-badge")
            .text("Silakan Hover ke Sini")
            .css({
                "background": "rgba(255, 255, 255, 0.05)",
                "color": "var(--text-secondary)"
            });
            
        addLog("mouseleave", "Kursor mouse KELUAR dari area hover card.");
    });

    $("#input-event").focus(function() {
        $("#input-tip").slideDown(200);
        $(this).css("background", "rgba(99, 102, 241, 0.05)");
        addLog("focus", "Input field mendapatkan FOCUS.");
    });

    $("#input-event").blur(function() {
        $("#input-tip").slideUp(200);
        $(this).css("background", "rgba(255, 255, 255, 0.03)");
        
        const value = $(this).val().trim();
        if (value === "") {
            $(this).css("border-color", "rgba(239, 68, 68, 0.5)");
            addLog("blur", "Input field kehilangan FOCUS (BLUR). Status: <strong>Kosong (Peringatan)</strong>");
        } else {
            $(this).css("border-color", "rgba(16, 185, 129, 0.5)");
            addLog("blur", "Input field kehilangan FOCUS (BLUR). Status: <strong>Terisi</strong>");
        }
    });

    $("#input-event").keyup(function(e) {
        const textVal = $(this).val();
        const charLength = textVal.length;
        
        $("#char-count").text(charLength);
        
        if (charLength > 0) {
            $("#preview-text")
                .text(textVal)
                .css({
                    "color": "var(--text-primary)",
                    "font-style": "normal"
                });
        } else {
            $("#preview-text")
                .text("Belum ada input...")
                .css({
                    "color": "var(--text-secondary)",
                    "font-style": "italic"
                });
        }

        addLog("keyup", `Tombol dilepas: <strong>"${e.key}"</strong> (Total: ${charLength} karakter)`);
    });

    $("#btn-clear-log").click(function() {
        $logBody.html(`
            <div class="log-entry" style="grid-template-columns: 1fr; color: var(--text-secondary); font-style: italic; text-align: center;">
                Log telah dibersihkan. Menunggu interaksi baru...
            </div>
        `);
    });
});
