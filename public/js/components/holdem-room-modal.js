// holdem-room-modal.js


window.initHoldemRoomModal = function() {
  const modal = document.getElementById('holdemRoomModal');
  const closeBtn = modal.querySelector('.close');
  const roomListBody = document.getElementById('roomListBody');
  const autoJoinButton = document.getElementById('autoJoinButton');

  let client;
  let monitorRoom;
  let currentChannelId = null;
  let isConnecting = false;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 30;
  const RECONNECT_DELAY = 3000; // 2 seconds

  const IS_DEMO = false;

  async function initializeMonitoring() {
    console.log("initializeMonitoring");

    if(IS_DEMO) {
      updateRoomList([]);
      return;
    }

    if (isConnecting) return;

    isConnecting = true;
    try {
      client = new Colyseus.Client(window.monitorUrl);
      monitorRoom = await client.joinOrCreate("monitor_room");

      // Reset reconnection attempts on successful connection
      reconnectAttempts = 0;

      monitorRoom.onMessage("rooms_list", (roomList) => {
        console.log("Received room list update:", roomList);
        // Filter rooms by channelId before updating the list
        const filteredRooms = roomList.filter(room =>
            currentChannelId ? room.channelId === currentChannelId : true
        );
        updateRoomList(filteredRooms);
      });

      // Add connection state change handling
      monitorRoom.onLeave((code) => {
        console.log("Connection lost with code:", code);
        handleDisconnection();
      });

      monitorRoom.onError((error) => {
        console.error("Monitor room error:", error);
        handleDisconnection();
      });

    } catch (error) {
      console.error("Error connecting to monitor room:", error);
      handleDisconnection();
    } finally {
      isConnecting = false;
    }
  }

  function handleDisconnection() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log("Max reconnection attempts reached");
      alert("서버와의 연결이 끊어졌습니다. 페이지를 새로고침해 주세요.");
      return;
    }

    if (!currentChannelId) {
      // Don't attempt reconnection if modal is closed
      return;
    }

    reconnectAttempts++;
    console.log(`Attempting reconnection ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${RECONNECT_DELAY}ms`);

    setTimeout(() => {
      if (currentChannelId) { // Double check modal is still open
        initializeMonitoring();
      }
    }, RECONNECT_DELAY);
  }

  function handleJoinRoom(roomId) {
    console.log(`Joining room: ${roomId}`);
    pokerStart(roomId);
  }

  function updateRoomList(roomList) {
    roomListBody.innerHTML = '';

    console.log("roomList: ", JSON.stringify(roomList, null, 2));

    if(roomList.length === 0) {
      roomList.push({
        roomId: "UZISNL3Uh",
        channelId: "1",
        clients: 0,
        maxClients: 6,
        baseBlindAmount: 10000,
      });
    }

    roomList.forEach(room => {
      const row = document.createElement('tr');
      row.innerHTML = `
<!--            <td>${room.roomId}</td>-->
            <td>
                <button class="join-button font-kr" data-room-id="${room.roomId}"
                    ${room.clients >= room.maxClients || room.locked ? 'disabled' : ''}>
                    참여
                </button>
            </td>

            <td>${room.clients}/${room.maxClients}</td>
            <td>${formatCurrency(room.baseBlindAmount)}</td>
            <td>${formatCurrency(room.baseBlindAmount * 2)}</td>
            <td>${room.locked ? '🔒' : '🔓'}</td>
        `;

      const joinButton = row.querySelector('.join-button');
      joinButton.addEventListener('click', () => handleJoinRoom(room.roomId));

      roomListBody.appendChild(row);
    });
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  }

  function handleAutoJoin() {
    const availableRooms = Array.from(roomListBody.querySelectorAll('tr'))
        .filter(row => {
          const joinButton = row.querySelector('.join-button');
          return !joinButton.disabled;
        })
        .map(row => {
          const cells = row.querySelectorAll('td');
          const joinButton = row.querySelector('.join-button');

          return {
            roomId: joinButton.dataset.roomId,
            clientCount: cells[1].textContent,
            baseBlind: cells[2].textContent,
            maxBlind: cells[3].textContent,
            isLocked: cells[4].textContent === '🔒'
          };
        });

    console.log('availableRooms:', JSON.stringify(availableRooms));

    if (availableRooms.length > 0) {
      const roomToJoin = availableRooms[0];
      console.log('Joining room:', roomToJoin);
      window.pokerStart(roomToJoin.roomId);
    } else {
      alert("현재 참여 가능한 방이 없습니다.");
    }
  }

  function show(channelId) {
    currentChannelId = channelId;
    modal.style.display = 'block';
    reconnectAttempts = 0; // Reset reconnection attempts when showing modal
    initializeMonitoring();
  }

  function hide() {
    modal.style.display = 'none';
    if (monitorRoom) {
      monitorRoom.leave();
    }
    currentChannelId = null;
  }

  closeBtn.addEventListener('click', hide);
  autoJoinButton.addEventListener('click', handleAutoJoin);

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      hide();
    }
  });

  return {
    show,
    hide
  };
};
