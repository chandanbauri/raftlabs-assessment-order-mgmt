package handler

import (
	"net/http"
	"order-mgmt-backend/database"
	"order-mgmt-backend/handlers"
	"order-mgmt-backend/websocket"
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	engine *gin.Engine
	once   sync.Once
)

func initEngine() {
	database.InitDB()

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())

	r.Use(cors.New(cors.Config{
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.OPTIONS("/*path", func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNoContent)
	})
	r.GET("/api/menu", handlers.GetMenu)
	r.POST("/api/orders", handlers.CreateOrder)
	r.GET("/api/orders/:id", handlers.GetOrder)
	r.POST("/api/orders/:id/cancel", handlers.CancelOrder)
	r.PATCH("/api/orders/:id/status", handlers.UpdateOrderStatus)
	r.GET("/api/orders/user/:name", handlers.GetUserOrders)
	r.POST("/api/login", handlers.Login)
	r.GET("/api/offers", handlers.GetOffers)
	r.GET("/api/locations", handlers.GetLocations)
	r.GET("/api/ws/order-status", func(c *gin.Context) {
		websocket.GlobalHub.HandleWS(c.Writer, c.Request)
	})
	r.GET("/api/test-db", handlers.TestDB)

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Order Management API"})
	})
	r.GET("/api", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Order Management API"})
	})

	engine = r
}

func Handler(w http.ResponseWriter, r *http.Request) {
	once.Do(initEngine)
	engine.ServeHTTP(w, r)
}
