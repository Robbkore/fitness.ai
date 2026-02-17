package db

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() error {
	dbPath := os.Getenv("DATABASE_URL")
	if dbPath == "" {
		dbPath = "fitness.db"
	}

	var err error
	DB, err = sql.Open("sqlite", dbPath)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %v", err)
	}

	if err := DB.Ping(); err != nil {
		return fmt.Errorf("unable to ping database: %v", err)
	}

	fmt.Println("Connected to SQLite database successfully")
	return nil
}

func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}

func RunSchema(schemaPath string) error {
	content, err := os.ReadFile(schemaPath)
	if err != nil {
		return fmt.Errorf("failed to read schema file: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = DB.ExecContext(ctx, string(content))
	if err != nil {
		return fmt.Errorf("failed to execute schema: %v", err)
	}

	fmt.Println("Database schema applied successfully")
	return nil
}
