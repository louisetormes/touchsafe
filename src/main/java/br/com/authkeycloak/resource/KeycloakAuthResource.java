package br.com.authkeycloak.resource;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import br.com.authkeycloak.clients.KeycloakClients;
import br.com.authkeycloak.dtos.TokenResponse;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/keycloak")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class KeycloakAuthResource {

	@Inject
	@RestClient
	KeycloakClients client;

	@Inject
	OrganizatorPaymentResource resourcePayment;

	@GET
	public Response getTokenKeycloak(@QueryParam("client_id") String clientId, @QueryParam("client_secret") String clientSecret) {
		String grantType = "client_credentials";
		TokenResponse getAccessToken = client.getToken(clientId, clientSecret, grantType);

		return Response.ok(getAccessToken.accessToken()).build();
	}
}