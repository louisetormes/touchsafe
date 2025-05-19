package br.com.authkeycloak;

import br.com.authkeycloak.dtos.OrganizatorPaymentDTO;
import br.com.authkeycloak.entities.OrganizatorPayment;
import br.com.authkeycloak.enums.PaymentEnum;
import br.com.authkeycloak.repositories.IOrganizatorPaymentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class PersistOrganizatorPayment {

    @Inject
    IOrganizatorPaymentRepository repository;

    @Transactional
    public OrganizatorPayment persist(OrganizatorPaymentDTO dto, String clientId){
        OrganizatorPayment toEntity = this.toEntity(dto);
        this.repository.save(toEntity);
        return toEntity;
    }

    public static OrganizatorPaymentDTO fromEntity(OrganizatorPayment entity) {
        return new OrganizatorPaymentDTO(
            entity.getId(),
            entity.getNamePayment(),
            entity.getDescription(),
            entity.getValuePayment(),
            entity.getPaymentDate(),
            entity.getTypePayment() != null ? entity.getTypePayment().getValue() : null,
            entity.getUser()
        );
    }

    public static OrganizatorPayment toEntity(OrganizatorPaymentDTO dto){
        return OrganizatorPayment.builder()
                    .withId(dto.id())
                    .withNamePayment(dto.namePayment())
                    .withDescription(dto.description())
                    .withPaymentDate(dto.paymentDate())
                    .withValuePayment(dto.valuePayment())
                    .withTypePayment(PaymentEnum.valueOf(dto.typePayment()))
                    .withUser(dto.user())
                    .build();
    }
}
