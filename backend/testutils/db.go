package testutils

import (
	"database/sql"
	"os"
	"path/filepath"
	"testing"

	"github.com/terr0r/fitness.ai/backend/db"
	_ "modernc.org/sqlite"
)

// SetupTestDB creates a temporary SQLite database for testing,
// connects the global db.DB to it, and applies the application schema.
// It returns a teardown function that MUST be deferred in tests.
func SetupTestDB(t *testing.T) func() {
	t.Helper()

	// Create a temporary file for the test database
	tempFile, err := os.CreateTemp("", "fitness_test_*.db")
	if err != nil {
		t.Fatalf("Failed to create temporary test database: %v", err)
	}
	dbPath := tempFile.Name()
	tempFile.Close()

	// Open the SQLite database
	testDB, err := sql.Open("sqlite", dbPath)
	if err != nil {
		os.Remove(dbPath)
		t.Fatalf("Failed to open test database: %v", err)
	}

	// Override the global DB connection
	db.DB = testDB

	// Find the schema file relative to the project root
	// Assuming tests are run from 'backend/somepkg' or 'backend'
	wd, err := os.Getwd()
	if err != nil {
		testDB.Close()
		os.Remove(dbPath)
		t.Fatalf("Failed to get working directory: %v", err)
	}

	// Simple heuristic to find backend dir: search up to 2 levels
	var schemaPath string
	for i := 0; i < 3; i++ {
		tryPath := filepath.Join(wd, "db", "schema.sql")
		if _, err := os.Stat(tryPath); err == nil {
			schemaPath = tryPath
			break
		}
		wd = filepath.Dir(wd)
	}

	if schemaPath == "" {
		testDB.Close()
		os.Remove(dbPath)
		t.Fatalf("Could not locate db/schema.sql from test directory")
	}

	// Run the schema migration on the test db
	if err := db.RunSchema(schemaPath); err != nil {
		testDB.Close()
		os.Remove(dbPath)
		t.Fatalf("Failed to run schema in test database: %v", err)
	}

	// Return teardown function
	return func() {
		db.CloseDB()      // Close connection
		os.Remove(dbPath) // Delete temp file
		db.DB = nil       // Reset global DB
	}
}
