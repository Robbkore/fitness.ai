package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/terr0r/fitness.ai/backend/models"
)

var GetJWTSecret = func() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return []byte("super-secret-key-for-dev") // fallback for dev
	}
	return []byte(secret)
}

func GenerateJWT(user models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
	})

	return token.SignedString(GetJWTSecret())
}
