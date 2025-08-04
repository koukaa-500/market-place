package tn.homrnai.model;

import java.util.Set;

public enum role {
    ADMIN(Set.of(permission.MANAGE_PRODUCTS, permission.VIEW_ORDERS, permission.PROCESS_ORDERS, permission.CREATE_PROMOTIONS)),
    SOCIETE(Set.of(permission.MANAGE_PRODUCTS)),
    SOCIETE_EMPLOYEE(Set.of()),
    CLIENT(Set.of(permission.MANAGE_PRODUCTS)),
    PRODUCT_MANAGER(Set.of(permission.MANAGE_PRODUCTS)),
    ORDER_MANAGER(Set.of(permission.VIEW_ORDERS, permission.PROCESS_ORDERS)),
    PROMOTION_MANAGER(Set.of(permission.CREATE_PROMOTIONS));

    private final Set<permission> permissions;

    role(Set<permission> permissions) {
        this.permissions = permissions;
    }

    public Set<permission> getPermissions() {
        return permissions;
    }
}
