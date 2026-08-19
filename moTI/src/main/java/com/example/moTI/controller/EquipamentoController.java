package com.example.moTI.controller;

import com.example.moTI.model.Equipamento;
import com.example.moTI.repository.EquipamentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipamentos")
public class EquipamentoController {

    private final EquipamentoRepository equipamentoRepository;

    EquipamentoController(EquipamentoRepository equipamentoRepository) {
        this.equipamentoRepository = equipamentoRepository;
    }

    // aqui é o cadastro
    @PostMapping
    public ResponseEntity<Equipamento> criar(@RequestBody Equipamento equipamento) {
        Equipamento salvo = equipamentoRepository.save(equipamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // aqui é onde lista todos eles
    @GetMapping
    public List<Equipamento> listar() {
        return equipamentoRepository.findAll();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Equipamento> buscarPorId(@PathVariable Long id) {
        return equipamentoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipamento> atualizar(@PathVariable Long id, @RequestBody Equipamento dados) {
        return equipamentoRepository.findById(id)
                .map(existente -> {
                    existente.setTipo(dados.getTipo());
                    existente.setMarca(dados.getMarca());
                    existente.setModelo(dados.getModelo());
                    existente.setPatrimonio(dados.getPatrimonio());
                    existente.setNumeroSerie(dados.getNumeroSerie());
                    existente.setLocal(dados.getLocal());
                    existente.setDataAquisicao(dados.getDataAquisicao());
                    existente.setStatus(dados.getStatus());
                    existente.setDetalhesEspecificos(dados.getDetalhesEspecificos());
                    return ResponseEntity.ok(equipamentoRepository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!equipamentoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        equipamentoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
