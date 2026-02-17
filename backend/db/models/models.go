package models

import (
	"time"
)

type User struct {
	ID            string    `json:"id"`
	Email         string    `json:"email"`
	PasswordHash  string    `json:"-"`
	Name          string    `json:"name"`
	Age           int       `json:"age"`
	Gender        string    `json:"gender"`
	Height        float64   `json:"height"`
	Weight        float64   `json:"weight"`
	ActivityLevel string    `json:"activity_level"`
	Goals         string    `json:"goals"` // Stored as JSON string
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Plan struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Type      string    `json:"type"`
	Content   string    `json:"content"` // Stored as JSON string
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Status    string    `json:"status"`
}

type Recipe struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	Ingredients  string `json:"ingredients"`  // Stored as JSON string
	Instructions string `json:"instructions"` // Stored as JSON string
	Macros       string `json:"macros"`       // Stored as JSON string
	Tags         string `json:"tags"`         // Comma-separated or JSON string
}

type Workout struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Difficulty  string `json:"difficulty"`
	Exercises   string `json:"exercises"` // Stored as JSON string
}

type Journal struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Date      time.Time `json:"date"`
	Type      string    `json:"type"`
	EntryData string    `json:"entry_data"` // Stored as JSON string
	CreatedAt time.Time `json:"created_at"`
}
