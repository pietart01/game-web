// Holdem room service
class HoldemService {
  constructor() {
    this.listeners = new Set();
    this.useRealTimeData = false; // Toggle this to switch between demo and real-time data
  }

  // Demo data
  getDemoRooms() {
    return [
      { id: "Room-001", currentPlayers: 6, maxPlayers: 9, buyIn: 1000000000, bigBlind: 10000000, isLocked: false },
      { id: "Room-002", currentPlayers: 9, maxPlayers: 9, buyIn: 500000000, bigBlind: 5000000, isLocked: false },
      { id: "Room-003", currentPlayers: 4, maxPlayers: 9, buyIn: 300000000, bigBlind: 3000000, isLocked: true },
      { id: "Room-004", currentPlayers: 2, maxPlayers: 9, buyIn: 100000000, bigBlind: 1000000, isLocked: false },
      { id: "Room-005", currentPlayers: 7, maxPlayers: 9, buyIn: 200000000, bigBlind: 2000000, isLocked: false }
    ];
  }

  async connect() {
    if (this.useRealTimeData) {
      // Real-time implementation here
      // Uncomment and modify when ready to use real-time data
      /*
      try {
        this.client = new Client("wss://your-colyseus-server.com");
        this.monitorRoom = await this.client.joinOrCreate("monitor_room");
        
        this.monitorRoom.onMessage("rooms_list", (roomList) => {
          this.notifyListeners(this.transformRoomData(roomList));
        });

        return true;
      } catch (error) {
        console.error("Failed to connect to monitor room:", error);
        return false;
      }
      */
    } else {
      // Use demo data
      this.startDemoUpdates();
      return true;
    }
  }

  startDemoUpdates() {
    // Simulate real-time updates with demo data
    this.notifyListeners(this.getDemoRooms());
    
    // Optional: Simulate periodic updates
    setInterval(() => {
      const rooms = this.getDemoRooms().map(room => ({
        ...room,
        currentPlayers: Math.floor(Math.random() * (room.maxPlayers + 1))
      }));
      this.notifyListeners(rooms);
    }, 5000);
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(roomList) {
    this.listeners.forEach(callback => callback(roomList));
  }

  disconnect() {
    this.listeners.clear();
    if (this.useRealTimeData) {
      // Cleanup real-time connections when implemented
      /*
      if (this.monitorRoom) {
        this.monitorRoom.leave();
      }
      if (this.client) {
        this.client.close();
      }
      */
    }
  }
}

export const holdemService = new HoldemService();