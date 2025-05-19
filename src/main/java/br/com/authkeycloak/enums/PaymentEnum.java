package br.com.authkeycloak.enums;

public enum PaymentEnum {

    PAYMENT("Pagamento realizado."),
    NOT_PAYMENT("Pagamento não realizado."),
    PAYMENT_FUTURE("Pagar futuramente.");

    public String value;

    private PaymentEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}

   