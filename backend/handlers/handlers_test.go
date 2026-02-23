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
)

func TestMain(m *testing.M) {
	// Setup test DB
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_USER", "rlab")
	os.Setenv("DB_PASSWORD", "rlabs")
	os.Setenv("DB_NAME", "rlab")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_SCHEMA", "rlabs_test")

	database.InitDB()

	code := m.Run()

	database.DB.Exec("DROP SCHEMA rlabs_test CASCADE")
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

	// Valid login
	loginReq := models.LoginRequest{
		Email:    "demo@example.com",
		Password: "password123",
	}
	body, _ := json.Marshal(loginReq)
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Invalid login
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
