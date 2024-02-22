# Local deployment for development

## SMS API

we are using octopush API to send OTP messages.

create an account [here](https://client.octopush.com/en/registration) and login, then grab your `api-key` and `api-login` from the [OTP setting page](https://client.octopush.com/settings/otp).

upon registration you have 5€ free credits.

## Environment variables:

create a `.env` file at the root of the project with the following variables:

```sh
SMS_SERVICE_KEY=your api-key from octupush
SMS_SERVICE_LOGIN=your api-login from octupush
SMS_SERVICE_API=https://api.octopush.com/v1/public/service/otp
SECRET="some complex secret string with 32 chars long"
LDAP_URL=your ldap service
LDAP_BASE=the ldap base DN
LDAP_DN=the ldap admin DN
LDAP_ADMIN_PASSWORD=the ldap password
AUTH_URL=your lemonldap auth url
PUBLIC_TMAIL_PLAYSTORE_URL=tmail playstore url
PUBLIC_TWAKE_PLAYSTORE_URL=twake chat playstore url
PUBLIC_TMAIL_APPSTORE_URL=tmail apple store url
PUBLIC_TWAKE_APPSTORE_URL=twake chat apple store url
PUBLIC_TWAKE_WEB=twake chat web url
PUBLIC_TMAIL_WEB=tmail web url
PUBLIC_TDRIVE_WEB=tdrive web url
PUBLIC_TWAKE_MAGIC_LINK=twake chat mobile app magic link
PUBLIC_TMAIL_MAGIC_LINK=tmail mobile app magic link
PUBLIC_TDRIVE_MAGIC_LINK=tdrive mobile app magic link
PUBLIC_OIDC_PROVIDER=oidc provider url
ADMIN_OTP=admin OTP ( dev only )
PUBLIC_AUTHORISATION_URL=lemonldap oauth2 url
PUBLIC_GEO_API_URL="https://get.geojs.io/v1/"
PUBLIC_SIGNUP_EMAIL_DOMAIN=the domain name to be used for creating accounts
```

example env:

```bash
SMS_SERVICE_KEY=redacted
SMS_SERVICE_LOGIN=email@example.com
SMS_SERVICE_API=https://api.octopush.com/v1/public/service/otp
SECRET="a1Aa]e7@ay]xaQ=G?RiPe.95og^3@)>F"
LDAP_URL="ldap://openldap:1389"
LDAP_BASE="dc=example,dc=org"
LDAP_DN="cn=admin,dc=example,dc=org"
LDAP_ADMIN_PASSWORD=123456
AUTH_URL="http://auth.example.com"
PUBLIC_TMAIL_PLAYSTORE_URL="https://play.google.com/...."
PUBLIC_TWAKE_PLAYSTORE_URL="https://play.google.com/...."
PUBLIC_TMAIL_APPSTORE_URL="https://apps.apple.com/us/app/...."
PUBLIC_TWAKE_APPSTORE_URL="https://apps.apple.com/us/app/...."
PUBLIC_TWAKE_WEB="https://beta.twake.app/"
PUBLIC_TMAIL_WEB="https://tmail.linagora.com/"
PUBLIC_TDRIVE_WEB="https://tdrive.linagora.com/"
PUBLIC_TWAKE_MAGIC_LINK="twake.chat://"
PUBLIC_TMAIL_MAGIC_LINK="teammail.mobile://"
PUBLIC_TDRIVE_MAGIC_LINK="twake.drive://"
PUBLIC_OIDC_PROVIDER="https://matrix.example.com/_matrix/client/v3/login/sso/redirect/oidc-twake"
ADMIN_OTP=775577
PUBLIC_AUTHORISATION_URL="http://auth.example.com/oauth2/authorize"
PUBLIC_GEO_API_URL="https://get.geojs.io/v1/"
PUBLIC_SIGNUP_EMAIL_DOMAIN='twake.app'
```

## run the services using docker

### pull the images:

```sh
docker-compose pull
```

### run the containers:

```sh
docker-compose up -d
```

## start testing

the application will be available here: http://localhost:8080/
