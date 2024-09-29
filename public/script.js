document.addEventListener('DOMContentLoaded', function() {
  initializeSwiper();
  loadGames();
  setupMenuToggle();
  setupLoginForm();
  setupLogout();
});

function initializeSwiper() {
  new Swiper(".mySwiper", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop: true,
    effect: "fade",
  });
}

function loadGames() {
  const slotGames = [
    {code: 'TA001', name: '프루티 슬롯', description: '과일 테마의 클래식 슬롯', image: 'https://images.unsplash.com/photo-1511213966740-24d719a0a814?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {code: 'TA002', name: '보석 마니아', description: '반짝이는 보석 슬롯', image: 'https://images.unsplash.com/photo-1511213966740-24d719a0a814?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {code: 'TA003', name: '드래곤 스핀', description: '동양 테마 슬롯', image: 'https://images.unsplash.com/photo-1511213966740-24d719a0a814?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {code: 'TA004', name: '스타버스트', description: '우주 테마 슬롯', image: 'https://images.unsplash.com/photo-1511213966740-24d719a0a814?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    {code: 'TA005', name: '해적의 보물', description: '해적 모험 슬롯', image: 'https://images.unsplash.com/photo-1511213966740-24d719a0a814?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
  ];

  const cardGames = [
    {code: 'blackjack', name: '블랙잭', description: '클래식 21점 게임', image: 'https://example.com/blackjack.jpg'},
    {code: 'poker', name: '포커', description: '텍사스 홀덤 포커', image: 'https://example.com/poker.jpg'},
    {code: 'baccarat', name: '바카라', description: '플레이어 vs 뱅커', image: 'https://example.com/baccarat.jpg'},
    {code: 'three-card', name: '영국 포커', description: '3장 카드 포커', image: 'https://example.com/three-card-poker.jpg'},
    {code: 'caribbean', name: '카리비안 스터드', description: '캐리비안 스타일 포커', image: 'https://example.com/caribbean-stud.jpg'},
  ];

  populateGameGrid('slotGamesGrid', slotGames);
  populateGameGrid('cardGamesGrid', cardGames);
}

function populateGameGrid(gridId, games) {
  const grid = document.getElementById(gridId);
  if (grid) {
    games.forEach(game => {
      const gameCard = createGameCard(game);
      grid.appendChild(gameCard);
    });
  }
}

function createGameCard(game) {
  const gameCard = document.createElement('div');
  gameCard.className = 'game-card';
  gameCard.onclick = () => gameStart(game.code);

  const gameImage = document.createElement('div');
  gameImage.className = 'game-image';
  gameImage.style.backgroundImage = `url('${game.image}')`;

  const gameInfo = document.createElement('div');

  const gameTitle = document.createElement('p');
  gameTitle.className = 'game-title';
  gameTitle.textContent = game.name;

  const gameDescription = document.createElement('p');
  gameDescription.className = 'game-description';
  gameDescription.textContent = game.description;

  gameInfo.appendChild(gameTitle);
  gameInfo.appendChild(gameDescription);

  gameCard.appendChild(gameImage);
  gameCard.appendChild(gameInfo);

  return gameCard;
}

function setupMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
}

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);

      fetch('/login', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.reload(); // Reload the page to show the user profile
          } else {
            alert(data.message || '로그인에 실패했습니다.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('로그인 중 오류가 발생했습니다.');
        });
    });
  }
}

function setupLogout() {
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      fetch('/logout', {
        method: 'GET',
        credentials: 'same-origin'
      }).then(response => {
        if (response.ok) {
          window.location.href = '/'; // Redirect to home page after successful logout
        } else {
          console.error('Logout failed');
        }
      }).catch(error => {
        console.error('Error:', error);
      });
    });
  }
}

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
      if(data.result == true) {
        const decodedUrl = decodeURIComponent(data.url);
        console.log('url = ', decodedUrl);
        var newWindow = window.open(decodedUrl, 'SlotGame', "width=1400, height=930, left=100, right=100, toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, scrollbars=no, copyhistory=no");
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
