package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/stretchr/testify/assert"
	"github.com/terr0r/fitness.ai/backend/testutils"
)

func setupTestRouter() *chi.Mux {
	r := chi.NewRouter()
	SetupAuthRoutes(r)
	return r
}

func TestRegisterUser_Success(t *testing.T) {
	// Setup DB
	teardown := testutils.SetupTestDB(t)
	defer teardown()

	router := setupTestRouter()

	// Create test payload
	payload := RegisterRequest{
		Email:    "test@example.com",
		Password: "Password123!",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusCreated, rr.Code)

	var resp RegisterResponse
	err := json.Unmarshal(rr.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.NotEmpty(t, resp.Token)
	assert.Equal(t, "test@example.com", resp.User.Email)
}

func TestRegisterUser_DuplicateEmail(t *testing.T) {
	teardown := testutils.SetupTestDB(t)
	defer teardown()

	router := setupTestRouter()

	payload := RegisterRequest{
		Email:    "dup@example.com",
		Password: "Password123!",
	}
	body, _ := json.Marshal(payload)

	// First request succeeds
	req1, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(body))
	req1.Header.Set("Content-Type", "application/json")
	rr1 := httptest.NewRecorder()
	router.ServeHTTP(rr1, req1)
	assert.Equal(t, http.StatusCreated, rr1.Code)

	// Second request fails
	req2, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(body))
	req2.Header.Set("Content-Type", "application/json")
	rr2 := httptest.NewRecorder()
	router.ServeHTTP(rr2, req2)
	assert.Equal(t, http.StatusConflict, rr2.Code)
}

func TestGoogleAuth(t *testing.T) {
	teardown := testutils.SetupTestDB(t)
	defer teardown()

	router := setupTestRouter()

	payload := GoogleAuthRequest{
		Email: "googleuser@example.com",
		Name:  "Google User",
		Token: "mock-google-token",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "/api/auth/google", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)

	var resp RegisterResponse
	err := json.Unmarshal(rr.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.NotEmpty(t, resp.Token)
	assert.Equal(t, "googleuser@example.com", resp.User.Email)
}
