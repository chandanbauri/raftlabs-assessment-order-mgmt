package database

import (
	"fmt"
	"log"
	"order-mgmt-backend/models"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable search_path=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SCHEMA"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	DB.Exec(fmt.Sprintf("CREATE SCHEMA IF NOT EXISTS %s", os.Getenv("DB_SCHEMA")))

	err = DB.AutoMigrate(&models.Item{}, &models.Order{}, &models.OrderItem{})
	if err != nil {
		log.Fatal(err)
	}

	seedData()
}

func seedData() {
	var count int64
	DB.Model(&models.Item{}).Count(&count)
	if count == 0 {
		items := []models.Item{
			{Name: "Margherita Pizza", Description: "Classic tomato and mozzarella", Price: 12.99, ImageURL: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"},
			{Name: "Pepperoni Pizza", Description: "Double pepperoni with extra cheese", Price: 14.99, ImageURL: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"},
			{Name: "Veggie Burger", Description: "Plant-based patty with fresh greens", Price: 10.99, ImageURL: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"},
			{Name: "Grilled Chicken Salad", Description: "Organic chicken with honey mustard", Price: 11.99, ImageURL: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"},
		}
		DB.Create(&items)
	}
}
