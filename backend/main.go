package main

import (
	"log"
	"order-mgmt-backend/database"
	"order-mgmt-backend/handlers"
	"order-mgmt-backend/websocket"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/menu", handlers.GetMenu)
	r.POST("/orders", handlers.CreateOrder)
	r.GET("/orders/:id", handlers.GetOrder)
	r.POST("/login", handlers.Login)
	r.GET("/offers", handlers.GetOffers)
	r.GET("/locations", handlers.GetLocations)
	r.GET("/ws/order-status", func(c *gin.Context) {
		websocket.GlobalHub.HandleWS(c.Writer, c.Request)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
