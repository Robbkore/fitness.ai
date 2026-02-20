#!/bin/bash
set -e

echo "====================================="
echo "Running Backend Tests (Go)"
echo "====================================="
cd backend
go test ./...
cd ..

echo ""
echo "====================================="
echo "Running Frontend Component Tests"
echo "====================================="
cd frontend
npx vitest run
cd ..

echo ""
echo "====================================="
echo "Running E2E Playwright Tests"
echo "====================================="
cd frontend
npx playwright test
cd ..

echo ""
echo "====================================="
echo "All tests passed successfully!"
echo "====================================="
