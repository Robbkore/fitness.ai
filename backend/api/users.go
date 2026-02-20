package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"github.com/terr0r/fitness.ai/backend/db"
	"github.com/terr0r/fitness.ai/backend/models"
	"github.com/terr0r/fitness.ai/backend/utils"
)

func SetupUserRoutes(r chi.Router) {
	r.Route("/api/users", func(r chi.Router) {
		r.Use(AuthMiddleware)
		r.Get("/me", getMe)
		r.Put("/me", updateMe)
	})
}

// Simple Auth Middleware to extract user ID from JWT
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || len(authHeader) < 8 || authHeader[:7] != "Bearer " {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString := authHeader[7:]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return utils.GetJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		userID := claims["sub"].(string)
		r.Header.Set("X-User-ID", userID)
		next.ServeHTTP(w, r)
	})
}

func getMe(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")

	var user models.User
	query := `SELECT id, email, name, age, gender, height, weight, activity_level, country, goals, created_at, updated_at FROM users WHERE id = ?`

	// We'll map NULL to default empty values using sql.Null* types if needed,
	// but standard Scan usually works if columns are properly handled or we default them in struct.
	// Since SQLite driver might return nil/null for these text/real columns, we should handle gracefully.
	// For brevity, assuming user struct with omitempty and direct scan works if they aren't completely null but empty.
	// Actually, SQLite might return NULL so we should use pointer fallbacks.
	var name, gender, activity, country, goals *string
	var age *int
	var height, weight *float64

	err := db.DB.QueryRow(query, userID).Scan(
		&user.ID, &user.Email, &name, &age, &gender, &height, &weight, &activity, &country, &goals, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if name != nil {
		user.Name = *name
	}
	if age != nil {
		user.Age = *age
	}
	if gender != nil {
		user.Gender = *gender
	}
	if height != nil {
		user.Height = *height
	}
	if weight != nil {
		user.Weight = *weight
	}
	if activity != nil {
		user.Activity = *activity
	}
	if country != nil {
		user.Country = *country
	}
	if goals != nil {
		user.Goals = *goals
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user": user,
	})
}

func updateMe(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")

	var updates struct {
		Name          string  `json:"name"`
		Age           int     `json:"age"`
		Gender        string  `json:"gender"`
		Height        float64 `json:"height"`
		Weight        float64 `json:"weight"`
		ActivityLevel string  `json:"activity_level"`
		Country       string  `json:"country"`
		Goals         string  `json:"goals"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	query := `
		UPDATE users 
		SET name = ?, age = ?, gender = ?, height = ?, weight = ?, activity_level = ?, country = ?, goals = ?, updated_at = ?
		WHERE id = ?
	`
	_, err := db.DB.Exec(query,
		updates.Name, updates.Age, updates.Gender, updates.Height, updates.Weight,
		updates.ActivityLevel, updates.Country, updates.Goals, time.Now(), userID)

	if err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	// Fetch updated user to return
	getMe(w, r)
}
