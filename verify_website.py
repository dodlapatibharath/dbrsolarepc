from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Determine the absolute path to the index.html file
        cwd = os.getcwd()
        index_path = f"file://{cwd}/index.html"

        print(f"Navigating to {index_path}")
        page.goto(index_path)

        # 1. Verify Title
        title = page.title()
        print(f"Page Title: {title}")
        assert "DBR SOLAR EPC" in title, "Title verification failed!"

        # 2. Verify Company Name
        company_name = page.locator("h1.hero-title").inner_text()
        print(f"Hero Title: {company_name}")
        assert "DBR SOLAR EPC PRIVATE LIMITED" in company_name, "Company Name verification failed!"

        # 3. Verify Footer Details (CIN, PAN, TAN)
        footer_text = page.locator("footer").inner_text()
        print("Footer text found.")
        assert "U43210TS2026PTC211006" in footer_text, "CIN verification failed!"
        assert "AAMCD4306R" in footer_text, "PAN verification failed!"
        assert "HYDD16980F" in footer_text, "TAN verification failed!"

        # 4. Verify CSS/JS Animation Classes
        # Scroll down to trigger animations
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000) # Wait for animation to trigger

        # Check if .visible class is added to .fade-in-up elements
        # The hero section has .fade-in-up and should be visible immediately or after scroll
        hero_classes = page.locator(".hero").get_attribute("class")
        print(f"Hero classes: {hero_classes}")
        # Note: Depending on implementation, it might take a moment or require intersection.
        # Let's check if at least one element has .visible
        visible_elements = page.locator(".visible").count()
        print(f"Number of visible animated elements: {visible_elements}")
        assert visible_elements > 0, "Animation verification failed: No elements have .visible class!"

        # 5. Take Screenshots
        page.screenshot(path="home_page_v2.png", full_page=True)
        print("Screenshot saved: home_page_v2.png")

        page.goto(f"file://{cwd}/products.html")
        page.screenshot(path="products_page_v2.png", full_page=True)
        print("Screenshot saved: products_page_v2.png")

        page.goto(f"file://{cwd}/contact.html")
        page.screenshot(path="contact_page_v2.png", full_page=True)
        print("Screenshot saved: contact_page_v2.png")

        browser.close()
        print("Verification complete!")

if __name__ == "__main__":
    run()
