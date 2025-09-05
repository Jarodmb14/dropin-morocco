import { supabase } from "@/integrations/supabase/client";

export const seedData = async () => {
  try {
    console.log("🌱 Starting data seeding...");

    // Seed Clubs
    const clubs = [
      {
        id: "club-1",
        name: "Fitness Plus Casablanca",
        description: "Premium fitness center with state-of-the-art equipment",
        address: "123 Boulevard Mohammed V, Casablanca",
        location: "Casablanca",
        capacity: 150,
        current_occupancy: 45,
        rating: 4.8,
        status: "ACTIVE",
        owner_id: "owner-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "club-2",
        name: "Marrakech Wellness Center",
        description: "Luxury spa and fitness center in the heart of Marrakech",
        address: "456 Avenue Hassan II, Marrakech",
        location: "Marrakech",
        capacity: 100,
        current_occupancy: 32,
        rating: 4.9,
        status: "ACTIVE",
        owner_id: "owner-2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "club-3",
        name: "Rabat Sports Club",
        description: "Modern sports facility with swimming pool and tennis courts",
        address: "789 Rue Agdal, Rabat",
        location: "Rabat",
        capacity: 200,
        current_occupancy: 78,
        rating: 4.6,
        status: "ACTIVE",
        owner_id: "owner-3",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "club-4",
        name: "Tangier Fitness Hub",
        description: "Community fitness center with group classes",
        address: "321 Boulevard Pasteur, Tangier",
        location: "Tangier",
        capacity: 80,
        current_occupancy: 25,
        rating: 4.4,
        status: "ACTIVE",
        owner_id: "owner-4",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "club-5",
        name: "Fez Yoga & Pilates Studio",
        description: "Specialized studio for yoga, pilates, and meditation",
        address: "654 Rue Fes El Bali, Fez",
        location: "Fez",
        capacity: 50,
        current_occupancy: 15,
        rating: 4.7,
        status: "ACTIVE",
        owner_id: "owner-5",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Seed Products
    const products = [
      {
        id: "prod-1",
        name: "Single Entry Pass",
        description: "One-time access to the facility",
        price: 50,
        duration: 120,
        validity_days: 1,
        club_id: "club-1",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "prod-2",
        name: "Day Pass",
        description: "Full day access with all amenities",
        price: 80,
        duration: 480,
        validity_days: 1,
        club_id: "club-1",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "prod-3",
        name: "Week Pass",
        description: "7 days of unlimited access",
        price: 300,
        duration: 1440,
        validity_days: 7,
        club_id: "club-1",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "prod-4",
        name: "Spa Day Package",
        description: "Access to spa facilities and massage",
        price: 200,
        duration: 240,
        validity_days: 1,
        club_id: "club-2",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "prod-5",
        name: "Swimming Pool Access",
        description: "Access to swimming pool and sauna",
        price: 60,
        duration: 180,
        validity_days: 1,
        club_id: "club-3",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "prod-6",
        name: "Group Class Pass",
        description: "Access to all group fitness classes",
        price: 40,
        duration: 60,
        validity_days: 1,
        club_id: "club-4",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "prod-7",
        name: "Yoga Session",
        description: "One yoga or pilates session",
        price: 35,
        duration: 90,
        validity_days: 1,
        club_id: "club-5",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "prod-8",
        name: "Premium Package",
        description: "Full access to all facilities including spa",
        price: 150,
        duration: 300,
        validity_days: 1,
        club_id: "club-2",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Seed Users (for testing)
    const users = [
      {
        id: "user-1",
        email: "customer@example.com",
        name: "John Doe",
        phone: "+212612345678",
        role: "CUSTOMER",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "owner-1",
        email: "owner1@example.com",
        name: "Ahmed Benali",
        phone: "+212698765432",
        role: "CLUB_OWNER",
        club_id: "club-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "owner-2",
        email: "owner2@example.com",
        name: "Fatima Zahra",
        phone: "+212612345679",
        role: "CLUB_OWNER",
        club_id: "club-2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "admin-1",
        email: "admin@dropin.ma",
        name: "Admin User",
        phone: "+212600000000",
        role: "ADMIN",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Insert data
    console.log("📊 Inserting clubs...");
    const { error: clubsError } = await supabase
      .from("clubs")
      .upsert(clubs, { onConflict: "id" });

    if (clubsError) {
      console.error("Error inserting clubs:", clubsError);
    } else {
      console.log("✅ Clubs seeded successfully");
    }

    console.log("📦 Inserting products...");
    const { error: productsError } = await supabase
      .from("products")
      .upsert(products, { onConflict: "id" });

    if (productsError) {
      console.error("Error inserting products:", productsError);
    } else {
      console.log("✅ Products seeded successfully");
    }

    console.log("👥 Inserting users...");
    const { error: usersError } = await supabase
      .from("users")
      .upsert(users, { onConflict: "id" });

    if (usersError) {
      console.error("Error inserting users:", usersError);
    } else {
      console.log("✅ Users seeded successfully");
    }

    console.log("🎉 Data seeding completed successfully!");
    
    return {
      success: true,
      message: "Data seeded successfully",
      data: {
        clubs: clubs.length,
        products: products.length,
        users: users.length,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Test data for development
export const testData = {
  clubs: [
    {
      id: "test-club-1",
      name: "Test Gym Casablanca",
      description: "Test gym for development",
      address: "Test Address, Casablanca",
      location: "Casablanca",
      capacity: 100,
      current_occupancy: 20,
      rating: 4.5,
      status: "ACTIVE",
      owner_id: "test-owner-1",
    },
  ],
  products: [
    {
      id: "test-prod-1",
      name: "Test Single Entry",
      description: "Test product for development",
      price: 50,
      duration: 120,
      validity_days: 1,
      club_id: "test-club-1",
      status: "ACTIVE",
    },
  ],
  users: [
    {
      id: "test-user-1",
      email: "test@example.com",
      name: "Test User",
      phone: "+212600000001",
      role: "CUSTOMER",
    },
    {
      id: "test-owner-1",
      email: "testowner@example.com",
      name: "Test Owner",
      phone: "+212600000002",
      role: "CLUB_OWNER",
      club_id: "test-club-1",
    },
  ],
};
