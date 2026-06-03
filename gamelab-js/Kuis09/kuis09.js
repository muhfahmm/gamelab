$(document).ready(function() {
    $("#btnText").click(function() {
        let newText = $("#inputContent").val();
        $("#textTarget").text(newText);
        showNotification("Berhasil menerapkan .text()");
    });

    $("#btnHtml").click(function() {
        let textVal = $("#inputContent").val();
        $("#textTarget").html(`<strong>Format HTML Aktif:</strong> <span style="color: #db2777; font-style: italic;">${textVal}</span>`);
        showNotification("Berhasil menerapkan .html()");
    });

    let itemCount = 0;

    $("#btnAppend").click(function() {
        itemCount++;
        $("#listTarget").append(`
            <li class="list-item" style="border-left-color: #db2777;">
                Item Baru #${itemCount} (Append) 
                <span style="font-size: 0.8rem; opacity: 0.7;">${new Date().toLocaleTimeString()}</span>
            </li>
        `);
        showNotification("Berhasil menerapkan .append()");
    });

    $("#btnPrepend").click(function() {
        itemCount++;
        $("#listTarget").prepend(`
            <li class="list-item" style="border-left-color: #10b981;">
                Item Baru #${itemCount} (Prepend) 
                <span style="font-size: 0.8rem; opacity: 0.7;">${new Date().toLocaleTimeString()}</span>
            </li>
        `);
        showNotification("Berhasil menerapkan .prepend()");
    });

    const icons = [
        "fa-solid fa-graduation-cap",
        "fa-solid fa-globe",
        "fa-solid fa-code",
        "fa-solid fa-rocket",
        "fa-solid fa-heart"
    ];
    let currentIconIndex = 0;

    $("#btnChangeAttr").click(function() {
        currentIconIndex = (currentIconIndex + 1) % icons.length;
        $("#iconTarget").attr("class", icons[currentIconIndex] + " fa-lg");
        $("#linkTarget").attr("href", "https://gamelab.id/news");
        $("#linkText").text("Jelajahi Berita Gamelab (Link Terupdate)");
        showNotification("Berhasil menerapkan .attr()");
    });

    $("#btnRemoveAttr").click(function() {
        $("#linkTarget").removeAttr("href");
        $("#linkTarget").removeAttr("target");
        $("#linkText").text("Link dinonaktifkan (href dihapus)");
        showNotification("Berhasil menerapkan .removeAttr()");
    });

    $("#btnToggleClass").click(function() {
        $("#previewDisplay").toggleClass("glowing-theme");
        showNotification("Berhasil menerapkan .toggleClass()");
    });

    $("#btnHighlight").click(function() {
        let box = $("#attrBox");
        if (box.hasClass("highlight")) {
            box.removeClass("highlight");
            showNotification("Menghapus class highlight dengan .removeClass()");
        } else {
            box.addClass("highlight");
            showNotification("Menambahkan class highlight dengan .addClass()");
        }
    });

    $("#btnEmptyList").click(function() {
        $("#listTarget").empty();
        showNotification("Berhasil menerapkan .empty() pada daftar list");
    });

    $("#btnRemoveBox").click(function() {
        $("#attrBox").remove();
        showNotification("Berhasil menerapkan .remove() pada Elemen Ber-Atribut");
    });

    function showNotification(message) {
        $(".toast-notify").remove();
        let toast = $(`<div class="toast-notify" style="
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #4f46e5;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 1000;
            animation: fadeIn 0.2s ease;
        ">${message}</div>`);
        $("body").append(toast);
        setTimeout(function() {
            toast.fadeOut(300, function() {
                $(this).remove();
            });
        }, 2500);
    }
});
