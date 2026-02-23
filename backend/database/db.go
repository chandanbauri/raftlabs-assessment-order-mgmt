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

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s search_path=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSLMODE"),
		os.Getenv("DB_SCHEMA"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	DB.Exec(fmt.Sprintf("CREATE SCHEMA IF NOT EXISTS %s", os.Getenv("DB_SCHEMA")))

	err = DB.AutoMigrate(&models.Item{}, &models.Order{}, &models.OrderItem{}, &models.User{}, &models.Offer{}, &models.Location{})
	if err != nil {
		log.Fatal(err)
	}

	seedData()
}

func seedData() {
	var itemCount int64
	DB.Model(&models.Item{}).Count(&itemCount)
	if itemCount == 0 {
		items := []models.Item{
			{Name: "Margherita Pizza", Description: "Classic tomato and mozzarella - Veg", Price: 299, ImageURL: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"},
			{Name: "Pepperoni Pizza", Description: "Double pepperoni with extra cheese", Price: 499, ImageURL: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"},
			{Name: "Veggie Burger", Description: "Plant-based patty with fresh greens - Veg", Price: 199, ImageURL: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"},
			{Name: "Grilled Chicken Salad", Description: "Organic chicken with honey mustard", Price: 349, ImageURL: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"},
			{Name: "Paneer Tikka", Description: "Spiced cottage cheese cubes grilled - Veg", Price: 250, ImageURL: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80"},
			{Name: "Butter Chicken", Description: "Creamy tomato based chicken curry", Price: 450, ImageURL: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80"},
			{Name: "Masala Dosa", Description: "Crispy crepe with potato filling - Veg", Price: 120, ImageURL: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80"},
			{Name: "Chicken Biryani", Description: "Aromatic rice dish with spicy chicken", Price: 399, ImageURL: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80"},
		}
		DB.Create(&items)
	}

	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		users := []models.User{
			{Name: "Demo User", Email: "demo@example.com", Password: "password123"},
		}
		DB.Create(&users)
	}

	var offerCount int64
	DB.Model(&models.Offer{}).Count(&offerCount)
	if offerCount == 0 {
		offers := []models.Offer{
			{Code: "WELCOME50", Discount: 50, Description: "Flat 50% OFF on your first order"},
			{Code: "SWIGGYIT", Discount: 20, Description: "20% OFF up to ₹100"},
			{Code: "FREEDEL", Discount: 40, Description: "Free delivery on orders above ₹500"},
		}
		DB.Create(&offers)
	}

	var locationCount int64
	DB.Model(&models.Location{}).Count(&locationCount)
	if locationCount == 0 {
		locations := []models.Location{
			{Name: "Bengaluru, Karnataka"},
			{Name: "Mumbai, Maharashtra"},
			{Name: "Delhi, NCR"},
			{Name: "Hyderabad, Telangana"},
			{Name: "Chennai, Tamil Nadu"},
		}
		DB.Create(&locations)
	}
}
