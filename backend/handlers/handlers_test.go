package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"order-mgmt-backend/database"
	"order-mgmt-backend/models"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestMain(m *testing.M) {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.Item{}, &models.Order{}, &models.OrderItem{}, &models.User{}, &models.Offer{})
	database.DB = db

	db.Create(&models.Item{ID: 1, Name: "Test Item", Price: 10.0})
	db.Create(&models.User{Email: "demo@example.com", Password: "password123", Name: "Test User"})
	db.Create(&models.Offer{Code: "TESTOFFER", Discount: 10, Description: "Test Offer"})

	code := m.Run()
	os.Exit(code)
}

func TestGetMenu(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.GET("/menu", GetMenu)

	req, _ := http.NewRequest("GET", "/menu", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var items []models.Item
	err := json.Unmarshal(w.Body.Bytes(), &items)
	assert.Nil(t, err)
	assert.True(t, len(items) > 0)
}

func TestLogin(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/login", Login)

	loginReq := models.LoginRequest{
		Email:    "demo@example.com",
		Password: "password123",
	}
	body, _ := json.Marshal(loginReq)
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	loginReq.Password = "wrong"
	body, _ = json.Marshal(loginReq)
	req, _ = http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestGetOffers(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.GET("/offers", GetOffers)

	req, _ := http.NewRequest("GET", "/offers", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var offers []models.Offer
	err := json.Unmarshal(w.Body.Bytes(), &offers)
	assert.Nil(t, err)
	assert.True(t, len(offers) > 0)
}
