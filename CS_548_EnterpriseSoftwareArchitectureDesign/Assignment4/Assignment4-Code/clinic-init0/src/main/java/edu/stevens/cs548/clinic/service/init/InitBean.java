package edu.stevens.cs548.clinic.service.init;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;


import edu.stevens.cs548.clinic.domain.*;

@Singleton
@LocalBean
@Startup
//@ApplicationScoped
//@Transactional
public class InitBean implements ITreatmentExporter<Void> {

	private static final Logger logger = Logger.getLogger(InitBean.class.getCanonicalName());

	private static final ZoneId ZONE_ID = ZoneOffset.UTC;

	private PatientFactory patientFactory = new PatientFactory();

	private ProviderFactory providerFactory = new ProviderFactory();

	private TreatmentFactory treatmentFactory = new TreatmentFactory();

	// TODO
	@Inject
	private IPatientDao patientDao;

	// TODO
	@Inject
	private IProviderDao providerDao;

	@Inject
	private ITreatmentDao treatmentDao;

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
			 * If we ensure that deletion of patients cascades deletes of treatments, then
			 * we only need to delete patients.
			 */

//			patientDao.deletePatients();
//			providerDao.deleteProviders();

			Patient patient1 = patientFactory.createPatient();
			patient1.setPatientId(UUID.randomUUID());
			patient1.setName("patient1");
			patient1.setDob(LocalDate.parse("1995-08-15"));
			patientDao.addPatient(patient1);

			Provider provider1 = providerFactory.createProvider();
			provider1.setProviderId(UUID.randomUUID());
			provider1.setName("provider1");
			provider1.setNpi("001");
			providerDao.addProvider(provider1);

			DrugTreatment drug01 = treatmentFactory.createDrugTreatment();
			drug01.setTreatmentId(UUID.randomUUID());
			drug01.setDiagnosis("Headache");
			drug01.setDrug("Aspirin");
			drug01.setStartDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug01.setEndDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug01.setFrequency(10);

			provider1.addTreatment(patient1, drug01);

			// TODO add more testing, including treatments and providers
			SurgeryTreatment surgery01 = treatmentFactory.createSurgeryTreatment();
			surgery01.setTreatmentId(UUID.randomUUID());
			surgery01.setDiagnosis("Surgery");
			surgery01.setSurgeryDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			surgery01.setDischargeInstructions("DischargeInstructions");

			provider1.addTreatment(patient1, surgery01);

			RadiologyTreatment radiology01 = treatmentFactory.createRadiologyTreatment();
			radiology01.setTreatmentId(UUID.randomUUID());
			radiology01.setDiagnosis("Radiology");
			radiology01.addTreatmentDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			radiology01.addTreatmentDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));

			provider1.addTreatment(patient1, radiology01);

			PhysiotherapyTreatment physiotherapy01 = treatmentFactory.createPhysiotherapyTreatment();
			physiotherapy01.setTreatmentId(UUID.randomUUID());
			physiotherapy01.setDiagnosis("Physiotherapy");
			physiotherapy01.addTreatmentDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			physiotherapy01.addTreatmentDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));

			provider1.addTreatment(patient1, physiotherapy01);
			
			Patient patient2 = patientFactory.createPatient();
			patient2.setPatientId(UUID.randomUUID());
			patient2.setName("patient2");
			patient2.setDob(LocalDate.parse("1995-08-15"));
			patientDao.addPatient(patient2);

			Provider provider2= providerFactory.createProvider();
			provider2.setProviderId(UUID.randomUUID());
			provider2.setName("provider2");
			provider2.setNpi("002");
			providerDao.addProvider(provider2);

			DrugTreatment drug02 = treatmentFactory.createDrugTreatment();
			drug02.setTreatmentId(UUID.randomUUID());
			drug02.setDiagnosis("Headache");
			drug02.setDrug("Aspirin");
			drug02.setStartDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug02.setEndDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			drug02.setFrequency(10);

			provider2.addTreatment(patient2, drug02);

			// TODO add more testing, including treatments and providers
			SurgeryTreatment surgery02 = treatmentFactory.createSurgeryTreatment();
			surgery02.setTreatmentId(UUID.randomUUID());
			surgery02.setDiagnosis("Surgery2");
			surgery02.setSurgeryDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			surgery02.setDischargeInstructions("DischargeInstructions");

			provider1.addTreatment(patient2, surgery02);

			RadiologyTreatment radiology02 = treatmentFactory.createRadiologyTreatment();
			radiology02.setTreatmentId(UUID.randomUUID());
			radiology02.setDiagnosis("Radiology2");
			radiology02.addTreatmentDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			radiology02.addTreatmentDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));

			provider2.addTreatment(patient2, radiology02);

			PhysiotherapyTreatment physiotherapy02 = treatmentFactory.createPhysiotherapyTreatment();
			physiotherapy02.setTreatmentId(UUID.randomUUID());
			physiotherapy02.setDiagnosis("Physiotherapy2");
			physiotherapy02.addTreatmentDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));
			physiotherapy02.addTreatmentDate(LocalDate.ofInstant(Instant.now(), ZONE_ID));

			provider2.addTreatment(patient2, physiotherapy02);

			// Now show in the logs what has been added

			Collection<Patient> patients = patientDao.getPatients();
			for (Patient p : patients) {
				String dob = p.getDob().toString();
				logger.info(String.format("Patient %s, ID %s, DOB %s", p.getName(), p.getPatientId().toString(), dob));
				p.exportTreatments(this);
			}

			Collection<Provider> providers = providerDao.getProviders();
			for (Provider p : providers) {
				logger.info(String.format("Provider %s, ID %s", p.getName(), p.getProviderId().toString()));
				p.exportTreatments(this);
			}

		} catch (Exception e) {
			throw new IllegalStateException("Failed to add record.", e);

		}

	}

//	public void shutdown(@Observes @Destroyed(ApplicationScoped.class) ServletContext init) {
//		logger.info("App shutting down....");
//	}

	@Override
	public Void exportDrug(UUID tid, UUID patientId, UUID providerId, String diagnosis, String drug, float dosage,
			LocalDate start, LocalDate end, int frequency, Collection<Void> followups) {
		logger.info(String.format("...Drug treatment %s, patientId %s, providerId %s, drug %s, diagnosis %s, diagnosis %f, "
				+ "start date %s, " + "end date %s, "+ "frequency %d, ", 
				tid.toString(), patientId.toString(), providerId.toString(), drug, diagnosis, dosage, 
				start.toString(), end.toString(), frequency));
		return null;
	}

	@Override
	public Void exportRadiology(UUID tid, UUID patientId, UUID providerId, String diagnosis, List<LocalDate> dates,
			Collection<Void> followups) {
		logger.info(String.format("...Radiology treatment %s", tid.toString()));
		return null;
	}

	@Override
	public Void exportSurgery(UUID tid, UUID patientId, UUID providerId, String diagnosis, LocalDate date,
			Collection<Void> followups) {
		logger.info(String.format("...Surgery treatment %s", tid.toString()));
		return null;
	}

	@Override
	public Void exportPhysiotherapy(UUID tid, UUID patientId, UUID providerId, String diagnosis, List<LocalDate> dates,
			Collection<Void> followups) {
		logger.info(String.format("...Physiotherapy treatment %s", tid.toString()));
		return null;
	}

}
