package tn.homrnai.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.homrnai.model.Avis;
import tn.homrnai.repository.AvisRepository;

import java.util.List;

@Service
public class AvisService {
    private final AvisRepository avisRepository;

    @Autowired
    public AvisService(AvisRepository avisRepository) {
        this.avisRepository = avisRepository;
    }

    public Avis saveAvis(Avis avis) {
        return avisRepository.save(avis);
    }

    public List<Avis> getAvisByProductId(Long productId) {
        return avisRepository.findByProductId(productId);
    }

}
