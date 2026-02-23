package main

import (
	"log"
	"net/http"
	"os"

	handler "order-mgmt-backend/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Route all local traffic to the Vercel handler
	http.HandleFunc("/", handler.Handler)

	log.Printf("Starting local development server on http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
