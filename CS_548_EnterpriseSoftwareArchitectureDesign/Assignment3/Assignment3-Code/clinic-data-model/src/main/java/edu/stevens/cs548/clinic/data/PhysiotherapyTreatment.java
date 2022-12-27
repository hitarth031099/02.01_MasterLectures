package edu.stevens.cs548.clinic.data;

import java.util.Collection;
import java.util.Date;

import javax.persistence.*;

// TODO
@Entity
@DiscriminatorValue("PhysiotherapyTreatment")
public class PhysiotherapyTreatment extends Treatment {

	private static final long serialVersionUID = 5602950140629148756L;
	
	// TODO 
	@ElementCollection
	protected Collection<Date> treatmentDates;

	public Collection<Date> getTreatmentDates() {
		return treatmentDates;
	}

	public void setTreatmentDates(Collection<Date> treatmentDates) {
		this.treatmentDates = treatmentDates;
	}
	
	public PhysiotherapyTreatment() {
		// TODO
	}

}
