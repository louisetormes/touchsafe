package br.com.authkeycloak.dtos;

import java.time.LocalDate;

public record OrganizatorPaymentDTO(
    String id,
    String namePayment,
    String description,
    Float valuePayment,
    LocalDate paymentDate,
    String typePayment,
    String user
) {}
