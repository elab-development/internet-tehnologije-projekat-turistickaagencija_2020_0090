<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Arrangement;

class AdditionalArrangementsSeeder extends Seeder
{
    public function run()
    {
        $arrangements = [
            [
                'name' => 'Last Minute - Grčka Leto',
                'description' => 'Super last minute ponuda za Grčku',
                'price' => 299.00,
                'original_price' => 499.00,
                'discount_percentage' => 40.00,
                'destination_id' => 1,
                'transport_type' => 'bus',
                'accommodation_type' => 'hotel',
                'is_active' => true,
                'is_last_minute' => true,
                'is_early_booking' => false,
                'start_date' => now()->addDays(5),
                'end_date' => now()->addDays(12),
                'available_spots' => 5,
                'special_offer_expires_at' => now()->addDays(2),
                'image_url' => 'https://example.com/greece.jpg'
            ],
            [
                'name' => 'Early Booking - Italija 2024',
                'description' => 'Rani booking za letovanje u Italiji',
                'price' => 450.00,
                'original_price' => 600.00,
                'discount_percentage' => 25.00,
                'destination_id' => 2,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
                'is_active' => true,
                'is_last_minute' => false,
                'is_early_booking' => true,
                'start_date' => now()->addDays(90),
                'end_date' => now()->addDays(97),
                'available_spots' => 20,
                'special_offer_expires_at' => now()->addDays(30),
                'image_url' => 'https://example.com/italy.jpg'
            ]
        ];

        foreach ($arrangements as $arrangement) {
           
            $exists = Arrangement::where('name', $arrangement['name'])->exists();
            if (!$exists) {
                Arrangement::create($arrangement);
            }
        }
    }
} 