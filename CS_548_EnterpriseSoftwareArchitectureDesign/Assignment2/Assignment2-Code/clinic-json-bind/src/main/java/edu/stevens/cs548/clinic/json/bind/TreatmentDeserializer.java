package edu.stevens.cs548.clinic.json.bind;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.UUID;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;

import edu.stevens.cs548.clinic.service.dto.*;
import edu.stevens.cs548.clinic.service.dto.TreatmentDto.TreatmentType;

/**
 * Class for deserializing a treatment.
 * 
 * The gson.fromJson operation requires a specification of the (concrete) type
 * of the object being deserialized, which of course is not known until we are
 * reading the input. We parse the data into a JsonElement object, read the tag
 * on that, then deserialize the object into a Java object of the concrete
 * class.
 * 
 * We cannot register this as custom deserialization logic in Gson because that
 * would lead to a cycle where attempting to deserialize a treatment causes the
 * custom deserializer to trigger deserialization on the same object.
 * 
 * @author dduggan
 *
 */
public class TreatmentDeserializer {

	private Gson gson;

	private TypeAdapter<JsonElement> jsonElementAdapter;

	public static TreatmentDeserializer getTreatmentDeserializer(Gson gson) {
		return new TreatmentDeserializer(gson);
	}

	private TreatmentDeserializer(Gson gson) {
		this.gson = gson;
		this.jsonElementAdapter = gson.getAdapter(JsonElement.class);
	}

	/*
	 * Deserialization has go to in two stages: parse the JSON data to an untyped
	 * JSON object, then examine the type tag to see what kind of object it is, and
	 * build the concreteinstance of TreatmentDto.
	 */
	public TreatmentDto deserialize(JsonReader rd) throws JsonParseException, IOException {
		return deserialize(parse(rd));
	}

	/*
	 * Parse the input stream into an untyped JSON object.
	 */
	private JsonElement parse(JsonReader rd) throws JsonParseException, IOException {
		JsonElement json = jsonElementAdapter.read(rd);
		return json;
	}

	/*
	 * Deserialize an untyped JSON object into a treatment DTO.
	 */
	private TreatmentDto deserialize(JsonElement json) throws JsonParseException {

		if (!json.isJsonObject()) {
			throw new JsonParseException("Non-object in token stream where treatment DTO expected: " + json);
		}

		if (!json.getAsJsonObject().has(TreatmentDto.TYPE_TAG)) {
			throw new JsonParseException("Missing type tag for treatment DTO: " + json);
		}

		JsonElement typeElem = json.getAsJsonObject().get(TreatmentDto.TYPE_TAG);
		if (!typeElem.isJsonPrimitive()) {
			throw new JsonParseException("Type tag for treatment is not primitive: " + typeElem);
		}
		if (!typeElem.getAsJsonPrimitive().isString()) {
			throw new JsonParseException("Type tag for treatment is not a string: " + typeElem);
		}
		if (!TreatmentType.isValid(typeElem.getAsJsonPrimitive().getAsString())) {
			throw new JsonParseException("Type tag for treatment is not a valid tag value: " + typeElem);
		}

		TreatmentType typeTag = TreatmentType.parse(typeElem.getAsJsonPrimitive().getAsString());

		// TODO use the typeTag to parse the specific treatment subtype

		UUID id = UUID.fromString(json.getAsJsonObject().get("id").getAsString());

		UUID patientId = UUID.fromString(json.getAsJsonObject().get("patient-id").getAsString());

		UUID providerId = UUID.fromString(json.getAsJsonObject().get("provider-id").getAsString());

		String diagnosis = json.getAsJsonObject().get("diagnosis").getAsString();

		if (TreatmentType.DRUGTREATMENT.equals(typeTag)) {
			TreatmentDto treatment = new DrugDto();
			treatment.setId(id);
			treatment.setPatientId(patientId);
			treatment.setProviderId(providerId);
			treatment.setDiagnosis(diagnosis);

			treatment.setDrug(json.getAsJsonObject().get("drug").getAsString());
			treatment.setDosage(json.getAsJsonObject().get("dosage").getAsFloat());
			treatment.setStartDate(
					LocalDate.parse(json.getAsJsonObject().get("start-date").getAsString()));
			treatment.setEndDate(LocalDate.parse(json.getAsJsonObject().get("end-date").getAsString()));
			treatment.setFrequency(json.getAsJsonObject().get("frequency").getAsInt());

			return treatment;

		} else if (TreatmentType.SURGERY.equals(typeTag)) {
			TreatmentDto treatment = new SurgeryDto();
			treatment.setId(id);
			treatment.setPatientId(patientId);
			treatment.setProviderId(providerId);
			treatment.setDiagnosis(diagnosis);

			treatment.setSurgeryDate(
					LocalDate.parse(json.getAsJsonObject().get("surgery-date").getAsString()));
			treatment.setDischargeInstruction(json.getAsJsonObject().get("dischargeInstruction").getAsString());

			String[] temp = gson.fromJson(json.getAsJsonObject().get("followups").getAsJsonArray(), String[].class);
			treatment.setFollowups(Arrays.asList(temp).stream().map(ele -> UUID.fromString(ele)).toArray(UUID[]::new));

			return treatment;

		} else if (TreatmentType.RADIOLOGY.equals(typeTag)) {
			TreatmentDto treatment = new RadiologyDto();
			treatment.setId(id);
			treatment.setPatientId(patientId);
			treatment.setProviderId(providerId);
			treatment.setDiagnosis(diagnosis);

			String[] temp = gson.fromJson(json.getAsJsonObject().get("treatmentDateList").getAsJsonArray(), String[].class);
			treatment.setTreatmentDateList(Arrays.asList(temp).stream().map(ele -> LocalDate.parse(ele))
					.toArray(LocalDate[]::new));
			
			String[] temp2 = gson.fromJson(json.getAsJsonObject().get("followups").getAsJsonArray(), String[].class);
			treatment.setFollowups(Arrays.asList(temp2).stream().map(ele -> UUID.fromString(ele)).toArray(UUID[]::new));
			
			return treatment;
		} else if (TreatmentType.PHYSIOTHERAPY.equals(typeTag)) {
			TreatmentDto treatment = new PhysiotherapyDto();
			treatment.setId(id);
			treatment.setPatientId(patientId);
			treatment.setProviderId(providerId);
			treatment.setDiagnosis(diagnosis);

			String[] temp = gson.fromJson(json.getAsJsonObject().get("treatmentDateList").getAsJsonArray(), String[].class);
			treatment.setTreatmentDateList(Arrays.asList(temp).stream().map(ele -> LocalDate.parse(ele))
					.toArray(LocalDate[]::new));
			
			return treatment;
		}
		throw new IllegalStateException("Unimplemented TreatmentDeserializer");

	}

}
