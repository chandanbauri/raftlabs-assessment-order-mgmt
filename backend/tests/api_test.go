package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"order-mgmt-backend/database"
	"order-mgmt-backend/handlers"
	"order-mgmt-backend/models"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.Item{}, &models.Order{}, &models.OrderItem{})
	database.DB = db

	items := []models.Item{
		{ID: 1, Name: "Test Item", Price: 10.0},
	}
	db.Create(&items)
}

func TestGetMenu(t *testing.T) {
	setupTestDB()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.GET("/menu", handlers.GetMenu)

	req, _ := http.NewRequest("GET", "/menu", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var items []models.Item
	json.Unmarshal(w.Body.Bytes(), &items)
	assert.Len(t, items, 1)
	assert.Equal(t, "Test Item", items[0].Name)
}

func TestCreateOrder(t *testing.T) {
	setupTestDB()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/orders", handlers.CreateOrder)

	payload := `{"customer_name":"John Doe","customer_address":"123 St","customer_phone":"1234567890","items":[{"item_id":1,"quantity":2}]}`
	req, _ := http.NewRequest("POST", "/orders", strings.NewReader(payload))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	var order models.Order
	json.Unmarshal(w.Body.Bytes(), &order)
	assert.Equal(t, "Order Received", order.Status)
	assert.Equal(t, 20.0, order.TotalPrice)
}

func TestCreateOrder_InvalidPhone(t *testing.T) {
	setupTestDB()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/orders", handlers.CreateOrder)

	payload := `{"customer_name":"John Doe","customer_address":"123 St","customer_phone":"123","items":[{"item_id":1,"quantity":2}]}`
	req, _ := http.NewRequest("POST", "/orders", strings.NewReader(payload))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
