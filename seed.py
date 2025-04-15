from models import db, User, Category, Item  # Make sure models are imported
from random import choice, randint
import faker

fake = faker.Faker()

def seed_data():
    db.drop_all()
    db.create_all()

    # Define your sections and categories
    section_data = {
        "For Sale": ["Cars + Trucks", "Motorcycles", "Boats", "Books", "Furniture"],
        "Housing": ["Apartments", "Rooms", "Vacation Rentals", "Sublets", "Office Space"],
        "Services": ["Automotive", "Computer", "Creative", "Labor", "Legal"],
        "Jobs": ["Full-time", "Part-time", "Internships", "Remote", "Freelance"],
        "Community": ["Events", "Groups", "Lost+Found", "Volunteers", "Classes"]
    }

    all_categories = []
    for section, categories in section_data.items():
        for name in categories:
            cat = Category(section=section, name=name)
            db.session.add(cat)
            all_categories.append(cat)
    
    db.session.commit()

    # Create test items
    for category in all_categories:
        for _ in range(3):  # 3 items per category
            item = Item(
                title=fake.sentence(nb_words=4),
                price=randint(10, 1000),
                description=fake.paragraph(nb_sentences=3),
                city=fake.city(),
                phone=fake.phone_number(),
                category_id=category.id
            )
            db.session.add(item)

    db.session.commit()
    print("✅ Test data seeded!")
