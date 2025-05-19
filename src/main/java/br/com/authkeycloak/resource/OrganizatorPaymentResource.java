package br.com.authkeycloak.resource;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;

import br.com.authkeycloak.PersistOrganizatorPayment;
import br.com.authkeycloak.dtos.OrganizatorPaymentDTO;
import br.com.authkeycloak.entities.OrganizatorPayment;
import br.com.authkeycloak.enums.PaymentEnum;
import br.com.authkeycloak.repositories.IOrganizatorPaymentRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.jbosslog.JBossLog;

@JBossLog
@Path("/api/organizator")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrganizatorPaymentResource {

    @Inject
    PersistOrganizatorPayment persist;

    @Inject
    IOrganizatorPaymentRepository repository;

    @POST
    @Path("/send/payment")
    public Response sendOrganizatorPayment(@RequestBody OrganizatorPaymentDTO dto,
                                       @HeaderParam("X-Client-Id") String clientId){
                                        log.info("chegou");
        return Response.ok(this.persist.persist(dto, clientId)).build();
    }

    @GET
    @Path("/return/payment")
    public Response getPayments(@QueryParam("client_id") String clientId){
        try{
            List<OrganizatorPayment> getPayments = repository.getPaymentsWithUser(clientId);
            List<OrganizatorPaymentDTO> dtos = getPayments.stream()
            .map(p -> this.persist.fromEntity(p))
            .collect(Collectors.toList());
            return Response.ok(dtos).build();
        } catch (WebApplicationException e){
            e.getMessage();
        }
       return null;
    }

    @PATCH
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    @Transactional
    public Response updatePayment(
        @QueryParam("id") String id, 
        @QueryParam("client_id") String clientId,
        OrganizatorPaymentDTO dto) {
        
        if (id == null || id.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity("ID do pagamento é obrigatório")
                .build();
        }
    
        Optional<OrganizatorPayment> existing = this.repository.findById(id);
        if (existing.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Pagamento não encontrado para o ID: " + id)
                .build();
        }
    
        try {
            OrganizatorPayment entity = existing.get();
            entity.setNamePayment(dto.namePayment());
            entity.setDescription(dto.description());
            entity.setValuePayment(dto.valuePayment());
            entity.setPaymentDate(dto.paymentDate());
            entity.setTypePayment(PaymentEnum.valueOf(dto.typePayment()));
            
            this.repository.update(entity);
            
            return Response.ok("Pagamento atualizado com sucesso. ID: " + id).build();
            
        } catch (Exception e) {
            return Response.serverError()
                .entity("Erro ao atualizar pagamento: " + e.getMessage())
                .build();
        }
    }

    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deletePayment(@QueryParam("id") String id) {
        if (id == null || id.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity("ID do pagamento é obrigatório")
                .build();
        }

        Optional<OrganizatorPayment> existing = this.repository.findById(id);
        if (existing.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Pagamento não encontrado para o ID: " + id)
                .build();
        }

        try {
            this.repository.deletePayment(existing.get());
            
            return Response.ok(
                Map.of(
                    "status", "success",
                    "message", "Pagamento deletado com sucesso",
                    "deletedId", id
                )
            ).build();
            
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Erro ao deletar pagamento: " + e.getMessage())
                .build();
        }
    }

    @GET
    @Path("/typePayment")
    public Response getByTypePayment(@QueryParam("typePayment") String typePayment, 
        @QueryParam("client_id") String clientId){
        List<OrganizatorPayment> getByTypePayment = this.repository.getByTypePayment(
            PaymentEnum.valueOf(typePayment), 
            clientId);
        List<OrganizatorPaymentDTO> dtos = getByTypePayment.stream()
        .map(p -> this.persist.fromEntity(p))
        .collect(Collectors.toList());
        return Response.ok(dtos).build();
    }

    @GET
    @Path("/date")
    public Response getByPaymentLate(@QueryParam("date") LocalDate date){
        List<OrganizatorPayment> allPayments = this.repository.getByPaymentDate(date);
        List<OrganizatorPaymentDTO> dtos = allPayments.stream()
        .map(p -> this.persist.fromEntity(p))
        .collect(Collectors.toList());
        return Response.ok(dtos).build();         
    }
}