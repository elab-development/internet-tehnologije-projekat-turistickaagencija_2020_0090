<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Arrangement;
use App\Models\Destination;

class EarlyBookingArrangementsSeeder extends Seeder
{
    public function run()
    {
        $arrangements = [
            [
                'name' => 'Early Booking - Pariz Proleće 2025',
                'description' => 'Uživajte u prolećnom Parizu uz popust za rane rezervacije i vođene obilaske muzeja.',
                'price' => 499.00,
                'original_price' => 699.00,
                'discount_percentage' => 28.61,
                'destination' => 'Pariz',
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
                'is_active' => true,
                'is_last_minute' => false,
                'is_early_booking' => true,
                'start_date' => now()->addDays(120),
                'end_date' => now()->addDays(127),
                'available_spots' => 18,
                'special_offer_expires_at' => now()->addDays(60),
                'image_url' => 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200&auto=format&fit=crop'
            ],
            [
                'name' => 'Early Booking - Rim Uskrs 2025',
                'description' => 'Posetite Rim tokom Uskrsa uz specijalan popust i VIP obilazak Vatikana.',
                'price' => 479.00,
                'original_price' => 659.00,
                'discount_percentage' => 27.31,
                'destination' => 'Rim',
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
                'is_active' => true,
                'is_last_minute' => false,
                'is_early_booking' => true,
                'start_date' => now()->addDays(140),
                'end_date' => now()->addDays(147),
                'available_spots' => 22,
                'special_offer_expires_at' => now()->addDays(70),
                'image_url' => 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop'
            ],
            [
                'name' => 'Early Booking - Barcelona Leto 2025',
                'description' => 'Sunčane plaže, Gaudijeva arhitektura i flamenco veče uključeni u cenu.',
                'price' => 549.00,
                'original_price' => 789.00,
                'discount_percentage' => 30.42,
                'destination' => 'Barcelona',
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
                'is_active' => true,
                'is_last_minute' => false,
                'is_early_booking' => true,
                'start_date' => now()->addDays(160),
                'end_date' => now()->addDays(168),
                'available_spots' => 26,
                'special_offer_expires_at' => now()->addDays(75),
                'image_url' => 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200&auto=format&fit=crop'
            ],
            [
                'name' => 'Early Booking - Amsterdam Prolećni City Break',
                'description' => 'Tulipani, krstarenje kanalima i degustacija sireva uz popust za ranu uplatu.',
                'price' => 429.00,
                'original_price' => 599.00,
                'discount_percentage' => 28.38,
                'destination' => 'Amsterdam',
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
                'is_active' => true,
                'is_last_minute' => false,
                'is_early_booking' => true,
                'start_date' => now()->addDays(110),
                'end_date' => now()->addDays(115),
                'available_spots' => 20,
                'special_offer_expires_at' => now()->addDays(55),
                'image_url' => 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1200&auto=format&fit=crop'
            ],
            [
                'name' => 'Early Booking - Atina Letovanje 2025',
                'description' => 'Letovanje u Atini sa izletom na ostrvo Eginu i wellness tretmanima u hotelu.',
                'price' => 399.00,
                'original_price' => 579.00,
                'discount_percentage' => 31.12,
                'destination' => 'Atina',
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
                'is_active' => true,
                'is_last_minute' => false,
                'is_early_booking' => true,
                'start_date' => now()->addDays(130),
                'end_date' => now()->addDays(138),
                'available_spots' => 28,
                'special_offer_expires_at' => now()->addDays(65),
                'image_url' => 'https://images.unsplash.com/photo-1548786811-dd6e453ccca0?q=80&w=1200&auto=format&fit=crop'
            ],
        ];

        foreach ($arrangements as $arrangement) {
            $destination = Destination::where('name', $arrangement['destination'])->first();

            if (!$destination) {
                continue;
            }

            $payload = $arrangement;
            $payload['destination_id'] = $destination->id;
            unset($payload['destination']);

            // Проверавамо да ли већ постоји сличан аранжман
            $exists = Arrangement::where('name', $payload['name'])->exists();
            if (!$exists) {
                Arrangement::create($payload);
            }
        }
    }
}