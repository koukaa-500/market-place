package tn.homrnai.service;

import lombok.Getter;

@Getter
public enum EmailTemplateName {

    ACTIVATE_ACCOUNT("confirm-email");
    private final String name;
    EmailTemplateName(String name) {
        this.name = name;
    }
}
