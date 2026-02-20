package models

import "time"

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Name         string    `json:"name,omitempty"`
	Age          int       `json:"age,omitempty"`
	Gender       string    `json:"gender,omitempty"`
	Height       float64   `json:"height,omitempty"`
	Weight       float64   `json:"weight,omitempty"`
	Activity     string    `json:"activity_level,omitempty"`
	Country      string    `json:"country,omitempty"`
	Goals        string    `json:"goals,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
