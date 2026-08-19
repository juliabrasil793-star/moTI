package com.example.moTI.model;

import jakarta.persistence.*;

@Entity
@Table(name = "locais")
public class Local {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome; // ex: "Laboratório 2"

    private String setor; // ex: "Bloco B"

    public Local() {}

    public Local(String nome, String setor) {
        this.nome = nome;
        this.setor = setor;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getSetor() { return setor; }
    public void setSetor(String setor) { this.setor = setor; }
}
