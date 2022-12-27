package edu.stevens.cs548.clinic.data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import javax.persistence.*;

// TODO
@Entity
@DiscriminatorValue("SurgeryTreatment")
public class SurgeryTreatment extends Treatment {

	private static final long serialVersionUID = 4173146640306267418L;

	// TODO
	@Temporal(TemporalType.DATE)
	private Date surgeryDate;

	private String dischargeInstructions;	
	
	// TODO
	@OneToMany
	@JoinTable(name="SurgeryTreatmentFollowup")
	private Collection<Treatment> followupTreatments;

	public Date getSurgeryDate() {
		return surgeryDate;
	}

	public void setSurgeryDate(Date surgeryDate) {
		this.surgeryDate = surgeryDate;
	}

	public String getDischargeInstructions() {
		return dischargeInstructions;
	}

	public void setDischargeInstructions(String dischargeInstructions) {
		this.dischargeInstructions = dischargeInstructions;
	}

	public Collection<Treatment> getFollowupTreatments() {
		return followupTreatments;
	}

	public void setFollowupTreatments(Collection<Treatment> followupTreatments) {
		this.followupTreatments = followupTreatments;
	}

	public SurgeryTreatment() {
		// TODO
		this.followupTreatments = new ArrayList<Treatment>();
	}

}
