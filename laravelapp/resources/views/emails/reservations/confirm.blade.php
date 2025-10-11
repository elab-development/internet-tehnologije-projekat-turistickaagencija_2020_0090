<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Potvrda rezervacije</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; background-color: #fff; padding: 20px; margin: auto; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Potvrda rezervacije</h2>

        <p>Zdravo {{ $reservation->user->name ?? 'poštovani korisniče' }},</p>

        <p>Vaša rezervacija je uspešno kreirana.</p>

        <h3>Detalji rezervacije:</h3>
        <ul>
            <li><strong>Aranžman:</strong> {{ $reservation->arrangement->destination->name ?? 'Nepoznato' }}</li>
            <li><strong>Broj osoba:</strong> {{ $reservation->number_of_persons }}</li>
            <li><strong>Ukupna cena:</strong> {{ $reservation->total_price }} EUR</li>
            <li><strong>Status:</strong> {{ ucfirst($reservation->status) }}</li>
            <li><strong>Datum rezervacije:</strong> {{ $reservation->reservation_date }}</li>
        </ul>

        <p>Hvala što ste izabrali našu turističku agenciju!</p>

        <p>Srdačan pozdrav,<br>
        <strong>{{ config('app.name') }}</strong></p>
    </div>
</body>
</html>

