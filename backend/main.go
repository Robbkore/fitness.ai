package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"github.com/terr0r/fitness.ai/backend/api"
	"github.com/terr0r/fitness.ai/backend/db"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize Database
	if err := db.InitDB(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.CloseDB()

	// Run Schema Migration
	if err := db.RunSchema("db/schema.sql"); err != nil {
		log.Fatalf("Failed to run schema migration: %v", err)
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// API Routes
	api.SetupAuthRoutes(r)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Fitness.ai API is running"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}
