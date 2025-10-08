<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use PDF;

class ReservationConfirmMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;

    public function __construct($reservation)
    {
        $this->reservation = $reservation;
        $this->user=auth()->user();
    }

    public function build()
    {
        $pdf = PDF::loadView('pdf.confirm', ['reservation' => $this->reservation,'user'=>$this->user]);

        return $this->subject('Potvrda o rezervaciji')
                    ->view('emails.confirm', [
                        'user' => $this->user,
                        'reservation' => $this->reservation,
                    ])
                    ->attachData($pdf->output(), 'confirm.pdf');
    }
}