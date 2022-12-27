package edu.stevens.cs548.clinic.service.dto;

import java.time.LocalDate;

import java.util.UUID;

public class RadiologyDto extends TreatmentDto {
	
	private LocalDate[] treatmentDateList;
	
	private UUID[] followups;
	
	public RadiologyDto() {
		super(TreatmentType.RADIOLOGY);
	}
	
	public LocalDate[] getTreatmentDateList() {
		return treatmentDateList;
	}

	public void setTreatmentDateList(LocalDate[] treatmentDateList) {
		this.treatmentDateList = treatmentDateList;
	}

	public UUID[] getFollowups() {
		return followups;
	}

	public void setFollowups(UUID[] followups) {
		this.followups = followups;
	}
	
}
