package edu.stevens.cs548.clinic.data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import javax.persistence.DiscriminatorValue;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

// TODO
@Entity
@DiscriminatorValue("RadiologyTreatment")
public class RadiologyTreatment extends Treatment {

	private static final long serialVersionUID = -3656673416179492428L;

	// TODO 
	@ElementCollection
	protected Collection<Date> treatmentDates;
	
	// TODO
	@OneToMany
	@JoinTable(name="RadiologyTreatmentFollowup")
	protected Collection<Treatment> followupTreatments;

	public Collection<Date> getTreatmentDates() {
		return treatmentDates;
	}

	public void setTreatmentDates(Collection<Date> treatmentDates) {
		this.treatmentDates = treatmentDates;
	}

	public Collection<Treatment> getFollowupTreatments() {
		return followupTreatments;
	}

	public void setFollowupTreatments(Collection<Treatment> followupTreatments) {
		this.followupTreatments = followupTreatments;
	}
	
	public RadiologyTreatment() {
		// TODO
		this.followupTreatments = new ArrayList<Treatment>();
	}
	
}
