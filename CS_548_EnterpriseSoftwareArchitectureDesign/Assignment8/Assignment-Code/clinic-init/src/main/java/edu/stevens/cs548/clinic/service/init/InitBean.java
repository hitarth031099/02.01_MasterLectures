package edu.stevens.cs548.clinic.service.init;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collection;
import java.util.UUID;
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
	// public void init(@Observes @Initialized(ApplicationScoped.class)
	// ServletContext init) {
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

			// TODO add more testing, including treatments and providers
			
			PatientDto patient01 = patientFactory.createPatientDto();
			patient01.setName("patient 01");
			patient01.setDob(LocalDate.parse("2001-01-01"));
			patient01.setId(UUID.fromString("0aaabbbb-aaaa-aaaa-aaaa-aaaabbbbcccc"));
			patientService.addPatient(patient01);

			ProviderDto provider01 = providerFactory.createProviderDto();
			provider01.setName("provider 01");
			provider01.setNpi("1234");
			provider01.setId(UUID.fromString("0aaabbbb-aaaa-aaaa-aaaa-aaaabbbbcccc"));
			providerService.addProvider(provider01);

			DrugTreatmentDto drug01 = treatmentFactory.createDrugTreatmentDto();
			drug01.setId(UUID.fromString("0aaabbbb-aaaa-aaaa-aaaa-aaaabbbbcccc"));
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
//			providerService.addTreatment(drug01);

			SurgeryTreatmentDto surgery01 = treatmentFactory.createSurgeryTreatmentDto();
			surgery01.setId(UUID.fromString("1aaabbbb-aaaa-aaaa-aaaa-aaaabbbbcccc"));
			surgery01.setPatientId(patient01.getId());
			surgery01.setPatientName(patient01.getName());
			surgery01.setProviderId(provider01.getId());
			surgery01.setProviderName(provider01.getName());
			surgery01.setDiagnosis("patient01 surgery diagnosis");
			surgery01.setSurgeryDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			surgery01.setDischargeInstructions("patient01 provider01 surgery01 Discharge Instructions");
//			providerService.addTreatment(surgery01);
			
			RadiologyTreatmentDto radiology01 = treatmentFactory.createRadiologyTreatmentDto();
			radiology01.setId(UUID.fromString("2aaabbbb-aaaa-aaaa-aaaa-aaaabbbbcccc"));
			radiology01.setPatientId(patient01.getId());
			radiology01.setPatientName(patient01.getName());
			radiology01.setProviderId(provider01.getId());
			radiology01.setProviderName(provider01.getName());
			radiology01.setDiagnosis("patient01 provider01 radiology01 diagnosis");
			radiology01.setTreatmentDates(Arrays.asList(LocalDate.ofInstant(Instant.now(), ZONE_ID),LocalDate.ofInstant(Instant.now(), ZONE_ID)));
//			providerService.addTreatment(radiology01);
			
			PhysiotherapyTreatmentDto physiotherapy01 = treatmentFactory.createPhysiotherapyTreatmentDto();
			physiotherapy01.setId(UUID.fromString("3aaabbbb-aaaa-aaaa-aaaa-aaaabbbbcccc"));
			physiotherapy01.setPatientId(patient01.getId());
			physiotherapy01.setPatientName(patient01.getName());
			physiotherapy01.setProviderId(provider01.getId());
			physiotherapy01.setProviderName(provider01.getName());
			physiotherapy01.setDiagnosis("patient01 provider01 physiotherapy01 diagnosis");
			physiotherapy01.setTreatmentDates(Arrays.asList(LocalDate.ofInstant(Instant.now(), ZONE_ID),LocalDate.ofInstant(Instant.now(), ZONE_ID)));
			physiotherapy01.setFollowupTreatments(Arrays.asList(drug01, surgery01, radiology01));
			providerService.addTreatment(physiotherapy01);	
			
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
		logger.info(String.format("...Drug treatment for %s, drug %s", t.getPatientName(), t.getDrug()));
	}

	private void logTreatment(RadiologyTreatmentDto t) {
		logger.info(String.format("...Radiology treatment for %s", t.getPatientName()));
	}

	private void logTreatment(SurgeryTreatmentDto t) {
		logger.info(String.format("...Surgery treatment for %s", t.getPatientName()));
	}

	private void logTreatment(PhysiotherapyTreatmentDto t) {
		logger.info(String.format("...Physiotherapy treatment for %s", t.getPatientName()));
	}

}
