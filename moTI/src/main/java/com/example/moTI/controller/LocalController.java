package com.example.moTI.controller;

import com.example.moTI.model.Local;
import com.example.moTI.repository.LocalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locais")
public class LocalController {

    @Autowired
    private LocalRepository localRepository;


    @PostMapping
    public ResponseEntity<Local> criar(@RequestBody Local local) {
        Local salvo = localRepository.save(local);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public List<Local> listar() {
        return localRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Local> buscarPorId(@PathVariable Long id) {
        return localRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Local> atualizar(@PathVariable Long id, @RequestBody Local dados) {
        return localRepository.findById(id)
                .map(existente -> {
                    existente.setNome(dados.getNome());
                    existente.setSetor(dados.getSetor());
                    return ResponseEntity.ok(localRepository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!localRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        localRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
