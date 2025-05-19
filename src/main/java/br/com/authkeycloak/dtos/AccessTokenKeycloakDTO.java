package br.com.authkeycloak.dtos;

import jakarta.json.bind.annotation.JsonbProperty;

public record AccessTokenKeycloakDTO(
    @JsonbProperty(value = "clientId") String clientId,
    @JsonbProperty(value = "clientSecret") String clientSecret,
    @JsonbProperty(value = "grant_type") String grantType
) {}
