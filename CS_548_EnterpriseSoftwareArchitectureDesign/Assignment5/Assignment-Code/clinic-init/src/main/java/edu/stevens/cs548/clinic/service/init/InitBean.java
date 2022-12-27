	package edu.stevens.cs548.clinic.service.init;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Destroyed;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.servlet.ServletContext;

import edu.stevens.cs548.clinic.service.IPatientService;
import edu.stevens.cs548.clinic.service.IProviderService;
import edu.stevens.cs548.clinic.service.dto.DrugTreatmentDto;
import edu.stevens.cs548.clinic.service.dto.PatientDto;
import edu.stevens.cs548.clinic.service.dto.PatientDtoFactory;
import edu.stevens.cs548.clinic.service.dto.PhysiotherapyTreatmentDto;
import edu.stevens.cs548.clinic.service.dto.ProviderDto;
import edu.stevens.cs548.clinic.service.dto.ProviderDtoFactory;
import edu.stevens.cs548.clinic.service.dto.RadiologyTreatmentDto;
import edu.stevens.cs548.clinic.service.dto.SurgeryTreatmentDto;
import edu.stevens.cs548.clinic.service.dto.TreatmentDto;
import edu.stevens.cs548.clinic.service.dto.TreatmentDtoFactory;

@Singleton
@LocalBean
@Startup
// @ApplicationScoped
// @Transactional
public class InitBean {

	private static final Logger logger = Logger.getLogger(InitBean.class.getCanonicalName());

	private static final ZoneId ZONE_ID = ZoneOffset.UTC;

	private PatientDtoFactory patientFactory = new PatientDtoFactory();

	private ProviderDtoFactory providerFactory = new ProviderDtoFactory();

	private TreatmentDtoFactory treatmentFactory = new TreatmentDtoFactory();

	// TODO
	@Inject
	private IPatientService patientService;

	// TODO
	@Inject
	private IProviderService providerService;

	/*
	 * Initialize using EJB logic
	 */
	@PostConstruct
	/*
	 * This should work to initialize with CDI bean, but there is a bug in
	 * Payara.....
	 */
	// public void init(@Observes @Initialized(ApplicationScoped.class) ServletContext init) {
	public void init() {
		/*
		 * Put your testing logic here. Use the logger to display testing output in the
		 * server logs.
		 */
		logger.info("Your name here: Yufu Liao");
		System.err.println("Your name here!");

		try {

			/*
			 * Clear the database and populate with fresh data.
			 * 
			 * Note that the service generates the external ids, when adding the entities.
			 */

//			providerService.removeAll();
//			patientService.removeAll();

			PatientDto patient01 = patientFactory.createPatientDto();
			patient01.setName("patient 01");
			patient01.setDob(LocalDate.parse("2001-01-01"));
			patient01.setId(patientService.addPatient(patient01));

			ProviderDto provider01 = providerFactory.createProviderDto();
			provider01.setName("provider 01");
			provider01.setNpi("1234");
			provider01.setId(providerService.addProvider(provider01));

			DrugTreatmentDto drug01 = treatmentFactory.createDrugTreatmentDto();
			drug01.setPatientId(patient01.getId());
			drug01.setPatientName(patient01.getName());
			drug01.setProviderId(provider01.getId());
			drug01.setProviderName(provider01.getName());
			drug01.setDiagnosis("patient01 provider01 drug01 diagnosis");
			drug01.setDrug("patient01 drug01");
			drug01.setDosage(01);
			drug01.setFrequency(01);
			drug01.setStartDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug01.setEndDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug01.setId(providerService.addTreatment(drug01));

			SurgeryTreatmentDto surgery01 = treatmentFactory.createSurgeryTreatmentDto();
			surgery01.setPatientId(patient01.getId());
			surgery01.setPatientName(patient01.getName());
			surgery01.setProviderId(provider01.getId());
			surgery01.setProviderName(provider01.getName());
			surgery01.setDiagnosis("patient01 surgery diagnosis");
			surgery01.setSurgeryDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			surgery01.setDischargeInstructions("patient01 provider01 surgery01 Discharge Instructions");
			surgery01.setId(providerService.addTreatment(surgery01));
			
			RadiologyTreatmentDto radiology01 = treatmentFactory.createRadiologyTreatmentDto();
			radiology01.setPatientId(patient01.getId());
			radiology01.setPatientName(patient01.getName());
			radiology01.setProviderId(provider01.getId());
			radiology01.setProviderName(provider01.getName());
			radiology01.setDiagnosis("patient01 provider01 radiology01 diagnosis");
			radiology01.setTreatmentDates(Arrays.asList(LocalDate.ofInstant(Instant.now(), ZONE_ID),LocalDate.ofInstant(Instant.now(), ZONE_ID)));
			radiology01.setId(providerService.addTreatment(radiology01));
			
			PhysiotherapyTreatmentDto physiotherapy01 = treatmentFactory.createPhysiotherapyTreatmentDto();
			physiotherapy01.setPatientId(patient01.getId());
			physiotherapy01.setPatientName(patient01.getName());
			physiotherapy01.setProviderId(provider01.getId());
			physiotherapy01.setProviderName(provider01.getName());
			physiotherapy01.setDiagnosis("patient01 provider01 physiotherapy01 diagnosis");
			physiotherapy01.setTreatmentDates(Arrays.asList(LocalDate.ofInstant(Instant.now(), ZONE_ID),LocalDate.ofInstant(Instant.now(), ZONE_ID)));
			physiotherapy01.setFollowupTreatments(Arrays.asList(drug01, surgery01, radiology01));
			physiotherapy01.setId(providerService.addTreatment(physiotherapy01));	
			
			
			PatientDto patient02 = patientFactory.createPatientDto();
			patient02.setName("patient 02");
			patient02.setDob(LocalDate.parse("2002-02-02"));
			patient02.setId(patientService.addPatient(patient02));

			ProviderDto provider02 = providerFactory.createProviderDto();
			provider02.setName("provider 02");
			provider02.setNpi("1234");
			provider02.setId(providerService.addProvider(provider02));

			DrugTreatmentDto drug02 = treatmentFactory.createDrugTreatmentDto();
			drug02.setPatientId(patient02.getId());
			drug02.setPatientName(patient02.getName());
			drug02.setProviderId(provider02.getId());
			drug02.setProviderName(provider02.getName());
			drug02.setDiagnosis("patient02 provider02 drug02 diagnosis");
			drug02.setDrug("patient02 drug02");
			drug02.setDosage(02);
			drug02.setFrequency(02);
			drug02.setStartDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug02.setEndDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug02.setId(providerService.addTreatment(drug02));

			SurgeryTreatmentDto surgery02 = treatmentFactory.createSurgeryTreatmentDto();
			surgery02.setPatientId(patient02.getId());
			surgery02.setPatientName(patient02.getName());
			surgery02.setProviderId(provider02.getId());
			surgery02.setProviderName(provider02.getName());
			surgery02.setDiagnosis("patient02 surgery diagnosis");
			surgery02.setSurgeryDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			surgery02.setDischargeInstructions("patient02 provider02 surgery02 Discharge Instructions");
			surgery02.setId(providerService.addTreatment(surgery02));
			
			RadiologyTreatmentDto radiology02 = treatmentFactory.createRadiologyTreatmentDto();
			radiology02.setPatientId(patient02.getId());
			radiology02.setPatientName(patient02.getName());
			radiology02.setProviderId(provider02.getId());
			radiology02.setProviderName(provider02.getName());
			radiology02.setDiagnosis("patient02 provider02 radiology02 diagnosis");
			radiology02.setTreatmentDates(Arrays.asList(LocalDate.ofInstant(Instant.now(), ZONE_ID),LocalDate.ofInstant(Instant.now(), ZONE_ID)));
			radiology02.setId(providerService.addTreatment(radiology02));
			
			PhysiotherapyTreatmentDto physiotherapy02 = treatmentFactory.createPhysiotherapyTreatmentDto();
			physiotherapy02.setPatientId(patient02.getId());
			physiotherapy02.setPatientName(patient02.getName());
			physiotherapy02.setProviderId(provider02.getId());
			physiotherapy02.setProviderName(provider02.getName());
			physiotherapy02.setDiagnosis("patient02 provider02 physiotherapy02 diagnosis");
			physiotherapy02.setTreatmentDates(Arrays.asList(LocalDate.ofInstant(Instant.now(), ZONE_ID),LocalDate.ofInstant(Instant.now(), ZONE_ID)));
			physiotherapy02.setFollowupTreatments(Arrays.asList(drug02, surgery02, radiology02));
			physiotherapy02.setId(providerService.addTreatment(physiotherapy02));	
			
			
			PatientDto patient03 = patientFactory.createPatientDto();
			patient03.setName("patient 03");
			patient03.setDob(LocalDate.parse("2003-03-03"));
			patient03.setId(patientService.addPatient(patient03));

			ProviderDto provider03 = providerFactory.createProviderDto();
			provider03.setName("provider 03");
			provider03.setNpi("1234");
			provider03.setId(providerService.addProvider(provider03));

			DrugTreatmentDto drug03 = treatmentFactory.createDrugTreatmentDto();
			drug03.setPatientId(patient03.getId());
			drug03.setPatientName(patient03.getName());
			drug03.setProviderId(provider03.getId());
			drug03.setProviderName(provider03.getName());
			drug03.setDiagnosis("patient03 provider03 drug03 diagnosis");
			drug03.setDrug("patient03 drug03");
			drug03.setDosage(03);
			drug03.setFrequency(03);
			drug03.setStartDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug03.setEndDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug03.setId(providerService.addTreatment(drug03));

			SurgeryTreatmentDto surgery03 = treatmentFactory.createSurgeryTreatmentDto();
			surgery03.setPatientId(patient03.getId());
			surgery03.setPatientName(patient03.getName());
			surgery03.setProviderId(provider03.getId());
			surgery03.setProviderName(provider03.getName());
			surgery03.setDiagnosis("patient03 surgery diagnosis");
			surgery03.setSurgeryDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			surgery03.setDischargeInstructions("patient03 provider03 surgery03 Discharge Instructions");
			surgery03.setId(providerService.addTreatment(surgery03));
			
			RadiologyTreatmentDto radiology03 = treatmentFactory.createRadiologyTreatmentDto();
			radiology03.setPatientId(patient03.getId());
			radiology03.setPatientName(patient03.getName());
			radiology03.setProviderId(provider03.getId());
			radiology03.setProviderName(provider03.getName());
			radiology03.setDiagnosis("patient03 provider03 radiology03 diagnosis");
			radiology03.setTreatmentDates(Arrays.asList(LocalDate.ofInstant(Instant.now(), ZONE_ID),LocalDate.ofInstant(Instant.now(), ZONE_ID)));
			radiology03.setId(providerService.addTreatment(radiology03));
			
			PhysiotherapyTreatmentDto physiotherapy03 = treatmentFactory.createPhysiotherapyTreatmentDto();
			physiotherapy03.setPatientId(patient03.getId());
			physiotherapy03.setPatientName(patient03.getName());
			physiotherapy03.setProviderId(provider03.getId());
			physiotherapy03.setProviderName(provider03.getName());
			physiotherapy03.setDiagnosis("patient03 provider03 physiotherapy03 diagnosis");
			physiotherapy03.setTreatmentDates(Arrays.asList(LocalDate.ofInstant(Instant.now(), ZONE_ID),LocalDate.ofInstant(Instant.now(), ZONE_ID)));
			physiotherapy03.setFollowupTreatments(Arrays.asList(drug03, surgery03, radiology03));
			physiotherapy03.setId(providerService.addTreatment(physiotherapy03));	
			
			
			// Now show in the logs what has been added

			Collection<PatientDto> patients = patientService.getPatients();
			for (PatientDto p : patients) {
				logger.info(String.format("Patient %s, ID %s, DOB %s", p.getName(), p.getId().toString(),
						p.getDob().toString()));
				logTreatments(p.getTreatments());
			}

			Collection<ProviderDto> providers = providerService.getProviders();
			for (ProviderDto p : providers) {
				logger.info(String.format("Provider %s, ID %s, NPI %s", p.getName(), p.getId().toString(), p.getNpi()));
				logTreatments(p.getTreatments());
			}

		} catch (Exception e) {
			;
			throw new IllegalStateException("Failed to add record.", e);

		}
		
	}

	public void shutdown(@Observes @Destroyed(ApplicationScoped.class) ServletContext init) {
		logger.info("App shutting down....");
	}

	private void logTreatments(Collection<TreatmentDto> treatments) {
		for (TreatmentDto treatment : treatments) {
			if (treatment instanceof DrugTreatmentDto) {
				logTreatment((DrugTreatmentDto) treatment);
			} else if (treatment instanceof SurgeryTreatmentDto) {
				logTreatment((SurgeryTreatmentDto) treatment);
			} else if (treatment instanceof RadiologyTreatmentDto) {
				logTreatment((RadiologyTreatmentDto) treatment);
			} else if (treatment instanceof PhysiotherapyTreatmentDto) {
				logTreatment((PhysiotherapyTreatmentDto) treatment);
			}
			if (!treatment.getFollowupTreatments().isEmpty()) {
				logger.info("============= Follow-up Treatments");
				logTreatments(treatment.getFollowupTreatments());
				logger.info("============= End Follow-up Treatments");
			}
		}
	}

	private void logTreatment(DrugTreatmentDto t) {
		logger.info(String.format("...Drug treatment %s, drug %s", t.getId().toString(), t.getDrug()));
	}

	private void logTreatment(RadiologyTreatmentDto t) {
		logger.info(String.format("...Radiology treatment %s", t.getId().toString()));
	}

	private void logTreatment(SurgeryTreatmentDto t) {
		logger.info(String.format("...Surgery treatment %s", t.getId().toString()));
	}

	private void logTreatment(PhysiotherapyTreatmentDto t) {
		logger.info(String.format("...Physiotherapy treatment %s", t.getId().toString()));
	}

}
