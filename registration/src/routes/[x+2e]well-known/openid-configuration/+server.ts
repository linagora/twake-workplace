import { type RequestHandler, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getUrl, removeTrailingSlash } from '$lib/utils/url';

export const GET: RequestHandler = async () => {
	const authServer = getUrl(env.AUTH_URL);

	return json({
		backchannel_logout_session_supported: true,
		introspection_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
		response_modes_supported: ['query', 'fragment', 'form_post'],
		jwks_uri: `${authServer}oauth2/jwks`,
		end_session_endpoint: `${authServer}oauth2/logout`,
		grant_types_supported: ['authorization_code', 'refresh_token'],
		authorization_endpoint: `${authServer}oauth2/authorize`,
		response_types_supported: ['code'],
		backchannel_logout_supported: true,
		frontchannel_logout_session_supported: true,
		userinfo_encryption_enc_values_supported: [
			'A256CBC-HS512',
			'A256GCM',
			'A192CBC-HS384',
			'A192GCM',
			'A128CBC-HS256',
			'A128GCM'
		],
		frontchannel_logout_supported: true,
		request_uri_parameter_supported: true,
		acr_values_supported: ['loa-4', 'loa-1', 'loa-2', 'loa-5', 'loa-3'],
		id_token_signing_alg_values_supported: [
			'none',
			'HS256',
			'HS384',
			'HS512',
			'RS256',
			'RS384',
			'RS512',
			'PS256',
			'PS384',
			'PS512'
		],
		request_parameter_supported: true,
		token_endpoint: `${authServer}oauth2/token`,
		userinfo_endpoint: `${authServer}oauth2/userinfo`,
		issuer: removeTrailingSlash(authServer),
		claims_supported: ['sub', 'iss', 'auth_time', 'acr', 'sid'],
		subject_types_supported: ['public'],
		scopes_supported: ['openid', 'profile', 'email', 'address', 'phone'],
		id_token_encryption_enc_values_supported: [
			'A256CBC-HS512',
			'A256GCM',
			'A192CBC-HS384',
			'A192GCM',
			'A128CBC-HS256',
			'A128GCM'
		],
		require_request_uri_registration: true,
		id_token_encryption_alg_values_supported: [
			'RSA-OAEP',
			'ECDH-ES',
			'RSA-OAEP-256',
			'ECDH-ES+A256KW',
			'ECDH-ES+A192KW',
			'ECDH-ES+A128KW',
			'RSA1_5'
		],
		token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
		userinfo_encryption_alg_values_supported: [
			'RSA-OAEP',
			'ECDH-ES',
			'RSA-OAEP-256',
			'ECDH-ES+A256KW',
			'ECDH-ES+A192KW',
			'ECDH-ES+A128KW',
			'RSA1_5'
		],
		code_challenge_methods_supported: ['plain', 'S256'],
		introspection_endpoint: `${authServer}oauth2/introspect`,
		userinfo_signing_alg_values_supported: [
			'none',
			'HS256',
			'HS384',
			'HS512',
			'RS256',
			'RS384',
			'RS512',
			'PS256',
			'PS384',
			'PS512'
		]
	});
};
