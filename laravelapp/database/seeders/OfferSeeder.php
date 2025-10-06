<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\Arrangement;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        // Prvo ćemo obrisati sve postojeće ponude
        Offer::query()->delete();


        // Uzimamo sve aktivne aranžmane
        $arrangements = Arrangement::where('is_active', true)->get();

        foreach ($arrangements as $arrangement) {
            // Last Minute ponuda za aranžmane koji počinju u naredne 2 nedelje
            if ($arrangement->start_date <= now()->addDays(14)) {
                Offer::create([
                    'name' => 'Last Minute - ' . $arrangement->name,
                    'arrangement_id' => $arrangement->id,
                    'type' => 'last_minute',
                    'discount_percentage' => 20.00,
                    'valid_from' => now(),
                    'valid_until' => $arrangement->start_date,
                    'is_active' => true,
                    'description' => 'Požurite! Posebna last minute ponuda sa popustom od 20%'
                ]);
            }

            // Early Booking ponuda za aranžmane koji počinju za više od 60 dana
            if ($arrangement->start_date >= now()->addDays(60)) {
                Offer::create([
                    'name' => 'Early Booking - ' . $arrangement->name,
                    'arrangement_id' => $arrangement->id,
                    'type' => 'early_booking',
                    'discount_percentage' => 15.00,
                    'valid_from' => now(),
                    'valid_until' => now()->addDays(30),
                    'is_active' => true,
                    'description' => 'Rezervišite na vreme i ostvarite 15% popusta'
                ]);
            }

            // Dodajemo i nekoliko specijalnih ponuda
            if ($arrangement->price >= 500) {
                Offer::create([
                    'name' => 'Specijalna ponuda - ' . $arrangement->name,
                    'arrangement_id' => $arrangement->id,
                    'type' => 'special',
                    'discount_percentage' => 10.00,
                    'valid_from' => now(),
                    'valid_until' => now()->addDays(45),
                    'is_active' => true,
                    'description' => 'Poseban popust od 10% za premium aranžmane'
                ]);
            }
        }
    }
} 