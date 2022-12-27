package edu.stevens.cs548.clinic.service.dto;

import java.time.LocalDate;

public class PhysiotherapyDto extends TreatmentDto {
	
	private LocalDate[] treatmentDateList;
	
	public PhysiotherapyDto() {
		super(TreatmentType.PHYSIOTHERAPY);
	}

	public LocalDate[] getTreatmentDateList() {
		return treatmentDateList;
	}

	public void setTreatmentDateList(LocalDate[] treatmentDateList) {
		this.treatmentDateList = treatmentDateList;
	}
		
}
