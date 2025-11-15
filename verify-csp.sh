#!/bin/bash
# CSP & FFmpeg Verification Script
# Verifies that all CSP headers are correctly configured

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   CSP & FFmpeg Configuration Verification Script          ║"
echo "║   ToolBoxKit - November 2025                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
check_pass() {
  echo -e "${GREEN}✓ PASS${NC}: $1"
  ((PASSED++))
}

check_fail() {
  echo -e "${RED}✗ FAIL${NC}: $1"
  ((FAILED++))
}

check_warn() {
  echo -e "${YELLOW}⚠ WARN${NC}: $1"
  ((WARNINGS++))
}

check_info() {
  echo -e "${BLUE}ℹ INFO${NC}: $1"
}

# Check 1: nginx.conf exists and has CSP
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Checking nginx.conf Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "nginx.conf" ]; then
  check_pass "nginx.conf exists"
  
  if grep -q "script-src.*blob:" nginx.conf; then
    check_pass "CSP allows blob: in script-src"
  else
    check_fail "CSP missing 'blob:' in script-src"
  fi
  
  if grep -q "wasm-unsafe-eval" nginx.conf; then
    check_pass "CSP includes 'wasm-unsafe-eval'"
  else
    check_fail "CSP missing 'wasm-unsafe-eval'"
  fi
  
  if grep -q "worker-src.*blob:" nginx.conf; then
    check_pass "CSP allows blob: in worker-src"
  else
    check_fail "CSP missing 'blob:' in worker-src"
  fi
  
  if grep -q "Cross-Origin-Embedder-Policy.*require-corp" nginx.conf; then
    check_pass "COEP header configured (require-corp)"
  else
    check_fail "COEP header not configured"
  fi
  
  if grep -q "Cross-Origin-Opener-Policy.*same-origin" nginx.conf; then
    check_pass "COOP header configured (same-origin)"
  else
    check_fail "COOP header not configured"
  fi
  
  if grep -q "Cross-Origin-Resource-Policy.*cross-origin" nginx.conf; then
    check_pass "CORP header configured (cross-origin)"
  else
    check_fail "CORP header not configured"
  fi
else
  check_fail "nginx.conf not found"
fi

echo ""

# Check 2: vite.config.js has CSP headers
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Checking vite.config.js Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "vite.config.js" ]; then
  check_pass "vite.config.js exists"
  
  if grep -q "'Cross-Origin-Embedder-Policy'.*'require-corp'" vite.config.js; then
    check_pass "Dev server has COEP header"
  else
    check_fail "Dev server missing COEP header"
  fi
  
  if grep -q "'Cross-Origin-Opener-Policy'.*'same-origin'" vite.config.js; then
    check_pass "Dev server has COOP header"
  else
    check_fail "Dev server missing COOP header"
  fi
  
  if grep -q "environment.*jsdom" vite.config.js; then
    check_pass "Vitest configured with JSDOM"
  else
    check_fail "Vitest not configured with JSDOM"
  fi
else
  check_fail "vite.config.js not found"
fi

echo ""

# Check 3: Test files exist
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Checking Test Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "src/test/useFFmpeg.test.jsx" ]; then
  check_pass "useFFmpeg.test.jsx exists"
  
  TEST_COUNT=$(grep -c "it(" src/test/useFFmpeg.test.jsx || echo "0")
  if [ "$TEST_COUNT" -gt 0 ]; then
    check_pass "Found $TEST_COUNT test cases in useFFmpeg.test.jsx"
  else
    check_warn "No test cases found in useFFmpeg.test.jsx"
  fi
else
  check_fail "useFFmpeg.test.jsx not found"
fi

echo ""

# Check 4: Documentation files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Checking Documentation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "CSP_TROUBLESHOOTING.md" ]; then
  check_pass "CSP_TROUBLESHOOTING.md exists"
else
  check_fail "CSP_TROUBLESHOOTING.md not found"
fi

if [ -f "CSP_IMPLEMENTATION.md" ]; then
  check_pass "CSP_IMPLEMENTATION.md exists"
else
  check_fail "CSP_IMPLEMENTATION.md not found"
fi

if [ -f "FFMPEG_QUICKSTART.md" ]; then
  check_pass "FFMPEG_QUICKSTART.md exists"
else
  check_fail "FFMPEG_QUICKSTART.md not found"
fi

echo ""

# Check 5: Docker configuration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Checking Docker Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "docker-compose.yml" ]; then
  check_pass "docker-compose.yml exists"
  
  if grep -q "nginx.conf:/etc/nginx/nginx.conf" docker-compose.yml; then
    check_pass "nginx.conf mounted in docker-compose"
  else
    check_fail "nginx.conf not properly mounted"
  fi
else
  check_fail "docker-compose.yml not found"
fi

echo ""

# Check 6: Package.json scripts
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Checking Build Scripts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "package.json" ]; then
  check_pass "package.json exists"
  
  if grep -q '"dev"' package.json; then
    check_pass "npm run dev script exists"
  else
    check_fail "npm run dev script not found"
  fi
  
  if grep -q '"build"' package.json; then
    check_pass "npm run build script exists"
  else
    check_fail "npm run build script not found"
  fi
  
  if grep -q '"test"' package.json; then
    check_pass "npm test script exists"
  else
    check_fail "npm test script not found"
  fi
else
  check_fail "package.json not found"
fi

echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    VERIFICATION SUMMARY                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Results:"
echo -e "  ${GREEN}✓ Passed: $PASSED${NC}"
echo -e "  ${RED}✗ Failed: $FAILED${NC}"
echo -e "  ${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Configuration is correct.${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Run: npm run lint"
  echo "  2. Run: npm run build"
  echo "  3. Run: npm run test:run"
  echo "  4. Run: npm run dev"
  echo "  5. Visit: http://localhost:5173"
  exit 0
else
  echo -e "${RED}❌ Configuration issues found. Please review the failures above.${NC}"
  echo ""
  echo "For help, see:"
  echo "  • CSP_TROUBLESHOOTING.md - Detailed troubleshooting guide"
  echo "  • CSP_IMPLEMENTATION.md - Implementation details"
  echo "  • FFMPEG_QUICKSTART.md - Quick start guide"
  exit 1
fi
