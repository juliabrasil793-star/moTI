package com.example.moTI.controller;

import com.example.moTI.model.Manutencao;
import com.example.moTI.repository.ManutencaoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manutencoes")
public class ManutencaoController {

    private final ManutencaoRepository manutencaoRepository;

    ManutencaoController(ManutencaoRepository manutencaoRepository) {
        this.manutencaoRepository = manutencaoRepository;
    }

    @PostMapping
    public ResponseEntity<Manutencao> criar(@RequestBody Manutencao manutencao) {
        Manutencao salva = manutencaoRepository.save(manutencao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @GetMapping
    public List<Manutencao> listar() {
        return manutencaoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manutencao> buscarPorId(@PathVariable Long id) {
        return manutencaoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/equipamento/{equipamentoId}")
    public List<Manutencao> listarPorEquipamento(@PathVariable Long equipamentoId) {
        return manutencaoRepository.findByEquipamentoId(equipamentoId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manutencao> atualizar(@PathVariable Long id, @RequestBody Manutencao dados) {
        return manutencaoRepository.findById(id)
                .map(existente -> {
                    existente.setEquipamento(dados.getEquipamento());
                    existente.setDataAbertura(dados.getDataAbertura());
                    existente.setDataResolucao(dados.getDataResolucao());
                    existente.setProblema(dados.getProblema());
                    existente.setSolucao(dados.getSolucao());
                    existente.setStatus(dados.getStatus());
                    return ResponseEntity.ok(manutencaoRepository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!manutencaoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        manutencaoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
