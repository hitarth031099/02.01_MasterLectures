package edu.stevens.cs548.clinic.json.bind;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import edu.stevens.cs548.clinic.service.dto.*;
import edu.stevens.cs548.clinic.service.dto.TreatmentDto.TreatmentType;

public class App {

	public static final String PATIENTS = "patients";

	public static final String PROVIDERS = "providers";

	public static final String TREATMENTS = "treatments";

	private static final Logger logger = Logger.getLogger(App.class.getCanonicalName());

	private final BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

	private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");

	private final PatientDtoFactory patientFactory = new PatientDtoFactory();

	private final ProviderDtoFactory providerFactory = new ProviderDtoFactory();

	private final TreatmentDtoFactory treatmentFactory = new TreatmentDtoFactory();

	private final Gson gson;

	TreatmentDeserializer treatmentDeserializer;

	private final List<PatientDto> patients = new ArrayList<PatientDto>();

	private final List<ProviderDto> providers = new ArrayList<ProviderDto>();

	private final List<TreatmentDto> treatments = new ArrayList<TreatmentDto>();

	public void severe(String s) {
		logger.severe(s);
	}

	public void severe(Exception e) {
		logger.log(Level.SEVERE, "Error during processing!", e);
	}

	public void warning(String s) {
		logger.info(s);
	}

	public void info(String s) {
		logger.info(s);
	}

	/**
	 * @param args the command line arguments
	 */
	public static void main(String[] args) {
		new App(args);
	}

	static void msg(String m) {
		System.out.print(m);
	}

	static void msgln(String m) {
		System.out.println(m);
	}

	static void err(String s) {
		System.err.println("** " + s);
	}

	public App(String[] args) {

		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.setPrettyPrinting().registerTypeAdapter(LocalDate.class, new LocalDateSerializer());

		gson = gsonBuilder.create();

		treatmentDeserializer = TreatmentDeserializer.getTreatmentDeserializer(gson);

		// Main command-line interface loop

		while (true) {
			try {
				msg("cs548> ");
				String line = in.readLine();
				if (line == null) {
					return;
				}
				String[] inputs = line.split("\\s+");
				if (inputs.length > 0) {
					String cmd = inputs[0];
					if (cmd.length() == 0)
						;
					else if ("load".equals(cmd))
						load(inputs);
					else if ("save".equals(cmd))
						save(inputs);
					else if ("addpatient".equals(cmd))
						addPatient(inputs);
					else if ("addprovider".equals(cmd))
						addProvider(inputs);
					else if ("addtreatment".equals(cmd))
						addTreatment(inputs);
					else if ("list".equals(cmd))
						list(inputs);
					else if ("help".equals(cmd))
						help(inputs);
					else if ("quit".equals(cmd))
						return;
					else
						msgln("Bad input.  Type \"help\" for more information.");
				}
			} catch (Exception e) {
				severe(e);
			}
		}
	}

	public void load(String[] inputs) throws IOException, ParseException {
		if (inputs.length != 2) {
			err("Usage: load <filename>");
		}
		File input = new File(inputs[1]);
		if (!input.equals(input)) {
			err("File " + input + " does not exist!");
		}
		JsonReader rd = gson.newJsonReader(new BufferedReader(new FileReader(input)));
		rd.beginObject();

		/*
		 * Parse the list of patients.
		 */
		if (!PATIENTS.equals(rd.nextName())) {
			throw new ParseException("Expected field: " + PATIENTS, 0);
		}
		rd.beginArray();
		while (rd.hasNext()) {
			PatientDto patient = gson.fromJson(rd, PatientDto.class);
			patients.add(patient);
		}
		rd.endArray();

		/*
		 * Parse the list of providers.
		 */
		if (!PROVIDERS.equals(rd.nextName())) {
			throw new ParseException("Expected field: " + PROVIDERS, 0);
		}
		rd.beginArray();
		while (rd.hasNext()) {
			ProviderDto provider = gson.fromJson(rd, ProviderDto.class);
			providers.add(provider);
		}
		rd.endArray();

		/*
		 * TODO Load the treatment information
		 */
		if (!TREATMENTS.equals(rd.nextName())) {
			throw new ParseException("Expected field: " + TREATMENTS, 0);
		}
		rd.beginArray();
		while (rd.hasNext()) {
			TreatmentDto treatment = treatmentDeserializer.deserialize(rd);
			treatments.add(treatment);
		}
		rd.endArray();

		rd.endObject();
	}

	@SuppressWarnings("resource")
	public void save(String[] inputs) throws IOException {
		if (inputs.length != 2) {
			err("Usage: save <filename>");
		}
		File output = new File(inputs[1]);
		try (JsonWriter wr = gson.newJsonWriter(new BufferedWriter(new FileWriter(output)))) {
			wr.beginObject();

			wr.name(PATIENTS);
			wr.beginArray();
			for (PatientDto patient : patients) {
				gson.toJson(patient, PatientDto.class, wr);
			}
			wr.endArray();

			wr.name(PROVIDERS);
			wr.beginArray();
			for (ProviderDto provider : providers) {
				gson.toJson(provider, ProviderDto.class, wr);
			}
			wr.endArray();

			/*
			 * TODO Save the treatment information.
			 */
			wr.name(TREATMENTS);
			wr.beginArray();
			for (TreatmentDto treatment : treatments) {
				if (TreatmentType.DRUGTREATMENT.equals(treatment.getType())) {					
					gson.toJson(treatment, DrugDto.class, wr);
				} else if (TreatmentType.SURGERY.equals(treatment.getType())) {
					gson.toJson(treatment, SurgeryDto.class, wr);
				} else if (TreatmentType.RADIOLOGY.equals(treatment.getType())) {
					gson.toJson(treatment, RadiologyDto.class, wr);
				} else if (TreatmentType.PHYSIOTHERAPY.equals(treatment.getType())) {
					gson.toJson(treatment, PhysiotherapyDto.class, wr);
				}
				
			}
			wr.endArray();

			wr.endObject();
		}
	}

	public void addPatient(String[] inputs) throws IOException {
		PatientDto patient = patientFactory.createPatientDto();
		patient.setId(UUID.randomUUID());
		msg("Name: ");
		patient.setName(in.readLine());
		patient.setDob(readDate("Patient DOB"));
		patients.add(patient);
	}

	public void addProvider(String[] inputs) throws IOException {
		ProviderDto provider = providerFactory.createProviderDto();
		provider.setId(UUID.randomUUID());
		msg("NPI: ");
		provider.setNpi(in.readLine());
		msg("Name: ");
		provider.setName(in.readLine());
		providers.add(provider);
	}

	public void addTreatment(String[] inputs) throws IOException, ParseException {
		msg("What form of treatment: [D]rug, [S]urgery, [R]adiology, [P]hysiology? ");
		String line = in.readLine();
		// TODO add other cases
		if ("D".equals(line)) {
			addDrugTreatment();
		} else if ("S".equals(line)) {
			addSurgeryTreatment();
		} else if ("R".equals(line)) {
			addRadiologyTreatment();
		} else if ("P".equals(line)) {
			addPhysiologyTreatment();
		} else {
			msgln("Bad input.");
		}

	}

	private void addDrugTreatment() throws IOException, ParseException {
		DrugDto treatment = treatmentFactory.createDrugTreatmentDto();

		treatment.setId(UUID.randomUUID());
		msg("Patient ID: ");
		treatment.setPatientId(UUID.fromString(in.readLine()));
		msg("Provider ID: ");
		treatment.setProviderId(UUID.fromString(in.readLine()));
		msg("Diagnosis: ");
		treatment.setDiagnosis(in.readLine());
		msg("Drug: ");
		treatment.setDrug(in.readLine());
		msg("Dosage: ");
		treatment.setDosage(Float.parseFloat(in.readLine()));
		treatment.setStartDate(readDate("Start date"));
		treatment.setEndDate(readDate("End date"));
		msg("Frequency: ");
		treatment.setFrequency(Integer.parseInt(in.readLine()));

		treatments.add(treatment);
	}

	private void addSurgeryTreatment() throws IOException, ParseException {
		SurgeryDto treatment = treatmentFactory.createSurgeryDto();

		treatment.setId(UUID.randomUUID());
		msg("Patient ID: ");
		treatment.setPatientId(UUID.fromString(in.readLine()));
		msg("Provider ID: ");
		treatment.setProviderId(UUID.fromString(in.readLine()));
		msg("Diagnosis: ");
		treatment.setDiagnosis(in.readLine());
		treatment.setSurgeryDate(readDate("Surgery Date: "));
		msg("Surgery Discharge Instruction: ");
		treatment.setDischargeInstruction(in.readLine());
		msg("Input follow-up treatments' uuid in one line, seperate each date by [space]");
		String[] inputs = in.readLine().split("\\s+");
		treatment.setFollowups(Arrays.asList(inputs).stream().map(ele -> UUID.fromString(ele)).toArray(UUID[]::new));

		treatments.add(treatment);
	}

	private void addRadiologyTreatment() throws IOException, ParseException {
		RadiologyDto treatment = treatmentFactory.createRadiologyDto();

		treatment.setId(UUID.randomUUID());
		msg("Patient ID: ");
		treatment.setPatientId(UUID.fromString(in.readLine()));
		msg("Provider ID: ");
		treatment.setProviderId(UUID.fromString(in.readLine()));
		msg("Diagnosis: ");
		treatment.setDiagnosis(in.readLine());
		msg("Input dates(MM/dd/yyyy) in one line, seperate each date by [space]");
		String[] inputs = in.readLine().split("\\s+");
		treatment.setTreatmentDateList(Arrays.asList(inputs).stream().map(ele -> LocalDate.parse(ele, dateFormatter)).toArray(LocalDate[]::new));

		msg("Input follow-up treatments' uuid in one line, seperate each date by [space]");
		String[] inputs2 = in.readLine().split("\\s+");
		treatment.setFollowups(Arrays.asList(inputs2).stream().map(ele -> UUID.fromString(ele)).toArray(UUID[]::new));

		treatments.add(treatment);
	}

	private void addPhysiologyTreatment() throws IOException, ParseException {
		PhysiotherapyDto treatment = treatmentFactory.createPhysiotherapyDto();

		treatment.setId(UUID.randomUUID());
		msg("Patient ID: ");
		treatment.setPatientId(UUID.fromString(in.readLine()));
		msg("Provider ID: ");
		treatment.setProviderId(UUID.fromString(in.readLine()));
		msg("Diagnosis: ");
		treatment.setDiagnosis(in.readLine());

		msg("Input dates(MM/dd/yyyy) in one line, seperate each date by [space]");
		String[] inputs = in.readLine().split("\\s+");
		treatment.setTreatmentDateList(Arrays.asList(inputs).stream().map(ele -> LocalDate.parse(ele, dateFormatter)).toArray(LocalDate[]::new));

		treatments.add(treatment);
	}

	private LocalDate readDate(String field) throws IOException {
		msg(String.format("%s (MM/dd/yyyy): ", field));
		return LocalDate.parse(in.readLine(), dateFormatter);
	}

	public void list(String[] inputs) {
		msgln("Patients:");
		for (PatientDto patient : patients) {
			msgln(gson.toJson(patient));
		}

		msgln("Providers:");
		for (ProviderDto provider : providers) {
			msgln(gson.toJson(provider));
		}

		msgln("Treatments:");
		for (TreatmentDto treatment : treatments) {
			msgln(gson.toJson(treatment));
		}
	}

	public void help(String[] inputs) {
		if (inputs.length == 1) {
			msgln("Commands are:");
			msgln("  load filename: load database from a file");
			msgln("  save filename: save database to a file");
			msgln("  addpatient: add a patient");
			msgln("  addprovider: add a provider");
			msgln("  addtreatment: add a treatment");
			msgln("  list: display database content");
			msgln("  quit: exit the app");
		}
	}

}
