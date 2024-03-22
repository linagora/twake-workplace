package Lemonldap::NG::Portal::SMS::TWP;

use strict;
use JSON 'to_json';
use LWP::UserAgent;

our $ua       = LWP::UserAgent->new;
our $smsApi   = $ENV{TWP_SMS_API}   or die "Missing SMS API";
our $smsToken = $ENV{TWP_SMS_TOKEN} or die "Missing SMS token";

sub sendSMS {
    my ( $phone, $text ) = @_;

    # Phones that start by 00
    $phone =~ s/^00/\+/;

    # Default to French phone when starting with "0"
    $phone =~ s/^0/\+33/;

    # Add "+" if missing
    $phone =~ s/^(\d)/\+$1/;

    # Prepare request
    my $hreq = HTTP::Request->new( POST => $smsApi );
    $hreq->header( 'Content-Type' => 'application/json' );
    $hreq->header( Accept         => 'application/json' );
    $hreq->header( Authorization  => "Bearer: $smsToken" );
    $hreq->content(
        to_json( {
                phone   => $phone,
                message => $text,
            }
        )
    );
    my $resp = $ua->request($hreq);
    return $resp->is_success;
}

1;
