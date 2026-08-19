package com.example.moTI.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "manutencoes")
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipamento_id", nullable = false)
    @JsonIgnore
    private Equipamento equipamento;

    @Column(nullable = false)
    private LocalDate dataAbertura;

    private LocalDate dataResolucao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String problema;

    @Column(columnDefinition = "TEXT")
    private String solucao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusManutencao status = StatusManutencao.ABERTA;

    public Manutencao() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Equipamento getEquipamento() { return equipamento; }
    public void setEquipamento(Equipamento equipamento) { this.equipamento = equipamento; }

    public LocalDate getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDate dataAbertura) { this.dataAbertura = dataAbertura; }

    public LocalDate getDataResolucao() { return dataResolucao; }
    public void setDataResolucao(LocalDate dataResolucao) { this.dataResolucao = dataResolucao; }

    public String getProblema() { return problema; }
    public void setProblema(String problema) { this.problema = problema; }

    public String getSolucao() { return solucao; }
    public void setSolucao(String solucao) { this.solucao = solucao; }

    public StatusManutencao getStatus() { return status; }
    public void setStatus(StatusManutencao status) { this.status = status; }
}
