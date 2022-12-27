package edu.stevens.cs548.clinic.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.stream.JsonReader;

import edu.stevens.cs548.clinic.service.IPatientService;
import edu.stevens.cs548.clinic.service.IPatientService.PatientServiceExn;
import edu.stevens.cs548.clinic.service.IProviderService;
import edu.stevens.cs548.clinic.service.IProviderService.ProviderNotFoundExn;
import edu.stevens.cs548.clinic.service.IProviderService.ProviderServiceExn;
import edu.stevens.cs548.clinic.service.IProviderService.TreatmentNotFoundExn;
import edu.stevens.cs548.clinic.service.dto.*;
import edu.stevens.cs548.clinic.service.dto.util.GsonFactory;

// TODO
@Path("/provider")
@Transactional
public class ProviderResource extends ResourceBase {

	private final Logger logger = Logger.getLogger(ProviderResource.class.getCanonicalName());

	/*
	 * Complete definition of GsonFactory class (initialization of Gson).
	 */
	private final Gson gson = GsonFactory.createGson();

	private static final String PROVIDERS = "providers";

	private static final String PATIENTS = "patients";

	private static final String TREATMENTS = "treatments";

	// TODO
	@Context
	private UriInfo uriInfo;

	// TODO
	@Inject
	private IPatientService patientService;

	// TODO
	@Inject
	private IProviderService providerService;

	// TODO
	/*
	 * Return a provider DTO including the list of treatments they are
	 * administering.
	 */
	@GET
	@Path("/{id}")
	public Response getProvider(@PathParam("id") String id) {
		try {
			UUID providerId = UUID.fromString(id);
			ProviderDto provider = providerService.getProvider(providerId, true);
			ResponseBuilder responseBuilder = Response.ok(provider);
			/*
			 * TODO Add links for treatments in response headers.
			 */
			for (TreatmentDto treatment : provider.getTreatments()) {
				responseBuilder.link(getTreatmentUri(uriInfo, treatment.getProviderId(), treatment.getId()), TREATMENT);
			}
			return responseBuilder.build();
		} catch (ProviderServiceExn e) {
			logger.info("Failed to find provider with id " + id);
			return Response.status(Status.NOT_FOUND).build();
		} catch (IllegalArgumentException e) {
			logger.info("Badly formed provider id: " + id);
			return Response.status(Status.BAD_REQUEST).build();
		}
	}

	// TODO
	/*
	 * Return a provider DTO including the list of treatments they are
	 * administering.
	 */
	@GET
	@Path("/{id}/treatment/{tid}")
	public Response getTreatment(@PathParam("id") String id, @PathParam("tid") String tid) {
		try {
			UUID providerId = UUID.fromString(id);
			UUID treatmentId = UUID.fromString(tid);

			TreatmentDto treatment = providerService.getTreatment(providerId, treatmentId);
			ResponseBuilder responseBuilder = Response.ok(treatment);
			/*
			 * TODO Add links for patient and provider in response headers.
			 */
			responseBuilder.link(getPatientUri(uriInfo, treatment.getPatientId()), PATIENT);
			responseBuilder.link(getProviderUri(uriInfo, treatment.getProviderId()), PROVIDER);
			return responseBuilder.build();
		} catch (ProviderServiceExn e) {
			logger.info("Failed to find provider with id " + id + e);
			return Response.status(Status.NOT_FOUND).build();
		} catch (IllegalArgumentException e) {
			logger.info("Badly formed provider id: " + id);
			return Response.status(Status.BAD_REQUEST).build();
		}
	}

	// TODO
	/*
	 * This operation is intended to upload lists of providers, patients and
	 * treatments from the client. Imagine the client is a mobile app on which data
	 * is entered and later synchronized with the server. We just do the
	 * synchronization in one direction. The input data is expected to be a JSON
	 * objects with three lists: { "providers" : [ provider1, ...., providerk ],
	 * "patients" : [ patient1, ...., patientm ], "treatments" : [ treatment1, ....,
	 * treatmentn ] }
	 * 
	 */
	@POST
	public Response upload(InputStream is) {

		try (JsonReader rd = gson.newJsonReader(new BufferedReader(new InputStreamReader(is)))) {

			logger.info("Receiving upload of clinic data...");

			rd.beginObject();

			/*
			 * Read stream of providers and add to database
			 */
			logger.info("...reading provider data...");
			String label = rd.nextName();
			if (!PROVIDERS.equals(label)) {
				logger.log(Level.SEVERE, String.format("Unexpected label, expected %s, found %s", PROVIDERS, label));
				return Response.status(Status.BAD_REQUEST).build();
			}
			rd.beginArray();
			while (rd.hasNext()) {
				ProviderDto provider = gson.fromJson(rd, ProviderDto.class);
				provider.setId(providerService.addProvider(provider));
				logger.info("......uploading provider " + provider.getId());
			}
			rd.endArray();

			logger.info("...reading patient data...");
			/*
			 * Read stream of patients and add to database
			 */
			label = rd.nextName();
			if (!PATIENTS.equals(label)) {
				logger.log(Level.SEVERE, String.format("Unexpected label, expected %s, found %s", PATIENTS, label));
				return Response.status(Status.BAD_REQUEST).build();
			}
			rd.beginArray();
			while (rd.hasNext()) {
				PatientDto patient = gson.fromJson(rd, PatientDto.class);
				patient.setId(patientService.addPatient(patient));
				logger.info("......uploading patient " + patient.getId());
			}
			rd.endArray();

			/*
			 * TODO read stream of treatments and add to database
			 */
			logger.info("...reading treatment data...");
			label = rd.nextName();
			if (!TREATMENTS.equals(label)) {
				logger.log(Level.SEVERE, String.format("Unexpected label, expected %s, found %s", TREATMENTS, label));
				return Response.status(Status.BAD_REQUEST).build();
			}
			rd.beginArray();
			while (rd.hasNext()) {
				TreatmentDto treatment = treatmentDeserialize(gson.getAdapter(JsonElement.class).read(rd));
				treatment.setId(providerService.addTreatment(treatment));
				logger.info("......uploading treatment " + treatment.getId());

			}
			rd.endArray();

			rd.endObject();

			logger.info("...upload complete!");

			return Response.ok().build();

		} catch (IOException e) {
			logger.log(Level.SEVERE, "Failed to open Json stream!", e);
			return Response.serverError().build();
		} catch (ProviderServiceExn e) {
			logger.log(Level.SEVERE, "Failed to add provider or treatment!", e);
			return Response.serverError().build();
		} catch (PatientServiceExn e) {
			logger.log(Level.SEVERE, "Failed to add patient!", e);
			return Response.serverError().build();
		}
	}

	private TreatmentDto treatmentDeserialize(JsonElement json)
			throws JsonParseException, ProviderNotFoundExn, TreatmentNotFoundExn, ProviderServiceExn {

		if (!json.isJsonObject()) {
			throw new JsonParseException("Non-object in token stream where treatment DTO expected: " + json);
		}

		if (!json.getAsJsonObject().has("type-tag")) {
			throw new JsonParseException("Missing type tag for treatment DTO: " + json);
		}

		// TODO use the typeTag to parse the specific treatment subtype
		TreatmentDtoFactory treatmentDtoFactory = new TreatmentDtoFactory();

		String typeTag = json.getAsJsonObject().get("type-tag").getAsString();

		UUID patientId = UUID.fromString(json.getAsJsonObject().get("patient-id").getAsString());

		UUID providerId = UUID.fromString(json.getAsJsonObject().get("provider-id").getAsString());

		String diagnosis = json.getAsJsonObject().get("diagnosis").getAsString();

		Collection<TreatmentDto> followupTreatments = new ArrayList<TreatmentDto>();

		logger.info(json.getAsJsonObject().get("followupTreatments").getAsJsonArray().toString());

		for (JsonElement followupTreatment : json.getAsJsonObject().get("followupTreatments").getAsJsonArray())
			followupTreatments.add(treatmentDeserialize(followupTreatment));

		if ("DRUG".equals(typeTag)) {
			DrugTreatmentDto treatment = treatmentDtoFactory.createDrugTreatmentDto();
			treatment.setPatientId(patientId);
			treatment.setProviderId(providerId);
			treatment.setDiagnosis(diagnosis);
			treatment.setFollowupTreatments(followupTreatments);

			treatment.setDrug(json.getAsJsonObject().get("drug").getAsString());
			treatment.setDosage(json.getAsJsonObject().get("dosage").getAsFloat());
			treatment.setStartDate(LocalDate.parse(json.getAsJsonObject().get("start-date").getAsString()));
			treatment.setEndDate(LocalDate.parse(json.getAsJsonObject().get("end-date").getAsString()));
			treatment.setFrequency(json.getAsJsonObject().get("frequency").getAsInt());

			return treatment;

		} else if ("SURGERY".equals(typeTag)) {
			SurgeryTreatmentDto treatment = treatmentDtoFactory.createSurgeryTreatmentDto();
			treatment.setPatientId(patientId);
			treatment.setProviderId(providerId);
			treatment.setDiagnosis(diagnosis);
			treatment.setFollowupTreatments(followupTreatments);

			treatment.setSurgeryDate(LocalDate.parse(json.getAsJsonObject().get("surgery-date").getAsString()));
			treatment.setDischargeInstructions(json.getAsJsonObject().get("dischargeInstruction").getAsString());

			return treatment;

		} else if ("RADIOLOGY".equals(typeTag)) {
			RadiologyTreatmentDto treatment = treatmentDtoFactory.createRadiologyTreatmentDto();
			treatment.setPatientId(patientId);
			treatment.setProviderId(providerId);
			treatment.setDiagnosis(diagnosis);
			treatment.setFollowupTreatments(followupTreatments);

			String[] temp = gson.fromJson(json.getAsJsonObject().get("treatmentDateList").getAsJsonArray(),
					String[].class);
			treatment.setTreatmentDates(
					Arrays.asList(temp).stream().map(ele -> LocalDate.parse(ele)).collect(Collectors.toList()));

			return treatment;
		} else if ("PHYSIOTHERAPY".equals(typeTag)) {
			PhysiotherapyTreatmentDto treatment = treatmentDtoFactory.createPhysiotherapyTreatmentDto();
			treatment.setPatientId(patientId);
			treatment.setProviderId(providerId);
			treatment.setDiagnosis(diagnosis);
			treatment.setFollowupTreatments(followupTreatments);

			String[] temp = gson.fromJson(json.getAsJsonObject().get("treatmentDateList").getAsJsonArray(),
					String[].class);
			treatment.setTreatmentDates(
					Arrays.asList(temp).stream().map(ele -> LocalDate.parse(ele)).collect(Collectors.toList()));

			return treatment;
		}
		throw new IllegalStateException("Unimplemented TreatmentDeserializer");

	}

}
