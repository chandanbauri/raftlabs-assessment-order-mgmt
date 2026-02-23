package handlers

import (
	"net/http"
	"order-mgmt-backend/database"
	"order-mgmt-backend/models"
	"order-mgmt-backend/websocket"
	"time"

	"github.com/gin-gonic/gin"
)

func GetMenu(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database not connected"})
		return
	}
	var items []models.Item
	database.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateOrder(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database not connected"})
		return
	}
	var req models.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !isValidPhone(req.CustomerPhone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid phone number format"})
		return
	}

	order := models.NewOrder()
	order.CustomerName = req.CustomerName
	order.CustomerAddress = req.CustomerAddress
	order.CustomerPhone = req.CustomerPhone

	var totalPrice float64
	for _, itemReq := range req.Items {
		var item models.Item
		if err := database.DB.First(&item, itemReq.ItemID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Item not found"})
			return
		}

		orderItem := models.OrderItem{
			OrderID:  order.ID,
			ItemID:   item.ID,
			Quantity: itemReq.Quantity,
			Price:    item.Price,
		}
		order.OrderItems = append(order.OrderItems, orderItem)
		totalPrice += item.Price * float64(itemReq.Quantity)
	}
	order.TotalPrice = totalPrice

	// Handle dummy payment
	if req.PaymentMethod != "" {
		order.PaymentStatus = "Paid"
	}

	if err := database.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	go simulateOrderStatus(order.ID)

	c.JSON(http.StatusCreated, order)
}

func GetOrder(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database not connected"})
		return
	}
	id := c.Param("id")
	var order models.Order
	if err := database.DB.Preload("OrderItems.Item").First(&order, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, order)
}

func Login(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database not connected"})
		return
	}
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ? AND password = ?", req.Email, req.Password).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func GetOffers(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database not connected"})
		return
	}
	var offers []models.Offer
	database.DB.Find(&offers)
	c.JSON(http.StatusOK, offers)
}

func GetLocations(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Database not connected"})
		return
	}
	var locations []models.Location
	database.DB.Find(&locations)
	c.JSON(http.StatusOK, locations)
}

func simulateOrderStatus(orderID string) {
	statuses := []string{"Preparing", "Out for Delivery", "Delivered"}
	interval := 5 * time.Second // Faster simulation for testing

	for _, status := range statuses {
		time.Sleep(interval)
		database.DB.Model(&models.Order{}).Where("id = ?", orderID).Update("status", status)
		websocket.GlobalHub.BroadcastStatus(orderID, status)
	}
}

func isValidPhone(phone string) bool {
	return len(phone) >= 10 && len(phone) <= 15
}

func TestDB(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"status": "error", "message": "Database is not connected"})
		return
	}
	// Try a simple query to assert connection is alive
	sqlDB, err := database.DB.DB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to get database instance: " + err.Error()})
		return
	}
	if err := sqlDB.Ping(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Database ping failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Database connection is successful"})
}
