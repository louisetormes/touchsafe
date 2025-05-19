package br.com.authkeycloak.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import br.com.authkeycloak.entities.OrganizatorPayment;
import br.com.authkeycloak.enums.PaymentEnum;


public interface IOrganizatorPaymentRepository {

    void save(OrganizatorPayment entities);
    List<OrganizatorPayment> getPaymentsWithUser(String user);
    Optional<OrganizatorPayment> findById(String id);
    void deletePayment(OrganizatorPayment entity);
    List<OrganizatorPayment> getByTypePayment(PaymentEnum value, String user);
    void update(OrganizatorPayment entity);
    List<OrganizatorPayment> getByPaymentDate(LocalDate date);
}
