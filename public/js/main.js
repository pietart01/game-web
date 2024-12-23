// public/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    const swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        loop: true,
        effect: "fade",
    });
});

function gameStart(gamecode) {
    $.ajax({
        type: "GET",
        url: "/game/init",
        dataType: "json",
        data: {
            _method: 'get',
            game: 'slot',
            gameCode: gamecode
        },
        success: function(data) {
            if (data.result === true) {
                const decodedUrl = decodeURIComponent(data.url);
                console.log('url = ', decodedUrl);
                // Open the game in a new window
                let newWindow = window.open(decodedUrl, 'SlotGame', "width=1400,height=890,left=100,top=100,toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=no,scrollbars=no,copyhistory=no");
                if (!newWindow) {
                    window.location.href = decodedUrl;
                }
            } else {
                alert(data.message);
            }
        },
        error: function() {
            alert("실패했습니다.");
        }
    });
}

function checkLoginAndStartGame(gameCode) {
    // In a real app, you'd check if user is logged in
    // then call gameStart. For now, just call gameStart directly.
    gameStart(gameCode);
}
