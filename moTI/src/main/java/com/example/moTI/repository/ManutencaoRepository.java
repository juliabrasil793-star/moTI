package com.example.moTI.repository;

import com.example.moTI.model.Manutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
    List<Manutencao> findByEquipamentoId(Long equipamentoId);
}
