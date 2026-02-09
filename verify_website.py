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

        # 1. Verify Localization in Hero
        hero_subtitle = page.locator("p.hero-subtitle").inner_text()
        print(f"Hero Subtitle: {hero_subtitle}")
        assert "Hyderabad" in hero_subtitle, "Hyderabad verification failed in Hero!"
        assert "Telangana" in hero_subtitle, "Telangana verification failed in Hero!"

        # 2. Verify Footer Details
        footer_text = page.locator("footer").inner_text()
        print("Footer text found.")
        assert "Region: Telangana, India" in footer_text, "Footer Region verification failed!"

        # 3. Verify Contact Page Address
        page.goto(f"file://{cwd}/contact.html")
        contact_info = page.locator(".contact-info").inner_text()
        print(f"Contact Info: {contact_info}")
        assert "Madhapur, Hitech City" in contact_info, "Address verification failed!"
        assert "Hyderabad, Telangana - 500081" in contact_info, "City/State verification failed!"
        assert "+91" in contact_info, "Phone format verification failed!"

        # 4. Take Screenshots for Visual Verification of "Solar Orange" and Badges
        page.goto(f"file://{cwd}/index.html")
        page.wait_for_timeout(500) # Wait for initial render
        page.screenshot(path="home_page_localized.png", full_page=True)
        print("Screenshot saved: home_page_localized.png")

        page.goto(f"file://{cwd}/products.html")
        page.wait_for_timeout(500)
        page.screenshot(path="products_page_localized.png", full_page=True)
        print("Screenshot saved: products_page_localized.png")

        page.goto(f"file://{cwd}/contact.html")
        page.wait_for_timeout(500)
        page.screenshot(path="contact_page_localized.png", full_page=True)
        print("Screenshot saved: contact_page_localized.png")

        browser.close()
        print("Verification complete!")

if __name__ == "__main__":
    run()
