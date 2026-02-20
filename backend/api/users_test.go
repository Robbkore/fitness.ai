package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/terr0r/fitness.ai/backend/db"
	"github.com/terr0r/fitness.ai/backend/testutils"
	"github.com/terr0r/fitness.ai/backend/utils"
)

func generateTestJWT(userID string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Hour).Unix(),
	})
	tokenString, _ := token.SignedString(utils.GetJWTSecret())
	return tokenString
}

func TestGetMe(t *testing.T) {
	teardown := testutils.SetupTestDB(t)
	defer teardown()

	router := setupTestRouter()
	SetupUserRoutes(router)

	// Insert mock user
	userID := "user-123"
	_, err := db.DB.Exec(`INSERT INTO users (id, email, name, country) VALUES (?, ?, ?, ?)`, userID, "test@example.com", "Test User", "US")
	assert.NoError(t, err)

	token := generateTestJWT(userID)
	req, _ := http.NewRequest("GET", "/api/users/me", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var resp map[string]interface{}
	json.Unmarshal(rr.Body.Bytes(), &resp)

	userMap := resp["user"].(map[string]interface{})
	assert.Equal(t, "Test User", userMap["name"])
	assert.Equal(t, "US", userMap["country"])
}

func TestUpdateMe(t *testing.T) {
	teardown := testutils.SetupTestDB(t)
	defer teardown()

	router := setupTestRouter()
	SetupUserRoutes(router)

	userID := "user-123"
	_, err := db.DB.Exec(`INSERT INTO users (id, email) VALUES (?, ?)`, userID, "test@example.com")
	assert.NoError(t, err)

	token := generateTestJWT(userID)

	payload := map[string]interface{}{
		"name":           "Updated Name",
		"age":            30,
		"weight":         80.5,
		"height":         180.0,
		"country":        "UK",
		"activity_level": "moderate",
		"goals":          "build muscle",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("PUT", "/api/users/me", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var resp map[string]interface{}
	json.Unmarshal(rr.Body.Bytes(), &resp)

	userMap := resp["user"].(map[string]interface{})
	assert.Equal(t, "Updated Name", userMap["name"])
	assert.Equal(t, float64(30), userMap["age"])
	assert.Equal(t, float64(80.5), userMap["weight"])
	assert.Equal(t, float64(180), userMap["height"])
	assert.Equal(t, "UK", userMap["country"])
}
