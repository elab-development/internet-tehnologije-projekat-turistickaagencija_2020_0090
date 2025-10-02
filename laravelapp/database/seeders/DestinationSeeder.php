<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $destinations = [
            [
                'name' => 'Pariz',
                'country' => 'Francuska',
                'description' => 'Grad svetlosti'
            ],
            [
                'name' => 'Rim',
                'country' => 'Italija',
                'description' => 'Večni grad'
            ],
            [
                'name' => 'Barcelona',
                'country' => 'Španija',
                'description' => 'Grad Gaudija'
            ],
            [
                'name' => 'London',
                'country' => 'Velika Britanija',
                'description' => 'Prestonica Engleske'
            ],
            [
                'name' => 'Amsterdam',
                'country' => 'Holandija',
                'description' => 'Grad kanala'
            ],
            [
                'name' => 'Beč',
                'country' => 'Austrija',
                'description' => 'Grad muzike i kulture'
            ],
            [
                'name' => 'Prag',
                'country' => 'Češka',
                'description' => 'Zlatni grad'
            ],
            [
                'name' => 'Atina',
                'country' => 'Grčka',
                'description' => 'Kolevka civilizacije'
            ]
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }
}
