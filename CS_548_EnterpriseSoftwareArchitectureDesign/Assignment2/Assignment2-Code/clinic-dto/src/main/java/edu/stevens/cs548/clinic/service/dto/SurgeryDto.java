package edu.stevens.cs548.clinic.service.dto;

import java.time.LocalDate;

import java.util.UUID;

import com.google.gson.annotations.SerializedName;

public class SurgeryDto extends TreatmentDto {
	
	@SerializedName("surgery-date")
	private LocalDate surgeryDate;
	
	private String dischargeInstruction;
	
	private UUID[] followups;
	
	public LocalDate getSurgeryDate() {
		return surgeryDate;
	}

	public void setSurgeryDate(LocalDate surgeryDate) {
		this.surgeryDate = surgeryDate;
	}

	public SurgeryDto() {
		super(TreatmentType.SURGERY);
	}

	public String getDischargeInstruction() {
		return dischargeInstruction;
	}

	public void setDischargeInstruction(String dischargeInstruction) {
		this.dischargeInstruction = dischargeInstruction;
	}

	public UUID[] getFollowups() {
		return followups;
	}

	public void setFollowups(UUID[] followups) {
		this.followups = followups;
	}

}
