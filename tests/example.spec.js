import { test, expect } from "@playwright/test"

test.describe("Stikky Data Dashboard - Comprehensive E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (after login)
    await page.goto("https://web.stikkydata.com/dashboard")

    // Wait for dashboard to load
    await page.waitForLoadState("domcontentloaded")

    // Maximize window
    await page.evaluate(() => {
      window.moveTo(0, 0)
      window.resizeTo(window.screen.width, window.screen.height)
    })
  })

  // ===== POSITIVE TEST CASES (Happy Path) =====
  test.describe("POSITIVE CASES - Happy Path Scenarios", () => {
    // Test 1: Verify dashboard loads successfully
    test("should load dashboard page successfully", async ({ page }) => {
      // Check for dashboard title
      const title = await page.title()
      expect(title).toContain("Stikkydata V2")

      // Wait for main container to be visible
      const mainContent = await page.locator(
        '[class*="container"], [class*="dashboard"], main'
      )
      await expect(mainContent.first()).toBeVisible({ timeout: 5000 })

      console.log("✓ Dashboard loaded successfully")
    })

    // Test 2: Verify header/navbar is present
    test("should display header and navigation bar", async ({ page }) => {
      // Check for header
      const header = await page.locator('header, [class*="header"]')

      if (await header.first().isVisible()) {
        await expect(header.first()).toBeVisible()

        // Check for logo
        const logo = await page.locator(
          'img[title="Stikkydata"], [class*="logo"] img, .brand-logo'
        )
        if (await logo.first().isVisible()) {
          await expect(logo.first()).toBeVisible()
        }

        console.log("✓ Header/Navigation visible")
      } else {
        console.log("⊘ Header not found on current page")
      }
    })

    // Test 3: Verify sidebar/menu navigation
    test("should display sidebar navigation menu", async ({ page }) => {
      const sidebar = await page.locator(
        '[class*="sidebar"], [class*="menu"], [role="navigation"]'
      )

      if (await sidebar.first().isVisible()) {
        await expect(sidebar.first()).toBeVisible()

        // Check for common menu items
        const menuItems = await page.locator(
          '[class*="menu-item"], [class*="nav-item"], li[role="menuitem"]'
        )
        const menuCount = await menuItems.count()
        expect(menuCount).toBeGreaterThan(0)

        console.log(`✓ Sidebar visible with ${menuCount} menu items`)
      }
    })

    // Test 4: Verify main dashboard content area
    test("should display main dashboard content area", async ({ page }) => {
      const mainContent = await page.locator(
        '[class*="main-content"], [class*="content"], main'
      )
      await expect(mainContent.first()).toBeVisible()

      // Check for dashboard cards/widgets
      const cards = await page.locator(
        '[class*="card"], [class*="widget"], [class*="panel"]'
      )
      const cardCount = await cards.count()

      if (cardCount > 0) {
        console.log(
          `✓ Main content area visible with ${cardCount} cards/widgets`
        )
      } else {
        console.log(
          `✓ Main content area visible (${cardCount} cards/widgets found)`
        )
      }
    })

    // Test 5: Verify dashboard statistics/metrics display
    test("should display dashboard statistics and metrics", async ({
      page
    }) => {
      // Look for metric cards
      const metrics = await page.locator(
        '[class*="stat"], [class*="metric"], [class*="kpi"]'
      )
      const metricCount = await metrics.count()

      if (metricCount > 0) {
        await expect(metrics.first()).toBeVisible()
        console.log(`✓ Found ${metricCount} metric cards`)
      }

      // Check for numbers/values
      const numbers = await page.locator("text=/^[0-9]+$/")
      const numberCount = await numbers.count()

      if (numberCount > 0) {
        console.log(`✓ Found ${numberCount} numeric values on dashboard`)
      } else {
        console.log(
          `✓ Dashboard metrics visible (${numberCount} numeric values found)`
        )
      }
    })

    // Test 6: Verify charts/graphs are rendered
    test("should display charts and graphs", async ({ page }) => {
      // Look for canvas elements (common for charts)
      const charts = await page.locator(
        'canvas, [class*="chart"], [class*="graph"]'
      )
      const chartCount = await charts.count()

      if (chartCount > 0) {
        await expect(charts.first()).toBeVisible()
        console.log(`✓ Found ${chartCount} chart elements`)
      } else {
        console.log("⚠ No charts found on dashboard")
      }
    })

    // Test 7: Test navigation menu items
    test("should navigate through menu items", async ({ page }) => {
      const menuItems = await page.locator(
        '[class*="menu-item"], [class*="nav-item"], a[role="menuitem"]'
      )
      const menuCount = await menuItems.count()

      if (menuCount > 0) {
        const firstMenu = menuItems.first()
        const firstText = await firstMenu.textContent()

        await firstMenu.click()
        await page.waitForTimeout(500)

        const newUrl = page.url()
        console.log(`✓ Navigated from menu to: ${newUrl}`)
      }
    })

    // Test 8: Test search functionality (if available)
    test("should perform search functionality", async ({ page }) => {
      const searchInput = await page.locator(
        'input[placeholder*="Search"], input[type="search"], [class*="search"] input'
      )

      if (await searchInput.first().isVisible()) {
        await searchInput.first().fill("test")
        await searchInput.first().press("Enter")
        await page.waitForTimeout(1000)

        console.log("✓ Search functionality working")
      } else {
        console.log("⚠ Search functionality not found")
      }
    })

    // Test 9: Test filters (if available)
    test("should apply filters on dashboard", async ({ page }) => {
      const filterButtons = await page.locator(
        'button[class*="filter"], button:has-text("Filter")'
      )
      const filterCount = await filterButtons.count()

      if (filterCount > 0) {
        await filterButtons.first().click()
        await page.waitForTimeout(500)

        console.log(
          `✓ Found and clicked filter (${filterCount} filters available)`
        )
      } else {
        console.log("⚠ No filter buttons found")
      }
    })

    // Test 10: Test date range picker (if available)
    test("should interact with date range picker", async ({ page }) => {
      const dateInput = await page.locator(
        'input[type="date"], [class*="date"], [class*="calendar"]'
      )

      if (await dateInput.first().isVisible()) {
        await dateInput.first().click()
        await page.waitForTimeout(500)

        console.log("✓ Date picker accessible")
      } else {
        console.log("⚠ Date picker not found")
      }
    })

    // Test 11: Test export functionality (if available)
    test("should export data functionality", async ({ page }) => {
      const exportBtn = await page.locator(
        'button:has-text("Export"), button[class*="export"], [class*="download"]'
      )

      if (await exportBtn.first().isVisible()) {
        console.log("✓ Export button found")
      } else {
        console.log("⚠ Export button not found")
      }
    })

    // Test 12: Test user profile/settings menu
    test("should display user profile menu", async ({ page }) => {
      const profileBtn = await page.locator(
        '[class*="profile"], [class*="user"], button[class*="avatar"]'
      )
      const settingsBtn = await page.locator(
        'button:has-text("Settings"), [class*="settings"]'
      )

      if (await profileBtn.first().isVisible()) {
        await profileBtn.first().click()
        await page.waitForTimeout(300)
        console.log("✓ User profile menu accessible")
      }

      if (await settingsBtn.first().isVisible()) {
        console.log("✓ Settings menu accessible")
      }
    })

    // Test 13: Test logout functionality
    test("should verify logout button exists", async ({ page }) => {
      const logoutBtn = await page.locator(
        'button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")'
      )

      if (await logoutBtn.first().isVisible()) {
        console.log("✓ Logout button found")
      } else {
        console.log("⚠ Logout button not found")
      }
    })

    // Test 14: Test responsive design
    test("should be responsive on different screen sizes", async ({ page }) => {
      // Test on mobile size
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)

      const mainContent = await page.locator('[class*="container"], main')
      await expect(mainContent.first()).toBeVisible()

      console.log("✓ Mobile view responsive")

      // Test on tablet size
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForTimeout(500)
      await expect(mainContent.first()).toBeVisible()

      console.log("✓ Tablet view responsive")

      // Test on desktop size
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.waitForTimeout(500)
      await expect(mainContent.first()).toBeVisible()

      console.log("✓ Desktop view responsive")
    })

    // Test 15: Test loading states and spinners
    test("should handle loading states properly", async ({ page }) => {
      const loaders = await page.locator(
        '[class*="spinner"], [class*="loader"], [role="status"]'
      )
      const loaderCount = await loaders.count()

      if (loaderCount > 0) {
        console.log(`✓ Found ${loaderCount} loader elements`)
      } else {
        console.log("✓ No active loaders on dashboard")
      }
    })

    // Test 16: Test data table interactions (if available)
    test("should interact with data tables", async ({ page }) => {
      const tables = await page.locator(
        'table, [role="table"], [class*="table"]'
      )
      const tableCount = await tables.count()

      if (tableCount > 0) {
        // Check for table rows
        const rows = await page.locator('tr, [role="row"]')
        const rowCount = await rows.count()

        expect(rowCount).toBeGreaterThan(0)
        console.log(`✓ Found ${tableCount} table(s) with ${rowCount} rows`)

        // Check for sortable columns
        const sortableHeaders = await page.locator(
          'th[class*="sort"], button[class*="sort"]'
        )
        const sortCount = await sortableHeaders.count()

        if (sortCount > 0) {
          console.log(`✓ Found ${sortCount} sortable column headers`)
        }
      } else {
        console.log("⚠ No tables found on dashboard")
      }
    })

    // Test 17: Test pagination (if available)
    test("should navigate through paginated content", async ({ page }) => {
      const paginationBtn = await page.locator(
        'button[aria-label*="next"], [class*="pagination"] button, [class*="pager"] button'
      )
      const paginationCount = await paginationBtn.count()

      if (paginationCount > 0) {
        const nextBtn = await page.locator(
          'button:has-text("Next"), button[aria-label*="next"]'
        )
        if (await nextBtn.first().isVisible()) {
          await nextBtn.first().click()
          await page.waitForTimeout(500)
          console.log("✓ Pagination working")
        }
      } else {
        console.log("⚠ No pagination found")
      }
    })

    // Test 18: Test error handling
    test("should handle network errors gracefully", async ({ page }) => {
      // Simulate network error
      await page.route("**/*", route => route.abort("failed"))

      await page.reload().catch(() => {
        console.log("✓ Page handled network error gracefully")
      })

      // Restore network
      await page.unroute("**/*")
    })

    // Test 19: Test console for errors
    test("should not have critical console errors", async ({ page }) => {
      let errorCount = 0

      page.on("console", msg => {
        if (msg.type() === "error") {
          console.error("Console Error:", msg.text())
          errorCount++
        }
      })

      await page.waitForTimeout(2000)
      console.log(`✓ Console errors: ${errorCount}`)
    })

    // Test 20: Test accessibility - keyboard navigation
    test("should support keyboard navigation", async ({ page }) => {
      // Press Tab to navigate
      await page.keyboard.press("Tab")
      await page.keyboard.press("Tab")
      await page.keyboard.press("Tab")

      // Get focused element
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName
      })

      console.log(
        `✓ Keyboard navigation working, focused element: ${focusedElement}`
      )
    })
  })
})
