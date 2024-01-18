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
```
example env:

```bash
SMS_SERVICE_KEY=redacted
SMS_SERVICE_LOGIN=email@example.com
SMS_SERVICE_API=https://api.octopush.com/v1/public/service/otp
SECRET="p1TM]e7@wy]xcQ=G?RiPe.95og^3@)>F"
LDAP_URL="ldap://openldap:1389"
LDAP_BASE="dc=example,dc=org"
LDAP_DN="cn=admin,dc=example,dc=org"
LDAP_ADMIN_PASSWORD=123456
AUTH_URL="http://auth.example.com"
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

