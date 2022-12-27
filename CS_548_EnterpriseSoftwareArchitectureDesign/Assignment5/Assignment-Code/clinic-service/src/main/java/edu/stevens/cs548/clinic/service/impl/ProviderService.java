package edu.stevens.cs548.clinic.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import edu.stevens.cs548.clinic.domain.*;
import edu.stevens.cs548.clinic.domain.IPatientDao.PatientExn;
import edu.stevens.cs548.clinic.domain.IProviderDao.ProviderExn;
import edu.stevens.cs548.clinic.domain.ITreatmentDao.TreatmentExn;
import edu.stevens.cs548.clinic.service.IPatientService.PatientNotFoundExn;
import edu.stevens.cs548.clinic.service.IPatientService.PatientServiceExn;
import edu.stevens.cs548.clinic.service.IProviderService;
import edu.stevens.cs548.clinic.service.dto.DrugTreatmentDto;
import edu.stevens.cs548.clinic.service.dto.PatientDto;
import edu.stevens.cs548.clinic.service.dto.PhysiotherapyTreatmentDto;
import edu.stevens.cs548.clinic.service.dto.ProviderDto;
import edu.stevens.cs548.clinic.service.dto.ProviderDtoFactory;
import edu.stevens.cs548.clinic.service.dto.RadiologyTreatmentDto;
import edu.stevens.cs548.clinic.service.dto.SurgeryTreatmentDto;
import edu.stevens.cs548.clinic.service.dto.TreatmentDto;

/**
 * CDI Bean implementation class ProviderService
 */
// TODO
@RequestScoped
public class ProviderService implements IProviderService {

	@SuppressWarnings("unused")
	private Logger logger = Logger.getLogger(ProviderService.class.getCanonicalName());

	private IProviderFactory providerFactory;

	private ITreatmentFactory treatmentFactory;

	private ProviderDtoFactory providerDtoFactory;
	

	public ProviderService() {
		// Initialize factories
		providerFactory = new ProviderFactory();
		providerDtoFactory = new ProviderDtoFactory();
		treatmentFactory = new TreatmentFactory();
	}
	
	// TODO
	@Inject
	private IProviderDao providerDao;

	// TODO
	@Inject
	private IPatientDao patientDao;
	
	@Inject
	private ITreatmentDao treatmentDao;

	/**
	 * @see IProviderService#addProvider(ProviderDto dto)
	 */
	@Override
	public UUID addProvider(ProviderDto dto) throws ProviderServiceExn {
		// Use factory to create Provider entity, and persist with DAO
		try {
			Provider provider = providerFactory.createProvider();
			provider.setProviderId(UUID.randomUUID());
			provider.setName(dto.getName());
			provider.setNpi(dto.getNpi());
			providerDao.addProvider(provider);
			return provider.getProviderId();
		} catch (ProviderExn e) {
			throw new ProviderServiceExn("Failed to add provider", e);
		}
	}
	
	public List<ProviderDto> getProviders() throws ProviderServiceExn {
		List<ProviderDto> dtos = new ArrayList<ProviderDto>();
		Collection<Provider> providers = providerDao.getProviders();
		for (Provider provider : providers) {
			try {
				dtos.add(providerToDto(provider, false));
			} catch (TreatmentExn e) {
				throw new ProviderServiceExn("Failed to export treatment", e);
			}
		}
		return dtos;
	}

	/**
	 * @see IProviderService#getProvider(UUID)
	 */
	@Override
	public ProviderDto getProvider(UUID id) throws ProviderServiceExn {
		// TODO use DAO to get Provider by external key
		Provider p = null;
		ProviderDto dto = null;
		try {
			 p = providerDao.getProvider(id);
			 dto = providerToDto(p, true);
		} catch (ProviderExn e) {
			// TODO Auto-generated catch block
			throw new ProviderServiceExn("Failed to export provider", e);
		} catch (TreatmentExn e) {
			// TODO Auto-generated catch block
			throw new TreatmentNotFoundExn("Failed to export treatment", e);
		}
		return dto;
	}
	
	private ProviderDto providerToDto(Provider provider, boolean includeTreatments) throws TreatmentExn {
		ProviderDto dto = providerDtoFactory.createProviderDto();
		dto.setId(provider.getProviderId());
		dto.setName(provider.getName());
		dto.setNpi(provider.getNpi());
		if (includeTreatments) {
			dto.setTreatments(provider.exportTreatments(TreatmentExporter.exportWithoutFollowups()));
		}
		return dto;
	}

	@Override
	public UUID addTreatment(TreatmentDto dto) throws PatientServiceExn, ProviderServiceExn {
		return addTreatmentImpl(dto).getTreatmentId();
	}
	
	private void addFollowupTreatments(Collection<TreatmentDto> treatmentDtos, Treatment treatment) throws PatientServiceExn, ProviderServiceExn {
		for (TreatmentDto treatmentDto : treatmentDtos) {
			try {
				treatment.addFollowupTreatment(treatmentDao.getTreatment(treatmentDto.getId()));
			} catch (TreatmentExn e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public Treatment addTreatmentImpl(TreatmentDto dto) throws PatientServiceExn, ProviderServiceExn {
		try {
			Provider provider = providerDao.getProvider(dto.getProviderId());
			Patient patient = patientDao.getPatient(dto.getPatientId());
			if (dto instanceof DrugTreatmentDto) {
				DrugTreatmentDto tDto = (DrugTreatmentDto) dto;
				DrugTreatment t = treatmentFactory.createDrugTreatment();
				t.setTreatmentId(UUID.randomUUID());
				t.setDiagnosis(tDto.getDiagnosis());
				
				// TODO fill in the rest of the fields
				t.setDrug(tDto.getDrug());
				t.setDosage(tDto.getDosage());
				t.setStartDate(tDto.getStartDate());
				t.setEndDate(tDto.getEndDate());
				t.setFrequency(tDto.getFrequency());
							
				addFollowupTreatments(dto.getFollowupTreatments(), t);
				t.setProvider(patient, provider);
				return t;
			} else if(dto instanceof RadiologyTreatmentDto){
				RadiologyTreatmentDto tDto = (RadiologyTreatmentDto) dto;
				RadiologyTreatment t = treatmentFactory.createRadiologyTreatment();
				t.setTreatmentId(UUID.randomUUID());
				t.setDiagnosis(tDto.getDiagnosis());
				
				// TODO fill in the rest of the fields				
				for(LocalDate d : tDto.getTreatmentDates()) {
					t.addTreatmentDate(d);
				}
				
				addFollowupTreatments(dto.getFollowupTreatments(), t);
				t.setProvider(patient, provider);
				return t;
			}else if(dto instanceof SurgeryTreatmentDto){
				SurgeryTreatmentDto tDto = (SurgeryTreatmentDto) dto;
				SurgeryTreatment t = treatmentFactory.createSurgeryTreatment();
				t.setTreatmentId(UUID.randomUUID());
				t.setDiagnosis(tDto.getDiagnosis());
				
				// TODO fill in the rest of the fields				
				t.setSurgeryDate(tDto.getSurgeryDate());
				t.setDischargeInstructions(tDto.getDischargeInstructions());

				addFollowupTreatments(dto.getFollowupTreatments(), t);
				t.setProvider(patient, provider);
				return t;
			}else if(dto instanceof PhysiotherapyTreatmentDto){
				PhysiotherapyTreatmentDto tDto = (PhysiotherapyTreatmentDto) dto;
				PhysiotherapyTreatment t = treatmentFactory.createPhysiotherapyTreatment();
				t.setTreatmentId(UUID.randomUUID());
				t.setDiagnosis(tDto.getDiagnosis());
				
				// TODO fill in the rest of the fields				
				for(LocalDate d : tDto.getTreatmentDates()) {
					t.addTreatmentDate(d);
				}			
				
				addFollowupTreatments(dto.getFollowupTreatments(), t);
				t.setProvider(patient, provider);
				return t;		
			}else {
				throw new IllegalArgumentException("No treatment-specific info provided.");
			}

		} catch (PatientExn e) {
			throw new PatientNotFoundExn("Could not find patient for "+dto.getPatientId(), e);
		
		} catch (ProviderExn e) {
			throw new ProviderNotFoundExn("Could not find provider for "+dto.getProviderId(), e);
		}
	}

	@Override
	public TreatmentDto getTreatment(UUID providerId, UUID tid)
			throws ProviderNotFoundExn, TreatmentNotFoundExn, ProviderServiceExn {
		// Export treatment DTO from Provider aggregate
		try {
			Provider provider = providerDao.getProvider(providerId);
			TreatmentDto treatment = provider.exportTreatment(tid, TreatmentExporter.exportWithoutFollowups());
			return treatment;

		} catch (TreatmentExn e) {
			throw new TreatmentNotFoundExn("Could not find treatment for "+tid, e);
		
		} catch (ProviderExn e) {
			throw new ProviderNotFoundExn("Could not find provider for "+providerId, e);
		}
	}

	
	@Override
	public void removeAll() throws ProviderServiceExn {
		providerDao.deleteProviders();
	}

}
