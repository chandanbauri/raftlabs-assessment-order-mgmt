package websocket

import (
	"log"
	"net/http"
	"sync"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Hub struct {
	clients map[string][]*websocket.Conn
	mu      sync.RWMutex
}

var GlobalHub = &Hub{
	clients: make(map[string][]*websocket.Conn),
}

func (h *Hub) HandleWS(w http.ResponseWriter, r *http.Request) {
	orderID := r.URL.Query().Get("orderId")
	if orderID == "" {
		http.Error(w, "Order ID required", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	h.mu.Lock()
	h.clients[orderID] = append(h.clients[orderID], conn)
	h.mu.Unlock()

	defer func() {
		h.mu.Lock()
		conns := h.clients[orderID]
		for i, c := range conns {
			if c == conn {
				h.clients[orderID] = append(conns[:i], conns[i+1:]...)
				break
			}
		}
		if len(h.clients[orderID]) == 0 {
			delete(h.clients, orderID)
		}
		h.mu.Unlock()
		conn.Close()
	}()

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			break
		}
	}
}

func (h *Hub) BroadcastStatus(orderID string, status string) {
	h.mu.RLock()
	conns, ok := h.clients[orderID]
	h.mu.RUnlock()

	if !ok {
		return
	}

	for _, conn := range conns {
		err := conn.WriteJSON(map[string]string{
			"orderId": orderID,
			"status":  status,
		})
		if err != nil {
			log.Println("WS Write Error:", err)
		}
	}
}
