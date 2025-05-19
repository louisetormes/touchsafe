package br.com.authkeycloak.entities;

import java.time.LocalDate;

import br.com.authkeycloak.enums.PaymentEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder(setterPrefix = "with")
@Data
@NoArgsConstructor
@AllArgsConstructor  
@Entity
@Table(name = "organizator_payment")
public class OrganizatorPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_payment")
    private String id;

    @Column(name = "name")
    private String namePayment;

    @Column(name = "description")
    private String description;

    @Column(name = "value_payment")
    private Float valuePayment;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_payment")
    private PaymentEnum typePayment;

    @Column(name = "user_id")
    private String user; 

    public String getTypePaymentValue() {
        return typePayment != null ? typePayment.getValue() : null;
    }

}
