<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Destination;
use App\Models\Arrangement;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    private $destinationsData = [
        ['name' => 'Pariz', 'country' => 'Francuska', 'latitude' => 48.8566, 'longitude' => 2.3522],
        ['name' => 'Rim', 'country' => 'Italija', 'latitude' => 41.9028, 'longitude' => 12.4964],
        ['name' => 'Barcelona', 'country' => 'Španija', 'latitude' => 41.3851, 'longitude' => 2.1734],
        ['name' => 'London', 'country' => 'Velika Britanija', 'latitude' => 51.5074, 'longitude' => -0.1278],
        ['name' => 'Amsterdam', 'country' => 'Holandija', 'latitude' => 52.3676, 'longitude' => 4.9041],
        ['name' => 'Beč', 'country' => 'Austrija', 'latitude' => 48.2082, 'longitude' => 16.3738],
        ['name' => 'Prag', 'country' => 'Češka', 'latitude' => 50.0755, 'longitude' => 14.4378],
        ['name' => 'Atina', 'country' => 'Grčka', 'latitude' => 37.9838, 'longitude' => 23.7275],
    ];

    public function run()
    {
        $this->call(AdminUserSeeder::class);
        $this->call(AgentClientUsersSeeder::class);
        foreach ($this->destinationsData as $destination) {
            $existing = Destination::where('name', $destination['name'])->first();
            if ($existing) {
                $existing->update($destination);
            } else {
                Destination::create($destination);
            }
        }

        // Create 2-3 arrangements for each destination
        foreach ($this->destinationsData as $destination) {
            $dest = Destination::where('name', $destination['name'])->first();

            for ($i = 0; $i < rand(2, 3); $i++) {
                $startDate = Carbon::now()->addDays(rand(30, 180));
                
                $payload = [
                    'destination_id' => $dest->id,
                    'name' => $this->getArrangementName($dest->name, $i),
                    'description' => $this->getDescription($dest->name, $i),
                    'price' => $this->getPrice($i),
                    'start_date' => $startDate,
                    'end_date' => $startDate->copy()->addDays(rand(5, 14)),
                    'available_spots' => rand(10, 50),
                    'transport_type' => $this->getRandomTransport(),
                    'accommodation_type' => $this->getRandomAccommodation(),
                    'is_active' => true,
                    'is_last_minute' => $this->isLastMinute($startDate),
                    'is_early_booking' => $this->isEarlyBooking($startDate),
                    'image_url' => $this->getImageUrl($dest->name),
                ];

                // Upsert po imenu aranžmana
                $existing = Arrangement::where('name', $payload['name'])->where('destination_id', $dest->id)->first();
                if ($existing) {
                    $existing->update($payload);
                } else {
                    Arrangement::create($payload);
                }
            }
        }

        $this->call([
            AdditionalArrangementsSeeder::class,
            EarlyBookingArrangementsSeeder::class,
        ]);

        $this->call(OfferSeeder::class);
    }

    private function getArrangementName($city, $index)
    {
        $types = [
            'Premium obilazak',
            'Luksuzni paket',
            'Ekonomični aranžman'
        ];
        return $city . ' - ' . $types[$index];
    }

    private function getDescription($city, $index)
    {
        $descriptions = [
            'Nezaboravno putovanje sa profesionalnim vodičem i premium smeštajem',
            'Luksuzni smeštaj u centru grada sa all-inclusive uslugom',
            'Ekonomična varijanta sa kvalitetnim smeštajem i organizovanim obilascima'
        ];
        return $descriptions[$index];
    }

    private function getPrice($index)
    {
        $prices = [599.99, 899.99, 299.99];
        return $prices[$index];
    }

    private function getRandomTransport()
    {
        $types = ['bus', 'airplane', 'own'];
        return $types[array_rand($types)];
    }

    private function getRandomAccommodation()
    {
        $types = ['hotel', 'apartment', 'villa'];
        return $types[array_rand($types)];
    }

    private function getImageUrl(string $city): string
    {
        $map = [
            'Pariz' => 'https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=1200&auto=format&fit=crop',
            'Rim' => 'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
            'Barcelona' => 'https://images.unsplash.com/photo-1464790719320-516ecd75af6c?q=80&w=1200&auto=format&fit=crop',
            'London' => 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1200&auto=format&fit=crop',
            'Amsterdam' => 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?q=80&w=1200&auto=format&fit=crop',
            'Beč' => 'https://images.unsplash.com/photo-1594732832278-c9c9ca7608d1?q=80&w=1200&auto=format&fit=crop',
            'Prag' => 'https://images.unsplash.com/photo-1534683334697-9541c7cb0e76?q=80&w=1200&auto=format&fit=crop',
            'Atina' => 'https://images.unsplash.com/photo-1548786811-dd6e453ccca0?q=80&w=1200&auto=format&fit=crop',
        ];
        return $map[$city] ?? 'https://images.unsplash.com/photo-1502920917128-1aa500764bca?q=80&w=1200&auto=format&fit=crop';
    }

    private function isLastMinute(Carbon $startDate): bool
    {
        return $startDate->diffInDays(Carbon::now()) <= 14;
    }

    private function isEarlyBooking(Carbon $startDate): bool
    {
        return $startDate->diffInDays(Carbon::now()) >= 90;
    }
}
