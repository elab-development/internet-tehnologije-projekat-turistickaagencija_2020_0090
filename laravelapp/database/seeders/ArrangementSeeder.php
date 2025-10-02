<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArrangementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $parisId = Destination::where('name', 'Pariz')->first()->id;
        $romeId = Destination::where('name', 'Rim')->first()->id;
        $barcelonaId = Destination::where('name', 'Barcelona')->first()->id;

        // Aranžmani za Pariz
        $this->createArrangements([
            [
                'destination_id' => $parisId,
                'name' => 'Romantični Pariz',
                'description' => 'Nezaboravno putovanje u grad ljubavi',
                'price' => 599.99,
                'start_date' => now()->addDays(30),
                'end_date' => now()->addDays(35),
                'available_spots' => 20,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => $parisId,
                'name' => 'Pariz Express',
                'description' => 'Kratki vikend u Parizu',
                'price' => 399.99,
                'start_date' => now()->addDays(15),
                'end_date' => now()->addDays(18),
                'available_spots' => 15,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => $parisId,
                'name' => 'Pariz Bus Tura',
                'description' => 'Ekonomično putovanje u Pariz',
                'price' => 299.99,
                'start_date' => now()->addDays(45),
                'end_date' => now()->addDays(52),
                'available_spots' => 40,
                'transport_type' => 'bus',
                'accommodation_type' => 'hotel',
            ],
        ]);

        // Aranžmani za Rim
        $this->createArrangements([
            [
                'destination_id' => $romeId,
                'name' => 'Rim Express',
                'description' => 'Otkrijte lepote antičkog Rima',
                'price' => 499.99,
                'start_date' => now()->addDays(45),
                'end_date' => now()->addDays(50),
                'available_spots' => 15,
                'transport_type' => 'bus',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => $romeId,
                'name' => 'Rimska Vila',
                'description' => 'Luksuzni smeštaj u vili sa bazenom',
                'price' => 899.99,
                'start_date' => now()->addDays(60),
                'end_date' => now()->addDays(67),
                'available_spots' => 8,
                'transport_type' => 'airplane',
                'accommodation_type' => 'villa',
            ],
            [
                'destination_id' => $romeId,
                'name' => 'Rim Budget',
                'description' => 'Ekonomična varijanta za studente',
                'price' => 299.99,
                'start_date' => now()->addDays(30),
                'end_date' => now()->addDays(35),
                'available_spots' => 25,
                'transport_type' => 'bus',
                'accommodation_type' => 'apartment',
            ],
        ]);

        // Aranžmani za Barcelonu
        $this->createArrangements([
            [
                'destination_id' => $barcelonaId,
                'name' => 'Last Minute Barcelona',
                'description' => 'Posetite prelepu Barcelonu po specijalnoj ceni',
                'price' => 399.99,
                'start_date' => now()->addDays(7),
                'end_date' => now()->addDays(12),
                'available_spots' => 5,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => $barcelonaId,
                'name' => 'Barcelona Lux',
                'description' => 'Premium smeštaj u centru grada',
                'price' => 799.99,
                'start_date' => now()->addDays(90),
                'end_date' => now()->addDays(97),
                'available_spots' => 10,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => $barcelonaId,
                'name' => 'Barcelona Apartmani',
                'description' => 'Udoban smeštaj u apartmanima',
                'price' => 449.99,
                'start_date' => now()->addDays(40),
                'end_date' => now()->addDays(47),
                'available_spots' => 12,
                'transport_type' => 'airplane',
                'accommodation_type' => 'apartment',
            ],
        ]);

        // Aranžmani za London
        $this->createArrangements([
            [
                'destination_id' => Destination::where('name', 'London')->first()->id,
                'name' => 'London City Break',
                'description' => 'Vikend u britanskoj prestonici',
                'price' => 449.99,
                'start_date' => now()->addDays(20),
                'end_date' => now()->addDays(23),
                'available_spots' => 15,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => Destination::where('name', 'London')->first()->id,
                'name' => 'London Deluxe',
                'description' => 'Luksuzni boravak u centru Londona',
                'price' => 899.99,
                'start_date' => now()->addDays(45),
                'end_date' => now()->addDays(52),
                'available_spots' => 10,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ]
        ]);

        // Aranžmani za Amsterdam
        $this->createArrangements([
            [
                'destination_id' => Destination::where('name', 'Amsterdam')->first()->id,
                'name' => 'Amsterdam Express',
                'description' => 'Kratki predah u gradu kanala',
                'price' => 349.99,
                'start_date' => now()->addDays(25),
                'end_date' => now()->addDays(29),
                'available_spots' => 20,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => Destination::where('name', 'Amsterdam')->first()->id,
                'name' => 'Amsterdam Special',
                'description' => 'Poseban aranžman sa obilaskom okolnih gradova',
                'price' => 599.99,
                'start_date' => now()->addDays(60),
                'end_date' => now()->addDays(67),
                'available_spots' => 15,
                'transport_type' => 'bus',
                'accommodation_type' => 'hotel',
            ]
        ]);

        // Aranžmani za Beč
        $this->createArrangements([
            [
                'destination_id' => Destination::where('name', 'Beč')->first()->id,
                'name' => 'Božićni Beč',
                'description' => 'Praznična čarolija u srcu Austrije',
                'price' => 299.99,
                'start_date' => now()->addDays(30),
                'end_date' => now()->addDays(33),
                'available_spots' => 30,
                'transport_type' => 'bus',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => Destination::where('name', 'Beč')->first()->id,
                'name' => 'Beč Klasik',
                'description' => 'Klasični obilazak sa vodičem',
                'price' => 399.99,
                'start_date' => now()->addDays(50),
                'end_date' => now()->addDays(55),
                'available_spots' => 25,
                'transport_type' => 'bus',
                'accommodation_type' => 'hotel',
            ]
        ]);

        // Aranžmani za Prag
        $this->createArrangements([
            [
                'destination_id' => Destination::where('name', 'Prag')->first()->id,
                'name' => 'Magični Prag',
                'description' => 'Otkrijte čari zlatnog grada',
                'price' => 299.99,
                'start_date' => now()->addDays(40),
                'end_date' => now()->addDays(45),
                'available_spots' => 35,
                'transport_type' => 'bus',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => Destination::where('name', 'Prag')->first()->id,
                'name' => 'Prag Lux',
                'description' => 'Premium smeštaj u srcu grada',
                'price' => 499.99,
                'start_date' => now()->addDays(70),
                'end_date' => now()->addDays(75),
                'available_spots' => 15,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ]
        ]);

        // Aranžmani za Atinu
        $this->createArrangements([
            [
                'destination_id' => Destination::where('name', 'Atina')->first()->id,
                'name' => 'Antička Atina',
                'description' => 'Putovanje kroz istoriju',
                'price' => 449.99,
                'start_date' => now()->addDays(35),
                'end_date' => now()->addDays(42),
                'available_spots' => 20,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ],
            [
                'destination_id' => Destination::where('name', 'Atina')->first()->id,
                'name' => 'Atina i ostrva',
                'description' => 'Kombinovani aranžman sa obilascima ostrva',
                'price' => 699.99,
                'start_date' => now()->addDays(80),
                'end_date' => now()->addDays(89),
                'available_spots' => 12,
                'transport_type' => 'airplane',
                'accommodation_type' => 'hotel',
            ]
        ]);
    }
    private function createArrangements(array $arrangements)
    {
        foreach ($arrangements as $arrangement) {
            Arrangement::create(array_merge($arrangement, ['is_active' => true]));
        }
    }
}
