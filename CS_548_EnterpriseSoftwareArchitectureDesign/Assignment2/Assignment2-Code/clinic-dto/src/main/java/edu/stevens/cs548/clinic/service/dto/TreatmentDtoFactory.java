package edu.stevens.cs548.clinic.service.dto;

public class TreatmentDtoFactory {
	
	public DrugDto createDrugTreatmentDto () {
		return new DrugDto();
	}
	
	/*
	 * TODO: Repeat for other treatments.
	 */
	
	public SurgeryDto createSurgeryDto () {
		return new SurgeryDto();
	}
	
	public RadiologyDto createRadiologyDto () {
		return new RadiologyDto();
	}
	
	public PhysiotherapyDto createPhysiotherapyDto () {
		return new PhysiotherapyDto();
	}

}
