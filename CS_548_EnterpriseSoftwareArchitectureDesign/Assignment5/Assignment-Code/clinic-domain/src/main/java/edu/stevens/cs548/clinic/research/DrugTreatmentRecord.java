package edu.stevens.cs548.clinic.research;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

import javax.persistence.*;

import org.eclipse.persistence.annotations.Convert;

import edu.stevens.cs548.clinic.util.DateUtils;

/**
 * Entity implementation class for Entity: DrugTreatmentRecord
 *
 */
@NamedQuery(
		name="SearchDrugTreatmentRecords",
		query="select t from DrugTreatmentRecord t")

// TODO
@Entity
@Table(indexes = @Index(columnList="treatmentId"))
public class DrugTreatmentRecord implements Serializable {
	
	private static final long serialVersionUID = 1L;

	public DrugTreatmentRecord() {
		super();
	}
	
	// TODO
	@Id @GeneratedValue(strategy = IDENTITY)
	private long id;
	
	// TODO
	@JoinColumn(referencedColumnName = "treatmentId")
	@Convert("uuidConverter")
	private UUID treatmentId;
	
	// TODO
	@Temporal(TemporalType.DATE)
	private Date startDate;
	
	// TODO
	@Temporal(TemporalType.DATE)
	private Date endDate;
	
	private String drugName;
	
	private float dosage;
	
	// TODO
	@ManyToOne
	private Subject subject;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public UUID getTreatmentId() {
		return treatmentId;
	}

	public void setTreatmentId(UUID treatmentId) {
		this.treatmentId = treatmentId;
	}

	public String getDrugName() {
		return drugName;
	}

	public void setDrugName(String drugName) {
		this.drugName = drugName;
	}

	public LocalDate getStartDate() {
		return DateUtils.fromDatabaseDate(startDate);
	}

	public void setStartDate(LocalDate date) {
		this.startDate = DateUtils.toDatabaseDate(date);
	}

	public LocalDate getEndDate() {
		return DateUtils.fromDatabaseDate(endDate);
	}

	public void setEndDate(LocalDate date) {
		this.endDate = DateUtils.toDatabaseDate(date);
	}

	public float getDosage() {
		return dosage;
	}

	public void setDosage(float dosage) {
		this.dosage = dosage;
	}

	public Subject getSubject() {
		return subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

}
