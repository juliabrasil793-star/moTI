package com.example.moTI.repository;

import com.example.moTI.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    // JpaRepository já dá: save, findAll, findById, deleteById, etc.
    // Depois podemos adicionar métodos como findByStatus(StatusEquipamento status)
}
