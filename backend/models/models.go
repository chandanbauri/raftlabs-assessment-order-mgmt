package models

import (
	"time"

	"github.com/google/uuid"
)

type Item struct {
	ID          uint    `json:"id" gorm:"primaryKey"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"image_url"`
}

type Order struct {
	ID              string      `json:"id" gorm:"primaryKey"`
	CustomerName    string      `json:"customer_name"`
	CustomerAddress string      `json:"customer_address"`
	CustomerPhone   string      `json:"customer_phone"`
	TotalPrice      float64     `json:"total_price"`
	Status          string      `json:"status"`
	PaymentStatus   string      `json:"payment_status"`
	CreatedAt       time.Time   `json:"created_at"`
	OrderItems      []OrderItem `json:"order_items" gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID       uint    `json:"id" gorm:"primaryKey"`
	OrderID  string  `json:"order_id"`
	ItemID   uint    `json:"item_id"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
	Item     Item    `json:"item" gorm:"foreignKey:ItemID"`
}

type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"-"`
	Name     string `json:"name"`
}

type Offer struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Code        string `json:"code"`
	Discount    int    `json:"discount"`
	Description string `json:"description"`
}

type Location struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type CreateOrderRequest struct {
	CustomerName    string             `json:"customer_name" binding:"required"`
	CustomerAddress string             `json:"customer_address" binding:"required"`
	CustomerPhone   string             `json:"customer_phone" binding:"required"`
	PaymentMethod   string             `json:"payment_method"`
	Items           []OrderItemRequest `json:"items" binding:"required,gt=0"`
}

type OrderItemRequest struct {
	ItemID   uint `json:"item_id" binding:"required"`
	Quantity int  `json:"quantity" binding:"required,gt=0"`
}

func NewOrder() *Order {
	return &Order{
		ID:            uuid.New().String(),
		CreatedAt:     time.Now(),
		Status:        "Order Received",
		PaymentStatus: "Pending",
	}
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required"`
}
