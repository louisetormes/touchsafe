package br.com.authkeycloak.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import br.com.authkeycloak.entities.OrganizatorPayment;
import br.com.authkeycloak.enums.PaymentEnum;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class OrganizatorRepository implements PanacheRepository<OrganizatorPayment>, IOrganizatorPaymentRepository{

    public void save(OrganizatorPayment entity){
        persist(entity);
    }

    public List<OrganizatorPayment> getPaymentsWithUser(String user){
        return list("user = ?1", user);
    }

    public Optional<OrganizatorPayment> findById(String id){
        return this.find("id = ?1", id).firstResultOptional();
    }

    public void deletePayment(OrganizatorPayment entity){
        this.delete(entity);
    }

    public List<OrganizatorPayment> getByTypePayment(PaymentEnum value, String user){
        return list("typePaiment = ?1 and user = ?2", value, user);
    }

    public List<OrganizatorPayment> getByPaymentDate(LocalDate date){
        return list("paymentDate < ?1", date);
    }

    public void update(OrganizatorPayment entity){
        getEntityManager().merge(entity);
    }
}
