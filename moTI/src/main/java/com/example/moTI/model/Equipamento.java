package com.example.moTI.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipamentos")
public class Equipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEquipamento tipo;

    private String marca;
    private String modelo;

    @Column(unique = true, nullable = false)
    private String patrimonio; // ex: "PC-034"

    private String numeroSerie;

    @ManyToOne
    @JoinColumn(name = "local_id")
    private Local local;

    private LocalDate dataAquisicao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEquipamento status = StatusEquipamento.FUNCIONANDO;

    @Column(columnDefinition = "TEXT")
    private String detalhesEspecificos;

    @OneToMany(mappedBy = "equipamento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Manutencao> manutencoes = new ArrayList<>();

    public Equipamento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TipoEquipamento getTipo() { return tipo; }
    public void setTipo(TipoEquipamento tipo) { this.tipo = tipo; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }

    public String getPatrimonio() { return patrimonio; }
    public void setPatrimonio(String patrimonio) { this.patrimonio = patrimonio; }

    public String getNumeroSerie() { return numeroSerie; }
    public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }

    public Local getLocal() { return local; }
    public void setLocal(Local local) { this.local = local; }

    public LocalDate getDataAquisicao() { return dataAquisicao; }
    public void setDataAquisicao(LocalDate dataAquisicao) { this.dataAquisicao = dataAquisicao; }

    public StatusEquipamento getStatus() { return status; }
    public void setStatus(StatusEquipamento status) { this.status = status; }

    public String getDetalhesEspecificos() { return detalhesEspecificos; }
    public void setDetalhesEspecificos(String detalhesEspecificos) { this.detalhesEspecificos = detalhesEspecificos; }

    public List<Manutencao> getManutencoes() { return manutencoes; }
    public void setManutencoes(List<Manutencao> manutencoes) { this.manutencoes = manutencoes; }
}
